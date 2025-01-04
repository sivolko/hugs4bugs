---
layout: post
title: The Best Way to Fool Yourself:Use SMS 2FA
subtitle:  Is your 2FA reliable?
description: Let's get concept clear what's Log analytics and log analytics workspace  
image: https://res.cloudinary.com/hugs4bugs/image/upload/v1735990558/hugs4bugs/MFA/profile_u7ic2x.jpg
optimized_image: https://res.cloudinary.com/hugs4bugs/image/upload/v1735990558/hugs4bugs/MFA/profile_u7ic2x.jpg
author: Shubhendu Shubham
date: 2025-01-04 00:00:00 Z
category: Identity & Access
tags:
- Cyber Security
---

Okay in this blog I'm not gonna tell you about sim swapping or OTP bypassing or hijacking, I'll try to keep as realistic I can for all layman people. Before we jump into our main topic let's clear a few terms like MFA == Multifactor Authenticator , 2FA == Two Factor Authenticator. 

Now let's understand the problem statement with example of a person name called "Sivolko". Meet sivolko, a  software developer who relies heavily on various online accounts for both work and personal use. Sivolko is well aware of securing these accounts and has enabled Multifactor Authenticator (MFA) on all of them.Unlikely many common people, sivolko uses SMS-based MFA especially for Email and he often uses Gmail as primary email and another gmail as backup but he haven't logged in to his backup gmail account since couple of months. 

However Sivolko is about to discover that this method,while seemingly secure can lead to some significant complications. Let's breakdown complications :- 

**The Problem with SMS-Based MFA**

One day sivolko  loses his smartphone while communiting to work.Panic sets in as sivolko realises that without the smartphone, he can't receive OTPs needed to access their accounts. so what could be common issues for him ? Let's break down them as well 

1. **Lost Phone or SIM Card** : Without smartphone sivolko can't receive the OTP via SMS. Usually gmail sends 6 or 7 numeric OTP which starts with "G". So what he'll try , use another method to authenticate option given by Gmail. Now he is supposed to enter his backup email address, which he remembers now it asks to enter password for the back email address as well, Here comes the twist since it was his backup email address he was not using it frequently so obvious reason he don't remember . Now when he tries to reset password for his backup email it sends OTP to his phone which is already lost ?

2. **Forgotten Backup Email Password**: Sivolko tries to use the backup email for account recovery but realizes they haven't accessed it in months and have forgotten the password. This creates a frustrating loop where Sivolko can't access the OTP sent to the backup email.

3. **Circular Problem**: With both the primary and backup methods failing, Sivolko is stuck in a loop where they can't access their accounts. This defeats the purpose of MFA, which is supposed to make accounts more secure, not more complicated.


*Before jumping to advance solution for this situation let's understand what could be better here, Sivolko might have used different SIM or phone numbers for both primary and backup emails. Another both numbers should not be in same phone or device, incase of lost still another phone or SIM could be easily accessible. Another point is he could have allowed sync in option in all devices where he still get option to "tap to verify" on another logged in devices with same primary or secondary email.* 

So let's see the standard Industrial grade solutions.

**Use FIDO Keys or Authenticator Apps?**

Sivolko starts researching alternative MFA methods and discovers FIDO (Fast Identity Online) keys and authenticator apps. Here's why these might be better options:

1. **FIDO Keys**: These are physical devices that Shubham can plug into their computer or connect via Bluetooth. They provide a secure way to authenticate without relying on SMS or email. FIDO keys use public key cryptography to verify identity, meaning that even if someone steals Sivolko's password, they won't be able to access the account without the physical key.

2. **Authenticator Apps**: Apps like Google Authenticator or Microsoft Authenticator app which  generate OTPs on Sivolo's phone without needing a cellular connection. Even if Sivolko loses their phone, they can often restore accounts on a new device using backup codes. Authenticator apps are more secure than SMS-based MFA because they don't rely on a phone number, which can be easily spoofed or intercepted.

**Final Verdict**
Sivolko decides to implement some practical solutions to avoid future complications:

1. **Use Authenticator Apps**: Sivolko sets up an authenticator app on their phone and saves the backup codes provided during setup. These codes can be used to restore access if the phone is lost. Authenticator apps are easy to use and provide a higher level of security than SMS-based MFA.

2. **Backup Email**: Sivolko regularly checks and updates their backup email, ensuring they remember the password or have a secure way to recover it. Sivolko also uses a different email provider for the backup email to reduce the risk of both accounts being compromised at the same time.

3. **FIDO Keys**: Sivolko invests in a FIDO key for an extra layer of security. These keys are highly secure and can be used across multiple devices. FIDO keys are especially useful for securing high-value accounts, such as email or bank accounts.

4. **Multiple Recovery Options**: Sivolko uses a combination of recovery options. For example, they set up both an authenticator app and a FIDO key. This way, if one method fails, there's a backup. Sivolko also sets up recovery options for the recovery options, such as a backup phone number or email address.

Lemme know if you have been in situtation like sivolko or do you have other solutions to deal with it. 