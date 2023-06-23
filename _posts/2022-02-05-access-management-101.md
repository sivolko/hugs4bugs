---
title: Access Management 101.
date: 2022-02-05 23:04:08 Z
categories:
- security
tags:
- Access Management
- Vulnerability
- Cyber Security
layout: post
subtitle: Know it before you need it.
description: Beasic understandings of Access Management and AAA concept.
image: https://d3nn873nee648n.cloudfront.net/900x600/16347/120-SM692126.jpg
optimized_image: https://d3nn873nee648n.cloudfront.net/900x600/16347/120-SM692126.jpg
author: Shubhendu Shubham
paginate: true
---

Access management that sounds like we all know about it, and even we are practicing it, but are we fundamentally aware of it ? Do our concepts of access management and security are correct?
![OMG](https://d3nn873nee648n.cloudfront.net/900x600/19772/1-SM961450.jpg)

Let's do start....

First of let's go thoroughly
**AAA** concept.

AAA : Access, Authentication, Authorization.
When we talk about security, two most confusing terms are **Authentication** and **Authorization**, but don't worry, after this you will not confuse again.

**Authentication** :- It means confirmation of who you are.It generally consists of Usernames, ID, passwords, tokens, fingerprints, etc.

Types of Authentication:-

**1 Single-Factor**: easiest authentication method, usually a simple password or token to grant access to a system or domain.

**2 Two-Factor**: two-step verification that results in more security. Eg :- In our banking system/environment one need to use both physical card (not considering cardless withdrawl here) and and PIN(personal-Identification-number) to withdraw money from ATM.

**3 Multifactor** : The most secure type of authentication to grant access, using two or more techniques from different categories.

**Authorization** :- It means confirmation of what you are allowed to do.It is the second step after authentication.

The third main important factor is **Auditing**

Basically auditing is the logging of events that have significance such as who has logged in and logged out or who attempted some type of privileged action.

If I have to prove someone did something on their network, I'll probably go for audit and security logs files, it contains all tracks of someone's actions or something performed an action in a networked environment.It helps in nonrepudiation, which means that the person authenticated & authorized can't deny the performance of the action.No one wants a situation where one person claims an action happened and another is in total opposite to the storytelling.

We need **3** major artifacts for nonrepudiation viz:-

- An identity
- Authentication of that identity
- Evidence connecting that identity to an action

Here comes the role of **least Privilege** :-

The principle of least privilege (PoLP) and Principle of least authority (PoLA) is a concept that reduces tha accidental or purposeful attack surface of an organization.

One can divide the organization into two groups:

**a. Standard-end-user**

**b. Administrator**

One reason this principle works so well is that it will make you do internal research on what privileges at what level are actually needed. Unfortunately, the path of least resistance in many organizations has been the overuse of accounts with deep and far‐reaching privilege. The consequences of a network administrator opening an email attachment that launches malware while logged into the domain administrator's account are that the malware will have administrator's privilege on the domain and unrestricted access to the network. If the network administrator is logged into a standard end‐user account, the malware only has access to the user's data, and the potential compromise scope is much smaller.

One should default to creating a separate standard user account for every user including administrators, and every account should use at least single‐factor authentication. This enables you to control what the users can install and websites they can visit. Too many organizations allow all users on their network administrative privileges, and it creates a massive attack surface. Administrators should always log in using their standard user account and then use the Run As Administrator feature to run those programs they need elevated privileges to use. There are far too many breaches that get traced back to administrators opening email and clicking a link that leads to a malicious download that compromises an asset that spreads through a network and steals everything. Not only do organizations lose intellectual property, but they end up fined for violations of compliance, which can lead to a loss of millions in a single breach.

One of the best ways to start implementing the PoLP is to start with a privileged audit. A user account created to use a database does not need admin rights like a programmer building the database. You do not want to hinder your end users; you want to give them only enough access to perform their required job.

Separation of duties (SoD) is a strategic function of least privilege. You have one person write the check and one person sign the check. By having more than one person accomplish a task, it can help prevent fraud or errors. In the Group Policy story earlier, SoD was part of that process. If the employee had followed procedures for change management, I could have told him why it was a really bad idea.

By implementing least privilege, one can even improve operational performance, reduce the chance of unauthorized behavior, reduce the attack surface, and reduce the chances of malicious software propagating since it might need elevated processes to run. One of the biggest benefits of implementing least privilege is that it makes it easier to meet compliance requirements. Many compliance regulations such as PCI‐DSS, HIPAA, FISMA, and SOX require that organizations apply least privilege to ensure proper data management and security.

Now next concept is **Single Sign-on**

Working in our modern‐day environments requires us to log into multiple programs to get our jobs done. We have to log into customer management databases, share resources in cloud applications, check email, and create documentation online. It can be a headache for the average user to remember all those usernames and passwords. To alleviate that issue, we use single sign‐on (SSO) applications. SSO is another form of access control between multiple, interrelated software systems.

![image](https://d3nn873nee648n.cloudfront.net/900x600/16464/20-SM700610.jpg)

Benefits of single sign‐on can include the reduction of password fatigue or having end users write their passwords on sticky notes and put them on their monitor or under the keyboard. It can save time typing in passwords over and over and ideally reduce help‐desk issues of people calling in because they went on vacation and forgot their password and locked themselves out. One of the big criticisms of SSO is the access to many different resources from just one login. To combat this issue, we have to focus on protecting the “keys to the kingdom” and combine this with strong verification like multifactor authentication.

**CIA TRIAD**

The CIA triad is used to find the right balance for an organization based on priorities, which includes **Confidentiality, Integrity, and Availability.**

Confidentiality is a set of rules that limit access to information, integrity is the assurance that the information is accurate, and availability is giving the right information access to the right people. Network and security IT administrators have to find a balance between protecting the environment and meeting compliance without hindering the workflow of the end users. If you tighten controls too tight, users cannot do their job, but if controls are too lax, it results in a vulnerability. If you're not careful, end users will start saving their credentials in their browser for easy login into their favorite banking or shopping websites. They may even save their corporate credentials, which could be catastrophic if the machine is ever accessed by non‐authorized individuals.

Next comes **JumpCloud**, JumpCloud is a cutting‐edge blend of SSO and management of permissions in a network environment. It is a cloud-based solution that allows you to manage permissions and access control for your network. It is a great way to manage access to your network.

Users' identities are at the core of JumpCloud as a directory as a service. One can create a central, authoritative version of each identity so employees can use a single set of credentials throughout all the resources they need to access.One can set up password complexity and expiration features to ensure policies are met and then, once set up, bind those users to any of the resources connected to JumpCloud from their host system to applications to networks.

For more details about, one should must visit [**Jump CLoud**](https://jumpcloud.com) and go through documentation. As far I am concerned, it gives free tier access upto 10 users.

These were my way to see the importance of the above mentioned factors.Will love to have more insights on this at your end.

Thanks for reading!
#chillmaadi,EnjoyMaadi
