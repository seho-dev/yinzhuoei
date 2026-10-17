---
title: "Using GitHub for the First Time: A Beginner's Guide"
description: "Hello, long time no see! I have not updated the blog in a while because I have been busy learning new things. I finished my first Vue project and gained plenty of development experience. Today, let's get started with GitHub. If you are a programmer or student who has never heard of Git or GitHub, read on and then set up your own code repository! What Is GitHub? GitHub…"
date: 2018-10-13
lang: en
translationKey: "2018-10-13_55_GitHub的第一次使用：从0入门"
categories:
  - "Life"
views: 5804
draft: false
---

Hello, long time no see! I have not updated the blog in a while because I have been busy learning new things. I finished my first Vue project and gained plenty of development experience along the way. Today, let's get started with GitHub. If you are a programmer or student who has never heard of Git or GitHub, read on and then try setting up your own code repository!

**What Is GitHub?**

GitHub is a code-hosting platform built around Git repositories. You can download other people's open-source projects to learn from them, or share code you have written yourself.

**Step 1: Install Git**

Search Baidu for the installer, download it, and keep clicking Next. Once it is installed successfully, you are halfway there.

**Step 2: Sign Up for GitHub and Create a Repository**

Visit the GitHub website, register an account, and create your own repository.

![Screenshot 20181013225006.png](https://www.yinzhuoei.com/usr/uploads/2018/10/1039008600.png)

**Step 3: Get the Remote URL**

After creating the repository, the page provides two ways to upload your code: HTTP and SSH. Choose HTTP.

![Blog image](https://upload-images.jianshu.io/upload_images/2915863-9a3e49176b6892fc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w=1240)

**Step 4: Work Locally**

Choose a local project folder, right-click, and select "Git Bash here." In the command window that opens, do the following:

![Screenshot 20181013225540.png](https://www.yinzhuoei.com/usr/uploads/2018/10/2316958222.png)

1. Initialize the project: `git init`
2. Stage the files: `git add .` (do not forget the dot).
3. Write a commit message: `git commit -m "description"`
4. Connect the repository: `git remote add origin your-repository-url`
5. Push to GitHub: `git push -u origin master`

Enter your GitHub username and password when prompted, then wait for the push to complete.

**Step 5: Done**

Refresh the GitHub page, and your code should be there!
