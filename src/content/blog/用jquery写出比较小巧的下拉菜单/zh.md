---
title: "用jquery写出比较小巧的下拉菜单"
description: "大家好，好久没更新了。最近学了不少新东西，都存在印象笔记里，后续会慢慢补上。明天就开学了，今晚用 jQuery 写了个下拉菜单的小 demo。 知识点 siblings()：获取除了当前元素之外的所有同级元素。说白了就是：拿到\"非当前对象的所有对象\"。 chi…"
date: 2018-08-18
lang: zh
translationKey: "2018-08-18_34_用jquery写出比较小巧的下拉菜单"
categories:
  - "前端"
views: 5079
draft: false
---

![u=4055771136,79106349&fm=27&gp=0.jpg](https://www.yinzhuoei.com/usr/uploads/2018/08/2725420953.jpg)

大家好，好久没更新了。最近学了不少新东西，都存在印象笔记里，后续会慢慢补上。明天就开学了，今晚用 jQuery 写了个下拉菜单的小 demo。

**知识点**

`siblings()`：获取除了当前元素之外的所有同级元素。说白了就是：拿到"非当前对象的所有对象"。

`children()`：获取当前元素的子元素。也就是：拿到当前对象下面的某个子元素。

**完整代码**

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
    <li>这是一级标签
        <ul class="sub">
            <li>二级标签</li>
            <li>二级标签</li>
            <li>二级标签</li>
            <li>二级标签</li>
            <li>二级标签</li>
        </ul>
    </li>
    <li>这是一级标签
        <ul class="sub">
            <li>二级标签</li>
            <li>二级标签</li>
            <li>二级标签</li>
            <li>二级标签</li>
            <li>二级标签</li>
        </ul>
    </li>
    <li>这是一级标签
        <ul class="sub">
            <li>二级标签</li>
            <li>二级标签</li>
            <li>二级标签</li>
            <li>二级标签</li>
            <li>二级标签</li>
        </ul>
    </li>
    <li>这是一级标签
        <ul class="sub">
            <li>二级标签</li>
            <li>二级标签</li>
            <li>二级标签</li>
            <li>二级标签</li>
            <li>二级标签</li>
        </ul>
    </li>
    <li>这是一级标签
        <ul class="sub">
            <li>二级标签</li>
            <li>二级标签</li>
            <li>二级标签</li>
            <li>二级标签</li>
            <li>二级标签</li>
        </ul>
    </li>
</ul>
</body>
</html>
```

---

最近开始玩 GitHub 了，下半年会有一个 CMS 免费开源程序跟大家见面。
