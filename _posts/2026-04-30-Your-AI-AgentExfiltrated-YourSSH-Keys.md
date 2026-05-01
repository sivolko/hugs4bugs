---
title: Your AI Agent Just Exfiltrated Your SSH Keys. You Approved It.
date: 2026-04-30 12:00:00 Z
category: security
tags:
- docker
- sandbox
- ai-agents
- security
layout: post
subtitle: The hidden risks of AI agent integrations and data exfiltration.
description: 'Exploring the security implications when AI agents have access to sensitive credentials and how approval workflows can inadvertently enable data exfiltration.'
image: https://cdn.pixabay.com/photo/2017/11/19/23/56/hacking-2964100_960_720.jpg
optimized_image: https://cdn.pixabay.com/photo/2017/11/19/23/56/hacking-2964100_960_720.jpg
author: Shubhendu Shubham
---

.

> **Source**: All technical content sourced from the [official Docker Sandboxes documentation](https://docs.docker.com/ai/sandboxes/) and [Docker Engine Security docs](https://docs.docker.com/engine/security/).

---

## The New Problem Sitting in Every Engineering Team's Lap

AI coding agents changed how software gets written. Claude Code, GitHub Copilot CLI, Codex, Gemini CLI — these tools don't just suggest code anymore, they execute it. They install packages, run builds, modify config files, call APIs, and spin up services. And by default, they do all of that on your machine, with your credentials, against your filesystem.

That's fine until it isn't. The moment an agent makes a wrong decision — misinterprets a prompt, hits a malicious package, or gets fed unexpected input — the blast radius on a developer machine is your entire environment. Your SSH keys, your `.env` files, your Git history, your host Docker daemon, your other containers.

Docker Sandboxes is the answer to this problem. Not a theoretical answer — an actual, running architecture with four specific isolation layers between the agent and your host system. This blog breaks down how it works, what it actually protects, and what it doesn't.

---

## What a Docker Sandbox Actually Is

Before anything else: this is not a Docker container with some extra flags. The primary trust boundary here is a **microVM** — a lightweight virtual machine with its own Linux kernel, completely separate from your host.

Every sandbox runs inside a lightweight microVM with its own Linux kernel. Unlike containers, which share the host kernel, a sandbox VM cannot access host processes, files, or resources outside its defined boundaries.

That distinction matters a lot. A container shares the host kernel. Kernel exploits, certain namespace escapes, and privileged container misconfigurations can reach through to the host. A microVM doesn't share anything — the kernel boundary is the isolation boundary.

Sandboxes run fully isolated in microVMs, giving more isolation without paying the full cost of running a VM. This lets them do things that need more permissions safely, like running additional Docker containers.

---

## The Four Isolation Layers — What They Are and Why Each Matters

Docker Sandboxes doesn't rely on a single security boundary. The sandbox security model has four layers: hypervisor isolation (separate kernel per sandbox, no shared memory or processes with the host), network isolation (all HTTP/HTTPS traffic proxied through the host, deny-by-default policy, non-HTTP protocols blocked entirely), Docker Engine isolation (each sandbox has its own Docker Engine with no path to the host daemon), and credential isolation (API keys are injected into HTTP headers by the host-side proxy, credential values never enter the VM).

Let's go through each one.

### Layer 1: Hypervisor Isolation

Process isolation means a separate kernel per sandbox; processes inside the VM are invisible to your host and to other sandboxes. Filesystem isolation means only your workspace directory is shared with the host — the rest of the VM filesystem persists across restarts but is removed when you delete the sandbox. Symlinks pointing outside the workspace scope are not followed.

This is the primary trust boundary. Everything else is defense-in-depth on top of it.

### Layer 2: Network Isolation

Raw TCP connections, UDP, and ICMP are blocked at the network layer. DNS resolution is handled by the proxy; the sandbox cannot make raw DNS queries. Traffic to private IP ranges, loopback, and link-local addresses is also blocked. Only domains explicitly listed in the policy are reachable.

This is not "restrict a few ports." It's a deny-by-default model where the only exit for any traffic is through an HTTP/HTTPS proxy on your host. An agent can't exfiltrate your files over a raw TCP socket. It can't ping your internal network. It can't resolve arbitrary DNS. The proxy decides what gets through.

### Layer 3: Docker Engine Isolation

Agents often need to build images, run containers, and use Docker Compose. Mounting your host Docker socket into a container would give the agent full access to your environment. Docker Sandboxes avoid this by running a separate Docker Engine inside the sandbox environment, isolated from your host. When the agent runs `docker build` or `docker compose up`, those commands execute against that engine. The agent has no path to your host Docker daemon.

This is important and easy to miss. The most common mistake in "secure" agent setups is mounting `/var/run/docker.sock` into the agent's container. Once you do that, the agent owns your host — it can spawn privileged containers, escape the container entirely, access any volume. Docker Sandboxes eliminates this attack vector completely by giving the agent its own isolated Docker daemon.

### Layer 4: Credential Isolation

An HTTP/HTTPS proxy on your host intercepts outbound API requests from the sandbox and injects the appropriate authentication headers before forwarding each request. Your credentials stay on the host and are never stored inside the sandbox VM.

Credential values are never stored inside the VM. They are not available as environment variables or files inside the sandbox unless you explicitly set them. This means a compromised sandbox cannot read API keys from the local environment.

The agent makes API calls, but never sees the keys. The proxy handles the auth injection. Even if the entire VM were compromised, an attacker inside it can't extract your `ANTHROPIC_API_KEY` or your `GITHUB_TOKEN` because those values never crossed the VM boundary.

---

## Installing and Getting Started

```bash
# Install Docker Engine (if not already installed)
curl -fsSL https://get.docker.com | sudo REPO_ONLY=1 sh

# Install the sandbox CLI
sudo apt-get install docker-sbx

# Add your user to the kvm group (required for microVM support)
sudo usermod -aG kvm $USER
newgrp kvm

# Log in
sbx login
```

That's it for setup. The `kvm` group membership is required because microVMs use Linux KVM for hardware virtualization — this is what gives you the kernel-level isolation without the full overhead of a traditional VM.

---

## Use Case 1: Running Claude Code Without Touching Your Host

This is the scenario most developers hit first. You want to use Claude Code in `--dangerously-skip-permissions` mode — the mode where it doesn't ask for approval on every command. On your host machine, that's a significant risk. Inside a sandbox, it's the default, safe workflow.

```bash
# Start a Claude Code sandbox in your project directory
cd ~/projects/my-api
sbx run claude
```

Each agent runs inside a dedicated microVM with your dev environment and only your project workspace mounted in. Agents can install packages, modify configs, and spin up their own Docker containers. Your host stays untouched. No manual review, no permission prompts, no supervision required.

What happens when you run this:

1. A microVM boots with your `~/projects/my-api` directory mounted at the same absolute path
2. Claude Code starts inside the VM with full permissions within that scope
3. All outbound traffic routes through your host proxy
4. Any `docker build` or `docker run` the agent issues hits the sandbox's own isolated Docker Engine
5. When you're done, `sbx rm` deletes the VM and everything inside it

The agent can install `npm` packages, run tests, start a local dev server, build Docker images — none of it touches your host.

### Verifying Workspace Isolation

```bash
# Check which sandboxes are running
sbx ls

# Inspect what's running inside
sbx exec <sandbox-id> -- ps aux

# Your host processes don't appear here — they're in a different kernel
```

---

## Use Case 2: Locking Down Network Access for a Sensitive Codebase

You're working on a codebase that handles payment processing. You want an agent to help with refactoring, but you're not comfortable with it being able to call arbitrary external APIs. You want it to only access your package registries and nothing else.

Sandboxes are network-isolated from your host and from each other. A policy system controls what a sandbox can access over the network. Use the `sbx policy` command to configure network access rules. Rules apply to all sandboxes on the machine. The only way traffic can leave a sandbox is through an HTTP/HTTPS proxy on your host, which enforces access rules on every outbound request.

Set up a tight policy before starting the sandbox:

```bash
# Start with a clean policy slate
sbx policy reset

# When prompted, choose option 2 (Balanced — deny-by-default)
# > Choose a default network policy:
# > 1. Open  — All network traffic allowed
# > 2. Balanced — Default deny, with common dev sites allowed

# Allow only what the agent needs
sbx policy allow network "*.npmjs.org,*.pypi.org,files.pythonhosted.org,github.com"

# Explicitly block anything you don't want touched
sbx policy deny network "*.stripe.com,*.twilio.com,api.sendgrid.com"

# Verify your rules
sbx policy ls
```

Output:

```
ID                                    TYPE     DECISION  RESOURCES
a1b2c3d4-e5f6-7890-abcd-ef1234567890  network  allow     *.npmjs.org, *.pypi.org, files.pythonhosted.org, github.com
f9e8d7c6-b5a4-3210-fedc-ba0987654321  network  deny      *.stripe.com, *.twilio.com, api.sendgrid.com
```

Now run the agent:

```bash
sbx run claude
```

The agent can install packages and pull from GitHub. It cannot call your payment processor's API, your SMS provider, or your email service — even if it tries to, the proxy blocks it at the network layer.

Rules support exact domains (`example.com`), wildcard subdomains (`*.example.com`), and optional port suffixes (`example.com:443`). Note that `example.com` doesn't match subdomains, and `*.example.com` doesn't match the root domain. Specify both to cover both.

So if you want to allow both `api.github.com` and `github.com`, specify both:

```bash
sbx policy allow network "github.com,*.github.com"
```

---

## Use Case 3: Credential Security — API Keys That Never Enter the VM

Here's a practical setup for a team where multiple developers use the same sandbox configuration, each with their own API keys.

Stored secrets (recommended) are saved in your OS keychain, encrypted and persistent across sessions. Environment variables are read from your current shell session — this works but is less secure on the host side, since environment variables are visible to other processes running as your user. If both are set for the same service, the stored secret takes precedence.

The secure way to set credentials:

```bash
# Store your Anthropic key in the OS keychain (recommended)
sbx secret set -g anthropic

# Or pipe it non-interactively in CI
echo "$ANTHROPIC_API_KEY" | sbx secret set -g anthropic

# Store GitHub credentials
sbx secret set -g github
```

The less secure but functional way (for quick local dev):

```bash
# Export in your shell — proxy reads it, VM never sees it
export ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
sbx run claude
```

Don't set API keys manually inside the sandbox. Sandbox agents are pre-configured to use proxy-managed credentials. For Claude Code and Codex, OAuth is another secure option: the flow runs on the host, so the token is never exposed inside the sandbox.

### SSH Agent Forwarding — Keys Stay on the Host

If your host has an SSH agent and `SSH_AUTH_SOCK` is set, Docker Sandboxes forwards the agent into the sandbox and sets `SSH_AUTH_SOCK` there. The private keys stay on your host. Processes inside the sandbox can request signatures from the forwarded agent, but they can't read or copy the private key.

```bash
# Ensure your SSH agent is running and key is loaded on the host
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Start sandbox — SSH agent forwarding happens automatically
sbx run claude

# Inside the sandbox, the agent can do Git operations over SSH
# but cannot read your private key — only request signatures
```

---

## Use Case 4: Multi-Agent Workload Isolation

You're running two agents simultaneously — one refactoring your backend API, another working on your frontend. They're in the same repo. You want them to operate independently without stepping on each other.

```bash
# Sandbox 1: backend work, branch isolated
cd ~/projects/myapp
sbx run claude --branch feature/api-refactor

# Sandbox 2: frontend work, different branch
sbx run claude --branch feature/ui-overhaul

# List both
sbx ls
```

Sandboxes are isolated from each other. All outbound traffic from the sandbox routes through an HTTP/HTTPS proxy on your host. Agents are configured to use the proxy automatically. The proxy enforces network access policies and handles credential injection.

Each sandbox has its own VM, its own Docker Engine, its own filesystem state. Agent 1 building a Docker image doesn't affect Agent 2's build cache. Agent 2 installing packages doesn't conflict with Agent 1's dependencies. They share your network policy but nothing else.

When you're done:

```bash
# Remove sandbox and its VM — branch worktrees are cleaned up too
sbx rm <sandbox-id>
```

---

## Use Case 5: Workspace Trust — The Thing Most People Miss

This is the security gap that's easy to overlook. The sandbox isolates the agent from your host system, but the agent's actions can still affect you through the shared workspace. Your workspace is mounted into the VM with read-write access, and changes the agent makes appear on your host immediately.

The agent edits the same files you see on your host. This includes files that execute implicitly during normal development: Git hooks, CI configuration, IDE task configs, Makefile, `package.json` scripts, and similar build files. Review changes before running any modified code. Note that Git hooks live inside `.git/` and do not appear in `git diff` output. Check them separately.

This is real. A malicious or confused agent could:
- Add a `postinstall` script to `package.json` that runs on your next `npm install`
- Modify a Git hook in `.git/hooks/pre-commit` that executes on your next commit
- Edit a `Makefile` target that runs in your next build

None of these require the agent to escape the VM. They work through the legitimate shared workspace channel.

**Practical defense:**

```bash
# After an agent session, before running anything:

# Check package.json scripts for unexpected additions
git diff HEAD -- package.json

# Check Git hooks explicitly — they don't show in normal git diff
ls -la .git/hooks/
cat .git/hooks/pre-commit  # if it exists

# Check CI config
git diff HEAD -- .github/workflows/

# Check Makefiles
git diff HEAD -- Makefile
```

Make this part of your review process. The agent didn't lie to you — it's just that the workspace channel is a legitimate shared boundary that the sandbox architecture explicitly documents.

---

## The Architecture Under the Hood

Understanding how traffic actually flows helps you configure policies correctly and debug when something doesn't reach the network.

```
Developer Machine
├── sbx daemon (host process)
│   ├── HTTP/HTTPS proxy (enforces network policies, injects credentials)
│   └── microVM hypervisor
│       └── [VM] Sandbox
│           ├── Isolated Linux kernel
│           ├── Agent (Claude Code / Codex / Gemini CLI / etc.)
│           ├── Workspace mount (read-write, your project directory)
│           └── Isolated Docker Engine
│               └── Containers built by the agent
│
└── Host Docker daemon (completely separate — agent has no path here)
```

Your workspace is mounted directly into the sandbox through a filesystem passthrough. The sandbox sees your actual host files, so changes in either direction are instant with no sync process involved. Your workspace is mounted at the same absolute path as on your host. Preserving absolute paths means error messages, configuration files, and build outputs all reference paths you can find on your host.

That last detail is useful — because paths are preserved, stack traces and error messages inside the sandbox point to the same file paths you see on your host. No mental translation required when debugging.

---

## What Sandboxes Don't Protect Against

Being clear about the limits is as important as describing the capabilities. The official docs are direct about this.

**Workspace channel is bidirectional.** The agent can modify any file in your project, including files that execute implicitly. Review changes before running them.

**Allowed domains cover a lot of surface area.** Default allowed domains include broad wildcards. Some defaults like `*.googleapis.com` cover many services beyond AI APIs. If your threat model is tight, audit the default policy and trim it.

**The sandbox isolates the agent, not from you.** If you copy a file out of the sandbox and run it, the sandbox did its job. What you do with the output is on you.

**UDP and ICMP stay blocked regardless.** UDP and ICMP traffic is blocked at the network layer and can't be unblocked with policy rules. If your workflow requires UDP (unusual, but some build tools do), that's a current limitation.

---

## Quick Reference: Common `sbx` Commands

```bash
# Installation
curl -fsSL https://get.docker.com | sudo REPO_ONLY=1 sh
sudo apt-get install docker-sbx
sudo usermod -aG kvm $USER

# Authentication
sbx login

# Running agents
sbx run claude                         # Claude Code
sbx run codex                          # OpenAI Codex
sbx run gemini                         # Gemini CLI
sbx run claude --branch my-feature     # Branch-isolated workspace

# Managing secrets
sbx secret set -g anthropic            # Store Anthropic key in keychain
sbx secret set -g github               # Store GitHub credentials
sbx secret ls                          # List stored secrets

# Network policies
sbx policy allow network "*.npmjs.org,github.com"
sbx policy deny network "ads.example.com"
sbx policy ls                          # View active rules
sbx policy reset                       # Wipe all policies, start over

# Sandbox lifecycle
sbx ls                                 # List running sandboxes
sbx exec <id> -- bash                  # Open shell inside sandbox
sbx stop <id>                          # Stop without deleting VM state
sbx rm <id>                            # Delete sandbox and all VM state
```

---

## Where This Fits in Your Security Stack

Docker Sandboxes solves a specific problem: agent execution safety. It doesn't replace your CI security scanning (Docker Scout), it doesn't replace your base image hardening (Docker Hardened Images), and it doesn't replace your secrets management (Vault, AWS Secrets Manager, etc.).

What it does is put a hard boundary between an AI agent and your host — a boundary that's enforced at the kernel level, the network layer, the Docker Engine layer, and the credential layer simultaneously. For any team that's started using AI coding agents seriously, that boundary is no longer optional.

The alternative is giving a non-deterministic system full access to your machine and hoping it makes good decisions every time.

---
