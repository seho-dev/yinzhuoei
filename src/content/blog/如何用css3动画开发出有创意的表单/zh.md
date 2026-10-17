---
title: "如何用css3动画开发出有创意的表单"
description: "最近在写一个教师满意度打分系统，前端和后台分离。后台大部分功能已经实现，就差前端了。我用 CSS3 animation 写了一个 div 块旋转居中的效果，还挺别致的。 先上代码。div 的 position 要设置成固定定位，块的最终位置就是居中： 最后一行…"
date: 2018-07-18
lang: zh
translationKey: "2018-07-18_14_如何用css3动画开发出有创意的表单"
categories:
  - "前端"
views: 5557
draft: false
---

![下载.jpg](https://www.yinzhuoei.com/usr/uploads/2018/07/1208579691.jpg)

最近在写一个教师满意度打分系统，前端和后台分离。后台大部分功能已经实现，就差前端了。我用 CSS3 animation 写了一个 div 块旋转居中的效果，还挺别致的。

先上代码。div 的 position 要设置成固定定位，块的最终位置就是居中：

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
    /* 让块旋转 */
    -webkit-animation: divrotate 1.3s;
}
```

最后一行的 `-webkit-animation` 是兼容 mac 和 Chrome 浏览器的前缀。`divrotate` 是动画名称，`1.3s` 是动画运行时间。

然后定义动画：

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

每个百分比的样式就是动画在那个进度时执行的操作。CSS 好写，但要写出漂亮效果，还是需要思路和创意的。
