---
layout: post
title: "Docker Scout Security Policy: A Technical  Deep Dive"
date: 2026-05-08 19:13:52 UTC
category: docker
tags:
  - docker
  - container-security
  - policy-as-code
subtitle: "Protecting Your Container Supply Chain"
description: "A technical guide to Docker Scout's Policy Evaluation — covering all nine policy types, real Dockerfile and CI/CD code snippets, and how to enforce supply chain security automatically in GitHub Actions and GitLab pipelines."
image: 
optimized_image: 
author: Shubhendu Shubham
---

Most teams treat container security as a one-time scan — push the image, check the CVE report, feel good, move on. That worked when you had a handful of services. It doesn't scale when you're running 40 microservices across three environments and someone quietly bumped a base image from `node:18-alpine` to `node:18` last Tuesday.

Docker Scout's Policy Evaluation is the answer to that problem. It takes the raw image analysis that Scout already does and puts a governance layer on top — letting you define what "good" looks like for your organization, track how far your images are from that standard, and actually course-correct without drowning in CVE noise.

This post goes deep on every policy type, how the evaluation engine works under the hood, and how you wire all of this into a CI pipeline so security is automatic rather than a post-deployment fire drill.


## How Policy Evaluation Actually Works

When you activate Docker Scout for a repository, every image you push gets analyzed automatically. Scout builds a package inventory — every OS package, every language dependency, the base image lineage, SBOM and provenance attestations. That's the raw analysis layer.

Policy Evaluation sits on top of that. A policy takes the analysis output and interprets it against a set of rules you define. The result isn't a binary pass/fail; it's a compliance gap visualization. Scout shows you not just whether an image is non-compliant, but *by how much*, so you can track whether your artifact is improving or deteriorating over time.

This distinction matters in practice. If your `Critical` CVE count went from 12 to 8 this sprint, that's meaningful progress even if the image isn't fully compliant yet. Traditional scanners don't show you that — they just show red. Scout shows you the trend.

Policies in Scout are derived from **policy types**. Think of policy types as classes and policies as instances. Each policy type defines the core evaluation logic; you configure the thresholds and parameters to match your org's requirements. One team might tolerate High CVEs in dev but block on any Critical in production — both configurations derive from the same `Severity-Based Vulnerability` policy type.


## The Nine Policy Types, Explained with Real Context

### 1. Severity-Based Vulnerability

This is the bread-and-butter policy. It checks images against Scout's vulnerability database and flags images containing CVEs that exceed your defined thresholds.

By default it flags Critical and High severity CVEs **where a fix version exists**. That second part is intentional — Scout shouldn't fail your build on a CVE you can't remediate yet. Only flag what you can actually fix.

The configurable parameters:

- **Severities**: `Critical`, `High`, `Medium`, `Low`
- **Fixable only**: Whether to restrict to CVEs with available fixes (default: on)
- **Age threshold**: Minimum days since publication before a CVE counts. This prevents a fresh zero-day from immediately breaking your pipeline before you've had time to react.
- **Package types**: Filter by PURL package type — `pkg:npm`, `pkg:pypi`, `pkg:deb`, etc. Useful if you only want to enforce policy on direct app dependencies, not system packages.

**Real-world use case:** A fintech team running PCI-DSS workloads might configure two policies from this type — one for dev (High+Critical, fixable, age > 30 days) and one for prod (Critical only, fixable, age > 7 days). The same base policy type, different risk tolerance by environment.

Here's what a non-compliant image looks like from the CLI:

```bash
$ docker scout policy myorg/payment-api:latest

  POLICY                     STATUS       RESULTS
  ─────────────────────────────────────────────────────────────
  No Critical Vulnerabilities  ✗ Failed   3 critical CVEs found
  Supply Chain Attestations    ✓ Passed
  Default Non-Root User        ✗ Failed   Running as root
  Up-to-Date Base Images       ✓ Passed
```

And to dig into what those critical CVEs actually are:

