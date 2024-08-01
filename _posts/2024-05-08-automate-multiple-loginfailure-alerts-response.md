---
layout: post
title: Automate Multiple Login failure alerts 
subtitle: Reduce SOC analyst burnout
description: In this section we'll cover up basic but important challange faced by SOC analyst bu automating the multiple login failure alerts response 
image: https://cdn.pixabay.com/photo/2019/04/29/09/33/anonymous-4165613_1280.jpg
optimized_image: https://cdn.pixabay.com/photo/2019/04/29/09/33/anonymous-4165613_1280.jpg
author: Shubhendu Shubham
date: 2024-05-08 00:00:00 Z
category: security
tags:
- Cyber Security
- BlueTeam
- SOC
---
MTTD (Mean Time To Detect) and MTTR (Mean Time To Response/Remediate) are the two crucial factor in Defensive side of hashtag#cybersecurity
Major challenge for Blue team is resource burnout and manual investigation on repetitive task which increase average MTTR .

Let's understand use case to orchestrate security flow 
use Case :- Automate Multiple login failure alerts response 

Workflow link :- 
![workflow](https://raw.githubusercontent.com/sivolko/Awesome-Security-Analyst-tools/main/security-automation/use-cases/image.png)

Here we'll use SOAR (Security Orchestration Autoamtion and Response) to automate Multiple login failure alert response. It can be achived with the both Azure Logic & Power Apps.

Steps:-

1. We'll set threashold of login failure eg- 4/5 times
2. When user account have multiple times failed password attemps,
3. Playbook will trigger an email to user asking for justification
4. Waits for the end user reply & inform analyst
5. As soon as it receives response from end user, next job will start based upon reply
6. If user confirms genuine activities then look for justification
7. In case password expired/forgotten, reset password and share revised login credentials to user over mail
8. Incase if failed password attempts are not from end user then playbook will trigger investigation action
9. Fetch Incidents details from SIEM and UEBA connectors
10. Query will run to extract usernames, Source IP, Destination IP, Assets details
11. Cross verify username with existing users list in AD (Active Directory)
12. Check IP reputation with multiple open source IP checker. ps :- It can be automated with help of API , eg if we do use VirusTotal then Virus total API can be integrated with SOAR platform ,And in case of Microsoft Azure, Microsoft Threat Intel profile could be linked up or TAXII API
13. Check distance between IP in case of multiple location jump and generate location map & event duration
14. Notify the analyst with result score
15. If activity is malicious then Quarantine?Block IP and user, Create ITSM ticket with defined SOP severity & notify support team via email/Teams channel or slack
16. If it's non malicious then close incident with false positive justification.
17. Stop playbook

[Github](https://github.com/sivolko/Awesome-Security-Analyst-tools/blob/main/security-automation/use-cases/multiple-login-failure-alert-response.md)

Keep Learning, Keep Troubleshooting ! 