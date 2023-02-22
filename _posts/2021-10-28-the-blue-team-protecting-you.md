---
date: 2021-08-2 23:04:08
layout: post
title: The Blue Team.☠️
subtitle: Proceting You.
description: >- 
 In cybersecurity, we have our own form of tackel box. We have our own versions of wiggly things.Let's learn few of the frameworks,tools and term from the cybersecurity together.
image: https://cdn.pixabay.com/photo/2017/11/19/23/56/hacking-2964100_960_720.jpg
optimized_image: https://cdn.pixabay.com/photo/2017/11/19/23/56/hacking-2964100_960_720.jpg
category: security
tags:
  - networking
  - security
author: Shubhendu Shubham
---

Before I start telling fancy stories of CyberSecurity, let me explain a few common used terms,so that whenever I use these words,one have clear picturisation of the terminology.Too many times in the many years, I've been in IT, I have seen people forget these basics terms.So, let's start.....


**Fundamental Networking and Security Tools**

1. Ping 
2. IPConfig 
3. NSLookUp
4. Tracert
5. NetStat
6. Putty


**Ping**

Ping =  Packet InterNet Groper 

Ping is a networking utility,used to test whether a host is *alive* on an Internet Protocol (IP) network.A host could be a computer or other device that is connected to a network.Ping measure the time it takes for a message sent from one host to reach another and echo back to the original host.

Ping send an *Internet Control Message Protocol (ICMP)* echo request to the target and wait for a reply.This'll report problems, trip time,and packet loss if the asset has a heartbeat means (alive).
If the assest is not online, one'll get back an ICMP error.

**TTL** = Time to Live

I am gonna use *CLI* to check the Ping, I would suggest you to use CLI on matter what's your OS.

