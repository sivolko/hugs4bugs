---
layout: post
title: Streamline Security :Wazuh in Docker with Kali
subtitle: Deploy wazuh in Docker for real-time Threat Detection & Compliance 
description: Enhance your security operations with wazuh for real time threat detection and complicane using open source SIEM wazuh using docker with kali. 
image: https://plus.unsplash.com/premium_photo-1683140655656-20448abc55da?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
optimized_image: https://plus.unsplash.com/premium_photo-1683140655656-20448abc55da?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
author: Shubhendu Shubham
date: 2024-12-29 00:00:00 Z
category: docker
tags:
- Cyber Security
- SIEM
- blueteam
- soc 
---
If you're a security professional,it might a chance you would be familier with SIEM aka Security Information Event Management used by SOC analyst or security engineers. In this homelab cybersecurity series I'm guiding you through step by step Wazuh as single node deployment using docker in Kali Machine. 

Before that let's understand Wazuh and It's Architecture :- 

## Wazuh 

Wazuh is open source security platform with unified XDR(Xtended Detection and Response) and SIEM platform which protects endpoints and cloud workloads.It has 3 major components 

1. Wazuh Server:- mainlay used for Agent data collection 
2. Wazuh Indexer:- for cluster communication 
3. Wazuh Dashboard:- Web Interface

### Features 

- Endpoint Security: Config Management,Malware Detection, File Integrity Monitoring 
- Threat Intelligence: Threat Hunting, Log Data Analysis, Vulnerability Detection.
- Security Operations: Incident Response, Regulatory Compliance, IT Hygiene
- Cloud Security: Container Security, Posture Management, Workload Protection

![Architecuture](https://documentation.wazuh.com/current/_images/deployment-architecture1.png "source: Wazuh docs")

Now question comes, why do I use **Docker** for Wazuh installation?

Since I love flexibility, light weight and portability that's why I'm using all Docker to utilise it's all container features. 

#### Prerequities:- 

* Docker installed if not use below command after running sudo apt update && sudo apt upgrade -y 

```
 sudo apt install docker.io 
```

* Docker compose is installed 

```
 sudo docker-compose --version 
```
![Image](https://res.cloudinary.com/hugs4bugs/image/upload/v1735462967/hugs4bugs/wazuh/12_ungfrg.png)

* 
```
 sudo systemctl start docker 
 ```
* 
```
 sudo systemctl enable docker
```

In this my homelab I'll be using single node deployment. so let's colne official wazuh github repo and change directory to single node.

1. 
```
 git clone https://github.com/wazuh/wazuh-docker.git -b v4.9.2
```
![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1735460734/hugs4bugs/wazuh/1_uvndlf.png)

2. change directory to single node & Generate Self Signed Certificates 

```
 docker-compose -f generate-indexer-certs.yml run --rm generator
```
![command](https://res.cloudinary.com/hugs4bugs/image/upload/v1735460735/hugs4bugs/wazuh/4_qije2l.png)

3.Now run 
```
 docker compose up -d or docker compose up 
```

![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1735460736/hugs4bugs/wazuh/5_u1afdd.png)

4.Now check docker running serverice using 

```
 sudo docker ps 
```
![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1735460735/hugs4bugs/wazuh/7_jyjjnw.png)

5.Visit Favourite browser and type localhost or local ip :443 for wazuh dashboard. Default username is admin & Password as SecretPassword

![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1735460735/hugs4bugs/wazuh/8_tckpuk.jpg)

6.Feel Free to change default password 

![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1735460735/hugs4bugs/wazuh/8_tckpuk.jpg)

7.Hover Hamburger Menu and click Endpoint Summary under server Management

![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1735464036/hugs4bugs/wazuh/13_kpbylg.jpg)

8.Click on Deploy New Agent

![Image](https://res.cloudinary.com/hugs4bugs/image/upload/v1735464229/hugs4bugs/wazuh/14_csw1zf.jpg)

9.In our case it's kali machine which id Debaian based so select OS as per your configuration 
![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1735464418/hugs4bugs/wazuh/15_wgb1kr.jpg)

10.Now Run the following commands

```
sudo systemctl daemon-reload
sudo systemctl enable wazuh-agent
sudo systemctl start wazuh-agent
```

11.After successful agent deployment dashboard will look like 

![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1735464783/hugs4bugs/wazuh/16_ib65zh.jpg)

12.Endpoint Dashboard will Look alike :-

![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1735464938/hugs4bugs/wazuh/17_nag96f.jpg).

