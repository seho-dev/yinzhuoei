---
title: "【大家一起学习vue源码】目录架构"
description: "我说我过年期间更新了3篇关于uniapp的文章，然后发布莫名消失，你们会信么？ 其实是真的，家里的网络非常不稳定，我连续发了2次文章，结果预览出来的效果仅仅只有一个自然段，剩余全部丢失，所以渐渐的我心态崩掉了，然后转眼就来到了4月，我仍然会每周坚持更新笔记/感…"
date: 2020-03-15
lang: zh
translationKey: "2020-03-15_177_【大家一起学习vue源码】目录架构"
categories:
  - "前端"
  - "唠嗑"
  - "精读"
views: 5327
draft: false
---

我说我过年期间更新了3篇关于uniapp的文章，然后发布莫名消失，你们会信么？

![timg.jpg](https://www.yinzhuoei.com/usr/uploads/2020/03/3729318075.jpg)

其实是真的，家里的网络非常不稳定，我连续发了2次文章，结果预览出来的效果仅仅只有一个自然段，剩余全部丢失，所以渐渐的我心态崩掉了，然后转眼就来到了4月，我仍然会每周坚持更新笔记/感悟，分享给大家。

这是一个全新的计划，关于分析vue的源码，那么我需要一个课程带着我学习，因为讲真，它有些门槛，像我第一次看底层源码，不知道从何看起，网上有太多的关于vue的实现，比如methods，computed实现，但是都太单一，所以我在youtube上找到课程，也是慕课网的金牌讲师ustbhuangyi

所以我会把这个课程参考的资料放到这个文章的顶部
[他的博客，vue源码资料](https://ustbhuangyi.github.io/vue-analysis/v2/prepare/)
[正版课程，请大家看完一定要去购买支持正版，虽然我没购买](https://coding.imooc.com/class/228.html)
[youtube免费课程，高清，可以翻墙免费看全集](https://www.youtube.com/watch?v=bg82rhdj0pI&list=PLMMJeBtTp27e4mY4iY_O8FxGXrB0Xkx-w&index=2)

---

这边配套的源码截止于目前文章发表的日期,版本是2.6.11，大家在学习vue源码的核心内容的时候，只要是2.0版本的最新的内容，基本上不会影响学习vue.js的灵魂。

---

首先来了解一下看到这个标题，这篇文章就简单的看一下vue的src源码中的目录分工，我们在写一般的vue工程时，也会分很多很多的文件进行模块化开发，这是大势所趋，比如api;common;util;components;assets;static;pages等等，那么在框架开发中，一般像我一样的初学者就很懵逼，所以我们一起来看看；

## compiler

这是vue.js编译相关的代码，它包括把vue模板编译成AST抽象语法树，一般情况下，编译会在构建时进行，因为是很耗费时长的，像webpack或者vue-loader这样的插件；

## core

这里的目录是vue.js的核心之处，我们所见到的2.0新特性的vdom，监听，状态，初始化，render等等都在这里

## platforms

我们一般常用的vue.js是在web端，那么vue.js也支持编译成供[weex](https://weex.apache.org/zh/)这样的运行在native上的框架
这个目录就是vue.js针对不同的平台而编译的入口

## server

vue.js支持服务端渲染内容，即这里的目录是在node中进行运行的，服务端运行将返回html字符串进行渲染，这里是在服务端的vue.js而不是web端的vue.js

## sfc

这里的parser.js会把编写的.vue文件转换成js对象

## shared

vue.js用到的公共的方法，它将是所有的目录公共可访问的内容

---

这两天会根据计划更新其他的内容，这个部分会一直进行下去，不定时更新