![ping](https://res.cloudinary.com/hugs4bugs/image/upload/v1632785557/Security/ping_htyxpa.png)

Above image shows a running ping on a windows Operating System sending request to [Google](www.google.com) using both IPv4 and IPv6.

There are more granular *ping* commands.If one type ping along with an option or switch, you can troubleshoot issuses that might be occuring in your network.

| Option | Meaning |
| /?     |    List command syntax option |
| -t     | Pings the specified host until stopped with Ctrl +C. ping -t is also known as *ping of death*, can be used as a denial-of-service (DoS) attack to cause a target machine to crash |
| -a     | Resolves address to hostname if possible |
| -n  count   | How many echo requests to send from 1 to 4.2 billion. (In windows OS 4,is the default) |
| -r count | Records route for count hops(IPv4 only).The maximum is 9, so if one need more that 9,*tracert* might work better |
| -s count | Timestamp for count hops (IPv4 only) |
| -i TTL | Time to live, maximum is 255 |


Traditional name of  **127.0.0.1** is **Loopback address**

It's interesting to know that one could ping yourself using loopback address. If you test this on your system and If it doesn't return an appropriate response, you know the problem is with the your system, not the network,ISP,or target URL.

![Ping yoursel](https://res.cloudinary.com/hugs4bugs/image/upload/v1632787173/Security/ping1_hqis0f.png)

2. IPConfig

Internet Protocol is a set of rules that govern how data is sent over the Internet or another network.This routing function essentially creates the Internet we know and love.\

IP has the function of tacking packets from the source host and delivering them to the proper destination host based solely on the IP addresses in a packet.The data-gram that is being sent has two parts :

**1.Header** : contains the information needed to get the information where it should go.
**2.Payload** : the stuff we want the other host to have

Open terminal and type *ifconfig* for Linux and Mac and for Windows *ipconfig*

![ifconfig](https://res.cloudinary.com/hugs4bugs/image/upload/v1632788653/Security/ifconfig_eoxvbh.png)

Let me remind you two more acronyms DHCP and DNS .

*DHCP* Dynamic Host Configuration Protocol.

**Dynamic** : Ever-changing,fuild

**Host** : Asset on a network

**Configuration** : How the asset is supposed to work

**Protocol** : Rules that allow two more assets to talk

DHCP is a network management tool, that dynamically assigns a IP address to a host on a network that lets it talk to other hosts.

In our day-to-day life a **router or gateway** can be used to act as a DHCP server.Most residential routers will get their unique public IP address from their ISP.

If your machine is using DHCP,you must have noticied *ipconfig /all or ifconfig /all* command how long your lease was? If you are not leasing, then you are using a static IP address.


**Commands to get new IP address**

* ipconfig /release : releases all IPv4 address
* ipconfig /renew   : This retrieves a new IP address,which may take a few moments.
* ipconfig /displaydns : This may scroll for a while because this is a record of all the domain names and thier IP address you have visited on a host.
* ipconfig /flushdns : if your start encountering HTML 404 error codes, you may need to flush your cache clean.This will force host to query name-servers for the latest and greatest information.


**DNS** = Domain Name System.

This is a naming system for all hosts that are connected to the Internet or your private netowork.
DNS remember domain names and It'll store this data in something called "Cache" *pronounced "cash"* nothing else.

This is done to speed up subsequent requests to the same host.Sometimes DNS cache can get all wonky-sometimes by accidently or intentionally (by hacker).

**Cache poisoning** = DNS Spoofing

is an attack where a mailcious party corrupt the DNS cache or table, causing the nameserver to return an incorrect IP address and network traffic to be diverted.

**3 NSLookup** 
The main use of NSLookup is to help with any DNS issues you may have.You can use it to find the IP address of a host,find the domain name of an IP address, or find mail servers on a domain.This tool can be used in an interactive and non interactive mode.

 Open terminal and use command:

 nslookup www.example.com

![NSLookup](https://res.cloudinary.com/hugs4bugs/image/upload/v1632816793/Security/nslookup_o4cpsl.png)


To find the specific types of assets, use command 

**nslookup -querytype=mx www.example.com**

you'll see the result of using query-type=mx

instead of using -querytype=mx, you can use any of the following:

| HINFO | Specifies a computer's CPU and type of Operating system |
| UNIFO | Specifies the user information  |
| MB    | Specifies a mailbox domain name |
| MG    | Specifies an email group member |
| MX    | Specifies the email server      | 

**4 Teracert**

Teracert is a cool diiagnostic utility which determines the route the message takes from one place to another by using ICMP echo packets sent to the destination.

ICMP is one of the Internet's original protocals used by network devices to send operational information or error messages.ICMP is not usually used to send data b/w computers, with the exception of *ping* and *traceroute*. It is used to report errors in the processing of datagrams.

Each router along the path subtracts the packets TTL value by 1 and forwards the packet,giving you the time and the intermediate routers between you and the destinations.Tracert will print the terace of the packet's travels.

Open a terminal and type *tracert 8.8.8.8*

if you try tracert -d 8.8.4.4
 this is another public Google DNS server,but now tracert will not try to resolve DNS while counting the hops.

**NetStat** = Network Statistics

NetStat is a network utility tool that displays networking  connection (both incoming and outgoing ),routing tables and some other details such as protocols statistics.

The output from the **netstat** command is used to display the current state of all the connections on the device.This is an important part of configuration and troubleshooting.NetStat also has many parameters to choose from to answer the questions presented in the previous paragraph.

commands showing netstat in below photo:- 

![Netstat](https://res.cloudinary.com/hugs4bugs/image/upload/v1632831737/Security/Screenshot_at_2021-09-28_17-47-41_jsagla.png)

let's understand it as  **we have 65,536 windows and doors** in our network ranging from 0 to 65,535. Computer starts counting at 0.

"Network admins are constantly yelling,"shut the windows and close the doors-you're letting the data out! "".

Ports can be TCP or UDP,but always remember TCP means there is a connection made between the host and and the destination. UDP doesn't doesn't worry about whether there is a connection made. Both TCP and UDP have **65,535** ports available to them. This was the highest number that could be represented by a 16-bit or 2-byte, number.Mathematically this is represented by 2^16 - 1