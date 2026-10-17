---
title: "基于vue音乐APP的项目笔记：项目准备和搭建"
description: "从这次项目开始，我会挑选比较精致的代码来分享笔记，方便日后复习。 项目准备 这次依旧是一个移动端页面，做音乐 App。需要引入这些东西： - fastclick - CSS 编译器：stylus 和驱动加载器 - babel-polyfill - babel-…"
date: 2018-10-21
lang: zh
translationKey: "2018-10-21_56_基于vue音乐APP的项目笔记：项目准备和搭建"
categories:
  - "前端"
views: 7388
draft: false
---

![下载.jpg](https://www.yinzhuoei.com/usr/uploads/2018/10/1574702599.jpg)

从这次项目开始，我会挑选比较精致的代码来分享笔记，方便日后复习。

**项目准备**

这次依旧是一个移动端页面，做音乐 App。需要引入这些东西：

- fastclick
- CSS 编译器：stylus 和驱动加载器
- babel-polyfill
- babel-runtime

**项目目录结构**

```
api      // 存放数据接口相关的 js
assets
base     // 存放封装的组件
common   // 存放公共 CSS 和 JS 资源
components
router
store    // vuex 仓库
```

这次项目 CSS 比较多，公用样式库都选择用 styl 来存储。

准备工作就这些。
