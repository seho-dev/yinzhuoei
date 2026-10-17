---
title: "Building a Compact Dropdown Menu with jQuery"
description: "It's been a while since my last update. I've learned quite a few new things and saved them in Evernote; I'll share them gradually. School starts tomorrow, so tonight I put together a small jQuery dropdown menu demo, using siblings() and children() to find the relevant elements."
date: 2018-08-18
lang: en
translationKey: "2018-08-18_34_用jquery写出比较小巧的下拉菜单"
categories:
  - "Frontend"
views: 5079
draft: false
---

![u=4055771136,79106349&fm=27&gp=0.jpg](https://www.yinzhuoei.com/usr/uploads/2018/08/2725420953.jpg)

Hi everyone, it's been a while since my last update. I've learned quite a few new things recently and saved them in Evernote; I'll gradually post them here. School starts tomorrow, so tonight I put together a small dropdown menu demo with jQuery.

**Key concepts**

`siblings()`: Gets all sibling elements other than the current element. In plain English, it finds all the other elements at the same level.

`children()`: Gets the child elements of the current element—in other words, the elements directly inside it.

**Complete code**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="jquery-3.0.0.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
        }
        .nav {
            width: 300px;
            list-style: none;
            margin: 100px auto;
        }
        .nav > li {
            border: 1px solid #000;
            line-height: 35px;
            border-bottom: none;
            text-indent: 2em;
        }
        .nav > li:first-child {
            border-top-right-radius: 10px;
            border-top-left-radius: 10px;
        }
        .nav > li:last-child {
            border-bottom: 1px solid #000;
            border-bottom-right-radius: 10px;
            border-bottom-left-radius: 10px;
        }
        .sub {
            display: none;
        }
        .sub > li {
            list-style: none;
            background: mediumpurple;
        }
        .sub > li:hover {
            background: red;
            border-bottom: 1px solid #fff;
        }
    </style>
    <script>
        $(function () {
            $('.nav>li').click(function () {
                var $sub = $(this).children('.sub');
                $sub.slideDown(300);
                var othersub = $(this).siblings().children(".sub");
                othersub.slideUp(300);
            })
        })
    </script>
</head>
<body>
<ul class="nav">
    <li>Top-level item
        <ul class="sub">
            <li>Submenu item</li>
            <li>Submenu item</li>
            <li>Submenu item</li>
            <li>Submenu item</li>
            <li>Submenu item</li>
        </ul>
    </li>
    <li>Top-level item
        <ul class="sub">
            <li>Submenu item</li>
            <li>Submenu item</li>
            <li>Submenu item</li>
            <li>Submenu item</li>
            <li>Submenu item</li>
        </ul>
    </li>
    <li>Top-level item
        <ul class="sub">
            <li>Submenu item</li>
            <li>Submenu item</li>
            <li>Submenu item</li>
            <li>Submenu item</li>
            <li>Submenu item</li>
        </ul>
    </li>
    <li>Top-level item
        <ul class="sub">
            <li>Submenu item</li>
            <li>Submenu item</li>
            <li>Submenu item</li>
            <li>Submenu item</li>
            <li>Submenu item</li>
        </ul>
    </li>
    <li>Top-level item
        <ul class="sub">
            <li>Submenu item</li>
            <li>Submenu item</li>
            <li>Submenu item</li>
            <li>Submenu item</li>
            <li>Submenu item</li>
        </ul>
    </li>
</ul>
</body>
</html>
```

---

I've also started exploring GitHub recently. I'll be releasing a free, open-source CMS in the second half of the year.
