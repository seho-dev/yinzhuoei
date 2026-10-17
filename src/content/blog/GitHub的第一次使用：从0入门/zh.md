---
title: "GitHub的第一次使用：从0入门"
description: "hello，好久不见！博客很久没更新了，一直在忙新东西。Vue 第一个项目完成了，收获了不少开发经验。今天来教大家玩 GitHub，如果你是程序员或者在校学生，没听过 git 或 GitHub，看完这篇就动手搭建自己的代码仓库吧！ GitHub 是什么 Git…"
date: 2018-10-13
lang: zh
translationKey: "2018-10-13_55_GitHub的第一次使用：从0入门"
categories:
  - "唠嗑"
views: 5804
draft: false
---

hello，好久不见！博客很久没更新了，一直在忙新东西。Vue 第一个项目完成了，收获了不少开发经验。今天来教大家玩 GitHub，如果你是程序员或者在校学生，没听过 git 或 GitHub，看完这篇就动手搭建自己的代码仓库吧！

**GitHub 是什么**

GitHub 是 git 环境提供的代码托管仓库。可以在官网下载别人的开源项目学习，也可以把自己写的代码分享出去。

**第一步：安装 git**

去百度下载安装包，一直点 next 就好了。安装成功就成功一半了。

**第二步：注册 GitHub，创建仓库**

打开 GitHub 官网，注册账号，创建一个自己的仓库。

![QQ截图20181013225006.png](https://www.yinzhuoei.com/usr/uploads/2018/10/1039008600.png)

**第三步：获取上传地址**

创建完成后，页面会提供两种上传方式：HTTP 和 SSH，选 HTTP。

![博客图片](https://upload-images.jianshu.io/upload_images/2915863-9a3e49176b6892fc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w=1240)

**第四步：本地操作**

在本地选择一个项目文件夹，右键点击 "Git Bash here"，弹出命令窗口，执行以下操作：

![QQ截图20181013225540.png](https://www.yinzhuoei.com/usr/uploads/2018/10/2316958222.png)

1. 初始化项目：`git init`
2. 添加文件到队列：`git add .`（点不能漏）
3. 写提交描述：`git commit -m "描述"`
4. 关联仓库：`git remote add origin 你的仓库地址`
5. 推送到 GitHub：`git push -u origin master`

按提示输入 GitHub 用户名和密码，等待提交成功就行。

**第五步：完成**

刷新 GitHub 页面，就能看到自己的代码了！
