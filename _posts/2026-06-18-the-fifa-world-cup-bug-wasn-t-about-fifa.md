---
layout: post
title: "The FIFA World Cup Bug Wasn't About FIFA "
date: 2026-06-18 11:56:18 UTC
category: security
tags:
  - client-side authorization
  - broken access control
  - microsoft entra
  - api security
  - owasp
subtitle: "It Was About Every App With a Pretty Frontend and No Backend Checks"
description: "How a public FIFA registration form exposed World Cup broadcast controls, and how to test your own APIs for the same client-side authorization flaw."
image: https://images.pexels.com/photos/38164422/pexels-photo-38164422.jpeg
optimized_image: https://images.pexels.com/photos/38164422/pexels-photo-38164422.jpeg
image_position: "43% 82%"
author: Shubhendu Shubham
---

On June 14, a researcher going by BobDaHacker registered as a football agent on FIFA's public site. Within a few hours they had standing access to FIFA's live World Cup streaming controls, match management system, and commentator dashboard. Not read access to a leaked file — live, write-capable access to the production systems running the tournament.

No exploit chain, no zero-day, no clever bypass. They filled out a form.

The root cause is one sentence, and it's the kind of thing that should make every architect uncomfortable: **the frontend checked permissions, the backend didn't.**

## What actually happened

FIFA runs a public portal at `agents.fifa.org` where anyone can apply to become a licensed football agent. Submit an ID, verify your email, you're in. That account gets created inside FIFA's Microsoft Entra tenant — the same tenant that authenticates FIFA's internal platforms.

BobDaHacker registered, then pointed their new account at `fdp.fifa.org`, FIFA's Football Data Platform. The app authenticated them, checked their role, found none, and showed a clean "you do not have any FDP role assigned" message. Normal, expected, looks correct.

Except the denial was theater. The Angular frontend was checking the JWT for a `NO_ROLES` claim and rendering a polite no-access screen. The backend APIs behind that screen weren't checking anything — they served data and accepted writes to anyone holding a valid token from the tenant, role or no role.

Walking straight past that denial screen and hitting the APIs directly got them into:

| System | What it controls | Access obtained |
|---|---|---|
| Streaming Management panel (MediaKind) | RTMP ingest URLs + stream keys for every camera, every match | Full read + start/stop/schedule control |
| FDP match management | Live scores, kickoff time, editorial commentary | Write access |
| Commentator Information System (`cis.fifa.org`) | Live talking points fed to broadcast commentators | Full read |
| Internal dev Function App | Blob storage URLs for 23 internal files — transfer data, revenue reports | Full read |

**Bottom line**: a zero-privilege, self-registered account had operational control over a global broadcast feed watched by billions.

## The part that should worry an architect more than the headline

Each match had five camera angles — PGM (program/main), Tactical, Camera1, and two "high behind" angles. Each had its own RTMP ingest URL, but here's the detail that turns "exposed" into "catastrophic": the stream key was shared across all five angles for a match. One key, five live broadcast inputs.

RTMP ingest is the literal pipe between a stadium camera and FIFA's broadcast distribution chain — camera → ingest → MediaKind → broadcast partners → your TV. Anyone holding that key could push their own video into the PGM feed and it goes out live, worldwide, to every network carrying the match. BobDaHacker's own framing of the worst case stuck for a reason: an attacker could have replaced a live match feed with a Rickroll, or worse, on every TV carrying the World Cup. They confirmed the feeds were live by opening a preview manifest in VLC, then closed it immediately and never touched a control.

## Why this happened: the policy decision point and the enforcement point lived in different places

Strip away the FIFA specifics and you're left with a textbook access control failure. In any proper authz design you have two things that have to agree:

- **The decision** — does this identity have the role/claim needed for this action?
- **The enforcement** — does the system that actually executes the action check that decision before doing it?

FIFA's Angular app was making the decision correctly. It just never enforced anything — that job was assumed to belong to someone else, and the backend assumed the frontend had already handled it. Classic responsibility gap: everyone assumed authorization was someone else's job, so nobody's code actually did it.

Think of it like a nightclub where the door staff politely tell you you're not on the list — and then the bar inside serves anyone who walks up to it, wristband or not. The rope at the door isn't security. It's a UI suggestion.

A minimal version of the bug looks like this:

