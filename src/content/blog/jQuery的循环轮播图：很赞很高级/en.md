---
title: "A Seamless jQuery Carousel: Simple and Slick"
description: "The result is shown above. A Small Gotcha When a timer moves images to the left, the offset eventually resets to zero. This causes an abrupt jump, so append the first two images to the end for smoother scrolling. Key Techniques - Control the offset with a timer - Use siblings() to select the other elements, which matters for the hover effect - fadeTo()…"
date: 2018-08-25
lang: en
translationKey: "2018-08-25_39_jQuery的循环轮播图：很赞很高级"
categories:
  - "Life"
views: 5622
draft: false
---

![Screenshot 20180825190050.png](https://www.yinzhuoei.com/usr/uploads/2018/08/2158873025.png)

The screenshot above shows the result.

**A Small Gotcha**

If you use a timer to move the images to the left, the offset eventually needs to reset to zero. That reset causes an abrupt jump between images. To make the scrolling seamless, append copies of the first two images to the end of the list.

**Key Techniques**

- Use a timer to control the offset.
- Use `siblings()` to select the other elements; this matters for the hover effect.
- Pass a duration and an opacity to `fadeTo()`. Since the `ul` has a black background, setting the opacity to 0.5 creates the appearance of a dark overlay.

**Complete Code**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Infinite Scrolling Carousel</title>
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
