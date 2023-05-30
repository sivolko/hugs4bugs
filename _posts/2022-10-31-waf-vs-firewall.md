---
title: WAF vs Firewall
date: 2022-10-31 00:00:00 Z
category: security
tags:
- cloud
- security
- hacking
- offensive security
- troubleshooter Club
layout: post
subtitle: We both are not same bruhh .
description: This is the series of cloud security . Anyone can learn this series,
  start exploring and learn cloud security.
image: https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1
optimized_image: https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1
author: Shubhendu Shubham
comment: false

---

Before start differences, let's understand the WAF. WAF stands for the **Web Application Firewall** that operates as application firewall for the HTTPS applications. It implements set of rules for a HTTP conversation and due to these rules, WAF prevents from XSS (Cross site scripting) and SQL injections.

WAF is more focused on **Web Applications** .A WAF is a firewall primarily used for protecting applications, APIs to Webhooks, providing protection by assessing what the traffic is trying to do and blocking it if necessary, especially if the actions in the traffic are deemed malicious.

General view of WAF

![WAF](https://firewallauthority.com/wp-content/uploads/2022/02/WAF.png)

Let's look at the **OSI** model for the both WAF and Firewall

![OSI](https://cybersecuritykings.com/wp-content/uploads/2020/06/osi4-768x378.jpg?ezimgfmt=ng:webp/ngcb1)

Now it's time for the tabular comparison

<style type="text/css">
.tg  {border-collapse:collapse;border-color:#9ABAD9;border-spacing:0;}
.tg td{background-color:#EBF5FF;border-color:#9ABAD9;border-style:solid;border-width:1px;color:#444;
  font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{background-color:#409cff;border-color:#9ABAD9;border-style:solid;border-width:1px;color:#fff;
  font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-hmp3{background-color:#D2E4FC;text-align:left;vertical-align:top}
.tg .tg-0lax{text-align:left;vertical-align:top}
</style>
<table class="tg">
<thead>
  <tr>
    <th class="tg-0lax"></th>
    <th class="tg-0lax"><span style="font-weight:bold;color:#000">WAF</span></th>
    <th class="tg-0lax"><span style="font-weight:bold;color:#000">Firewall</span></th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-0lax">OSI Layer </td>
    <td class="tg-hmp3">Layer 3 to 7</td>
    <td class="tg-0lax">Layer 3 to 4</td>
  </tr>
  <tr>
    <td class="tg-0lax">Deployment Architecture</td>
    <td class="tg-hmp3">Reverse Proxy</td>
    <td class="tg-0lax">Layer 3 Gateway</td>
  </tr>
  <tr>
    <td class="tg-0lax">Access Control Granularity </td>
    <td class="tg-hmp3">Port, protolcol, IP Address</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">Port, protolcol, IP Address</span></td>
  </tr>
  <tr>
    <td class="tg-0lax">Threat Detection , Prevention Technique </td>
    <td class="tg-hmp3">Signatures, Protocol Anomaly Detection, App-specific Anomaly Detection </td>
    <td class="tg-0lax">NA</td>
  </tr>
  <tr>
    <td class="tg-0lax">Protocol Coverage </td>
    <td class="tg-hmp3">Web-centric: HTTP(s), XML, SOAP,SPDY</td>
    <td class="tg-0lax">Any</td>
  </tr>
  <tr>
    <td class="tg-0lax">DDos Protection </td>
    <td class="tg-hmp3">Application Layer</td>
    <td class="tg-0lax">N/w layer (Basics)</td>
  </tr>
  <tr>
    <td class="tg-0lax">Web Application Protection </td>
    <td class="tg-hmp3">Extensive, Including full Application Layer coverage</td>
    <td class="tg-0lax">Minimal</td>
  </tr>
  <tr>
    <td class="tg-0lax">SSL</td>
    <td class="tg-hmp3">Yes</td>
    <td class="tg-0lax">NA</td>
  </tr>
</tbody>
</table>

**Key Point Takeaways** :-

- Network Firewall operates at the 3rd and 4th layers of OSI Layer Architecture, while WAF operates at the 3rd through 7th layers of OSI Layer Architecture.

- Network firewall uses Layer 3 gateway deployment architecture. In addition, WAF uses reverse proxy deployment architecture.

- WAF and Network Firewall both have the same Access control granularity, Port, Protocol and IP address.

- Network Firewall does not have any Threat detection/prevention methods. However, WAF has Signatures, Protocol anomaly detectors, and app-specific anomaly detection tools.

- A Network firewall covers all protocol types, while WAF covers Web-centric protocols such as HTTP(s), XML and SOAP.

- Network Firewall provides DDoS protection for Network Layer while WAF offers it for the Application Layer.

- Network Firewalls offer minimal protection for Web applications, while WAF provides extensive protection that includes full application layer coverage.

**Benefits of WAF**

- Prevents attacks
- WAFs enforces compliance
- Stops customer data from being compromised
- Saves Resources

Keep learning, Keep **Troubleshooting** !
