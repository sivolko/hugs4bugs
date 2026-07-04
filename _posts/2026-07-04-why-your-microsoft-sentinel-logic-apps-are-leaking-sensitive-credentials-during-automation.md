---
layout: post
title: "Why your Microsoft sentinel logic apps are leaking sensitive credentials during automation?"
date: 2026-07-04 20:04:25 UTC
category: security
tags:
  - microsoft sentinel
  - credential exposure
subtitle: ""
description: "Microsoft Sentinel Logic Apps playbooks leak secrets through run history and Log Analytics by default. Here's the exact leak path, KQL hunting query, and fix"
image: https://images.unsplash.com/photo-1777508921732-646da5428adf?q=80&w=2098&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
optimized_image: https://images.unsplash.com/photo-1777508921732-646da5428adf?q=80&w=2098&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
image_position: "44% 77%"
discover: true
author: Shubhendu Shubham
---

## What credential leakage in Sentinel playbooks actually means

Here's the thing nobody tells you when you build your first Microsoft Sentinel playbook: the automation that's supposed to make your SOC faster is, by default, writing every API key, bearer token, and Key Vault secret it touches straight into a run history that half your Azure AD tenant can probably read.

I've reviewed enough Logic Apps-based SOAR implementations now to know this isn't an edge case. It's the default behavior. Azure Logic Apps was built as an integration platform first and a security automation engine second, and that heritage shows up exactly where you don't want it — in how it logs.

If your playbook calls a firewall API to block an IP, posts to Teams, opens a ServiceNow ticket, or pulls a secret from Key Vault to authenticate an HTTP action, every one of those steps gets recorded with full inputs and outputs in run history unless you've explicitly told Logic Apps to hide them. And "explicitly" is doing a lot of work in that sentence, because the designer doesn't nag you about it, Microsoft Sentinel's playbook templates rarely ship with it configured, and Defender for Cloud won't flag it as a finding on its own.

## The problem: Logic Apps was never secure by default

Azure Key Vault gives people a false sense of safety. I've sat in architecture reviews where someone points at the Key Vault connector and says "we're good, the secret's in Key Vault." Technically true. Operationally irrelevant, because the moment that secret gets pulled into the workflow to authenticate the next action, Logic Apps treats it as just another piece of JSON to log.

<cite index="19-1">Storing secrets in Azure Key Vault is a valid, encouraged approach — until you discover your API key is leaking into your operational logs (run history) for anyone who has access to those logs to discover.</cite> That's not a hypothetical. <cite index="20-1">Security researchers have documented this exact vulnerability class in real client environments — run history responses from action blocks containing the secret in plaintext, classified as sensitive information exposure.</cite>

Here's the mechanism, end to end:

```
┌─────────────────────────────────────────────────────────────────┐
│                     THE LEAK PATH                                │
│                                                                    │
│  Sentinel Incident ──▶ Automation Rule ──▶ Playbook Triggered    │
│                                                  │                 │
│                                                  ▼                 │
│                                     ┌────────────────────────┐    │
│                                     │  Get Secret (Key Vault) │    │
│                                     │  action                 │    │
│                                     └───────────┬────────────┘    │
│                                                  │ secret in       │
│                                                  │ plaintext JSON  │
│                                                  ▼                 │
│                                     ┌────────────────────────┐    │
│                                     │  HTTP Action             │    │
│                                     │  (calls firewall/EDR/   │    │
│                                     │   ticketing API)        │    │
│                                     └───────────┬────────────┘    │
│                                                  │                 │
│                    ┌─────────────────────────────┼──────────────┐ │
│                    ▼                             ▼              ▼ │
│           Run History (Portal)      Log Analytics        ARM export│
│           Logic App Contributor/    (AzureDiagnostics /   template │
│           Reader roles can view     LogicAppWorkflowRuntime)      │
│           full inputs/outputs       readable by anyone with       │
│                                      Log Analytics Reader on the   │
│                                      workspace via KQL — no need   │
│                                      to even open the Logic App    │
└─────────────────────────────────────────────────────────────────┘
```

Three separate exposure surfaces, three separate audiences who can read the secret, and none of them require compromising anything. Just normal, granted RBAC.

## How the leak actually happens under the hood

### Surface 1: Run history in the portal

<cite index="11-1">When you view your logic app's run history, Azure Logic Apps authenticates your access and then provides links to the inputs and outputs for the requests and responses for each run. For actions that handle passwords, secrets, keys, or other sensitive information, that data is visible by default</cite> unless secured explicitly. This is true whether the secret came from a Key Vault connector, a hardcoded parameter, or a connection string dropped into an HTTP body.

I've seen this bite teams hardest with **Compose** and **Parse JSON** actions. <cite index="17-1">These actions only have a Secure Inputs setting, and when turned on it also hides the action's outputs — but if a downstream action explicitly uses the hidden outputs as its own inputs, Logic Apps doesn't automatically hide that downstream action's data.</cite> Secure Inputs/Outputs doesn't propagate. You have to set it action by action, every single time a secret passes through.

### Surface 2: Log Analytics — the one people forget

