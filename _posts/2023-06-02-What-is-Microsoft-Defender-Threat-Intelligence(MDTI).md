---
layout: post
title: What is Microsoft Defender Threat Intelligence
subtitle: Security Analyst Workbench
description: Automatically send email with attachment via Microsoft logic apps and Blob storage 
image: https://images.pexels.com/photos/10782398/pexels-photo-10782398.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1
optimized_image: https://images.pexels.com/photos/10782398/pexels-photo-10782398.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1
author: Shubhendu Shubham
date: 2023-09-02 00:00:00 Z
categories:
- azure
tags:
- azure
- Defender
- Cyber Security
- Threat Intelligence
---

Before starting let's understand a few steps of threat investigation and attackers' mindset. Whenever attacker breaches a system or try to all logs are generated as Events and Incidents which can be fetched into SIEM tools like MS Sentinel , Qradar. These behaviours can be summarised into **TTP** viz 

1. Tactics : The high level description of the behaviour and strategy of a threat actor.It means how they behave across the different stages of the cyberattack kill chain. Usually these stages includes :
 * Reconnaissance
 * Delivery and exploitation
 * Acting on the objective 
2. Technique : This is all about what the threat actors do in order to cause all sorts of problems. eg : Network infiltrate, Inside movement without trace, command and control centers establishments
3. Procedure: are the detailed description of how tactics are executed using the choice of techniques and set of actionable.

So for every SOC analyst have to visit multiples repository to check , Domain Name, IP reputations, CVE details . So to reduce the pain of SOC people Microsoft has solution called Microsoft Defender Theat Intelligence aka MDTI

**What is MDTI?**
Platform that streamlines triage, incident response, threat hunting, vulnerability management and cyber threat intelligence analyst workflows.

**USE CASES**

1. Security Operations :use data collection from various cyber defense tools to analyze events occuring within an environment to migrate threats.
2. Incident Response: Investigate, Analysis and Responding to cyber Incidents within a network 
3. Threat Hunting: Search for malware and attacker within a n/w
4. Cyber Threat Intelligence Analysis: Identifying and Tracking cyber threats to an organisation and working with stakeholders to reduce task.
5. Cybersecurity Research: Developing a new concept and approach .

**Demo**

Licences : Defender TI premium Licence
Free Licence can access free offering of MDTI

[Portal Link](https://ti.defender.microsoft.com/)

*  Landing Page Look :-

![Landing Page](https://res.cloudinary.com/hugs4bugs/image/upload/v1693644280/Azure/MDTI/Web_capture_2-9-2023_104139_ti.defender.microsoft.com_uuwo99.jpg)

It contains featuured articles with CVE , Threat Indicators and Intel Group name 

*  Articles 

![Articles](https://res.cloudinary.com/hugs4bugs/image/upload/v1693657867/Azure/MDTI/2_mlcljt.jpg)

*  Creating Teams account and Project. In free license we can't create Teams account but we can create 1 project with accessibility to ownselves.

![Teams account](https://res.cloudinary.com/hugs4bugs/image/upload/v1693657998/Azure/MDTI/3_dwm5f5.jpg)

*  After Project creation, we do have to add artifacts to run the jobs

![Artifacts](https://res.cloudinary.com/hugs4bugs/image/upload/v1693658491/Azure/MDTI/4_kefh7u.jpg)

* Artifacts can be either for domain or IP specific 

![Artifacts](https://res.cloudinary.com/hugs4bugs/image/upload/v1693658719/Azure/MDTI/5_qrmyk2.jpg)

* Run Jobs and It'll seach from each search type like Tags, components, Trackers, WHOIS, Certificate, Cookies and provides result into two part 

1. First is summary 
2. Data Tab which contains all details about scans 

![Scans](https://res.cloudinary.com/hugs4bugs/image/upload/v1693659085/Azure/MDTI/6_ud8med.jpg)

At Intel profile, we can filter out Threat actors and groups by Targets and country  

![Intel](https://res.cloudinary.com/hugs4bugs/image/upload/v1693659234/Azure/MDTI/7_dju2wa.jpg)