```typescript
// Angular route guard — this is the ONLY check that existed
canActivate(): boolean {
  const claims = decodeJwt(this.auth.token);
  if (claims.role === 'NO_ROLES') {
    this.router.navigate(['/access-denied']);
    return false; // stops navigation in the SPA
  }
  return true;
}
```

```javascript
// Express backend — what was actually missing
app.get('/api/streaming/matches/:id', async (req, res) => {
  // No role check here. Any valid tenant token reaches this line.
  const data = await streamingService.getMatchStreams(req.params.id);
  res.json(data); // RTMP URLs and stream keys, served to anyone
});
```

The fix isn't complicated — it's middleware that never got written:

```javascript
app.get(
  '/api/streaming/matches/:id',
  requireRole(['STREAMING_ADMIN', 'BROADCAST_OPS']), // server-side enforcement
  async (req, res) => {
    const data = await streamingService.getMatchStreams(req.params.id);
    res.json(data);
  }
);
```

## A second mistake hiding under the first

Even with that middleware in place, there's a design decision upstream that deserves its own line item in a threat model: a public self-registration portal and FIFA's production broadcast systems sit in the **same Entra tenant**. That means anonymous-ish internet users — anyone who can photograph an ID — are one role-check bug away from touching crown-jewel systems.

Proper authz enforcement should have stopped this attack on its own. But tenant boundaries are a second, independent control. Public-facing self-service identities (agents, fan accounts, vendor registrations) belong in a separate tenant or at minimum a separate app registration with conditional access policies that require explicit group membership — not just "authenticated in our directory" — before anything internal will talk to them. Defense in depth means the attacker has to beat two unrelated failures, not one.

## How to check your own stack for this exact pattern

This is the part worth doing this week, not after your next pentest finds it.

```bash
# 1. Get a low-privilege/no-role token the normal way (register, sign up, whatever)
# 2. Decode it — don't trust the app, read the claims yourself
echo $TOKEN | cut -d '.' -f2 | base64 -d | jq

# 3. Skip the SPA entirely. Hit the API directly with that token.
curl -s -H "Authorization: Bearer $TOKEN" \
  https://api.yourapp.com/v1/admin/export | jq

# If you get a 200 and a payload instead of a 401/403, the backend
# isn't enforcing anything — it's trusting the frontend to behave.
```

Test every sensitive route this way, not just the obvious admin ones. The FIFA breach wasn't one bad endpoint — it was an entire backend built on the assumption that the frontend's "access denied" page was the access control.

## Where this lands in OWASP, for your writeup

| Pattern | OWASP API Security Top 10 | OWASP Top 10 (Web) |
|---|---|---|
| Backend trusts any authenticated tenant member | API5:2023 Broken Function Level Authorization | A01:2021 Broken Access Control |
| Frontend-only role gating | API1:2023 Broken Object Level Authorization (where object = match/stream) | A01:2021 Broken Access Control |
| No rate limiting or anomaly detection on a public registration flow feeding a privileged tenant | API4:2023 Unrestricted Resource Consumption | — |

## The disclosure failure stacked on top of the technical one

FIFA has no `security.txt`, no published vulnerability disclosure policy, and no bug bounty program. BobDaHacker's emails to FIFA addresses bounced or went unanswered, calls to FIFA Zurich and the media line hit closed lines, and the report only moved once they reached CISA's 24/7 line and FBI contacts directly — CISA being the named federal cybersecurity lead for the 2026 World Cup. The bug got fixed by the next day, but FIFA never acknowledged the report. As the researcher put it, client-side authorization is not authorization.

A `security.txt` file and a VDP cost an afternoon to stand up. Not having one means your fastest path to fixing a live, billion-viewer-facing bug is a researcher cold-calling a federal hotline at 3am. That's not a researcher problem — that's a missing control in your incident response design, same as the missing middleware.

## Cheat sheet

| Question | If yes, you have this bug |
|---|---|
| Does your SPA decide what to render based on a JWT claim, with no matching check server-side? | Yes |
| Can you `curl` a "protected" endpoint directly with a low-priv token and get a 200? | Yes |
| Do public self-registration users land in the same identity tenant as internal/production apps? | Partial — separate concern, same blast radius |
| Do you have a `security.txt` and a VDP a researcher can find in under five minutes? | If no, your MTTR for the next one is "however long it takes to find someone's WhatsApp" |

Enforce authorization at every API route, server-side, with no exceptions for "the frontend already checked." If that sentence describes your backend right now, you don't have access control. You have a UI suggestion.