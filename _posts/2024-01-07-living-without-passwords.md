---
layout: post
title: Live without passwords 
subtitle: FIDO 2.0
description: This is curated list of awesome Security Analyst tool used by SOC/Security Analyst.
image: https://cdn.pixabay.com/photo/2019/04/29/09/33/anonymous-4165613_1280.jpg
optimized_image: https://cdn.pixabay.com/photo/2019/04/29/09/33/anonymous-4165613_1280.jpg
author: Shubhendu Shubham
date: 2024-01-07 00:00:00 Z
category: security
tags:
- Cyber Security
- Tools
---
Before starting, let's quickly recall what's **Password**? Can we consider any sets of characters as password?

Well in the layman word answer is "YES", untill those are secret to you.Again the matter of choice is completely on enduser, how strong  one sets the password.That's why instead of simple dictionary words, it's advisable to use Passpharse like Y0urP@sswrd@7856.But we often forget these complex alpha-numeric passwords easily. Sometimes we do use secrets Manager tools like PassKey to store our credentials.

But the challenges aries, when our system get compromised or we lost passwords for secret managers.

Now here comes the solution as **"FIDO" aka Fast Identity Online**. 

## What is FIDO?
FIDO aka Fast Identity Online is a global authentication standard based on public key cryptography.FIDO authentication is developed by FIDO Alliance.It has been since 2013,but not much popular.Off-late 200 + companies like APPLE & Google are adopting it.

## How FIDO replaces Passwords?
Since FIDO is based on public key cryptography protocol, so it uses PASSKEYS having asymmetric value in the form of Public and Private keys.

**Why do we need it? OTP is already there for MFA?**

Passwords, and other forms of legacy authentication like OTP are knowledged based and easy to get phising,harvested and replay.According to the offical documentation of FIDO ALLIANCE 80% passwords are the root cause of over 80% of data breaches.

**Working Principle**

1. During registration with an online service, user's client device creates a new cryptographic key pair aka *Passkeys* that is bound to the web services domain.
2. The device retains the private key and registers the public key with the online service and these passkeys are unique to every online services.
3. For authenticaion FIDO sends a challenge from online services and user have to prove possession of the private key by sign-in challange either via biometric,pin or Touch. 
4. Sign-in works on challenge-response method from the user's device and the online service.
5. Device uses the user's account identifier provided by the service to select the correct key and sign the service's challenge.
6. Client device sends the signed challenge back to the service,which verifies it with the stored public key and signs-in the user.

Eg: of PASSKEY is your Digital-SIGNATURE (DSC)used by CA(charted Accountant) for signature verification 

**What is FIDO2?**

It's combination of W3C Web authentication and CTAP from FIDO Alliance.

- FIDO Universal Second Factor(FIDO U2F)
- FIDO Universal Authentication Framework (FIDO UAF)
- Client to Authenticator Protocols (CTAP), which is complementary to the W3C's.

Refer:-
[Official Link](https://fidoalliance.org)