---
title: "Creating a Creative Form with CSS3 Animation"
description: "I have been building a teacher satisfaction rating system with separate frontend and backend applications. Most of the backend functionality is done; the frontend is all that remains. I used CSS3 animation to make a div rotate into the center of the screen—a rather distinctive effect. Let's start with the code. Give the div fixed positioning so that its final position is centered. The final line…"
date: 2018-07-18
lang: en
translationKey: "2018-07-18_14_如何用css3动画开发出有创意的表单"
categories:
  - "Frontend"
views: 5557
draft: false
---

![Downloaded image.jpg](https://www.yinzhuoei.com/usr/uploads/2018/07/1208579691.jpg)

I have been building a teacher satisfaction rating system with separate frontend and backend applications. Most of the backend functionality is done; the frontend is all that remains. I used CSS3 animation to make a `div` rotate into the center of the screen. It is a rather distinctive effect.

Let's start with the code. Give the `div` fixed positioning so that its final position is centered:

```css
#ready {
    border-radius: 6px;
    width: 444px;
    height: 430px;
    background: #fff;
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    margin: auto;
    /* Rotate the block */
    -webkit-animation: divrotate 1.3s;
}
```

The final line uses the `-webkit-animation` prefixed property for compatibility with Mac browsers and Chrome. `divrotate` is the animation's name, and `1.3s` is its duration.

Next, define the animation:

```css
@keyframes divrotate {
    0% {
        transform: rotate(90deg);
        -ms-transform: rotate(90deg);
        -moz-transform: rotate(90deg);
        -o-transform: rotate(90deg);
        width: 30px;
        height: 30px;
    }
    25% {
        transform: rotate(180deg);
        -ms-transform: rotate(180deg);
        -moz-transform: rotate(180deg);
        -o-transform: rotate(180deg);
        left: 12%;
        width: 100px;
        height: 100px;
    }
    50% {
        transform: rotate(270deg);
        left: 24%;
        width: 180px;
        height: 180px;
    }
    75% {
        transform: rotate(300deg);
        left: 48%;
        width: 280px;
        height: 280px;
    }
    100% {
        transform: rotate(360deg);
        left: 34%;
        width: 444px;
        height: 430px;
    }
}
```

The styles at each percentage define what happens at that point in the animation. CSS is easy to write, but creating a beautiful effect still takes thought and creativity.