This is the one that actually worries me more than the portal run history, because it's invisible unless you go looking. <cite index="15-1">When you obscure inputs or outputs on a trigger or action, Logic Apps doesn't send that secured data to Log Analytics.</cite> That's the correct behavior — but it means the inverse is also true: **anything you haven't marked as secure gets shipped into your Log Analytics workspace in plaintext**, sitting in the `AzureDiagnostics` or `LogicAppWorkflowRuntime` table, permanently, queryable by KQL.

If your Sentinel workspace and your Logic Apps diagnostic logs land in the same Log Analytics workspace (a very common architecture, since it simplifies RBAC and cost management), then anyone with **Log Analytics Reader** or **Sentinel Reader** on that workspace can run this and pull secrets without ever touching the Logic App resource itself:

```kql
// Hunting query: surface Logic App action inputs/outputs that may
// contain leaked secrets, API keys, or bearer tokens in plaintext
AzureDiagnostics
| where ResourceProvider == "MICROSOFT.LOGIC"
| where Category == "WorkflowRuntime"
| where OperationName has_any ("workflowActionCompleted", "workflowTriggerCompleted")
| extend RawContent = tostring(properties_s)
| where RawContent has_any ("api_key", "apikey", "Authorization", "client_secret", "password", "Bearer ")
| project TimeGenerated,
          WorkflowName = resource_workflowName_s,
          ActionName   = resource_actionName_s,
          RunId        = resource_runId_s,
          RawContent
| order by TimeGenerated desc
```

Run that against a workspace that's been collecting Logic App diagnostics for a few months and don't be surprised if it returns actual credentials. I have run near-identical queries during architecture reviews and found live API keys for third-party threat intel feeds sitting in plaintext, months old, never rotated.

### Surface 3: ARM template export and source control

This is the quiet one. When someone exports a playbook as an ARM template for CI/CD or backup — completely reasonable, Microsoft even recommends it for Standard logic apps — the `connections.json` and parameters file can carry API-key-based connection strings in plaintext unless you've deliberately used `securestring` parameters. <cite index="11-1">If you automate deployment with Resource Manager templates, you can define secured template parameters using the securestring and secureobject types, evaluated at deployment, with values coming from a separate parameter file that references Key Vault</cite> — but that requires someone to do it on purpose. The default ARM export from the portal doesn't do this for you. I've pulled exported templates out of internal GitHub repos more than once and found bearer tokens sitting right there in `parameters.json`, committed by someone who assumed the export was "just structure."

## Real scenario: the compromised-user playbook that leaked a firewall key

**Scenario**: A mid-size fintech runs a Sentinel automation rule that triggers on `Multiple failed logins followed by success` — a classic credential-stuffing pattern. The playbook, built off a Microsoft template, does three things: pulls the source IP from the incident entities, calls a Palo Alto firewall REST API to add the IP to a dynamic block list, and posts a summary to a Teams channel called `soc-alerts`.

The firewall API key lives in Key Vault. The playbook's **Get Secret** action retrieves it, and the following **HTTP** action passes it as a custom header (`X-PAN-KEY`) — not the `Authorization` header. That header choice matters more than it looks: <cite index="11-1">by default, Authorization headers aren't visible through inputs or outputs, so a secret placed there isn't retrievable — but that protection doesn't extend to custom headers.</cite>

Nobody enabled Secure Inputs on the Get Secret action or Secure Outputs on the HTTP action, because the template didn't ship with it and nobody in the build review asked. Diagnostic settings were pointed at the org's central Sentinel Log Analytics workspace — again, standard architecture. Eight months later, a contractor with Sentinel Reader access (needed for a compliance audit) runs a routine KQL sweep out of curiosity, finds the `X-PAN-KEY` value sitting in the `AzureDiagnostics` table across dozens of historical runs, and now has standing write access to the firewall's block-list API. The playbook worked exactly as designed. That's what makes this class of bug so uncomfortable — nothing broke.

## Step-by-step: closing the leak

### Step 1 — audit every existing playbook's connections

Before fixing individual actions, find out how bad it already is. This PowerShell pulls every Logic App in a resource group and flags connections still using API-key or basic-auth style authentication instead of managed identity:

```powershell
# Step 1: Connect and set the scope for the audit
Connect-AzAccount
Set-AzContext -SubscriptionId "<your-subscription-id>"

# Step 2: Pull every Logic App connection resource and flag non-MSI auth
$resourceGroup = "rg-sentinel-playbooks"
$connections = Get-AzResource -ResourceGroupName $resourceGroup `
    -ResourceType "Microsoft.Web/connections"