```bash
$ docker scout cves myorg/payment-api:latest --only-severity critical

    ✗ CRITICAL CVE-2023-44487
      Package: golang.org/x/net@0.7.0
      Fixed in: 0.17.0
      Description: HTTP/2 Rapid Reset Attack
```

Once you upgrade the package in your `go.mod` and rebuild, the policy clears automatically on next push.


### 2. Compliant Licenses

This one doesn't get enough attention. You can accidentally pull in a dependency with an AGPL v3 or GPL license, and depending on your product's distribution model, that's a legal liability — not a security one, but still a real business risk.

The **Compliant Licenses** policy checks every package in your image's SBOM against a configurable blocklist of licenses. Default configuration flags AGPL v3. You can extend it to flag GPL, LGPL, EUPL, or any license type you want to avoid.

You can also add PURL-based exceptions. If you've vetted a specific package and cleared it with legal, you can allowlist it:

```
# Allowed exceptions (PURL format)
pkg:npm/%40mapbox/node-pre-gyp@1.0.11
```

**Real-world use case:** An ISV shipping on-premises software discovered mid-audit that a transitive Python dependency pulled in code under AGPL v3. Without policy enforcement, this would have shipped. With Scout's license policy active, the build failed in CI and triggered a conversation with legal before the release was cut.

### 3. Up-to-Date Base Images

This policy answers a question that's easy to overlook: even if your app code is fine, is the base image it sits on still current?

When `ubuntu:22.04` releases a patch and your Dockerfile is pinned to a digest that predates that patch, you're running a stale base. The **Up-to-Date Base Images** policy checks whether the tag you used at build time still points to the same digest as what's currently in the registry. If there's a mismatch, your image is non-compliant.

This policy requires provenance attestations to work. Scout needs to know what base image tag you used, which it reads from SLSA provenance. Without it, Scout can't make the comparison and the policy shows a "No data" state.

To generate provenance at build time:

```bash
$ docker buildx build \
  --provenance=true \
  --sbom=true \
  -t myorg/api-service:1.4.2 \
  --push \
  .
```

Or in GitHub Actions:

```yaml
- name: Build and push
  uses: docker/build-push-action@v6
  with:
    push: true
    tags: myorg/api-service:1.4.2
    provenance: true
    sbom: true
```

Once provenance is attached, Scout can trace the base image used in the build and compare it against the current state of that tag. If `python:3.11-slim` was updated two weeks ago and your image is older than that update, the policy flags it.


### 4. High-Profile Vulnerabilities

Some CVEs are so critical they warrant their own dedicated policy track, regardless of your general severity thresholds. Scout maintains a curated list of vulnerabilities that are widely recognized as dangerous:

- **CVE-2014-0160** — OpenSSL Heartbleed
- **CVE-2021-44228** — Log4Shell
- **CVE-2023-38545** — cURL SOCKS5 heap buffer overflow
- **CVE-2023-44487** — HTTP/2 Rapid Reset
- **CVE-2024-3094** — XZ backdoor

The XZ backdoor entry is worth calling out. This was a supply chain attack embedded in `xz-utils` versions 5.6.0 and 5.6.1, which shipped in some Linux distro preview builds in early 2024. Teams running Fedora 40 beta or certain Debian sid builds were potentially exposed. The fact that this list is kept current and automatically scanned across your entire image portfolio is genuinely useful.

The policy also supports **CISA KEV integration** — the CISA Known Exploited Vulnerabilities catalog. When enabled, any CVE that CISA has marked as actively exploited in the wild will trigger this policy, even if it doesn't make Scout's curated list. This is the closest thing to real-time threat intelligence in container security.

Configuration options:

```json
{
  "excluded_cves": [],
  "cisa_kev": true
}
```

### 5. Supply Chain Attestations

Running containers without knowing what's in them is flying blind. Attestations — specifically SBOM and SLSA provenance — are what let Scout (and your organization) answer the fundamental questions: what packages does this image contain, and where did it come from?

