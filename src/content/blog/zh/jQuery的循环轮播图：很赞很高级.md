---
title: "jQuery的循环轮播图：很赞很高级"
description: "效果图在上面。 小坑 如果用计时器让图片往左偏移，偏移到一定程度会归零。归零的瞬间图片会突然切换，显得很生硬。所以要在图片末尾再加上前两张图片，让滚动更流畅。 主要技巧 - 计时器控制偏移 - siblings() 获取非当前元素，在触摸图层会很重要 - fa…"
date: 2018-08-25
lang: zh
translationKey: "2018-08-25_39_jQuery的循环轮播图：很赞很高级"
categories:
  - "唠嗑"
views: 5622
draft: false
---

![QQ截图20180825190050.png](https://www.yinzhuoei.com/usr/uploads/2018/08/2158873025.png)

效果图在上面。

**小坑**

如果用计时器让图片往左偏移，偏移到一定程度会归零。归零的瞬间图片会突然切换，显得很生硬。所以要在图片末尾再加上前两张图片，让滚动更流畅。

**主要技巧**

- 计时器控制偏移
- `siblings()` 获取非当前元素，在触摸图层会很重要
- `fadeTo()` 方法，传入时间和透明度。ul 背景是黑色的，透明度设为 0.5，呈现出来的就是黑色蒙版效果

**完整代码**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>无限循环滚动轮播</title>
    <script src="jquery-3.0.0.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
        }
        div {
            width: 1180px;
            height: 470px;
            border: 1px solid black;
            margin: 100px auto;
            overflow: hidden;
        }
        ul {
            width: 4130px;
            height: 470px;
            list-style: none;
            background: black;
        }
        li {
            float: left;
        }
    </style>
</head>
<body>
    <div>
        <ul>
            <li><img src="1.jpg" alt=""></li>
            <li><img src="2.jpg" alt=""></li>
            <li><img src="3.jpg" alt=""></li>
            <li><img src="4.jpg" alt=""></li>
            <li><img src="5.jpg" alt=""></li>
            <li><img src="1.jpg" alt=""></li>
            <li><img src="2.jpg" alt=""></li>
        </ul>
    </div>
    <script>
        var off = 0;
        var timer;

        $(function () {
            autoplay();
            listen();
        });

        function autoplay() {
            timer = setInterval(function () {
                off += -1;
                if (off <= -2950) {
                    off = 0;
                }
                $('ul').css({
                    'marginLeft': off
                });
            }, 10);
        }

        function listen() {
            $('li').hover(function () {
                clearInterval(timer);
                $(this).siblings().fadeTo(100, 0.5);
                $(this).fadeTo(100, 1);
            }, function () {
                autoplay();
                $('li').fadeTo(100, 1);
            })
        }
    </script>
</body>
</html>
```
