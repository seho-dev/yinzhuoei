---
title: "又是前端的一些小干货来了：同事面前装13必备"
description: "大家好，我是老沈。最近研究前端的时候，看到了一些从没见过的 CSS 写法，在开源源码里几乎没见过。 酷炫到没朋友！ 2.如何快速写一个梯形 这个写法的原理我到现在也没完全搞懂，但挺好用的。 HTML： CSS： 这是直角梯形。如果是三角梯形，加上 border…"
date: 2018-07-23
lang: zh
translationKey: "2018-07-23_24_又是前端的一些小干货来了：同事面前装13必备"
categories:
  - "唠嗑"
views: 5563
draft: false
---

大家好，我是老沈。最近研究前端的时候，看到了一些从没见过的 CSS 写法，在开源源码里几乎没见过。

![QQ图片20180723190118.jpg](https://www.yinzhuoei.com/usr/uploads/2018/07/2010946705.jpg)

酷炫到没朋友！

**2.如何快速写一个梯形**

这个写法的原理我到现在也没完全搞懂，但挺好用的。

HTML：

```html
<div id="leftnav"></div>
```

CSS：

```css
border-bottom: 949px solid #F14248;
border-right: 248px solid transparent;
```

这是直角梯形。如果是三角梯形，加上 `border-left` 就行。`transparent` 是透明的意思，类似 `rgb(0, 0, 0, 0)`。其实还是一个 div 块，只是边变成透明的了，而且边很宽，就形成了梯形。

**3.两个小插件**

做横屏 PC 站点的时候，滑轮滑动整个视图往右走。试了几个方案，最后找到两个好用的插件：

鼠标滑轮插件，任何滑轮效果都能轻松实现：

```html
<script src="js/jquery.mousewheel.js"></script>
```

美化滚动条插件，一步搞定丑丑的默认滚动条：

```html
<script src="js/jquery.nicescroll.js"></script>
```

两个插件都依赖 jQuery，要先引入 jQuery 文件，而且必须在 ready 函数里写，否则会出错。

---

拜拜，明天会有更多教程分享。每天有分享，证明每天都有进步！
