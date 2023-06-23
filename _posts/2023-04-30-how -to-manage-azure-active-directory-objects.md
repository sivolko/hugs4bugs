---
layout: post
title: How to create & Manage users and Groups within Azure AD.
subtitle: Az Active Directory Objects
description: Atomatically  deploy your webapps with Github actions and firebase hosting with Jekyll templates
image: https://images.pexels.com/photos/3201761/pexels-photo-3201761.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1
optimized_image: https://images.pexels.com/photos/3201761/pexels-photo-3201761.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1
category: azure
tags:
  - azure
  - active directory
  - developer
  - cloud
author: Shubhendu Shubham
comment: true
toc: true
---

In this blog,let's learn how to create and manage users & group their properties within Azure AD.

*Disclaimer* :- I'm not gonna cover Azure AD's AU (Administrative Units)

**Prerequisits** :- 

 * Azure Account 
 * Global Administrator Privilege
 * Basic Knowledge of Azure service

Q. Before start let's understand What Azure AD offers? or What is Azure AD?

A. 
   * Directory and Identity management solution within the cloud  
   * Provides Traditional username & password Identity Managemet 
   * Role based permission management
   * Multifactor authentication (Enterprise solution)
   * Application monitoring solution and alerting
   * Can be integrated with on-prem AD

If you are interested into Azure AD licencing and cost, kindly visit official doc :-

[Azure AD licencing](https://www.microsoft.com/nl-nl/security/business/identity-access-management/azure-ad-pricing?rtc=1&market=nl)

**Create users in Azure AD via portal**

steps:- 

1) Visit [Azure portal](https://portal.azure.com)


![Image](https://res.cloudinary.com/hugs4bugs/image/upload/v1687535386/Azure/az104/1_ijkwsk.jpg)

2) Select Azure Active Directory from left hand hamburger menu or directly search in search box

![Az AD Directory](https://res.cloudinary.com/hugs4bugs/image/upload/v1687535627/Azure/az104/2_b4bvym.jpg)

3) Click on users, then select all Users

![users](https://res.cloudinary.com/hugs4bugs/image/upload/v1687535966/Azure/az104/3_miyxtr.jpg)

4) Now We have to create a few demo users with different privileges,here I'm gonna create 3 users as 
 - user1
 - user2
 - user3

![new user](https://res.cloudinary.com/hugs4bugs/image/upload/v1687536583/Azure/az104/4_vmwzm2.jpg)

5) I am using my own custom domain [hugs4bugs](https://hugs4bugs.me), but feel free to use deafult 

![Usercreation Page](https://res.cloudinary.com/hugs4bugs/image/upload/v1687538927/Azure/az104/5_rq9uzk.jpg)

6) Fill the second tab info as per your choice and feel free to skips non mandatory things too.
I have filled details as follow :-
```
 * First Name : user
 * Last Name : 1
 * user type: member
 * job title: az admin (here this user gonna have global admin privilege)
 * company : hugs4bugs (optional)
 * departement: IT (optional)
 * employee id: 001 (optional)
 * contact info : skipped 
 * parental control : skipped 
 * settings: usage location : India
```
![Properties](https://res.cloudinary.com/hugs4bugs/image/upload/v1687539645/Azure/az104/6_c87kus.jpg)

Leave as default or blank Assignments tab 

7) Click on Review and Create button and repeate same steps for user2 & user3

![user creation](https://res.cloudinary.com/hugs4bugs/image/upload/v1687540040/Azure/az104/7_fhlywu.jpg)

8) After successful user creation , notification will popup .

![notification](https://res.cloudinary.com/hugs4bugs/image/upload/v1687540045/Azure/az104/8_pszz3x.jpg)

**Groups : Azure AD**

Before jumping to the Azure AD Groups, let's understand the types of groups and their functionality.

![Image](https://res.cloudinary.com/hugs4bugs/image/upload/v1687549467/Azure/az104/9_ancsen.jpg)
```
* Security Group :- As same as on prem Group
                   used to secure Objects within the Azure AD 

* Microsoft 365 Group :- Provides group of people access to a collection of shared resources eg:- shared mailbox, calendar,.
Not just limited to Azure AD
```
Security Groups provides 3 types of memberships:-

1. Assigned :- Manually assign user to a group
2. Dynamic user:- Define parameter, to auto assign users to a group like people with same job Title can be groupped together
3. Dynamic Devices:- Define parameters to auto group devices, eg:- All devices with same OS can be assigned to the same group

**Create Assigned Group via Azure Portal**

* Follow the previous steps to get into azure active Directory from [azure portal](https://portal.azure.com) and select Group from the left hamburger menu.

if you have premium P1 licence feel free to create Dynamic user group.

![Assigned Group](https://res.cloudinary.com/hugs4bugs/image/upload/v1687555597/Azure/az104/10_oizkdd.jpg)

**Managing User and Group Properties**

So, we have successfully created users,Groups in previous steps now what and how can configure for an azure AD user account.

**For Users**
List:- 

1. Profile: 
2. Assigned Roles
3. Administrative Units
4. Groups
5. Applications
6. Licences
7. Devices
8. Azure Role Assignments 
9. Authentication Methods

**For Groups**

List:-

1. Overview
2. Properties
3. Members
4. Owners
5. Administrative units
6. Group Memberships
7. Applications
8. Licenses
9. Azure Role Assignments
10. Dynamic Membership Rules
