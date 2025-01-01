---
layout: post
title: Wazuh's Big Move:From Elasticsearch to OpenSearch 
subtitle: Why it matters? 
description: Enhance your security operations with wazuh for real time threat detection and complicane using open source SIEM wazuh using docker with kali. 
image: https://res.cloudinary.com/hugs4bugs/image/upload/v1735713838/IMG_5316_vrb0rb.jpg
optimized_image: https://res.cloudinary.com/hugs4bugs/image/upload/v1735713838/IMG_5316_vrb0rb.jpg
author: Shubhendu Shubham
date: 2025-01-01 00:00:00 Z
category: security
tags:
- Cyber Security
- SIEM
- blueteam
- soc 
---
Before, we jump to our topic let's recall what wazuh is? It's a popular open source security monitoring platfrom . It's HIDS aka host based intrusion Detection system. HIDs a Host-based Intrusion Detection System monitors and analyzes the internals of a computing system rather than the network packets on its external interfaces. It focuses on detecting unauthorized access and malicious activities on individual hosts or devices.

Wazuh has shifted to opensearch from elasticsearch since version4.3 and current version is 4.9.2 . So let's break down why it happened and how cybersecurity professional get benifited. 

1. **Licensing Issues**

 - Initially, Elasticsearch was a favorite among many open-source projects because it was licensed under Apache 2.0. This license is very permissive, allowing anyone to use, modify, and distribute the software freely.

 - However, Elasticsearch’s parent company, Elastic, decided to change the license to SSPL (Server Side Public License). This new license is more restrictive, especially for cloud service providers. It imposes additional rules on how the software can be used, which made it less attractive for open-source projects like Wazuh.

2.**OpenSearch** 

 - In response to these changes, OpenSearch was created. OpenSearch is a fork of Elasticsearch, meaning it started as a copy of Elasticsearch’s code but has since developed independently.

 - OpenSearch remains under the Apache 2.0 license, which is much more open and friendly for community-driven projects. This means that anyone can continue to use, modify, and share OpenSearch without worrying about the restrictive terms of SSPL.

 - OpenSearch, on the other hand, is a community-driven project. This means it actively encourages contributions from a wide range of developers and organizations. The community-driven approach fosters innovation and ensures that the project evolves based on the needs and inputs of its users.

 - Wazuh wanted to be part of this vibrant and collaborative community. By aligning with OpenSearch, Wazuh can benefit from the collective expertise and contributions of the broader open-source community.

3.**Features and Compatibility**
 
Elasticsearch:

- Despite the licensing changes, Elasticsearch still offers a robust set of features. However, the restrictive license made it less appealing for open-source projects that rely on community contributions and open development

- For Wazuh, continuing with Elasticsearch under the new license would have meant dealing with potential legal and operational complexities

**OpenSearch**

- OpenSearch offers similar features to Elasticsearch, making it a viable alternative. This similarity ensures that Wazuh users can transition to OpenSearch without losing any critical functionality

- Wazuh has even developed its own version of OpenSearch to ensure full compatibility and to leverage the active development and improvements made by the OpenSearch community.

**How Security Practitioners can be benified?**

1. Freedom to integrate 3rd party tools 
2. Licensing Freedom 
3. Improved Security Monitoring
4. Simplified Management 
5. Community Contributions. 
6. Future Proofing 

**Conclusion** 

For Security researchers, wazuh's move to openSearch means greater freedom, enhanced collaboration and access to a robust community driven platform. 

