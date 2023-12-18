---
layout: post
title: How to install ThreatMapper in Kali Linux?
subtitle: One of the best CNAPP
description: This is to install Open source CNAPP tool Threat Mapper in Kali Machine
image: https://assets-global.website-files.com/63eaa07bbe370228bab003ea/644292bf096fd43dfd6532d4_image2-p-800.png
optimized_image: https://assets-global.website-files.com/63eaa07bbe370228bab003ea/644292bf096fd43dfd6532d4_image2-p-800.png
author: Shubhendu Shubham
date: 2023-12-17 00:00:00 Z
category: security
tags:
- Cyber Security
- Threat Intelligence
---
Before starting, let's understand a few terms,what is CNAPP?
CNAPP aka cloud Native Application Protection Platform is all-in one cloud-native software platform that simplifies DevSecops practices.This term **CNAPP was orignally coined by Gartner in 2021** CNAPPs make it simpler to embed security into the application lifecycle while providing superior protection for cloud workloads and data. A few core features of CNAPP are:-

1. No Vendor Locking, with multi cloud support
2. TI(Threat Intelligence)integration
3. Shifted Left DevOps Security Management
4. Centralised Compliance and Permissions 
5. Comprehensive cloud workload protection

Now let's understand briefly what is **ThreatMapper**?

ThreatMapper is an opensource CNAPP version of ThreatStryker, developed by [Deepfence](https://www.deepfence.io/threatmapper).It gives both agent and agentless based scanning options.

**Components**:-
ThreatMapper consists of 2 components:-
1. ThreatMapper Console : It integrates with Infrastructure API to scan & detect config errors, compliance posture with the help of data collected from sensors. It generated SBOMs to find vulnerabilities.
2. ThreatMapper Sensors: These sensors support different types of platforms like K8S, Docker, Bare Metal, AWS fargate.

Architecture :-

![Image source Deepfence!](https://community.deepfence.io/threatmapper/assets/images/threatmapper-components-5df1ba6044bd031a7f541358814bb9ed.jpg "Image source Deepfence")

**Installation**

For prerequisite please visit offical documentation by [Deepfence](https://community.deepfence.io/threatmapper/docs/console/requirements/)

In this blog I'm referring official (GitHub Repo](https://github.com/deepfence/ThreatMapper)

**Management Console Installation**
```
# Docker installation process for ThreatMapper Management Console

wget https://github.com/deepfence/ThreatMapper/raw/release-2.1/deployment-scripts/docker-compose.yml
```
Execute the following command to install and start the latest build of the Console
```
 docker compose up -d
```
Now Let me run command **docker ps** to see all running images 
![Image](https://res.cloudinary.com/hugs4bugs/image/upload/v1702884578/hugs4bugs/Screenshot_2023-12-18_12_58_26_ow04dq.png "Docker Image")

Now Find my local IP using 'ifconfig' command in linux terminal and paste IP address in browser, default deepfence login/signup page will pop-up click on registration for first time user.

![Default](https://res.cloudinary.com/hugs4bugs/image/upload/v1702884832/hugs4bugs/login_mwfroo.jpg)

Registration page ![Image](https://res.cloudinary.com/hugs4bugs/image/upload/v1702884913/hugs4bugs/reg_hbppbs.jpg)

**Dashboard**

Default dashboard will appear and we need to add connectors

![Connector](https://res.cloudinary.com/hugs4bugs/image/upload/v1702885100/hugs4bugs/dashboard_r7w2uj.jpg)

**Main Dashboard**

![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1702886176/hugs4bugs/dass_opjiqk.jpg)

Now I'll connect my Azure cloud provider single subscription as data connector via Terraform.
so let's create a terraform basic file (yourfilename).tf

```
  touch cloud-scanner.tf
```

Now paste the following command and replace it with your Azure subscription ID, ThreatMapper API, URL etc

```
 provider "azurerm" {
  features {}
  subscription_id = "<SUBSCRIPTION_ID eg. XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX>"
}

module "cloud-scanner_example_single-subscription" {
  source              = "deepfence/cloud-scanner/azure//examples/single-subscription"
  version             = "0.2.0"
  mgmt-console-url    = "<Console URL> eg. XXX.XXX.XX.XXX"
  mgmt-console-port   = "443"
  deepfence-key       = "<Deepfence-key> eg. XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
  name                = "deepfence-cloud-scanner"
  image               = "quay.io/deepfenceio/cloud-scanner:2.0.1"
}
```
Then initalise terraform inside directory using command

```
  terraform init
```

![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1702886516/hugs4bugs/tff_ithxuc.png)

Then run command 

```
  terraform plan
```
![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1702887309/hugs4bugs/tf_bjb2l8.png)

then run command 

```
 terraform apply
```
to remove scan and connection, run command 'terraform destroy'

## Linux Host  

Now let's scan my own local machine which is runnig as Kali linux as bare metal Linux host.For this we have to install sensors. follow [official page](https://community.deepfence.io/threatmapper/docs/v2.0/sensors/docker/) for information 

commands

```
 docker run -dit \
    --cpus=".2" \
    --name=deepfence-agent \
    --restart on-failure \
    --pid=host \
    --net=host \
    --log-driver json-file \
    --log-opt max-size=50m \
    --privileged=true \
    -v /sys/kernel/debug:/sys/kernel/debug:rw \
    -v /var/log/fenced \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v /:/fenced/mnt/host/:ro \
    -e USER_DEFINED_TAGS="" \
    -e MGMT_CONSOLE_URL="---CONSOLE-IP---" \
    -e MGMT_CONSOLE_PORT="443" \
    -e DEEPFENCE_KEY="---DEEPFENCE-API-KEY---" \
    deepfenceio/deepfence_agent_ce:2.0.1
```
After this there will be change in connected Devices --> visit Topology and Hosts

![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1702888100/hugs4bugs/kali_baflg5.jpg)

Now there is no scans ![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1702888251/hugs4bugs/noscan_duznsu.jpg)initiated,let's start quicks Vulnerability scan from top left **Action** button.

Here I'm doing only OS SCAN
![Scan](https://res.cloudinary.com/hugs4bugs/image/upload/v1702888469/hugs4bugs/sp_dewc0c.jpg)

Meanwhile we can check same from Vulnerability blade from right side.

![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1702888658/hugs4bugs/vb_pawxws.jpg)

Remarks :- 

Doing bare metal/Host OS Vulnerability scan, there might be spikes in Memory and CPU usages.

Thanks for reading blog, keep troubleshooting 