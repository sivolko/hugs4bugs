---
layout: post
title: "Why You Still Need a SIEM"
date: 2026-06-26 07:15:50 UTC
category: security
tags:
  - SIEM
  - Microsoft Sentinel
  - Observability
subtitle: "Even If You Already Have Grafana or New Relic?"
description: "Grafana and New Relic tell you your app is unhealthy. They won't tell you someone is inside it. Here's what a SIEM actually catches that they can't.After this you'll know exactly which security questions Grafana and New Relic can't answer, and where a SIEM starts earning its cost."
image: https://images.unsplash.com/photo-1484950763426-56b5bf172dbb?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
optimized_image: https://images.unsplash.com/photo-1484950763426-56b5bf172dbb?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
image_position: "62% 72%"
author: Shubhendu Shubham
---

I get this question almost every quarter, usually from someone who just signed off on a [New Relic](https://newrelic.com/) or Datadog renewal: "We have full observability now, dashboards, traces, alerts on everything, do we really need to buy a SIEM on top of this?" The honest answer is yes, and it has nothing to do with how good Grafana or New Relic is at its job. It's because neither of them was built to answer the question a SIEM exists for.

Observability answers "is my system healthy." A SIEM answers "is someone doing something to my system they shouldn't be." Those sound like the same question if you say them fast. They're not, and conflating them is how breaches sit undetected for weeks while every dashboard stays green the whole time.

## What is a SIEM, and why is comparing it to Grafana the wrong question

SIEM stands for Security Information and Event Management. At its core it's a system that pulls in logs from everywhere, your identity provider, your firewalls, your endpoints, your cloud audit trail, your applications, normalizes them into a common format, and then runs correlation rules across all of it looking for patterns that match known attacker behavior. Splunk, Microsoft Sentinel, IBM QRadar, Elastic Security, and the open-source option Wazuh all do this job, with very different pricing models and very similar core ideas.

Grafana, New Relic, Datadog, and Prometheus are observability platforms. They're built around the three pillars: metrics, logs, and traces, with one job: tell an SRE when the system is unhealthy and help them find the broken thing fast. They're reactive to performance and reliability. They were never designed to think about intent.

So "we already have observability, why do we need a SIEM" is a bit like asking why you need a smoke detector when you already have a thermostat. Both of them care about temperature in some sense. Only one of them is trying to catch fire.

## What problem do observability tools actually solve, and where do they stop

### The three pillars cover health, not hostility

Grafana shows you CPU, memory, latency percentiles, and request rates. New Relic and Datadog APM add distributed traces so you can see which downstream call made a request slow. This is genuinely great engineering, and if your auth-service p99 jumps from 120ms to 2.8 seconds, these tools will tell you within seconds and probably point at the offending pod or query.

### What's missing: identity, intent, and "is this normal for this person"

None of that tooling, by default, ingests who logged in, from where, with what role, doing what action, compared to how that person normally behaves. They don't carry identity provider sign-in logs, IAM policy change events, or per-user data access patterns. They show you a system symptom. They don't show you a security story.

Take Log4Shell, CVE-2021-44228, as an example almost everyone in this industry remembers. A server under active exploitation through a malicious JNDI lookup looks, from a pure metrics standpoint, like a CPU and connection spike. Nothing in that graph says "exploit." A SIEM watching outbound LDAP or RMI connections to unfamiliar external IPs immediately after an inbound request with a crafted User-Agent string has the actual indicator. The observability stack just sees load.

## How does a SIEM correlate signals that Grafana never sees

### Log normalization: everything becomes one schema

Raw logs arrive in wildly different shapes. Windows Event Logs, syslog, cloud audit JSON, firewall CEF format. A SIEM normalizes all of it into a common schema, Splunk's CIM, Sentinel's ASIM, so that "user," "source IP," "action," and "destination" mean the same thing no matter which system the event came from. That normalization step is what makes cross-source correlation possible at all.

### Correlation rules and MITRE ATT&CK mapping

Here's the part that actually matters: a SIEM correlates events across sources within a time window. Fifty failed logins from forty distinct IPs in three minutes isn't suspicious on its own, brute-force tools fail constantly and get ignored. One successful login afterward isn't suspicious on its own either, people mistype passwords. But the sequence, burst of failures, then one success, then that same identity calling a privileged API it's never touched before, is the thing worth waking someone up for. Grafana's data model has no concept of "this entity normally never does this." A SIEM's does, and most modern platforms let you tag the detection to a MITRE ATT&CK technique ID so your SOC and your auditors both know exactly which stage of an intrusion got caught.

## Real scenario: a 2:14 AM latency spike that was actually a breach

> **Scenario:** NorthStar Lending, a fictional Bengaluru-based NBFC, gets an on-call page at 2:14 AM IST. Grafana shows p99 latency on `auth-service` jumping from 120ms to 2.8s. New Relic APM shows a 4x spike in 500 errors on `/api/v2/login`. The on-call SRE checks pod memory, sees nothing alarming, restarts two pods, and latency drops back to normal by 2:31 AM. The ticket gets closed as "transient load, likely client retries."

Here's what was actually happening underneath, visible only because a SIEM was watching the identity and cloud audit logs that the observability stack never touches. Between 2:09 and 2:14 AM, forty IPs, mostly Tor exit nodes and residential proxies, hit `/api/v2/login` over six thousand times using a leaked credential combo list. One attempt succeeded. The account belonged to a back-office ops contractor who'd been granted an MFA exemption two years earlier during a rushed onboarding migration, and nobody had ever revoked it.

At 2:16 AM, that session called an internal admin API and exported a KYC report, 53,000 records including PAN numbers, to an S3 bucket outside the org's AWS account. The IAM role attached to that account had a wildcard `s3:*` permission left over from the same migration, instead of the read-only scope it was supposed to have.

The SRE's dashboards saw the symptom, a login storm driving up latency and error rate, and "fixed" it by restarting pods. Nobody saw the exfiltration because Grafana and New Relic don't ingest Azure AD or Okta sign-in logs, IAM policy evaluation events, or S3 data access logs by default, and even if they did, neither has a correlation engine built to chain "login storm, then one success, then privileged API call, then data egress" into a single incident. A SIEM watching those three log sources would have fired one high-fidelity alert at 2:17 AM, tagged T1110 (Brute Force) into T1078 (Valid Accounts) into T1537 (Transfer Data to Cloud Account), with the account, the source IPs, and the exact API calls already on one timeline. Instead, NorthStar found out six weeks later, from a customer who got a fraud call referencing data that should never have left the building.

## Step-by-step: what a real SIEM detection rule looks like

This is the part worth showing side by side, because the contrast is the whole point. Here's a perfectly reasonable Prometheus alert, this is exactly what Grafana and Prometheus are built to catch well:

```yaml
# prometheus-alerts.yml
# This is what observability tooling is genuinely good at: a clean,
# single-service threshold alert.
groups:
  - name: auth-service-health
    rules:
      - alert: AuthServiceHighLatency
        expr: histogram_quantile(0.99, rate(http_request_duration_seconds_bucket{service="auth-service"}[5m])) > 1
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "auth-service p99 latency above 1s for 2 minutes"
```

That rule has no way to know whether the latency spike came from a deploy, a slow downstream dependency, or a credential-stuffing botnet. It just knows latency is high. Now here's the kind of cross-source correlation a SIEM runs instead, written for Microsoft Sentinel, since most of the environments I work in are Azure-first:

```kql
// Sentinel KQL: chains a credential-stuffing burst to the one successful
// sign-in, then checks if that account touched a sensitive resource
// within the same window. Adjust table/field names if you're pulling
// from AWS CloudTrail or GCP audit logs instead of Azure AD.
let Lookback = 30m;
// Step 1: find accounts hit by a burst of failed sign-ins from many IPs
let BruteForceTargets = SigninLogs
    | where TimeGenerated > ago(Lookback)
    | where ResultType != "0"
    | summarize FailedAttempts = count(), DistinctIPs = dcount(IPAddress) by UserPrincipalName
    | where FailedAttempts > 50 and DistinctIPs > 20;
// Step 2: did one of those accounts then succeed?
let SuccessfulBreakIn = SigninLogs
    | where TimeGenerated > ago(Lookback)
    | where ResultType == "0"
    | where UserPrincipalName in (BruteForceTargets)
    | project TimeGenerated, UserPrincipalName, IPAddress, AppDisplayName;
// Step 3: did that same account immediately export or download something?
SuccessfulBreakIn
| join kind=inner (
    AuditLogs
    | where OperationName has "Export" or OperationName has "Download"
  ) on $left.UserPrincipalName == $right.InitiatedBy
| project TimeGenerated, UserPrincipalName, IPAddress, OperationName
// Sample output:
// 2026-06-26T02:16:11Z | ops-contractor07@northstarlending.com |
// 185.220.101.43 | "Export KYC Report"
```

Note this isn't a copy-paste-and-done query, your actual field names will depend on whether you're correlating Azure AD with Azure Activity logs, AWS CloudTrail, or a custom app audit table. The schema details are annoying and the Microsoft docs don't always make the join keys obvious. The shape of the logic, burst, then success, then privileged action, within one window, is the part that matters and translates across any SIEM.

## What breaks: the "pipe everything into Splunk" mistake

Once a team decides they need a SIEM, the most common mistake I see is forwarding every log they already have, including high-volume app and infra logs sitting comfortably in Datadog or New Relic, straight into Splunk or Sentinel. Both platforms bill by ingestion volume, and security log ingestion is priced very differently from observability telemetry that's designed for high cardinality. I've seen a six-figure ingestion bill show up in month two because someone forwarded raw application debug logs "just in case."

The fix is to be selective. Send identity provider logs, EDR telemetry, firewall and VPC flow logs, and cloud audit trails into the SIEM. Keep performance metrics and high-cardinality traces in Grafana and New Relic, where they're cheap and built for exactly that volume. If you need to filter noisy fields before they hit the SIEM, something like Cribl Stream or Sentinel's own data collection rules will save you real money.

The second common mistake is alert fatigue. Out-of-the-box SIEM rule packs throw a lot of low-fidelity alerts at analysts, and an under-tuned SIEM trains your SOC to ignore everything within a month, which defeats the entire point. Tune detections to your actual environment before you trust them.

And don't skip the compliance angle. PCI-DSS Requirement 10 expects audit logs retained for at least a year, with the most recent three months immediately searchable. RBI's cyber security framework for NBFCs and banks expects similarly long retention for security-relevant logs. Grafana and Prometheus typically retain metrics for fifteen to ninety days because that's all an SRE needs for trend analysis, and cost goes up fast past that. If your security log retention is whatever your observability stack happens to keep, you have a compliance gap, not a strategy.

## Quick reference: Grafana/New Relic vs SIEM, side by side

| Capability | Observability stack | SIEM |
|---|---|---|
| Primary question answered | Is the system healthy | Is someone attacking or misusing the system |
| Data ingested | Metrics, traces, app logs | Identity logs, EDR, firewall, cloud audit trail, app logs |
| Typical retention | 15-90 days, cost-driven | 1+ years, compliance-driven |
| Correlation model | Per-service, time-series thresholds | Cross-source, identity-centric, MITRE ATT&CK mapped |
| Example tools | Grafana, New Relic, Datadog, Prometheus | Splunk, Microsoft Sentinel, IBM QRadar, Elastic Security, Wazuh |

**Bottom line:** if you can only have one of these for a 2 AM page, the observability stack tells you what broke. The SIEM tells you whether someone broke it on purpose. Most breaches sit undetected for months precisely because a team only had the first one and assumed it covered the second.