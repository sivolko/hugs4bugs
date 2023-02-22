---
date: 2020-01-12 12:26:40
layout: post
title: How to install JENKINS on Linux ?
subtitle: Learn Jenkins and it's installation
description: what is jenkins and how to install in our system.How to use it in our project
image: https://www.jenkins.io/images/logos/needs-you/Jenkins_Needs_You-02.png
optimized_image: https://www.jenkins.io/images/logos/needs-you/Jenkins_Needs_You-02.png
category: devops
tags:
  - devops
  - jenkins
  - linux
author: Shubhendu Shubham
---

# What is Jenkins?

Jenkins is an open source automation tool written in Java with plugins built for Continuous Integration purpose. Jenkins is used to build and test your software projects continuously making it easier for developers to integrate changes to the project, and making it easier for users to obtain a fresh build. It also allows you to continuously deliver your software by integrating with a large number of testing and deployment technologies.

It is a server-based system that runs in servlet containers such as Apache Tomcat

## How To Install it ?

Here,I am using my own Linux (Debian) machine and Long Term Support (LTS) Jenkins 2.222.3.

1. It can be installed from the [debian-stable apt repository](https://pkg.jenkins.io/debian-stable/).

```code

 wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
 sudo sh -c 'echo deb https://pkg.jenkins.io/debian-stable binary/ > \
    /etc/apt/sources.list.d/jenkins.list'
 sudo apt-get update
 sudo apt-get install jenkins

```

![Project file](/assets/images/L/j1.png "Jenkins-Debian")

**Else we can visit Jenkins Debian packages page manually**

![Project file](https://miro.medium.com/max/700/1*RUD24xZmgjGC45VN5Gnbcw.png " Jenkins-Debian")

# Commands used for the Jenkins Services

**Starting Jenkins**

```Start

    $ sudo systemctl start jenkins.service

```

**Stopping Jenkins**

```Stop

  $ sudo systemctl stop jenkins.service

```

**Restarting Jenkins**

```Restart

 $ sudo systemctl restart jenkins.service

```

## Unlock Jenkins Default Password

![Project file](https://miro.medium.com/max/700/1*L8zupPGGMyXAbgTqsjhriQ.png " Jenkins-Default Password")

To unlock default password, go to the mentioned path **(/var/lib/jenkins/secrets/initialAdminPassword )**using terminal

![Project file](https://miro.medium.com/max/700/1*s0xvEPW-xXqPm6FH4Q8J4A.png "Default password Location")

## Copy and paste password

![Project file](https://miro.medium.com/max/700/1*woGo-Nwt1gbjWJQkCnnf2Q.png "Default password Login")

## Select Install suggested plugins or else choose according to your preference.

![Project file](https://miro.medium.com/max/700/1*CA19i2Jd_qHt_C12goC71A.png "Jenkins Plugins")

## Getting started

![Project file](https://miro.medium.com/max/700/1*0KwhXrtI6getkWCyqsxRKg.png "Jenkins Start")

![Project file](https://miro.medium.com/max/700/1*Yrx6JenLK9COm7LohDImGA.png "Jenkins Set Up")

## Admin Setup

![Project file](https://miro.medium.com/max/700/1*bbopPt67YMDXroZFduvWVQ.png "First page")

## By default Jenkins runs on port 8080 but feel free to change it according to use cases.

![Project file](https://miro.medium.com/max/700/1*A5roj3JXRal4wI6rGFQ-lg.png "localhost8080")

## Ready to use

![Project file](https://miro.medium.com/max/700/1*5MBn3hzjQPcQJm2JodZ-aQ.png "Jenkins setup finished
")

## Jenkins Home

![Project file](https://miro.medium.com/max/700/1*gCU7NcZtzVcZv8hW4yo_3A.png "Jenkins Home console
")
