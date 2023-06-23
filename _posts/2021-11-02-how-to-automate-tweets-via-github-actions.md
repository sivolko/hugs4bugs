---
title: Automate Twitter via github Actions.
date: 2021-11-02 23:04:08 Z
categories:
- automation
tags:
- Automation
- CI/CD
- GitHub Actions
layout: post
subtitle: because why not!
description: How you ever seen add to home screen or install popup on .
image: https://images.pexels.com/photos/5744251/pexels-photo-5744251.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940
optimized_image: https://images.pexels.com/photos/5744251/pexels-photo-5744251.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940
author: Shubhendu Shubham
paginate: true
---

We are used to the way we work, but we are also used to the way we work.Hahahah, Sounds confusing, right? I know, but it is not.Lemme explain.

We are used to tweet via either twitter webApps or Native apps.But hold on, in the era of Devops where every things reliable on CI/CD, then why not automate our twitter too.

We gonna call this **Twitter-Together**

basically twitter-together is a [**Github Action**](https://github.com/features/actions)
that utilizes text files to publish tweets from a GitHub repository. Rather than tweeting directly, GitHub’s pull request review process encourages more collaboration, Twitter activity and editorial contributions by enabling everyone to submit tweet drafts to a project.

**Setups**

1. Create a twitter app with your shared twitter account and store the credentials as _TWITTER_API_KEY_, _TWITTER_API_SECRET_KEY_, _TWITTER_ACCESS_TOKEN_ and _TWITTER_ACCESS_TOKEN_SECRET_ in your repository’s secrets settings.

2. Create a github workflow _.yml_ file with the following contents:

```
on: [push, pull_request]
name: Twitter, together!
jobs:
  preview:
    name: Preview
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - uses: gr2m/twitter-together@v1.x
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  tweet:
    name: Tweet
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - name: checkout main
        uses: actions/checkout@v2
      - name: Tweet
        uses: gr2m/twitter-together@v1.x
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          TWITTER_ACCESS_TOKEN: ${{ secrets.TWITTER_ACCESS_TOKEN }}
          TWITTER_ACCESS_TOKEN_SECRET: ${{ secrets.TWITTER_ACCESS_TOKEN_SECRET }}
          TWITTER_API_KEY: ${{ secrets.TWITTER_API_KEY }}
          TWITTER_API_SECRET_KEY: ${{ secrets.TWITTER_API_SECRET_KEY }}

```

3. After creating or updating .github/workflows/twitter-together.yml in your repository’s default branch, a pull request will be created with further instructions.

Now see the magic!

No wait, what about logic ?

chillax!

Here comes it:-

**How It Works**

Twitter-together is using two workflows

1. _push_ event to publish new tweets
2. _pull_request_ event to validate and preview new tweets

**The Push Events**

When triggered by the push event, the script looks for added \*.tweet files in the tweets/ folder or subfolders. If there are any, a tweet for each added tweet file is published.

If there is no tweets/ subfolder, the script opens a pull request creating the folder with further instructions.

**The Pull Request Events**

For the pull_request event, the script handles only opened and synchronize actions. It looks for new \*.tweet files in the tweets/ folder or subfolders. If there are any, the length of each tweet is validated. If one is too long, a failed check run with an explanation is created. If all tweets are valid, a check run with a preview of all tweets is created.

What else?

![Whatelse](https://media3.giphy.com/media/VeB9ieebylsaN5Jw8p/giphy.gif?cid=790b761136d0babf66050b3c838edbb51605f8eccbb2b2f2&rid=giphy.gif&ct=g)

Nothing else.

![Nothing](https://media1.giphy.com/media/KBW6GETG4ydgHa9nPc/200w.webp?cid=ecf05e47bts7tyfingval61ivqvnuxwwomh6o3ntfyf20jsb&rid=200w.webp&ct=g)
