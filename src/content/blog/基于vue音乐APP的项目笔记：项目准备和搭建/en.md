---
title: "Vue Music App Project Notes: Preparation and Setup"
description: "Starting with this project, I will share notes on selected pieces of well-crafted code for future reference. This time, we are building a mobile music app with fastclick, Stylus and its loader, babel-polyfill, and babel-runtime."
date: 2018-10-21
lang: en
translationKey: "2018-10-21_56_基于vue音乐APP的项目笔记：项目准备和搭建"
categories:
  - "Frontend"
views: 7388
draft: false
---

![Download.jpg](https://www.yinzhuoei.com/usr/uploads/2018/10/1574702599.jpg)

Starting with this project, I will share notes on selected pieces of well-crafted code so I can revisit them later.

**Project Preparation**

Once again, this is a mobile web project: a music app. We need to bring in the following:

- fastclick
- CSS compiler: Stylus and its loader
- babel-polyfill
- babel-runtime

**Project Directory Structure**

```
api      // Store data API-related js
assets
base     // Store reusable components
common   // Store shared CSS and JS resources
components
router
store    // vuex store
```

This project has quite a lot of CSS, so all shared styles will be stored in `.styl` files.

That is all for the setup.
