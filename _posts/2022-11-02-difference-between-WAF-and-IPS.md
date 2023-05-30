---
title: WAF vs IPS
date: 2022-11-02 00:00:00 Z
category: cloud
tags:
- cloud
- security
- hacking
- offensive security
- troubleshooter Club
layout: post
subtitle: Are you still confused?
description: What is the difference between WAF and IPS system and why do we need
  both?
image: https://images.pexels.com/photos/5473298/pexels-photo-5473298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1
optimized_image: https://images.pexels.com/photos/5473298/pexels-photo-5473298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1
author: Shubhendu Shubham
comment: false

---

Before we start, you must be confused or there might be a question in your mind "why do we need so many things as security?" We do have firewalls, Antivirus though .

Lemme explain this situation in simpler use case. Suppose you have plan for long road trip for a week with your family and you have decided to leave home at early morning to avoid city traffic . You set alarm, and leave home as early as you can . While boarding to car, you **locked your main gate, but in rush you have forgotten to close balcony french window, back gates**.

This is the same situation when a **network administrator knows that this would be like locking the front door of our house but leaving all the windows and the back door open. Now that the attacks occur in different “layers” in the network protocols, for which we need different defense systems for each type of traffic**

I hope you got your confusion away.Now let's jump over main point What's difference between Web Application Firewall(WAF) and Intrusion Prevention System (IPS)

**WAF**

In WAF all request-response i.e nothing but HTTP request is analyzed before reaching to the WebApps or users.That's why WAF is a solution (hardware or software) that works as an intermediary between external users and web applications. And WAF have a set of predefined or manual rules, which help WAF to perform HTTP traffic monitoring and Analysis to prevent malicious HTTP requests like XSS(Cross site Scripting )DOS, DDOS, SQL injection etc.

**Once the WAF detects a threat, it blocks the traffic and rejects the malicious web request or response with sensitive data.**

Requirements for WAF :-

- SSL Acceleration
- DPI (Deep Packet Inspection)
- High-performance and high-throughput
- High-availability
- Scalability

**IPS**

Intrusion Prevention System (IPS) is a more general-purpose protection appliance or software. It provides protection from traffic from a wide variety of protocol types, such as DNS, SMTP, TELNET, RDP, SSH, and FTP among others.

General Methods used in IPS (Intrusion Prevention System) are :-

- Signature-based detection
- Policy-based detection
- Detection based on anomalies
- Honey Pot Detection

1. IPS uses signature-based detection just as an antivirus does. A firm can recognize a threat and send an alert to the administrator. For this method to work correctly, all signatures must be with the latest update.

2. IPS requires that security policies be declared very specifically. The IPS recognizes the traffic that is outside of these policies and automatically rejects abnormal behavior or unusual traffic.

3. The IPS automatically performs statistical analysis and establishes a comparison standard. When the traffic moves too far from this standard, it sends out an alert. The other way is by manually setting the normal behavior of the traffic so that alerts are sent when the traffic, again, moves away from this rule. The disadvantage of the manual way is that being less flexible and dynamic, it can send **false alerts**.

**Why Do You Need A WAF And IPS Security Solution?**

An IPS accompanies a WAF solution and is typically deployed together. WAF deployments protect web application traffic, while IPS deployments scan and protect the network level by inspecting all packets. An IPS is typically used to protect your network from threats in most network protocols, and it works at OSI Layer 4-7. WAF solutions are mainly used to protect applications at the OSI layer-7 level.

Tabular Comparison between WAF & IPS :-

<style type="text/css">
.tg  {border-collapse:collapse;border-color:#9ABAD9;border-spacing:0;}
.tg td{background-color:#EBF5FF;border-color:#9ABAD9;border-style:solid;border-width:1px;color:#444;
  font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{background-color:#409cff;border-color:#9ABAD9;border-style:solid;border-width:1px;color:#fff;
  font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-phtq{background-color:#D2E4FC;border-color:inherit;text-align:left;vertical-align:top}
.tg .tg-0pky{border-color:inherit;text-align:left;vertical-align:top}
</style>
<table class="tg">
<thead>
  <tr>
    <th class="tg-0pky"></th>
    <th class="tg-0pky"><span style="font-weight:bold;color:#000">WAF</span></th>
    <th class="tg-0pky"><span style="font-weight:bold;color:#000">IPS</span></th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-0pky"><span style="font-weight:400;font-style:normal">Network placement</span></td>
    <td class="tg-phtq"><span style="font-weight:400;font-style:normal">Placed at the front of websites / web application</span></td>
    <td class="tg-0pky"><span style="font-weight:400;font-style:normal">Behind the firewall either as in-line or out-of-band.</span><br></td>
  </tr>
  <tr>
    <td class="tg-0pky"><span style="font-weight:400;font-style:normal">Main Purpose </span></td>
    <td class="tg-phtq">Dedicated to inspect only HTTP web traffic and protect against web specific attacks<br></td>
    <td class="tg-0pky">Dedicated to inspect all network packets to match them against signatures of known malicious attacks. Then, traffic is either blocked or an alarm is issued.<br></td>
  </tr>
  <tr>
    <td class="tg-0pky">Protection </td>
    <td class="tg-phtq">SQL injection, Cross Site Scripting, GET/POST attacks, session manipulation attacks, javascript, LFI/RFI etc<br></td>
    <td class="tg-0pky">Exploits against services such as webservers, SMTP, RDP, DNS, windows OS, Linux OS etc.<br></td>
  </tr>
</tbody>
</table>

Thanks for reading! keep Learning, Keep **Troubleshooting**
