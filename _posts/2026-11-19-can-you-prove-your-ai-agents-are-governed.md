---
layout: post
title: "Can you prove your AI agents are governed?"
date: 2026-11-19 07:28:16 UTC
category: Ai, security
tags:

subtitle: "Build a tamper-evident decision log and answer an auditor's question about any agent action in minutes"
description: "Can you prove your AI is governed? What ISO 42001 and the EU AI Act audits expect as evidence for AI agents, plus a tested tamper-evident audit log"
image: 
optimized_image: 
image_position: "50% 50%"
author: Shubhendu Shubham
---

A customer's security team sends you a questionnaire. Question 14 reads: "Provide evidence that your AI agents operate within defined authority." You have an AI policy. It was approved in March, it's eleven pages, and legal likes it.

That's not evidence. It's a promise. AI governance evidence is a record showing the policy fired at the moment an agent touched something. If you can't produce that record, you can't prove anything, and in November 2026 more people are asking for proof than were asking a year ago.

## What does "prove your AI is governed" mean right now?

Two things are driving the questions: a regulation with a moving calendar, and a certifiable standard.

On the regulation side, the EU's Digital Omnibus on AI, Regulation (EU) 2026/1744, was published in the Official Journal on 24 July 2026 and entered into force on 27 July. It pushed the AI Act's high-risk obligations out: Annex III systems to 2 December 2027, AI embedded in regulated products (Annex I) to 2 August 2028.

Here's the mistake people are making with that news: reading it as a pause. The delay covers the high-risk regime only. Transparency obligations (chatbot disclosure, deepfake labelling) applied from 2 August 2026. General-purpose AI model obligations have applied since August 2025. A new ban on AI systems built to generate non-consensual intimate imagery or CSAM has a hard date of 2 December 2026, which is two weeks away. And the AI Act's penalty tiers include up to EUR 7.5 million or 1.5% of turnover for giving authorities incorrect or misleading information. Claiming governance you can't evidence is its own exposure.

On the standard side, ISO/IEC 42001 (published December 2023) is the first certifiable AI management system standard. The certification path mirrors ISO 27001: internal audit under Clause 9.2, then a Stage 1 and Stage 2 external audit. It's voluntary, but it's the thing customers point at when they want something more than your word.

## Why does the policy document fail the audit?

Because agents don't read policies. They call tools.

The numbers on how this is going are not good. The Cloud Security Alliance's survey work reports 65% of organizations had an AI agent security incident in the previous twelve months, 82% had found agents running without their security or governance teams knowing, and only 21% had a formal process for retiring an agent once its purpose ended. Kiteworks' 2026 forecast adds that 63% of organizations can't enforce purpose limitations on agents, 60% can't terminate a misbehaving one, and 55% can't isolate AI systems from the wider network. These are vendor and industry-body surveys, so treat the exact percentages as directional. The pattern is the useful part.

The pattern is that incidents come from missing identity, missing access limits and missing runtime enforcement, not from a model going rogue. As reported, an internal agent at Meta triggered a Sev-1 in March 2026 by posting incorrect technical advice without human approval, which led to roughly two hours of data exposure. In April 2026, a coding agent at a company called PocketOS deleted a production database and its backups in nine seconds. Neither needed an attacker.

So the failure isn't "we had no policy." It's "we had a policy and nothing that enforced or recorded it."

## What evidence do auditors actually ask for?

Strip away the framework names and it comes down to six questions. OWASP's Top 10 for Agentic Applications 2026 (published 9 December 2025) gives you the risk vocabulary: ASI02 Tool Misuse, ASI03 Identity and Privilege Abuse, ASI10 Rogue Agents. The CSA's Agentic AI Autonomy Levels framework (January 2026) gives you a six-level scale, 0 to 5, for stating how much authority each agent has.