The **Supply Chain Attestations** policy is binary: does your image have both an SBOM attestation and a provenance attestation with **max mode** provenance? If not, it fails.

Max mode provenance means the provenance record includes the full build context — the Git commit SHA, inputs, environment variables, the works. Min mode provenance exists but contains less detail and is insufficient for this policy.

Build command for full attestations:

```bash
$ docker buildx build \
  --provenance=mode=max \
  --sbom=true \
  -t registry.example.com/myapp:v2.1.0 \
  --push \
  .
```

The provenance attestation that gets generated looks roughly like this in the OCI manifest:

```json
{
  "buildType": "https://mobyproject.org/buildkit@v1",
  "materials": [
    {
      "uri": "pkg:docker/python@3.11-slim?platform=linux%2Famd64",
      "digest": {
        "sha256": "abc123..."
      }
    }
  ],
  "invocation": {
    "configSource": {
      "uri": "https://github.com/myorg/myapp",
      "digest": {
        "sha1": "commit-sha-here"
      },
      "entryPoint": "Dockerfile"
    }
  }
}
```

The SBOM attestation is generated in CycloneDX or SPDX format and catalogues every package in the final image — the kind of thing you'd need to produce for a software supplier at a government customer's request, or to respond quickly to a new CVE disclosure.

### 6. Default Non-Root User

This is a container hardening fundamental that gets violated surprisingly often. By default, processes in a container run as `root` unless the Dockerfile explicitly specifies otherwise. Root inside a container isn't the same as root on the host in modern Docker, but if an attacker manages a container escape, the blast radius is much larger if the process was running as root.

The policy checks the image configuration blob for a non-root `USER` directive. There's a subtle point here: it distinguishes between implicit root (no `USER` set) and explicit root (`USER root` declared intentionally). Both fail, but the differentiation helps you triage whether it was an oversight or a deliberate decision.

Non-compliant Dockerfile examples:

```dockerfile
# Implicit root — no USER set
FROM python:3.11-slim
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

```dockerfile
# Explicit root — even worse
FROM python:3.11-slim
USER root
COPY requirements.txt .
RUN pip install -r requirements.txt
CMD ["python", "app.py"]
```

Compliant version:

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .

# Create a non-root user and switch to it before the final runtime stage
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
USER appuser

CMD ["python", "app.py"]
```

For multi-stage builds, the `USER` directive only needs to be set in the final runtime stage. The builder stage can run as root to install dependencies without affecting policy evaluation:

