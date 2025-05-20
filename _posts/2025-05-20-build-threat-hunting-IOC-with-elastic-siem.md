---
layout: post
title: Build Your Own IOC Playground with ELastic SIEM
subtitle:  "Hunt IOC"
description: Let's learn how to hunt Threat adversory 
image: https://res.cloudinary.com/hugs4bugs/image/upload/v1747750540/AI%20generated/use_this_image_as_person_with_laptop_frcpq3.png
optimized_image: https://res.cloudinary.com/hugs4bugs/image/upload/v1747750540/AI%20generated/use_this_image_as_person_with_laptop_frcpq3.png
author: Shubhendu Shubham
date: 2025-03-9 0:0:00 Z
category: security
tags:
- Cyber Security
- Elastic SIEM 
---
When it comes to proactive approach of security, threat Hunting comes to the picture. And being aware of IOC aka Indicators of Compromise gives an extra leverage to find malicious urls, hash, IP and block those and take proper action. In this lab, I'm gonna build homelab with Elastic Cloud and Elastic SIEM deployment and generate IOC with AbuseCH . 

Basic HLD 

![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1747751796/hugs4bugs/Screenshot_20-5-2025_20540_excalidraw.com_rlsc0e.jpg)

**Steps to create a hosted Deployment**
1. Signup to  [Elastic Cloud](https://cloud.elastic.co)
2. Click on Add Deployment 
![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1747754029/hugs4bugs/Elastics/hostedclouddeployment_ustvd2.jpg)
3. Launching Deployement 
![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1747754101/hugs4bugs/Elastics/launching_deployement_ewcinj.jpg)
4. Incoming Data Confirmation
![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1747754167/hugs4bugs/Elastics/incomingdatapreview_vlz16q.jpg)


**Agent Installation** 

1. Click on the assets, and Add Agent button 
![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1747752370/hugs4bugs/Elastics/completeintegrationEDR_jzv0dn.jpg)

2. Enroll in Fleet which means elastic agents in fleet to automatically deploy updates and centrally manage the agent.
3. Install Elastic agent on the host machine, in my case it's Kali Linux Machine 
```
curl -L -O https://artifacts.elastic.co/downloads/beats/elastic-agent/elastic-agent-9.0.1-linux-arm64.tar.gz 
  tar xzvf elastic-agent-9.0.1-linux-arm64.tar.gz
  cd elastic-agent-9.0.1-linux-arm64
  sudo ./elastic-agent install --url=https://a097fdb86de9432ebec921c664a65f9d.fleet.us-east-1.aws.elastic.cloud:443 --enrollment-token=R0FzLTRwWUJtSzFxcVVmU2tyUUo6OUlIdGticVFtcjJhRVNjR2t1NUY4dw==
```
![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1747752682/hugs4bugs/Elastics/agentsuccess_ni21jq.png)

4. Incoming Data confirmation 

![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1747752747/hugs4bugs/Elastics/agentinstallationconfirmationUI_pgtnsy.jpg)

**Now Deploy Elastic Defend**

Go to the integration and select Elastic Defend then click Add Elastic Defend  

![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1747753309/hugs4bugs/Elastics/fleet_agents_vznevr.jpg)

1. Configuration Integration give it a name and Description
![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1747753425/hugs4bugs/Elastics/completeintegrationEDR_cpwl9a.jpg)
2. Under Configuration Settings, it should be "Complete EDR with full telemetry"
![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1747753543/hugs4bugs/Elastics/EDRconfig_zrslnf.jpg)
3. under Where to host section, select existing host and pick same host where we had deployed 1st agent policy
![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1747753694/hugs4bugs/Elastics/existinghostti_ogs2b2.jpg)

Save & Continue 

Now configure Threat Intel feed, from security project left hand menu side click on Intelligence 
1. Click on AbuseCH TI tool
![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1747754440/hugs4bugs/Elastics/absurech_vb1tk1.jpg)
2. Add AbuseCH 
![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1747754555/hugs4bugs/Elastics/add_absuech_h0ozni.jpg)
3. Select Deployment option as Agent based and toggle off for "collect AbuseCh logs via API using Elastic Agents" . If you have AbuseCH API key feel free to use this option 
![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1747754702/hugs4bugs/Elastics/deployment-agentbased-ti_lzn3ss.jpg)
4. Now check the TI feeds from Intelligence pannel and feel free to build custom dashboard as well. 
![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1747754859/hugs4bugs/Elastics/threattintelfeed_kxoqps.jpg)

IOC Details 

![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1747755003/hugs4bugs/Elastics/IOC_details_k9gmw0.jpg)

**Custom Dashboards** 
![Abusechurls](https://res.cloudinary.com/hugs4bugs/image/upload/v1747755168/hugs4bugs/Elastics/abusechurl_vfwmli.jpg)

![Most url](https://res.cloudinary.com/hugs4bugs/image/upload/v1747755248/hugs4bugs/Elastics/popularurls_uzd62i.jpg)

In next part we'll discuss how to create correlation rule with TI feeds.