| Auditor asks | Evidence you hand over | Anchor | Example tools |
|---|---|---|---|
| Which agents do you run? | Live inventory: owner, purpose, autonomy level | ISO 42001 Clause 4.3 scope; CSA autonomy levels | Cloud asset inventory, agent registry, an AI bill of materials |
| Which agent is this? | Unique identity per agent, least-privilege scopes | OWASP ASI03 | SPIFFE/SPIRE, cloud workload identity |
| What stopped it doing X? | A policy decision (allow, deny, escalate) made before the call | OWASP ASI02, ASI03 | Microsoft Agent Governance Toolkit, OPA, Cedar |
| What did it do last Tuesday? | Tamper-evident log of every action with the policy version | EU AI Act Article 12; ISO 42001 Clause 9 | Microsoft Sentinel, object-lock storage |
| Who approved the risky ones? | Named approver on every escalated action | EU AI Act Article 14 (human oversight) | Approval workflows, ticketing |
| Can you switch it off? | Tested kill switch and a retirement process | OWASP ASI10 | Credential revocation, feature flags, AGT runtime kill switch |

**Bottom line**: if you can only build one row this quarter, build the fourth. A decision log is the evidence the other five rows depend on, and it's the one auditors sample.

## Real scenario: an auditor asks about one claim

> **Scenario**: It's Thursday, 4:10pm. Northvale Health, a fictional claims processor, has an agent called `claims-triage-01` that reads insurance claims and can update their status. A customer's auditor sends one question: "Show every action `claims-triage-01` took on claim 88231 last Tuesday, which policy version allowed each one, and who approved the write."

Without a decision log, someone greps application logs. The tool calls are interleaved with a dozen other agents, nothing records which policy was live, and the approval was a Slack DM from `r.menon` that nobody exported. The honest answer is "we'll get back to you," and that answer is a finding.

With a decision log, it's one command and the chain verifies. Here's how to build the minimum version.

## Step-by-step: build a tamper-evident agent decision log

This is a small Python module I tested before putting it here. Every entry stores the hash of the previous entry, so editing any past line breaks the chain from that point forward.

```python
# audit_log.py
# Append-only decision log where each entry carries the hash of the previous one.
import hashlib
import json
import time

LOG = "agent_decisions.jsonl"
GENESIS = "0" * 64


def _digest(entry: dict) -> str:
    return hashlib.sha256(json.dumps(entry, sort_keys=True).encode()).hexdigest()


def _last_hash() -> str:
    try:
        with open(LOG) as f:
            lines = f.read().splitlines()
    except FileNotFoundError:
        return GENESIS
    return json.loads(lines[-1])["hash"] if lines else GENESIS


def record(agent_id, tool, target, decision, policy_version, approver=None):
    entry = {
        "ts": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "agent_id": agent_id,
        "tool": tool,
        "target": target,
        "decision": decision,  # allow | deny | escalate
        "policy_version": policy_version,
        "approver": approver,
        "prev": _last_hash(),
    }
    entry["hash"] = _digest(entry)
    with open(LOG, "a") as f:
        f.write(json.dumps(entry) + "\n")


def verify() -> bool:
    prev = GENESIS
    with open(LOG) as f:
        for n, line in enumerate(f, 1):
            e = json.loads(line)
            h = e.pop("hash")
            if e["prev"] != prev or _digest(e) != h:
                print(f"chain broken at line {n}")
                return False
            prev = h
    print(f"chain intact, head={prev[:12]}")
    return True
```

```bash
# Step 1: log what the agent was allowed to do
python3 -c "from audit_log import record; record('claims-triage-01','read_claim','claim/88231','allow','pol-2026-11-03')"

# Step 2: log what the policy blocked (denials are evidence too)
python3 -c "from audit_log import record; record('claims-triage-01','export_report','bucket/phi-exports','deny','pol-2026-11-03')"

# Step 3: log an escalation with the human who approved it
python3 -c "from audit_log import record; record('claims-triage-01','update_claim','claim/88231','escalate','pol-2026-11-03',approver='r.menon')"

# Step 4: verify the chain, then answer the auditor's question
python3 -c "from audit_log import verify; verify()"
grep 'claim/88231' agent_decisions.jsonl
```

