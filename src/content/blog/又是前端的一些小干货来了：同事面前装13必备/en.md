---
title: "More Handy Frontend Tricks to Impress Your Colleagues"
description: "Hi everyone, Lao Shen here. While exploring frontend development recently, I came across some CSS techniques I had never seen before—not even in most open-source code. Seriously cool stuff! 2. A Quick Way to Draw a Trapezoid I still do not fully understand why this technique works, but it is handy. HTML: CSS: This creates a right trapezoid. To slope the other side as well, add border…"
date: 2018-07-23
lang: en
translationKey: "2018-07-23_24_又是前端的一些小干货来了：同事面前装13必备"
categories:
  - "Life"
views: 5563
draft: false
---

Hi everyone, Lao Shen here. While exploring frontend development recently, I came across some CSS techniques I had never seen before—not even in most of the open-source code I have read.

![Image 20180723190118.jpg](https://www.yinzhuoei.com/usr/uploads/2018/07/2010946705.jpg)

Seriously cool stuff!

**2. A Quick Way to Draw a Trapezoid**

I still do not fully understand why this technique works, but it is very handy.

HTML:

```html
<div id="leftnav"></div>
```

CSS:

```css
border-bottom: 949px solid #F14248;
border-right: 248px solid transparent;
```

This creates a right trapezoid. To slope the other side as well, add `border-left`. `transparent` means see-through, similar to `rgb(0, 0, 0, 0)`. It is still just a `div`, but some of its borders are transparent. With sufficiently wide borders, the visible area forms a trapezoid.

**3. Two Small Plugins**

For a horizontally scrolling desktop website, I wanted the mouse wheel to move the entire view to the right. After trying a few approaches, I found two useful plugins:

A mouse-wheel plugin that makes wheel interactions easy:

```html
<script src="js/jquery.mousewheel.js"></script>
```

A scrollbar-styling plugin that replaces the ugly default scrollbar in one step:

```html
<script src="js/jquery.nicescroll.js"></script>
```

Both plugins depend on jQuery, so include the jQuery file first. Also make sure to put your code inside the ready handler, or you will run into errors.

---

Bye for now. More tutorials tomorrow. Sharing something every day means making progress every day!
