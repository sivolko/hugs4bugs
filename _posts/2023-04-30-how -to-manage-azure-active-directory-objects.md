---
title: How to create & Manage users and Groups within Azure AD.
date: 2023-04-30 00:00:00 Z
categories:
- azure
tags:
- azure
- active directory
- developer
- cloud
layout: post
subtitle: Az Active Directory Objects
description: Atomatically  deploy your webapps with Github actions and firebase hosting
  with Jekyll templates
image: https://images.pexels.com/photos/7238759/pexels-photo-7238759.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1
optimized_image: https://images.pexels.com/photos/7238759/pexels-photo-7238759.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1
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

![Users Permission](https://res.cloudinary.com/hugs4bugs/image/upload/v1687726491/Azure/az104/11_gpljsd.jpg)


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

**Device Management**

To meet with the security and compliance standard, we can configure Device based conditional access form Azure AD.

Steps:

1) Signin to [Azure Portal](https://portal.azure.com)
2) Go to Azure Active Directory and select Devices option 

![Devices](https://res.cloudinary.com/hugs4bugs/image/upload/v1687726881/Azure/az104/12_waeypt.jpg)

3) Select Device settings from the left-hand menu and let's configure following settings:-

![settings](https://res.cloudinary.com/hugs4bugs/image/upload/v1687727020/Azure/az104/13_yw7zxx.jpg)

For the best security use case make sure enable MFA.

After all settings are done click on the save.

To check all user logs, click on the audit logs 

![audit logs](https://res.cloudinary.com/hugs4bugs/image/upload/v1687727341/Azure/az104/14_ghcsgb.jpg)

**Managing Guest Users**

Here comes the Azure AD B2B in the role,it is a feature in azure that allows org to connect and work safely with external users.

- External users don't require a microsoft work and personal account that has been added to an existing Azure AD tenant.

![External User](https://res.cloudinary.com/hugs4bugs/image/upload/v1687727773/Azure/az104/15_lk6nzr.jpg)

![Guest](https://res.cloudinary.com/hugs4bugs/image/upload/v1687728114/Azure/az104/16_ktn4bp.jpg)

Feel free to select users role from assignment tab and be causious too., since it's external guest user permission. You don't wanna share critical resources with others.

![Guest Access](https://res.cloudinary.com/hugs4bugs/image/upload/v1687728223/Azure/az104/17_jud2cv.jpg)

If you put original guest user email . you will get a mail like this 

![email](https://res.cloudinary.com/hugs4bugs/image/upload/v1687729482/Azure/az104/18_mz0hiy.jpg)

After Accepting invitation, it'll ask for MFA(Multifactor Authenticato App) Registration .

![MFA](https://res.cloudinary.com/hugs4bugs/image/upload/v1687729803/Azure/az104/19_bjwc2n.jpg)

After 1st successful signin 

![Success](https://res.cloudinary.com/hugs4bugs/image/upload/v1687730030/Azure/az104/20_ykiv9h.jpg)

**SSPR**

SSPR stands for the self-service password Reset. It allows users to reset password by ownself, which reduces the dependencies on admins.

*in free Azure AD only cloud users only password change is supported not password reset*

Steps:

1) Visit Azure Active Directory
2) Select password reset from the Azure AD overview blade from left hamburger menu.

![password reset](https://res.cloudinary.com/hugs4bugs/image/upload/v1687730422/Azure/az104/21_q810ey.jpg)


3) In the Password reset overview blade, you can enable SSPR for all your users, by selecting All, or for selected users and groups, by selecting Selected.

Make a slection of methods available to users for password reset.

Click save.

Thanks for Reading, Keep learning keep Troubleshooting together!