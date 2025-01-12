---
layout: post
title: Effortless Wazuh v4.10.0 upgrade using Docker
subtitle: Let's do it
description: In this section we'll see how effortlessly we can upgrade wazuh from v4.9.0 to v10.0  using docker in kali linux
image: https://benheater.com/content/images/size/w1050/2022/06/wazuh_logo_circle-1.png
optimized_image: https://benheater.com/content/images/size/w1050/2022/06/wazuh_logo_circle-1.png
author: Shubhendu Shubham
date: 2025-01-12 00:00:00 Z
category: security
tags:
- Cyber Security
- SOC
---
Upgrading your wazuh docker deployment to the latest version ensures you benift from the latest features, security patches and performance improvements.I have been using Wazuh docker deployment using single-node for my home lab so in this guide, I'll walk through the process of upgrading wazuh from version 4.9.0 to v4.10.0 using docker. 

Before upgrading, let's ask this question why to upgrade wazuh to v4.10.0?

1. Enhanced Security: New Security patches & upgrades
2. Improved Performance: Better resource management and faster processing
3. New Features: Access to the latest tool, Yara rules and functions

**Prerequisities**
  - Docker and Docker compose installed in your system
  - Existing wazuh 4.9.0 deployment docker image or git repo 

**Step-by-step Upgrade Process**

Step1: Backup your Data

before starting the upgrade,it's crucial to backup your existing data to prevent any loss .

```
docker compose down

```
step2: Download the latest Wazuh Docker compose files 

Navigate to your wazuh Docker directory and pull the latest version 

```
cd /path/to/your/wazuh-docker
git fetch --all --tags
git checkout v4.10.0
```
![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1736704594/hugs4bugs/wazuh/update4.10_txppqb.png)

step3: if you have custom configurations, ensure they are comptaible with the new version,

step4: Start the New Wazuh version 

```
docker compose up -d 
```

![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1736704750/hugs4bugs/wazuh/restarting_udi5xl.png)

![iamge](https://res.cloudinary.com/hugs4bugs/image/upload/v1736704761/hugs4bugs/wazuh/started_qhvcne.png)

Step5: Post-upgrade checks
 * verify all services are running correctly 
 *  check logs for any errors or warnings 

```
docker-compose logs 
```
**What's New in Wazuh 4.10?**
Release Date: January 9, 2025

**Highlights:**

- Enhanced Debugging: Debug symbols are now generated during builds for macOS, Linux, and Windows.

- Standardized Logging: A logger has been introduced to standardize logs for cloud integration modules.

- Microsoft Intune Integration: Allows Wazuh to retrieve audit logs from managed devices.

- Vulnerability Evaluation Status: New field to indicate whether a vulnerability is under evaluation or disputed.

- Dashboard UI Improvements: Redesigned key sections for better user experience.

- Reworked SCA Policies: Updated policies for various operating systems.

**Key Features**

| Feature                      | Description                                                                 |
|------------------------------|-----------------------------------------------------------------------------|
| Debug Symbols Generation     | Debug symbols are now generated during builds for macOS, Linux, and Windows.|
| Standardized Logging         | A logger has been introduced to standardize logs for cloud integration modules.|
| Microsoft Intune Integration | Integration with Microsoft Intune allows Wazuh to retrieve audit logs from managed devices.|
| Vulnerability Evaluation Status | New field to indicate whether a vulnerability is under evaluation or disputed.|
| Dashboard UI Improvements    | Redesigned key sections of the Wazuh dashboard for better user experience.   |
| Reworked SCA Policies        | Updated policies for various operating systems.                             |

**Detailed Changes**:
Wazuh Manager:

- Added self-recovery mechanism for rocksDB databases.

- Improved logging for indexer connector monitoring class.

- Added generation of debug symbols.

- Improved Vulnerability Scanner performance by optimizing the PEP440 version matcher, version matcher object creation, and global data handling.

Wazuh Agent:

- Added generation of debug symbols.

- Changed how the AWS module handles non-existent regions.

- Enhanced Wazuh macOS agent installation instructions.

- Enhanced Windows agent signing procedure.

- Enhanced security by preventing unauthorized uninstallation of the Wazuh agent on Linux endpoints.

- Enhanced integration with Microsoft Intune MDM to pull audit logs for security alert generation.

- Updated rootcheck old signatures.

- Prevented agent termination during package upgrades in containers by removing redundant kill commands.

- Fixed handle leak in FIM’s realtime mode on Windows.

- Fixed errors on AIX 7.2 by adapting the blibpath variable.

- Sanitized agent paths to prevent issues with parent folder references.

- Fixed an issue in the DEB package that prevented the agent from restarting after an upgrade.

- Improved file path handling in agent communications to avoid references to parent folders.

- Set RPM package vendor to UNKNOWN_VALUE when the value is missing.

- Updated Solaris package generation to use the correct wazuh-packages reference.

For deatiled upgrade changes follow [official Link](https://documentation.wazuh.com/current/release-notes/release-4-10-0.html)