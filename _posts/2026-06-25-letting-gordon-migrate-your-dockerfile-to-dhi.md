---
layout: post
title: "Letting Gordon migrate your Dockerfile to DHI: "
date: 2026-06-25 20:33:16 UTC
category: devsecops
tags:
  - docker hardened images
  - docker ai
subtitle: "what you're actually approving?"
description: "How Docker's Gordon AI assistant migrates Dockerfiles to Docker Hardened Images, what permissions it requests, and what to verify before approving.What Gordon actually does to your Dockerfile when you ask it to migrate to Docker Hardened Images, and what to check before you approve any of it."
image: https://plus.unsplash.com/premium_photo-1701091956254-8f24ea99a53b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
optimized_image: https://plus.unsplash.com/premium_photo-1701091956254-8f24ea99a53b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
image_position: "50% 50%"
discover: true
author: Shubhendu Shubham
---

`docker ai`, then `"Migrate my dockerfile to DHI"`, then a minute or two of back-and-forth, and you get a working multi-stage Dockerfile back. That part isn't the interesting bit — it works about as well as you'd expect for a well-documented, pattern-based migration. The interesting bit is what you just approved while you were looking at the diff instead of the permission prompt.

I covered the [manual DHI migration](https://docs.docker.com/dhi/migration/migrate-from-doi/) for Verclaim Health's claims-validation API in the last post. This time I pointed [Gordon](https://docs.docker.com/ai/gordon/) at the same Dockerfile to see what it does differently, and more importantly, what it asks permission to do along the way.

## What is Gordon, and why use it to migrate to DHI?

Gordon is Docker's built-in AI assistant, available through Docker Desktop or the `docker ai` CLI command. [AI-assisted migration](https://docs.docker.com/dhi/migration/migrate-with-ai/) is currently an experimental capability on top of it: you point it at a Dockerfile, ask it to migrate to Docker Hardened Images, and it edits the file directly rather than just describing what to change.

The appeal is obvious if you've got a few hundred Dockerfiles across a microservices estate and no appetite to hand-edit each one using the checklist from the manual migration guide. The catch is that you're handing an LLM-driven agent write access to your build files and, depending on what it decides it needs, your shell and the internet too.

## What problem does AI-assisted migration actually solve?

The manual process isn't hard once you understand it — swap the base image, split into a multi-stage build, fix whatever assumed root and a shell. But it's repetitive in a way that doesn't reward careful attention the tenth time through. Gordon is aimed at that repetition: same pattern, applied consistently, without a human getting bored on Dockerfile #47 and skipping the `docker scout compare` step.

It doesn't solve the part that actually matters for a security team, though: someone still has to verify the result is correct. Docker says as much directly — you're expected to check the assistant's edits and test the image before you trust it, the same as you would with any AI-generated change to production infrastructure.

## How does Gordon's migration flow work under the hood?

Functionally, it's the same migration described in the [migration checklist](https://docs.docker.com/dhi/migration/checklist/) — Gordon isn't using a different process, it's just driving the same one. What's different is the interaction model, governed by [Gordon's permission system](https://docs.docker.com/ai/gordon/how-to/permissions/):

- Reading files, listing directories (even outside its working directory), and searching documentation happen without asking.
- Running shell commands, writing or changing files, and fetching anything from the internet all require your explicit approval first.

That second list is the entire migration: Gordon has to write the new Dockerfile, almost certainly wants to run a build to confirm it works, and needs network access to pull the DHI base images and run `docker scout compare` against them. None of that is unreasonable for the task — but it means a single "yes" early in the conversation can cover commands you never individually reviewed, because **approving a tool for the session approves every subsequent use of that tool, not just the one in front of you.**

One detail worth flagging for anyone used to thinking about sandboxing: the working directory you start `docker ai` in is just the default context for file operations. It does not fence Gordon in — it can still read files outside that directory if it decides it needs to.

## Real scenario: running `docker ai` against Verclaim Health's claims-validation Dockerfile

Same Dockerfile from last time: single-stage, `python:3.11-slim`, root user, `apt-get install gcc libpq-dev`, writing logs to `/var/log/claims-api`, bound to port 80. I ran it through Gordon to compare against the migration I did by hand.

```bash
cd ~/projects/claims-api
docker ai
```

```console
> Migrate my dockerfile to DHI

Gordon: I'll update your Dockerfile to use Docker Hardened Images. This will require
a multi-stage build since your current image installs build tools and runs as root.

Gordon proposes:
  Write changes to Dockerfile

Approve? [Y/n/a]: y

Gordon proposes:
  docker login dhi.io

Approve? [Y/n/a]: a

Gordon proposes:
  docker build -t claims-api:dhi-test .

[Executes automatically - you approved shell access for this session]

Gordon proposes:
  docker scout compare claims-api:dhi-test --to claims-api:latest --ignore-unchanged

[Executes automatically]
```

The rewritten Dockerfile Gordon produced was functionally close to the one I'd written by hand: `dhi.io/python:3.11-debian12-dev` for the build stage, `dhi.io/python:3.11-debian12` for runtime, `gcc`/`libpq-dev` moved into the build stage, and the port changed off 80. It missed one thing I'd caught manually — it left the `RUN mkdir -p /var/log/claims-api` line in the runtime stage, which still fails against the nonroot user. That's exactly the kind of thing the verify-before-trusting step is for.

## How do you actually run an AI-assisted DHI migration, step by step?

**Step 1: Confirm Gordon is available.** AI-assisted migration needs Docker Desktop 4.38.0 or later for the base feature. If you want the newer ask-first permission UI and session-level approval described above — including the option to flip on YOLO mode — that's a Desktop 4.61.0+ capability specifically, so check which version you're actually running before assuming you'll see those prompts.

**Step 2: Start the conversation from the right directory.**

```bash
cd /path/to/your/dockerfile
docker ai
```

**Step 3: Ask for the migration.**

```console
"Migrate my dockerfile to DHI"
```

**Step 4: Read every proposed action before approving it**, not just the Dockerfile diff at the end. "Approve for this session" is convenient and also the point where you stop seeing individual commands.

**Step 5: Verify independently.** Build the image yourself, run `docker scout compare` against the original, and walk through the [migration checklist](https://docs.docker.com/dhi/migration/checklist/) by hand — package management, nonroot permissions, ports, entry point, no shell — even though Gordon already claims to have handled it.

## What should you verify before approving Gordon's changes?

| Check | Why it matters | What I'd actually do |
|---|---|---|
| Base and dev tags | Gordon might pick a different distro variant than your team standardizes on | Confirm `-debian12` vs `-alpine3.23` matches your other services |
| File permissions | Nonroot (UID 65532) can't write where root could | Grep the diff for any `mkdir`, `chmod`, or log-path assumptions left over from the old image |
| Port binding | Privileged ports break under nonroot | Confirm `EXPOSE` and the app's bind address both moved to 1025+ |
| Build success | A clean diff doesn't guarantee a working image | Run the build yourself, don't trust the "no vulnerabilities detected" message without your own `docker scout compare` |
| Approval scope | "Approve for this session" covers every later use of that tool | Use single-approval (`y`) instead of session-approval (`a`) for anything touching production-bound files |
| Destructive ops | Gordon warns about destructive commands but doesn't block them | Have a Git commit before you start, so reverting is a `git checkout` away |

**Bottom line:** Gordon got Verclaim's migration about 90% right on the first pass — correct base images, correct multi-stage split, correct port change. It missed a runtime permission issue that would have failed on first deploy. That ratio is good enough to use as a starting draft and bad enough that it shouldn't go anywhere near a CI pipeline without a human reading the diff first.

## Gordon migration cheat sheet

| Gordon action | Requires approval? |
|---|---|
| Reading your Dockerfile, listing project files | No |
| Searching Docker docs for the right DHI tag | No |
| Writing the migrated Dockerfile | Yes |
| `docker login dhi.io` / pulling DHI images | Yes (network access) |
| Running `docker build` to test the result | Yes (shell access) |
| `docker container prune`, `docker volume rm`, or similar | Yes — but Gordon will run it once you've approved shell access for the session, so read the proposal, not just the prompt |

If your org needs this locked down further, [Settings Management](https://docs.docker.com/enterprise/security/hardened-desktop/settings-management/) lets administrators disable Gordon entirely, restrict which tools it can call, or pin its working directory boundaries — worth setting before someone on your team approves "a" without reading what comes next.