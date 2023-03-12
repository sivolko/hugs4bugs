---
title: "Managing and Storing Secrets:Azure Vault.\U0001F646"
date: 2021-08-02 23:04:08 Z
categories:
- azure
tags:
- networking
- security
layout: post
subtitle: Hiding:The Secrets
description: This is fundamental blog of how to manage and store secrets like certificates,
  passwords using Azure vault .
image: https://images.unsplash.com/photo-1550439062-609e1531270e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80
optimized_image: https://images.unsplash.com/photo-1550439062-609e1531270e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80
author: Shubhendu Shubham
---

As we deploy our production to the cloud, we need to be very consious about the sensitive informations eg:- passwords,encryption keys and certificates, which needs to be available to function. Apart from authorised use case, one should take care for **unauthorised** access.

Hence, comes the **Azure Key Vault**

**What is Azure key vault**?

Azure Key Vault is a centrilized cloud service for securely storing and accessing secrets.Hold on what does _Secret_ means? it could be anythings that one want to tightly control access to eg- API keys, passwords, certificates.

Key value services supports 2 types of containers:-

1.  **Vaults** : Support storing software and HSM-backed keys,secrets and certificates.
2.  **Managed Hardware Security Modules (HSM) pool** : Only supports _HSM-backed_ keys.

**Features of Azure Vault** :-

1. **Manage Secrets**

   Azure Vault is used to store and tightly control access to tokens, passwords, certificates, API keys etc.

2. **Manage Encryption Key** :-

   It can be used as a key management solution, key vault makes it easier to create and control the encryption keys that are used to encrypt your data.

3. **Manage SSL/TLS certificates** :-

   Key vault enables you to provide,manage and deploy your public and private Secure Sockets layer/Transport Layer Security (SSL/TLS) certificates for both our Azure resources and your internal resources.

4. **Store secrets backed by hardware security modules (HSMs)** :-

   These secrets and keys can be protected either by software or by FIPS 140-2 level 2 validated HSMs.

**Benifits of Azure Key Vault** :-

1. Centralized application secrets

2. Securely stored secrets and keys

3. Access monitoring and Access control

4. Simplified administration of Application secrets

5. Integration with other Azure services

**Hands on**

Let's learn how to add password to Azure Key Vault. Password falls under the category of _sesitive information_

Ways to add secrets to and read secrets from Key Vault.

1. Using Azure Portal
2. Azure CLI
3. Azure Powershell

**Azure CLI** is a way to work with Azure resources from the command line or from scripts.

**Cloud Shell** is a browser-based shell experience to manage and develop Azure resources.An interactive shell that runs in the cloud.

**Creating a Key Vault** :-

Steps :-

- Go to the Azure portal.

![Azure Portal](/assets/img/a/01.jpg)

- Select Create a resource under Azure services. This Create a resource pane appears.

![Azure Resource ](/assets/img/a/one.jpg)

- In the search bar, enter key vault,and then select _Key Vault_ from the results.This will appear Key Vault pane.

![Search Key vault](/assets/img/a/2.jpg)

- Click on the _Create_ and fill these following details. Don't forget to replace NNN with a series of numbers.This helps ensure that the name of your key vault is **Unique**.

<style type="text/css">
.tg  {border-collapse:collapse;border-color:#9ABAD9;border-spacing:0;}
.tg td{background-color:#EBF5FF;border-color:#9ABAD9;border-style:solid;border-width:1px;color:#444;
  font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{background-color:#409cff;border-color:#9ABAD9;border-style:solid;border-width:1px;color:#fff;
  font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-0lax{text-align:left;vertical-align:top}
</style>
<table class="tg">
<thead>
  <tr>
    <th class="tg-0lax"><span style="font-weight:bold;color:#000">Settings</span></th>
    <th class="tg-0lax"><span style="font-weight:bold;color:#000">Value</span></th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-0lax">Project Details</td>
    <td class="tg-0lax"></td>
  </tr>
  <tr>
    <td class="tg-0lax">Subscription</td>
    <td class="tg-0lax">Concierge Subscription</td>
  </tr>
  <tr>
    <td class="tg-0lax">Resource group</td>
    <td class="tg-0lax">[sandbox resource group name]</td>
  </tr>
  <tr>
    <td class="tg-0lax">Instance details</td>
    <td class="tg-0lax"></td>
  </tr>
  <tr>
    <td class="tg-0lax">Key vault name</td>
    <td class="tg-0lax">my-keyvault-NNN where NNN is a unique identifier</td>
  </tr>
</tbody>
</table>

![details Key vault ](/assets/img/a/3.jpg)

![details key vault ](/assets/img/a/4.jpg)

![key vault ](/assets/img/a/5.jpg)

- Select **Review + Create** and after passing validation,select Create.Wait for deployment to successfully complete.

- Select _Go to resource_

![details](/assets/img/a/6.jpg)

![details](/assets/img/a/7.jpg)

![details](/assets/img/a/8.jpg)

here, will appear some details about your key vault eg, Vault URI field shows the URI that your application can use to access your vault from the REST API.

![details](/assets/img/a/9.jpg)

- As an optional step, on the left menu pane,under _Settings_, examine some of the other features.

**Adding a password to the key vault**

- On the left menu pane,under _Settings_,select **Secrets**. The Secrets pane for your key vault appears.

![Secrets](/assets/img/a/11.jpg)

- From the top menu bar, select **Generate/Import**.The Create a secret pane appears.

![Secrets](/assets/img/a/10.jpg)
![Secrets](/assets/img/a/12.jpg)

Fill these details accordingly :-

<style type="text/css">
.tg  {border-collapse:collapse;border-color:#9ABAD9;border-spacing:0;}
.tg td{background-color:#EBF5FF;border-color:#9ABAD9;border-style:solid;border-width:1px;color:#444;
  font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{background-color:#409cff;border-color:#9ABAD9;border-style:solid;border-width:1px;color:#fff;
  font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-0lax{text-align:left;vertical-align:top}
</style>
<table class="tg">
<thead>
  <tr>
    <th class="tg-0lax"><span style="font-weight:bold;color:#000">Settings</span></th>
    <th class="tg-0lax"><span style="font-weight:bold;color:#000">Value</span></th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-0lax">Upload Options</td>
    <td class="tg-0lax">Manual</td>
  </tr>
  <tr>
    <td class="tg-0lax">Name</td>
    <td class="tg-0lax">MyPassword</td>
  </tr>
  <tr>
    <td class="tg-0lax">Value</td>
    <td class="tg-0lax">hVFkk96</td>
  </tr>
</tbody>
</table>

Accept the remaining settings at their default values.Notice that you can specify properties such as the activation date and the expiration date.You can also disable access to the secret.

- Select **Create**

**Showing the Password**

There are the 2 ways to access password from the Key Vault i.e

1. from Azure portal
2. Azure CLI

Being a linux distro user and Die hard fan of CLI, here I am gonna use Azure CLI to fetch password from Azure vault.

- Run **Cloud Shell**
- az keyvault secret show \
  --name MyPassword \
  --vault-name <my-keyvault-NNN> \
  --query value \
  --output tsv

**<my-keyvault-NNN>** replace this with your here for eg my case it's _my-keyvault-0402_

![password](/assets/img/a/13.jpg)

**Output** :-

**hVFkk96**

**JSON View**

![Resource JSON](/assets/img/a/14.jpg)

**Cleaning Up**

The sandbox automatically cleans up your resources when you're finished with this module.

When you're working in your own subscription, it's a good idea at the end of a project to identify whether you still need the resources you created. Resources left running can cost you money. You can delete resources individually or delete the resource group to delete the entire set of resources.
