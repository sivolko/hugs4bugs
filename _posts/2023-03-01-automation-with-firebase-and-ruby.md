---
title: Automate Firebase hosting with Github Actions and Ruby.
date: 2023-03-01 00:00:00 Z
category: automation
tags:
- webApps
- jekyll
- developer
- troubleshooter Club
layout: post
subtitle: set up CI/CD pipeline
description: Atomatically  deploy your webapps with Github actions and firebase hosting
  with Jekyll templates
image: https://images.pexels.com/photos/4506940/pexels-photo-4506940.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1
optimized_image: https://images.pexels.com/photos/4506940/pexels-photo-4506940.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1
author: Shubhendu Shubham
comment: true
---

Before start, let's understand why do I need this ? Since I have been working on my blog and deploying it over firebase and again pushing them back to github for version control and keeping source code hosted  to reduce the chance of deletion from my location system , which is very common to me! Being a lazy and troubleshooter guy I planned to reduce my workload , and minimalise them. That's how journey of CI/CD starts. 
```

# USE CASE:-

1. Setup firebase hosting 
2. Integrate hosting with Github Repository 
3. Setup Workflow inside project for github actions with firebase token permission 
4. Setup auto mere PR for main branch with all dependecies check. 

```

**Expected Result**

- For every successful PR Merge , github action jobs should trigger and it automatically deploy over firebase hosting project id.

Here I have been using Ruby VS 2.7.4, since my blog is based on Jekyll open source template.

**Why Firebase?**

- Since it's spark plan viz free meets my all requirements for blog .
- Easy sign up just gmail 
- Provides fully managed hosting services for static, dynamic with microservices.
- Backed  by SSD storage and Global CDN with free built in SSL. 

**STEPS**

I already have github repo with branch:main configured so skipping step 0 , in case if you don't have then make a github repo with any branch (name it as per ur requirement)and connect it with local codebase.

*  Firebase Hosting Setup

```
firebase init hosting
```
Hosting with Github 

In case firebase hosting is already initiated, then run below command 
```
firebase init hosting:github
```

*  Create a service account in firebase project with hosting permission.

![service account](https://res.cloudinary.com/hugs4bugs/image/upload/v1685742542/hugs4bugs/fb_hbqkvi.png)

*  Encrypts that service account's JSON key and uploads it to the specified GitHub repository as a GitHub secret.

Now inside local codebase .github/workflows folder will be automatically created. 

* Setup two files 

![githubflows](https://res.cloudinary.com/hugs4bugs/image/upload/v1685742554/hugs4bugs/fb3_f9rp6p.png)

**Code for hosting-merge.yml**

```
name: Deploy to Firebase Hosting on merge
'on':
  push:
    branches:
      - main
jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: 'sudo gem install bundler && sudo bundle install && bundle exec jekyll build '
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT_SHUBHENDU_SHUBHAM }}'
          channelId: live
          projectId: shubhendu-shubham //replace it with your project ID

```          

**Code for hosting-pull-request.yml**

```
name: Deploy to Firebase Hosting on PR
'on': pull_request
jobs:
  build_and_preview:
    if: '${{ github.event.pull_request.head.repo.full_name == github.repository }}'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: 'bundle install && bundle exec jekyll build '
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT_SHUBHENDU_SHUBHAM }}'
          projectId: shubhendu-shubham
```

* Here we'll be deploying over ubuntu OS , verison -latest

* Since my blog template is Ruby based so,need to provide commands for run viz 

```
sudo gem install bundler && sudo bundle install && bundle exec jekyll build


```

**Explanation** : 

1. Since we have fresh installation of jobs , so neet to install first bundler by running gem isntaller bundler with sudo permission.

2. second command sudo bundle install will install all the project dependencies inside the ubuntu . 
3. bundle exec jekyll build command will build our webapp under public folder called _site. 
4. Since inside firebase hosting we already have set _site as public folder.


**Jobs in Action** :- 

As soon as you push your code to the main branch automatically github actions will trigger and it will deploy your production ready webapp.

![Deploay action](https://res.cloudinary.com/hugs4bugs/image/upload/v1685744200/hugs4bugs/image_2023-05-31_00-43-18_fgivev.png)


Finally I don't need to worry about  this command , after every github push.

```
firebase deploy 
```

Our task become easy with CI/CD setup. Thanks for reading !