```text
chain intact, head=44fba216033a
```

Your head hash will differ, since it includes timestamps. Now the part auditors like: tamper with an entry and run verify again.

```bash
# Flip the first decision from allow to deny, then re-verify
sed -i.bak '1s/allow/deny/' agent_decisions.jsonl
python3 -c "from audit_log import verify; verify()"
```

```text
chain broken at line 1
```

Call `record()` from the enforcement point, the layer that allows or blocks the tool call, not from inside the agent's own code. If you're using a runtime policy engine such as Microsoft's open-source Agent Governance Toolkit (MIT license, released April 2026, public preview as of mid-2026), that interception layer already exists and you'd write decisions from there.

## What breaks, and what to watch out for

**The chain proves edits, not deletion of the whole file.** Anyone with write access can regenerate every hash. Ship the head hash somewhere the agent's host can't write, such as object-lock storage or your SIEM, on a schedule. The auditor then compares the anchored head to the file.

**This script has one writer.** Two processes appending at once will fork the chain. In production, use a database sequence or a ledger service and keep the same `prev` and `hash` idea.

**If the agent can write its own log, the log is fiction.** Put logging in the enforcement layer, outside the agent process.

**A policy version with no archive is a dead reference.** `pol-2026-11-03` only means something if the exact policy file is in git at that tag.

**Log identifiers, not content.** In healthcare and BFSI, `claim/88231` is fine; the claim body in your audit log turns the log into a regulated dataset.

**Logging only denials looks selective.** Auditors sample allows too, because that's where excessive agency hides.

**You can't govern agents you don't know about.** If 82% of organizations found agents nobody told security about, the inventory row comes before the log.

## Quick reference: five questions to answer in under ten minutes

1. List every agent in production, its owner and its autonomy level.
2. Show one agent's identity and the permissions it holds today.
3. Show a denied action and the policy version that denied it.
4. Pull everything one agent did to one record last week, and verify the chain.
5. Revoke an agent's credentials and show it stopped.

Pick the agent with the biggest blast radius, usually the one that can write to a system of record, and get it to a yes on all five before you touch the next one.

### References

- [Digital Omnibus on AI enters into force (White & Case)](https://www.whitecase.com/insight-alert/eu-ai-omnibus-enters-force-amending-ai-act)
- [Digital Omnibus on AI key dates (Hunton)](https://www.hunton.com/privacy-and-cybersecurity-law-blog/eu-digital-omnibus-on-ai-enters-into-force)
- [The Digital Omnibus for AI is here (ICT Recht)](https://www.ictrecht.nl/en/blog/de-digitale-omnibus-voor-ai-is-er-wat-verandert-er-nu-écht)
- [EU AI Act high-risk deadline delayed: penalty tiers (ai2.work)](https://ai2.work/blog/eu-ai-act-high-risk-deadline-delayed-what-enterprises-must-do)
- [Autonomous by Design, Uncontrolled in Practice (CSA)](https://labs.cloudsecurityalliance.org/research/csa-whitepaper-agentic-ai-loss-of-control-20260908-csa-style/)
- [AI agent errors trigger Sev-1 at Meta (Kiteworks)](https://www.kiteworks.com/cybersecurity-risk-management/meta-rogue-ai-agent-data-exposure-governance/)
- [Autonomous but Not Controlled: PocketOS incident (PointGuard AI)](https://www.pointguardai.com/blog/autonomous-but-not-controlled-csa-report-reveals-a-serious-security-gap)
- [OWASP Top 10 for Agentic Applications 2026](https://genai.owasp.org/resource/2025-12-09/owasp-top-10-for-agentic-applications-for-2026)
- [Introducing the Agent Governance Toolkit (Microsoft)](https://opensource.microsoft.com/blog/2026/04/02/introducing-the-agent-governance-toolkit/)

---


