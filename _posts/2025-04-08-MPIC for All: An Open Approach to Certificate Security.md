---
layout: post
title: MPIC for All:An Open Approach to Certificate Security
subtitle:  "Is your HTTPS safe?"
description: Let's learn what's beyond the HTTPs
image: https://cdn.pixabay.com/photo/2016/11/29/02/14/man-1866784_1280.jpg
optimized_image: https://cdn.pixabay.com/photo/2016/11/29/02/14/man-1866784_1280.jpg
author: Shubhendu Shubham
date: 2025-03-9 0:0:00 Z
category: security
tags:
- Cyber Security
---

Alright, let's talk about making the internet a little safer when you get those "secure" padlocks in your browser. Imagine you're trying to prove you own a house, and you only show the ID to one person. A sneaky bad guy could potentially trick that one person into thinking they're you. That's kind of what can happen with website security certificates, and a new project called Open Multi-Perspective Issuance Corroboration (MPIC) is trying to fix that.

Think of it like this: when a website wants to get a security certificate (that digital ID that says "this website is legit"), a Certificate Authority (CA) needs to make sure the website actually owns the domain name. This process is called domain control validation. Now, there's a sneaky attack called a Border Gateway Protocol (BGP) routing attack. Imagine the internet as a giant network of roads, and BGP is like the traffic control system. A BGP attack is like a bad guy changing the road signs so that traffic meant for the real website goes to their fake website instead.

So, when the CA tries to check if you own your website, the bad guy can hijack the traffic and trick the CA into thinking they own your website. This means they could get a legitimate security certificate for a fake website and use it to steal your information – that's what we call a man-in-the-middle attack. Pretty scary, right?

That's where Multi-Perspective Issuance Corroboration (MPIC) comes to the rescue. Instead of just checking from one place, MPIC is like having multiple detectives checking your ID from different locations across the internet. Think of it as the CA asking several different computers around the world to verify if the request to validate your domain is actually coming to your server.

The cool thing is that these sneaky BGP attacks usually don't affect the entire internet – they're often localized, like a road closure in one part of town. So, if the CA checks from a location that isn't affected by the attack, that check will go to the real website and the CA will realize something is fishy. This multi-checking process makes it much harder for attackers to fool the CAs

Now, some of the big players like Let's Encrypt and Google Trust Services are already using MPIC to protect against these attacks. They've built their own systems to do this. However, these existing systems have some limitations.

**Let's Encrypt's** system is built into their specific software called Boulder, and it uses its own internal data structures, which might make it difficult for other CAs to use. Also, Let's Encrypt only deals with one specific way of validating domain ownership called ACME

**Google Trust Services** also uses MPIC, but it relies on Google's own internal infrastructure. Like Let's Encrypt, their current MPIC setup only supports ACME validation.

**CloudFlare** has created an HTTPS-API-based version of MPIC that other CAs can use. This is helpful, but right now, it also only supports ACME validation methods, although they plan to add more later. Plus, some CAs might prefer to have more direct control over the infrastructure rather than relying on a third party like CloudFlare

Here's a quick look at the differences

| Feature                 | Let’s Encrypt | Google Trust Services | CloudFlare | Open MPIC |
| :---------------------- | :------------ | :-------------------- | :--------- | :-------- |
| **ACME Support**        | Yes           | Yes                   | Yes        | **Yes**   |
| **Non-ACME Support**    | No            | No                    | No*        | **Yes**   |
| **Open Source**         | Yes           | No                    | No         | **Yes**   |
| **First-Party Hosted**  | Yes           | Yes                   | No         | **Yes**   |
| **RESTful API**         | No            | No                    | Yes        | **Yes**   |

Here are some of the cool technical bits about Open MPIC, explained in a way that hopefully makes sense:


**Supports Different Ways to Prove Ownership (ACME and Non-ACME)**: Open MPIC plans to work with both the standard ACME method and other ways CAs verify you own a domain, like checking files on your website or DNS records. This is a big deal because not all CAs use ACME.


**Handles Various Validation Methods**: Initially, they'll focus on the common methods like HTTP (checking a file on your website) and DNS (checking records in your domain's settings). But they also plan to expand it to check other things, like email contacts in your domain's CAA records (these records say which CAs are allowed to issue certificates for your domain).

**CAA Compliance Checking**: The system will be able to check your CAA records at the same time it's doing the other validation checks. It can also do a separate check of these records whenever needed. This adds another layer of security by making sure only authorized CAs can issue certificates.

**Detailed Logging**: Open MPIC will keep very detailed records of all the checks it performs. This logging will follow the guidelines that the CA/Browser Forum (the group that sets the rules for certificate issuance) is likely to require. This includes logs from all the different "detective" locations and detailed responses from the checks. The idea is that CAs can easily fit these logs into their existing systems.

**Secure Infrastructure**: The Open MPIC system itself will be hosted on secure servers and will follow best security practices to prevent attacks on it. Also, all communication between the CA and the Open MPIC system will be protected with strong encryption (TLS) and secret keys known only to that CA. Even the communication between the different checking locations will be secure.

**Automated Deployment**: Setting up and managing infrastructure in different parts of the world can be a headache. To solve this, Open MPIC aims to have an automated system that allows CAs to quickly deploy their own instance of the API using their existing cloud provider accounts (like Amazon Web Services, Google Cloud, etc.). Think of it as a one-click setup for this security enhancement

**Highly Configurable**: While the default settings should work for most CAs, Open MPIC will also be very customizable. CAs will be able to adjust things like how many locations to check from, where those locations are, and how many checks need to succeed for the validation to pass (this is called a quorum policy).
•
**Works Across Different Clouds**: Eventually, the goal is for Open MPIC to work with all the major cloud providers. This gives CAs more flexibility in choosing where to deploy the system, especially if they already have relationships with a particular cloud provider.