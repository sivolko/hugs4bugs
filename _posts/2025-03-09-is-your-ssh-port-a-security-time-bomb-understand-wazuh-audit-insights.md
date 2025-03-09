---
layout: post
title: Is Your SSH Port a Security Time Bomb? Understanding Wazuh Audit Insights
subtitle:  "Fix Your SSH Port Before It's Too Late"
description: Learn how default SSH configurations, such as using port 22, can expose your system to security risks. This blog dives into Wazuh audit insights and provides actionable steps to strengthen your Unix-based system's defenses. Stay ahead of attackers with smarter configurations!
# image: https://res.cloudinary.com/hugs4bugs/image/upload/v1735990558/hugs4bugs/MFA/profile_u7ic2x.jpg
optimized_image: https://res.cloudinary.com/hugs4bugs/image/upload/v1735990558/hugs4bugs/MFA/profile_u7ic2x.jpg
author: Shubhendu Shubham
date: 2025-03-9 0:0:00 Z
category: security
tags:
- Cyber Security
- wazuh
- soc
---

![mage](https://res.cloudinary.com/hugs4bugs/image/upload/v1741543902/hugs4bugs/wazuh_yg5dwh.jpg)

When it comes to system security, even small misconfigurations can open the door to cyberattacks. Tools like Wazuh, a Security Information and Event Management (SIEM) platform, help users perform audits to evaluate their system's security posture. In this blog, we’ll walk you through understanding audit results and share actionable steps to secure your Unix-based system.

**Understanding Wazuh System Audit Scores**

A Wazuh audit generates a report that divides checks into three categories:

- Passed: Checks that meet security standards.

- Failed: Checks that require attention to improve security.

- Not Applicable: Checks that don’t apply to your current system setup.

For example, here’s what a typical result looks like:

1. Passed Checks: 3

2. Failed Checks: 13

3. Not Applicable Checks: 7

**Overall Score: 18%**

My audit score (in this case, 18%) reflects the percentage of security checks your system passed. Higher scores mean better security compliance. A low score like this highlights potential vulnerabilities.

**Identifying Issues: A Closer Look**

One example from a Wazuh audit might flag this issue: "SSH Hardening: Port should not be 22." Let’s break it down:

![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1741545552/hugs4bugs/controls_wtzyq0.jpg)

**What’s wrong?** By default, SSH (Secure Shell) listens on port 22, which is commonly targeted by automated bots and attackers. Keeping this default configuration increases your risk of brute-force attacks or port scans.

**Why does it matter?** Changing the SSH port to something other than 22 adds an extra layer of security. It won’t completely stop determined attackers, but it can reduce the chances of opportunistic attacks by bots.

**How do you fix it?** Modify the SSH configuration file (/etc/ssh/sshd_config) and change the Port 22 line to a non-default port (e.g., 2222). After saving the changes, restart the SSH service to apply the update.

**Preventive Steps to Improve Audit Scores**

1. Harden Your SSH Settings
  - Change the default SSH port.
  - Disable root login by setting PermitRootLogin no in the SSH config file.
  - Use SSH key-based authentication instead of passwords.
  - Implement two-factor authentication (2FA).
2. Manage File Permissions
- Use commands like chmod and chown to set restrictive file permissions.

- Regularly audit sensitive files to prevent unauthorized access.

3. Apply Security Updates
  - Always keep your operating system and software up to date. Updates often include patches for vulnerabilities.

4. Enforce Strong Password Policies
  - Use tools like PAM to enforce complex passwords and periodic changes.

5. Firewall and Network Security
  - Use a firewall (iptables or ufw) to block unauthorized access.

  - Restrict network services to only what is essential.

6. Monitor Logs
   - Continuously monitor system logs for suspicious activities using tools like journalctl.

7. Run Regular Audits
  - Perform routine checks with Wazuh or other tools to identify and fix new vulnerabilities.


![alt text](https://res.cloudinary.com/hugs4bugs/image/upload/v1741546358/hugs4bugs/www_irv7on.png)

**Steps to Change the SSH Port**

Edit the SSH Configuration File:

**Open the SSH configuration file in a text editor**:

```
bash
sudo nano /etc/ssh/sshd_config
Locate the line that says #Port 22. If it’s commented out (with a #), remove the # to uncomment it.
```

**Change the value from 22 to 222**:

```
bash
Port 222
Update Firewall Rules:
```
**Allow the new port (222) in your firewall to ensure SSH connections are not blocked**:
```
bash
sudo ufw allow 222/tcp
```

If you’re using iptables, add a rule for the new port:
```
bash
sudo iptables -A INPUT -p tcp --dport 222 -j ACCEPT

```

Restart the SSH Service:

Apply the changes by restarting the SSH daemon:

```
bash
sudo systemctl restart sshd
Test the New Port:
``` 
Before logging out, test the new port to ensure it works:
```
bash
ssh -p 222 username@your_server_ip
Replace username with your actual username and your_server_ip with your system’s IP address.
```
Disable the Old Port (Optional):

Once you confirm the new port works, you can block the old port (22) in your firewall:
```
bash
sudo ufw deny 22/tcp

```
