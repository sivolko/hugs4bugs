---
layout: post
title: "How to Install Kali Purple SOC Tools on Existing Kali Linux (Step-by-Step 2026)"
subtitle: "Full NIST framework tool installation on any existing Kali Linux machine"
description: "Step-by-step guide to install Kali Purple SOC tools on existing Kali Linux. Covers all 5 NIST framework tools: Identify, Protect, Detect, Respond, Recover — no fresh install needed."
image: https://www.kali.org/blog/kali-linux-2023-1-release/images/kali-purple-icon.svg
optimized_image: https://www.kali.org/blog/kali-linux-2023-1-release/images/kali-purple-icon.svg
author: Shubhendu Shubham
date: 2024-01-26 00:00:00 Z
category: security
tags:
- kali-linux
- kali-purple
- soc
- blue-team
- security-tools
---
When Kali org announced Kali-purple on the occassion of 10th anniversary,it was move from offensive security to defensive security.
It announced with couple of interesting features viz:-
1. SOC out of the box
2. Security control design and testing 
3. Protection of small & Medium size environment 

Refer official docs for more [Kali Purple Official](https://www.kali.org/blog/kali-linux-2023-1-release/)

Main interesting feature of Kali-purple is Tools are structured upon [NIST Framework](https://www.nist.gov/cyberframework) viz 
* Identify 
* Protect 
* Detect
* Respond 
* Recover 

Suppose you already have Kali machine like me and wanna try kali purple specific tools or all SOC OOTB tools here comes commands :-

step 1: Update repository 

```bash
 sudo apt update 
```
step 2: Upgrade system 

```bash
 sudo apt full-upgrade -y 
```
step 3: To remove unnecessary lib installed during upgradation 

```bash
 sudo apt autoremove
```
suppose you want to install specific tool, then run single command viz 

step 4: specific tool

```bash
 sudo apt install kali-tools-identify -y
```

Or else if you want to install all 5 framework tools together then run following command

step 5: All 5 together

```bash
 sudo apt install kali-tools-identify kali-tools-protect kali-tools-detect kali-tools-respond kali-tools-recover -y
```
After all these tools installation your kali menu will be same like previous

![image](https://pbs.twimg.com/media/GEobUi3a4AA0AQq?format=jpg&name=900x900)

If you want to add those framework tools into kali menu then reinstall kali menu running this command

```bash
 sudo apt install --reinstall kali-menu 
```
Then restart your system using command or GUI method

```bash
 sudo systemctl restart
```
Afterwards those framework tools will be added 

![kali-purple tools](https://pbs.twimg.com/media/GEobVF_a4AAA3e0?format=jpg&name=900x900)

Thanks for reading blog

Now keep learning,keep troubleshooting  #troubleshooterclub
