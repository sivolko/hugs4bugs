---
layout: post
title: How to onboard your first Microsoft sentinel SIEM tool?
subtitle: Security Monitoring 
description: This is all about how to configure Microsoft Sentinel environment with Log Analytics workspace
image: https://th.bing.com/th/id/OIP.4iyoklvcRYZRDAi1HOKt0gHaEW?w=271&h=180&c=7&r=0&o=5&pid=1.7
optimized_image: https://th.bing.com/th/id/OIP.4iyoklvcRYZRDAi1HOKt0gHaEW?w=271&h=180&c=7&r=0&o=5&pid=1.7
author: Shubhendu Shubham
date: 2023-11-13 00:00:00 Z
category: azure
tags:
- azure
- Microsoft Sentinel
- Cyber Security
- Threat Intelligence
---
Before jump over the onboarding of Microsoft Sentinel, let's understand what MS Sentinel is?

**Definition**: Microsoft Sentinel is a cloud native SIEM(Security information and Event Management) and SOAR(Security orchestration,automation,and response) solution,which delivers intelligent security analytics and threat intelligence.

**Why do we use it?**
To act as blue teaming as defensive security against attack detection,threat visibility,proactive hunting and threat response.

In this blog we'll be considering a single tennat onboarding with a single workspace.

**Prerequisites**:

1. Azure subscription 
2. Microsoft Entra ID / tennant ID
3. Sentinel Contributor permission or owner premission at tennant level
4. Log Analytics workspace

In this blog I'll be assuming one have already configured Tennant ID and having a valid Azure subscription.

**Onboarding steps**:

1. Log on to [Azure portal](https://portal.azure.com)
2. Search and select for Log Analytics workspace
![Log ANAlytics](https://res.cloudinary.com/hugs4bugs/image/upload/v1699907667/Azure/sentinel/bzdaurygtsspwatefto8.jpg)
3. Select + Create to create a new workspace
![LAWC](https://res.cloudinary.com/hugs4bugs/image/upload/v1699907666/Azure/sentinel/saaksvzy6debecqkb3ie.jpg)
4. Choose your subscription, select a Resource Group
5. Enter a valid name for the Log Analytics Workspace
6. Select a Region to store Logs .Make sure to consider GDPR rule is you are deploying for client 
![img](https://res.cloudinary.com/hugs4bugs/image/upload/v1699907671/Azure/sentinel/ow2ey5y8zgp0srhdx5ip.jpg)
7. Select Review + create to validate the new workspace then click on create to deploy the workspace.
8. Wait for a few seconds, after deployment is completed, click on go to resources.
![img](https://res.cloudinary.com/hugs4bugs/image/upload/v1699907668/Azure/sentinel/tamg3g47xjt3aqcafah7.jpg)

Now we have to deploy Microsoft Sentinel to the recently created Log Analytics workspace.

9. Search and Select for MS sentinel in Azure portal search box.
![img](https://res.cloudinary.com/hugs4bugs/image/upload/v1699907672/Azure/sentinel/bvpfkdfbo8iwda6ed31p.jpg)
10. Click on + Create
![img](https://res.cloudinary.com/hugs4bugs/image/upload/v1699907666/Azure/sentinel/ir1ribi6c7xs6vau1cq6.jpg)
11. Select recently created workspace and click Add
![img](https://res.cloudinary.com/hugs4bugs/image/upload/v1699907667/Azure/sentinel/th3jwvjnpixi7wafjsvq.jpg)
12. Automatically 31-days free MS Sentinel trial will be added.
![img](https://res.cloudinary.com/hugs4bugs/image/upload/v1699907670/Azure/sentinel/hk8adnyzpwe3f3fwvpsb.jpg)

Now Next step will be assiging a Microsoft Sentinel role to a user

13. Go to the Resource Group of Log Analytics workspace
14. Select Access control(IAM)
15. Select Add and Add role assignment
![img](https://res.cloudinary.com/hugs4bugs/image/upload/v1699907672/Azure/sentinel/u64u5cwmj6idkh0rcnna.jpg)
16. In the search bar search and select Mirosoft Sentinel Contributor role and click next
![img](https://res.cloudinary.com/hugs4bugs/image/upload/v1699907671/Azure/sentinel/myrh9fvuat1fipd9d6c3.jpg)
17. Select the option user,group or service principal
![img](https://res.cloudinary.com/hugs4bugs/image/upload/v1699907672/Azure/sentinel/v4qzy8yrkljapyuraw8t.jpg)
18. Select + Select members and assign to role to the proper user
19. click review and assign

Now let's connect the data connector to the Sentinel.

20. Jump over MS Sentinel and select content Hub blade from content management 
![img](https://res.cloudinary.com/hugs4bugs/image/upload/v1699907673/Azure/sentinel/htb6vprwyjitc5rqbvz5.jpg)
21. Select Azure Activity Data connector and click on install
![img](https://res.cloudinary.com/hugs4bugs/image/upload/v1699907673/Azure/sentinel/jbgwlgtlskqhyem99c0p.jpg)
22. After successful installation, Installed connector blade will change to 1.
![img](https://res.cloudinary.com/hugs4bugs/image/upload/v1699907674/Azure/sentinel/pjpnlhtbn2m88xufb2kd.jpg)
23. After sometime we can check Logs using "Hearbeat" KQL command.
24. For Analytics rules creation , visit Analytics rule blade under configuration tab.
![img](https://res.cloudinary.com/hugs4bugs/image/upload/v1699907793/Azure/sentinel/w9jxbtsy9utye4kp9dw9.jpg)

Thanks for reading blog, keep learning Keep Troubleshooting.