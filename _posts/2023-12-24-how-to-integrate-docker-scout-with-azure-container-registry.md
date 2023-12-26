---
layout: post
title: How to integrate Docker Scout with Azure Container Registry
subtitle: Container Security
description: This blog is about how to integrate docker scout with ACR(Azure Container Registry)
image: https://res.cloudinary.com/hugs4bugs/image/upload/v1703441731/hugs4bugs/01-primary-blue-docker-logo_rl8tst.png
optimized_image: https://res.cloudinary.com/hugs4bugs/image/upload/v1703441731/hugs4bugs/01-primary-blue-docker-logo_rl8tst.png
author: Shubhendu Shubham
date: 2023-12-24 00:00:00 Z
category: security
tags:
- Cyber Security
- Container
---
Before starting, let's understand what exactly is **Docker Scout**? 
Docker Scout is a container image scanning tool built within Docker Desktop as well as CLI with mindset of Shift-Left approach.It lies on the top of the Docker ecosystem and helps developers to find container image vulnerabilities at the time of image build,thus helps organisation to ship secure entire supply chain.Now one might be confused is that Docker-Scout another CNAPP tool? As per [official documentation](https://docs.docker.com/scout/),it uses SBOM(Software Bill of Material) with 17+ advisory Databases to analyze and scan images with real time CVEs updates.

Now let's see how we can integrate with [Azure Container Registry](https://learn.microsoft.com/en-us/azure/container-registry/) to scan real time image.

*ACR+DockerScout is in Early Access phase at the time of writing this blog*

**Infra Prerequisites**:

1. [Active Azure Subscription](https://azure.microsoft.com/en-in/free/search/?ef_id=_k_72add33a00b31d31c1e2b6b27ce9063c_k_&OCID=AIDcmmf1elj9v5_SEM__k_72add33a00b31d31c1e2b6b27ce9063c_k_&msclkid=72add33a00b31d31c1e2b6b27ce9063c)

2. Resource Group (Make sure region of resource group should match with ACR region and ACR region integration is not available for all region so refer official docs)

3. ACR (Azure Container Registry)
4. Event Grid with System Topic Deployed
5. Event Hub Namespace 
6. Inside ACR,enable Token from Repository Permission Blade
7. Docker Hub account, if you don't have [create New one](https://hub.docker.com/)
8. [Docker socut](https://scout.docker.com/org/sivolko/settings/integrations) logged in with Docker hub account
9. Locally Docker Installed, if using Laptop CLI

**LAB**
In this lab I have taken [OWASP Juice Shop App](https://github.com/juice-shop/juice-shop) as container image to scan with Docker Scout.

## Azure Container Registry(Azure portal)

* Go to Azure Portal and search for container Registry and create one.Just for testing I have allowed all public network access to registry from Networking blade,but in the production use private N/W
![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1703497968/hugs4bugs/dockerscout/IMG_6067_ppa5qu.jpg)

* After successful ACR creation, you'll get unique login server
![Image](https://res.cloudinary.com/hugs4bugs/image/upload/v1703498280/hugs4bugs/dockerscout/IMG_6068_qsp5ox.jpg)

* Now create a registry token from Repository permission blade,this token will be required during Docker Scout configuration. If you are using ARM template provided by Docker to deploy ACR then you can skip this step.
![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1703498504/hugs4bugs/dockerscout/IMG_6069_chqn26.jpg)

* Now grab the container image of OWASP Juice APP, using docker pull command or else feel free to use own custom image.

```
  docker pull bkimminich/juice-shop
```
* Now Run this Image locally 

```
docker run --rm -p 3000:3000 -d bkimminich/juice-shop 
```
You will see OWASP Juice Shop application can be accessible over port 3000. This is vulnerable application provided by OWASP for pentesting.

![Local APp](https://res.cloudinary.com/hugs4bugs/image/upload/v1703499102/hugs4bugs/dockerscout/jshop_sk06vw.jpg)

* Now tag this image and push it to ACR using following command 

```
 docker tag bkimminich/juice-shop dockerscoutshubhendu.azurecr.io/owasp:v1
```
Replace  my loginserver with yours.

* Push it to ACR 

```
 docker push dockerscoutshubhendu.azurecr.io/owasp:v1
```
![Image](https://res.cloudinary.com/hugs4bugs/image/upload/v1703499593/hugs4bugs/dockerscout/dscoutpushed_hitsil.png)

Confirm from Azure portal Repositories blade
![Image](https://res.cloudinary.com/hugs4bugs/image/upload/v1703499718/hugs4bugs/dockerscout/IMG_6070_uq9wsw.jpg)

Now let's integrate ACR with SCOUT for Vulnerability scan 
# Docker Scout Integration 

* Visit [Docker Scout Dashboard](https://scout.docker.com/org/sivolko/settings/integrations), and Login with docker account and select Azure Container Registry Option 

![Image](https://res.cloudinary.com/hugs4bugs/image/upload/v1703500085/hugs4bugs/dockerscout/dsss_fg7afa.jpg)

* Now Enter Registry Name,which is nothing but your login server from ACR, copy paste same

![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1703500217/hugs4bugs/dockerscout/regname_ngknme.jpg)

after that, you will get ARM template to deploy, basically this ARM template will deploy a Event Grid system topic from Azure Service Events and Registry token .

![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1703500699/hugs4bugs/dockerscout/azureee_q2nde4.jpg)

Make sure to deploy Docker Scout resources to the same resource group as the registry.Then review and create.
After successful deployment go to your ACR--> Tokens from Repository Permission blade and copy token, then generate password. You can set password expiration date too. But remember to copy and save password locally, once window is close same password can't be retrived. You need to regenerate.

![Image](https://res.cloudinary.com/hugs4bugs/image/upload/v1703501159/hugs4bugs/dockerscout/IMG_6071_jqu7is.jpg)

Copy the same Token/password put into Docker Scout Registry Token blade and click on enable integration.

![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1703501288/hugs4bugs/dockerscout/rtt_tk7vne.jpg)

After 5 min, status on Docker Scout will change to connected

![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1703501479/hugs4bugs/dockerscout/conn_b6ko3u.jpg)
Now to start SCAN,select Image and activate Scan Analysis
![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1703501839/hugs4bugs/dockerscout/scan_vmw4mx.jpg)
![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1703501840/hugs4bugs/dockerscout/scanactive_jp38jf.jpg)

Jump over image blade,there our ACR image is scanned with list of vulnerabilities.
![Image](https://res.cloudinary.com/hugs4bugs/image/upload/v1703501597/hugs4bugs/dockerscout/dscoutvlnreport_yclmts.jpg)

Jump over Vulnerabilites blade for more details 
![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1703501772/hugs4bugs/dockerscout/dscoutvlncve_u7trma.jpg)

To mitigate vulnerabilities, jump to patch blade and follow the patch released by specific vendor.
![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1703502034/hugs4bugs/dockerscout/dscoutpath_tvzbfg.jpg)

We can check all centralised details from overview blade too.
![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1703502220/hugs4bugs/dockerscout/ov_gzscav.jpg)

and we can deploy our own custom policies from Ploicies blade to set rules.

Thanks for reading blog, keep troubleshooting!