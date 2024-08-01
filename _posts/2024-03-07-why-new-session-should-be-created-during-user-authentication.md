---
layout: post
title: Why new session should be created during user authentication? 
subtitle: Security POV
description: In this section we'll see importance of session cookies, browsers request handling and security authentication 
image: https://cdn.pixabay.com/photo/2019/04/29/09/33/anonymous-4165613_1280.jpg
optimized_image: https://cdn.pixabay.com/photo/2019/04/29/09/33/anonymous-4165613_1280.jpg
author: Shubhendu Shubham
date: 2024-07-03 00:00:00 Z
category: security
tags:
- Cyber Security
- SAST
- Pentest
---
Let's Understand a few Terms before jumping to our main topic viz "Why do we need a new session for user authentication"?

**What's Session**?

In layman term session is the term used to refer to a user's time browsing a webpage.It identifies the users to the app after they have logged in an is valid for a period of time. It contians activities like Page rendering, events e.g like, share, comments in session storages.

A web session is the sequence of network HTTP request and response transcations associated with the same user.WebApps/Websites use sessions once user has authenticated .This ensure the ability to identify the user on any subsequent requests as well as being able to apply security access controls, authorised access to the user private data and to increase usability of App. That's why sessions can be used both pre and post authentication.

Since HTTP is a stateless protocol,which means each request and response pair is independent of other web interactions.

Now let's understand **Session Fixation** Here don't get confused session fixation with session Hijacking. In **Session Hijacking** steals the established session between the client and web server **after the user logs in** but in **Session Fixation** attack fixes an established session on the victim's browser so the attack starts before the user logs in . 

As per OWASP documentation 


Session Fixation is an attack that permits an attacker to hijack a valid user session. The attack explores a limitation in the way the web application manages the session ID, more specifically the vulnerable web application. When authenticating a user, it doesn’t assign a new session ID, making it possible to use an existent session ID. The attack consists of obtaining a valid session ID (e.g. by connecting to the application), inducing a user to authenticate himself with that session ID, and then hijacking the user-validated session by the knowledge of the used session ID. The attacker has to provide a legitimate Web application session ID and try to make the victim’s browser use it.

**Session Fixation Workflow**
