---
layout: post
title: "Docker Hardened Images migration"
date: 2026-06-25 20:16:10 UTC
category: Devsecops
tags:
  - docker hardened images
  - dockerfile
  - container security
subtitle: "fixing 'sh: not found' and nonroot permission errors"
description: "How to move a Python service from a Docker Official Image to a Docker Hardened Image without breaking package installs, root permissions, or your entrypoint. A practical Docker Hardened Images migration guide covering missing shells, nonroot permissions, port binding, and multi-stage Dockerfile fixes."
image: https://images.unsplash.com/photo-1777047023579-5007a6d402bc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
optimized_image: https://images.unsplash.com/photo-1777047023579-5007a6d402bc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
image_position: "55% 69%"
discover: true
author: Shubhendu Shubham
---

You change one line in your Dockerfile — swap `FROM python:3.11-slim` for `FROM dhi.io/python:3.11-debian12` — kick off the build, and watch it fall over. `apt-get: command not found`. Fix that, rebuild, and now it's `Permission denied` writing to a log directory. Fix that too, and your container won't bind to port 80 anymore. None of this is broken tooling. It's [Docker Hardened Images](https://docs.docker.com/dhi/) (DHI) doing exactly what they're designed to do, and the official migration guide assumes you already know why before you start.

I ran this migration for a Flask claims-validation service recently, and most of the pain came from treating it like a base image bump instead of an architecture change. Here's what actually happens under the hood, why your existing Dockerfile breaks, and how to fix it without rewriting your whole build pipeline.

## What is a Docker Hardened Image, and why does it break your existing Dockerfile?

DHI ships as Alpine-based and Debian-based variants, pulled from a separate registry (`dhi.io`) rather than Docker Hub directly. You authenticate with the same Docker ID you already use, run `docker login dhi.io`, and pull images the same way you always have.

The part that actually changes your build: DHI's runtime images are [minimal, or "distroless"](https://docs.docker.com/dhi/core-concepts/distroless/). They ship the application binary, its runtime dependencies, and nothing else — no shell, no package manager, no `curl`, `ps`, or `cat`. Docker's own published comparison for the Python image shows the hardened variant dropping from roughly 412 MB down to about 35 MB, cutting installed packages from around 610 to 80, and removing a high-severity CVE along with most of the medium and low-severity ones present in the standard image. Your numbers will differ depending on the image and date you pull, but the direction is consistent: drastically less surface area for an attacker to work with.

That's also exactly why a naive `FROM` swap doesn't work. Every `apt-get install`, every `RUN sh -c`, every assumption that the container runs as root — all of it depends on tooling that simply isn't in the runtime image anymore.

## What problem is this migration actually solving?

