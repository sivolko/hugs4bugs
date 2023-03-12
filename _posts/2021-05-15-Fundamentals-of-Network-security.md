---
title: Fundamentals of Network Security.☠️
date: 2021-05-15 23:04:08 Z
categories:
- networking
tags:
- networking
- security
layout: post
subtitle: Network Security 101.
description: 'This is fundamental blog of network security 101 with role as an azure
  developer,solution architect,administrator requires knowledge of the foundations
  of networking. '
image: https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=750&q=80
optimized_image: https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=750&q=80
author: Shubhendu Shubham
---

Either one is taking role as an azure developer,solution architech or administrator, all requires basic of the foundation of the networking.

In this blog, we'll learn the client-server network model, difference b/w authentication and authorization, firewall types and many more related topics.

# Network Clients

According to traditionnal sense, a network client is a lightweight computer/device that can't run program on its own.But now-a-days the client has transformed from a simple terminal which can represent any hardware or software system that interects with services made available on a server.

## Types of clients:- 

**Client** | **Local storage** | **Local CPU** |
Thick      | Yes               | Yes           |
Hybrid     | No                | Yes           |
Thin       | No                | No            |

**Thick** :- It is also known as workstation,that can process and store data locally without using a server.The client's interaction with a server is minimal and might only be to store data on a shared netowork drive.

**Hybrid** :- This is a combination of both thick and thin clients.A hybrid client can do limited local data processing but has no local storage capability.These device renders content and stores the result on the server as same as the automated rating system.

**Thin** :- Historically thin client was a terminal. A thin client can't process or store data locally.It depends upon the server to provide computaional power and storage.In modern era thin clients are represented by web Applications that request and display information from server regardless of the device they're running on.

## Servers

In layman word server is an array of switches,routers,load balancers and firewalls which usually runs on server software eg:- windows Server 2019, Linux Server.A server's main task is to provide services and resources to its clients. The larger the number of applications and users, the more the server is dedicated to specific purposes.

A server's hardware is usually a high-end computer with dozens of CPUs or cores, and vast amounts of memory.A server supports multiple clients, and a client can connect to and use the services from multiple servers.

Eg:- Application can use

    media server :- displays images & Sound
    Database server :- to pull data to display


**Server Model**

All client-server models are identified on the basis of how the client and server software communicates and how the server shares data and resources with clients.

    Types of Server Model

    1. Request-response
    2. Peer-to-peer
    3. Publish-subscribe

1. Request-response:- In request-response model,the client sends arequest to the server and  server carries out an activity and sends back a response. The response is either the result of a request or an acknowledgment.

2. Peer-to-peer:- In this model, every network device attached to the network is both a client and a server. Each client can request services (for example files) from any other device on the network and vice versa. P2P is an unstructured network suited for ad hoc usage.

3.Publish-subscribe:-  This model is a messaging pattern, where clients subscribe to a service on the server. When a server receives a new message, it sends a response to each client that has subscribed. An RSS feed is a typical publish-subscribe type of client-server, where the user subscribes to the RSS feed. When new items appear, the user is automatically notified.

   Types of Server

   1. Application Server
   2. Computing Server
   3. Database Server
   4. Files
   5. Game
   6. Mail
   7. Media 
   8. Print
   9. Web

Server      | Purpose | Clients |   
Application | Hosts an application,which can be run through a web browser or customized client software | Any network device with access.
Computing   | Makes available CPU and memory to the client. This type of server might be a supercomputer or mainframe. | Any networked computer that requires more CPU power and RAM to complete an activity.
Database   | Any networked computer that requires more CPU power and RAM to complete an activity | Any form of software that requires access to structured data.
File       | Makes available shared files and folders across a network | Any client that needs access to shared resources.
Game       | Provisions a multiplayer game environment. | Personal computers, tablets, smartphones, or game consoles.
Mail       | Hosts your email and makes it available across the network. | User of email applications.
Media      | Enables media streaming of digital video or audio over a network. | Web and mobile applications.
Print      | Shares printers over a network. | Any device that needs to print.
Web        | Hosts webpages either on the internet or on private internal networks. | Any device with a browser.