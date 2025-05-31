---
layout: post
title: Be a Detective with AWS Detective 
subtitle:  "SOC POV"
description: Let's deep dive into AWS Detective services
image: https://res.cloudinary.com/hugs4bugs/image/upload/v1748665961/hugs4bugs/aws/aws.png
optimized_image: https://res.cloudinary.com/hugs4bugs/image/upload/v1748665961/hugs4bugs/aws/aws.png
author: Shubhendu Shubham
category: Cyber Security
tags:
- aws
- Cybersecurity
---
In the ever-evolving landscape of cloud security, identifying and responding to threats swiftly is paramount. Amazon detective makes its easy for soc analyst or security engineer to analyse, investigate, and do RCA. Before jumping to the tehnical side, let's understand the landscape of security Incidents investigation phase :

![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1748666399/hugs4bugs/aws/1_d9pzu7.jpg)

1.Triage – Figuring Out If There’s a Real Threat
Imagine getting an alert that something suspicious might be happening in your system. Your first step is to check whether it’s a real problem or a false alarm.

Some alerts come from Amazon GuardDuty or Amazon Inspector, which help detect unusual activity.

If the issue looks serious (like someone trying to break in), it’s a true positive, and you move on to the next step.

If it’s just normal activity being misinterpreted, it’s a false positive, and you can ignore it.

AWS Detective helps by showing useful data about the activity so you can decide whether it’s actually a threat.

2.Scoping – Understanding the Full Story
Once you've confirmed there's a real security issue, it's time to investigate the details. This phase answers key questions:

Who or what was affected? (Did someone gain access to your system or users' accounts?)

Where did the problem start? (Did the attack come from inside or outside your network?)

How long has this been happening? (Has your data been exposed for days, weeks, or just minutes?)

Are there other related issues? (If someone stole data, how did they get in?)

AWS Detective visualizes all this information so you can connect the dots and see the bigger picture.

3.Response – Stopping the Attack & Preventing Future Issues
After understanding the scope of the attack, the final step is taking action to fix the problem:

Shut down the attack (Block suspicious users, cut off unauthorized access).

Limit the damage (Secure affected systems, restore backups).

Prevent similar attacks (Improve security measures, adjust settings).

AWS Detective helps you trace the source of the attack, so your security team can act fast and prevent another one from happening.

![image](https://docs.aws.amazon.com/images/detective/latest/userguide/images/diagram_investigation_flow_entity.png)
source: aws

**How to enable Amazon Detective?**

1.Visit Aws console and search for Amazon Detective and click on Get started
![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1748666903/hugs4bugs/aws/2_s0oqzk.jpg)

2.You can invite group members or use default aws recommendation, which uses IAM policy 
![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1748667030/hugs4bugs/aws/3_uyk7kq.jpg)

3.Now enable Security Lake, but for that your aws account must be a member of AWS orgnaisation 
![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1748667211/hugs4bugs/aws/4_rqrfri.jpg)

4.Now let's create aws orgnaisation 
![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1748667333/hugs4bugs/aws/5_lbjogb.jpg)

5.Convert or create a management account 

![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1748667434/hugs4bugs/aws/6_s0t5ix.jpg)

6.Successful Managemetn Account creation
![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1748667546/hugs4bugs/aws/7_dcjztg.jpg)

7.Now return to amazon detective page for security lake integration adn enable 30-days free trials
![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1748667712/hugs4bugs/aws/8_swkgqt.jpg)

8.Crate a delegate account
![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1748667802/hugs4bugs/aws/9_kluqha.jpg)

9.Register a deligate Admin 
![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1748668339/hugs4bugs/aws/10_ofb158.jpg)
![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1748669113/hugs4bugs/aws/12_y764em.jpg)

10.Make sure Trust access is enabled from AWS orgnaisation for Amazon Detective

![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1748668897/hugs4bugs/aws/11_i9fpj9.jpg)

11.Now you can see all Roles and Users with Most API calls 
![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1748670703/hugs4bugs/aws/14_vwsoye.jpg)

12.Geolocation based 

![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1748670703/hugs4bugs/aws/15_khrn0y.jpg)