If you're doing this voluntarily, it's usually one of two things: a customer security questionnaire that now asks for SBOMs and signed provenance on every image you ship, or an internal mandate to cut CVE noise out of vulnerability scans before it eats another sprint. DHI addresses both directly — every image ships with [SBOMs and attestations](https://docs.docker.com/dhi/core-concepts/attestations/) baked in, and for regulated environments there are FIPS and STIG-compliant variants available through a DHI subscription.

The tradeoff is operational, not philosophical. You're not losing functionality, you're losing the assumption that a shell is always one `docker exec` away. For teams in healthcare or BFSI where that compliance pressure is already non-negotiable, the migration cost is worth paying once instead of explaining the same CVE list to an auditor every quarter.

## How does DHI change your build model under the hood?

Four things change, and they all stem from the same design decision — strip the runtime image down to just what the app needs to run.

| Item | Docker Official Images | Docker Hardened Images |
|---|---|---|
| Package manager | Available everywhere | Only in `dev`/`sdk`-tagged images, used for build stages |
| Default user | Root | Nonroot (UID 65532) at runtime |
| Shell | Present | Absent in runtime images |
| Privileged ports | Root can bind below 1024 | Nonroot can't — use 1025+ |

**Bottom line:** if your Dockerfile installs anything with `apt`/`apk`, runs as root, or touches a shell command at runtime, you need a multi-stage build — a `dev`-tagged image to do the work, and a slim runtime image that just runs the result. Single-stage builds against DHI are technically supported, but they pull in the full `dev` image, which defeats most of the point.

One more gotcha that isn't obvious from the docs: DHI's base images set `USER nonroot` themselves. Since Docker inherits the active user across subsequent instructions in a stage, every `RUN` and `COPY` you add after that `FROM` line also executes as nonroot — not just `docker run` at the end. That's why `RUN apt-get update` fails twice over against a runtime-tagged image: the binary isn't there, and even if it were, your build doesn't have permission to use it.

There's also no `latest` tag on DHI images — that's deliberate, to force explicit versioning. Tags include the distro suffix, like `-alpine3.23` or `-debian12`, so check the [DHI Catalog](https://hub.docker.com/hardened-images/catalog/) for the exact tag rather than guessing.

## Real scenario: migrating Verclaim Health's claims-validation API

Verclaim Health runs a Flask service that validates incoming insurance claims against a Postgres-backed rules engine, built on `python:3.11-slim`. Their original Dockerfile looked like this:

```dockerfile
FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p /var/log/claims-api

EXPOSE 80
CMD ["gunicorn", "--bind", "0.0.0.0:80", "claims_api.wsgi:application"]
```

It's a single stage, runs as root, installs `gcc` and `libpq-dev` to compile `psycopg2` from source, writes logs to a local file, and binds to port 80. Every one of those is a wall the DHI migration runs into.

## How do you actually migrate a Dockerfile to DHI, step by step?

**Step 1: Authenticate.**

```console
$ docker login dhi.io
```

Note that this Community login path is free with any Docker account. If Verclaim later needs SLA-backed CVE remediation timelines or FIPS/STIG variants, that moves to a DHI Select or Enterprise subscription, which mirrors images into your own org namespace on Docker Hub instead of pulling from `dhi.io` directly.

**Step 2: Pick the right base and dev tags.** Verclaim is already on Debian's glibc for compatibility with `psycopg2`, so the equivalent hardened tags are `dhi.io/python:3.11-debian12-dev` for the build stage and `dhi.io/python:3.11-debian12` for runtime.

**Step 3: Split into a multi-stage build.** Compile in the `dev` image, copy only the result into the runtime image:

```dockerfile
#syntax=docker/dockerfile:1

# === Build stage: apt and a shell are available here ===
FROM dhi.io/python:3.11-debian12-dev AS builder

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PATH="/app/venv/bin:$PATH"

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

RUN python -m venv /app/venv
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# === Runtime stage: minimal, nonroot, no shell, no package manager ===
FROM dhi.io/python:3.11-debian12

WORKDIR /app

ENV PYTHONUNBUFFERED=1
ENV PATH="/app/venv/bin:$PATH"

COPY --from=builder /app/venv /app/venv
COPY --from=builder /app/claims_api ./claims_api

EXPOSE 8443
ENTRYPOINT ["gunicorn", "--bind", "0.0.0.0:8443", "claims_api.wsgi:application"]
```

Notice what's gone: the `mkdir /var/log/claims-api` line, and port 80. Both needed fixing for reasons in the next section.

**Step 4: Validate the result.** Compare the hardened image against the original to confirm the reduction is real:

```console
$ docker scout compare dhi.io/python:3.11-debian12 \
    --to python:3.11-slim \
    --platform linux/amd64 \
    --ignore-unchanged
```

For Verclaim's image, this dropped the package count from the high 400s to under 100 and zeroed out every medium-and-above CVE that the slim base had been carrying. Your own numbers will move depending on what's in your `requirements.txt`, but `docker scout compare` is how you prove the migration actually did something instead of just trusting the marketing.

## What breaks during migration, and how do you fix it?

| Checklist item | What broke for Verclaim | The fix |
|---|---|---|
| Package management | `apt-get install gcc` failed in runtime stage | Moved to the `dev`-tagged build stage only |
| Nonroot user (UID 65532) | `mkdir /var/log/claims-api` hit permission denied | Logged to stdout instead, let the container platform collect it — also just better practice |
| Privileged ports | Couldn't bind to port 80 as nonroot | Switched to port 8443, TLS terminated upstream at the ingress |
| TLS certificates | Had a leftover `apt-get install ca-certificates` step | Removed it — DHI ships standard certs by default |
| No shell | Couldn't `docker exec -it sh` during an incident | Used `docker debug` to attach a debug sidecar without modifying the running container |
| Entry point | Assumed the same `CMD` semantics as `python:slim` | Ran `docker inspect` on the DHI tag first to confirm the baked-in entry point before overriding it |

**Bottom line:** none of these are DHI being awkward for its own sake — they're consequences of removing root access and shell tooling from a production container. The fixes are mostly things you should be doing anyway (stdout logging, no compilers in prod images, TLS termination at the edge).

## DHI migration cheat sheet

| Old pattern (DOI/Ubuntu/Wolfi) | DHI replacement |
|---|---|
| `FROM python:3.11-slim` | `FROM dhi.io/python:3.11-debian12` (runtime) |
| `apt-get install` at any stage | Only inside a `-dev`/`-sdk` tagged build stage |
| Single-stage Dockerfile | Multi-stage: `dev` tag to build, runtime tag to ship |
| Runs as root by default | Runs as nonroot (UID 65532) — check file/dir permissions |
| `EXPOSE 80` | `EXPOSE 1025` or higher |
| `apt-get install ca-certificates` | Remove it — already included |
| `docker exec -it sh` for debugging | `docker debug` against the running container |
| `docker pull image:latest` | Pick an explicit tag with the distro suffix, e.g. `-debian12` |

For Go, Node.js, .NET, and Java equivalents of this same before/after pattern, Docker maintains [language-specific migration examples](https://docs.docker.com/dhi/migration/examples/) — the shape of the fix is identical, only the toolchain in the `dev` stage changes. If you'd rather not hand-edit Dockerfiles at all, [Gordon can do the first pass](https://docs.docker.com/dhi/migration/migrate-with-ai/) and you review the diff.