```dockerfile
# Builder — root is fine here
FROM node:20 AS builder
WORKDIR /build
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

# Runtime — must not be root
FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/node_modules ./node_modules

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### 7. Approved Base Images

This policy is how you enforce a golden image strategy at the organizational level. Instead of trusting that developers will pick appropriate base images, you configure a list of approved sources and let Scout enforce it automatically.

Pattern matching uses a glob-like syntax. Some examples:

| Intent | Pattern |
|--------|---------|
| Allow all Docker Hub images | `docker.io/*/*` |
| Allow only Docker Official Images | `docker.io/library/*` |
| Restrict to your internal registry | `registry.internal.company.com/*` |
| Allow only slim Node tags | `docker.io/library/node:*-slim` |
| Specific org on Docker Hub | `docker.io/myorg/*` |

A real enterprise configuration might look like this:

```json
{
  "approved_base_image_sources": [
    "registry.internal.company.com/*",
    "docker.io/library/python:*-slim",
    "docker.io/library/node:*-alpine",
    "docker.io/library/golang:*-alpine"
  ],
  "only_supported_tags": true,
  "only_supported_os_distributions": true
}
```

The `only_supported_tags` flag is worth enabling. Official images mark certain tags as supported (e.g., `node:20-alpine` is supported, while `node:12-alpine` is EOL). This flag causes a policy violation if a developer reaches for an EOL tag — which happens more often than you'd think when someone copies a Dockerfile from a three-year-old tutorial.

Like `Up-to-Date Base Images`, this policy requires provenance attestations to function. Scout needs to trace what base image was used at build time, and that comes from the SLSA provenance record.


### 8. SonarQube Quality Gates

This is the policy that bridges container security with code quality. It ingests SonarQube's quality gate results and surfaces them as a Docker Scout policy — meaning your Scout dashboard becomes a single pane of glass that shows both what's wrong with the runtime artifact and what's wrong with the source code it was built from.

The integration works through a shared Git commit SHA. Scout looks at the image's provenance attestation (or the `org.opencontainers.image.revision` OCI annotation) to find the commit that produced the image, then looks up the SonarQube analysis for that same commit. If the quality gate was red, the policy fails.

Dockerfile label approach if you're not using provenance:

```dockerfile
ARG GIT_COMMIT
LABEL org.opencontainers.image.revision=$GIT_COMMIT
```

Build command:

```bash
$ docker buildx build \
  --build-arg GIT_COMMIT=$(git rev-parse HEAD) \
  --label "org.opencontainers.image.revision=$(git rev-parse HEAD)" \
  -t myorg/api:latest \
  --push \
  .
```

GitHub Actions workflow that wires SonarQube + Scout together:

```yaml
name: Build and Security Check

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Required for SonarQube

      - name: SonarQube Analysis
        uses: SonarSource/sonarqube-scan-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and push with attestations
        uses: docker/build-push-action@v6
        with:
          push: true
          tags: myorg/api:${{ github.sha }}
          provenance: true
          sbom: true

      - name: Docker Scout Policy Check
        uses: docker/scout-action@v1
        with:
          command: policy
          image: myorg/api:${{ github.sha }}
          organization: myorg
```

Once the Scout integration is configured in Docker Hub, the SonarQube quality gate result will automatically appear in the policy panel.


### 9. Valid Docker Hardened Image (DHI) or DHI Base Image

This is the newest addition to Scout's policy suite. It validates whether an image is either a Docker Hardened Image itself, or was built from a DHI as its base.

Docker Hardened Images are minimal, security-hardened images that ship with near-zero CVEs, strong SBOM attestations, Sigstore signatures, and in some configurations, FIPS-validated cryptography. This policy validates the chain of trust — it checks for a Docker-signed verification summary attestation in the image manifest.

An image passes if:

- It carries a valid Docker-signed verification summary attestation (it's a DHI), or
- Its SLSA provenance record shows its base image carries such an attestation (it was built on a DHI)

This policy has no configurable parameters — it's binary. Either the attestation chain is valid or it isn't.

This is most relevant for teams in regulated industries (healthcare, finance, government) that need to demonstrate their container supply chain meets specific security standards.

## Wiring Policy Evaluation into CI

This is where it stops being theoretical. You need policy failures to actually block bad builds from reaching production. Docker Scout has a dedicated CI integration that does exactly this.

### GitHub Actions — Full Policy Gate

```yaml
name: Container Security Gate

on:
  push:
    branches: [main, release/*]
  pull_request:

jobs:
  security-policy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v6
        id: build
        with:
          push: true
          tags: |
            myorg/myapp:${{ github.sha }}
            myorg/myapp:latest
          provenance: mode=max
          sbom: true

      - name: Evaluate Scout policies
        uses: docker/scout-action@v1
        with:
          command: policy
          image: myorg/myapp:${{ github.sha }}
          organization: myorg
          # Exit with non-zero code if any policy fails
          exit-code: true
          # Only fail on these specific policies
          only-policies: |
            No Critical Vulnerabilities
            Supply Chain Attestations
            Default Non-Root User
```

The `exit-code: true` option is what gives this teeth — if a policy fails, the step exits with a non-zero code and the workflow fails.

### GitLab CI/CD

```yaml
stages:
  - build
  - security

build:
  stage: build
  script:
    - docker buildx build
        --provenance=mode=max
        --sbom=true
        --push
        -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .

scout-policy:
  stage: security
  image: docker:latest
  services:
    - docker:dind
  variables:
    DOCKER_TLS_CERTDIR: "/certs"
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - curl -fsSL https://raw.githubusercontent.com/docker/scout-cli/main/install.sh | sh
  script:
    - docker scout policy $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
        --org $DOCKER_SCOUT_ORG
        --exit-code
  needs: [build]
```

### Making Policy Failures Visible in PRs

A pattern that teams find particularly useful is running Scout policy evaluation on the feature branch image and comparing it against the main branch baseline. This lets you catch regressions before they merge:

```yaml
- name: Scout policy comparison
  uses: docker/scout-action@v1
  with:
    command: compare
    image: myorg/myapp:${{ github.sha }}
    to: myorg/myapp:main
    organization: myorg
    # Post results as PR comment
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

This surfaces a comment on the PR showing exactly which policies changed — green to red is a regression, red to green is a fix.


## Handling the "No Base Image Data" State

You'll eventually run into a policy showing "No data" rather than pass/fail. This happens for `Up-to-Date Base Images` and `Approved Base Images` when Scout can't determine what base image was used.

The root cause is almost always missing provenance. When you build with plain `docker build` (not `docker buildx build`), no provenance attestation is generated, so Scout has nothing to trace base image lineage from.

Fix: always use BuildKit with provenance and SBOM flags. If you need to migrate existing pipelines, a pragmatic intermediate step is at minimum using the OCI annotation:

```dockerfile
ARG BASE_IMAGE=python:3.11-slim
FROM $BASE_IMAGE
LABEL org.opencontainers.image.base.name="docker.io/library/python:3.11-slim"
```

```bash
$ docker buildx build \
  --label "org.opencontainers.image.base.name=docker.io/library/python:3.11-slim" \
  --push \
  -t myorg/myapp:latest .
```

This is less complete than full provenance but better than nothing — Scout will use the label to identify the base image.


## Managing Policies at Scale

For organizations with many teams and repositories, the Docker Scout Dashboard at `scout.docker.com/reports/policy` gives you an org-level view of policy compliance across all repositories. But a few operational patterns are worth establishing:

**Use policy "disable" sparingly.** The disable feature exists for situations where a policy genuinely doesn't apply to a specific context (e.g., an internal tooling image that will never have provenance attestations). If you find yourself disabling policies to make dashboards green, that's a signal the policy thresholds need reconfiguring, not disabling.

**Age thresholds in vulnerability policies are your friend.** Setting a minimum CVE age of 7-14 days prevents the jarring situation where a zero-day published on Monday breaks every build on Tuesday before anyone has had time to assess the impact or wait for a patched dependency version.

**Keep historic results in mind.** When you delete a policy (rather than disable it), Scout also deletes the historic evaluation data for that policy. If you're thinking about compliance reporting over time, reconfigure rather than delete.

**One policy type, multiple policies.** You can create multiple policies from the same policy type with different configurations — for example, a lenient `Dev Vulnerability Policy` and a strict `Prod Vulnerability Policy` derived from `Severity-Based Vulnerability`. Apply them to different environments by tagging images with environment labels and using Scout's environment integration.


## The Bigger Picture

Security scanning without policy enforcement is just producing reports that eventually get ignored. The teams that actually improve their security posture over time are the ones who've made compliance failures visible, automatic, and actionable — in the same pipeline where code ships.

Docker Scout's Policy Evaluation gives you the mechanism to do that across every layer that matters: CVEs, license compliance, base image freshness, supply chain attestations, and runtime configuration. The incremental tracking (rather than binary pass/fail) is what makes it sustainable — you can ratchet your way toward compliance rather than trying to boil the ocean in a single sprint.

The attestation requirements — provenance and SBOM — are the biggest operational change for most teams adopting this. Once those are baked into the build pipeline, everything else builds naturally on top.


*All information in this post is sourced from the official Docker Scout documentation at [docs.docker.com/scout/policy](https://docs.docker.com/scout/policy/).*