foreach ($conn in $connections) {
    $details = Get-AzResource -ResourceId $conn.ResourceId -ExpandProperties
    $authType = $details.Properties.parameterValueType

    # Step 3: Flag anything that isn't ManagedIdentity-based auth
    if ($authType -ne "Alternative" -and $authType -notlike "*ManagedServiceIdentity*") {
        Write-Output "REVIEW: $($conn.Name) — auth type: $authType"
    }
}
```

### Step 2 — turn on Secure Inputs/Outputs on every credential-touching action

Do this in the designer per action: select the action → **Settings** → **Security** → toggle **Secure Inputs**, **Secure Outputs**, or both. <cite index="15-1">Enable Secure Outputs on the Get Secret action at minimum, and Secure Inputs on any downstream action that consumes that secret as an input.</cite> Do this for every Key Vault retrieval, every HTTP action carrying a custom auth header, and every connector action touching PII (email addresses, ticket contents with user data, etc.).

If you're managing this through code instead of the designer, the underlying workflow definition looks like this:

```json
{
  "actions": {
    "HTTP_Call_Firewall_API": {
      "type": "Http",
      "inputs": {
        "method": "POST",
        "uri": "https://firewall.contoso.com/api/v1/block-list",
        "headers": {
          "X-PAN-KEY": "@body('Get_secret')?['value']"
        },
        "body": {
          "ip": "@triggerBody()?['entities']?[0]?['Address']"
        }
      },
      "runtimeConfiguration": {
        "secureData": {
          "properties": [
            "inputs",
            "outputs"
          ]
        }
      }
    }
  }
}
```

That `runtimeConfiguration.secureData` block is the actual mechanism behind the "Secure Inputs/Outputs" toggle — worth knowing if you're deploying playbooks via ARM/Bicep and want this baked in from the first deployment rather than clicked through the designer after the fact.

### Step 3 — move off API-key connectors to managed identity everywhere it's supported

<cite index="3-1">Managed identities grant playbooks permission to interact with resources like Azure Storage, Key Vault, or external APIs without requiring explicit credential management, eliminating the risk of credential leaks entirely for those calls.</cite> If your firewall, ticketing system, or SIEM has an Azure AD-integrated API and supports token-based auth via managed identity, use it. There's no secret to leak if there's no secret in the workflow.

### Step 4 — restrict who can actually see run history, not just who can edit the playbook

People conflate "can edit this Logic App" with "can view run history," and the roles aren't the same thing. Logic App **Reader** can already see run history inputs/outputs for anything not explicitly secured — so scoping down to Reader doesn't protect you. <cite index="11-1">You can also restrict access to run history by IP address range</cite> as an additional layer, but the real control is the Secure Inputs/Outputs setting itself, not the RBAC role.

### Step 5 — stop co-locating Logic App diagnostics with your Sentinel workspace, or scope table-level access

If separating workspaces isn't feasible operationally, at minimum apply table-level RBAC on `AzureDiagnostics` so that Sentinel Reader access doesn't implicitly grant read access to Logic App runtime telemetry. Most orgs don't realize table-level access control exists in Log Analytics until an audit forces the conversation.

## Exposure surfaces at a glance

| Surface | Who can read it by default | Fix |
|---|---|---|
| Run history (portal) | Logic App Reader/Contributor, Sentinel Automation Contributor | Secure Inputs/Outputs per action |
| Log Analytics (AzureDiagnostics) | Anyone with Reader on the Log Analytics workspace | Secure Inputs/Outputs (excludes secured data from logs) + table-level RBAC |
| ARM template export | Anyone with access to the exported file / repo | securestring parameters + Key Vault reference at deploy time |
| Custom HTTP headers | Same as run history + Log Analytics | Never put secrets in custom headers; use Authorization header or managed identity |

**Bottom line**: Key Vault protects the secret at rest. It does nothing to protect the secret once your playbook pulls it into memory and hands it to the next action — that part is entirely on you to lock down.

## What breaks, what to watch for

Turning on Secure Inputs/Outputs across an existing production playbook estate isn't free. <cite index="13-1">Secure Input/Output settings can hide necessary data, complicating troubleshooting in non-production environments</cite> — you'll lose visibility into exactly what payload failed and why, right when you need it most during an incident. Standard practice I use: keep Secure Inputs/Outputs off in a dedicated dev/test Logic App environment with dummy credentials, and only enable it once the workflow is promoted to production. Don't be the team that disables it "temporarily" in prod to debug a failure and forgets to re-enable it.

Also watch for **Variables** — <cite index="15-1">you can't apply obfuscation to Variables at all, so if a playbook stores a secret in a variable instead of passing it directly between actions, it has no protection mechanism</cite>. Route secrets through a **Compose** action instead, where Secure Inputs/Outputs actually applies.

## Quick reference — hardening checklist

```markdown
[ ] Every Key Vault "Get secret" action has Secure Outputs enabled
[ ] Every action consuming a secret as input has Secure Inputs enabled
[ ] No secrets stored in Variables — use Compose actions instead
[ ] No API keys in custom HTTP headers where avoidable — prefer managed identity
[ ] ARM/Bicep templates use securestring parameters, never inline secrets
[ ] Logic App diagnostic logs are scoped or table-RBAC'd separately from
    general Sentinel Reader access
[ ] Run the AzureDiagnostics hunting KQL query quarterly against your
    own workspace — assume something will show up the first time
[ ] Dev/test environments use dummy credentials, not scoped-down real ones,
    so Secure Inputs/Outputs can stay on everywhere that matters
```

Run the hunting query from this post against your own tenant this week. I'd rather you find it than the contractor with read-only access does.
