---
title: "前端专栏：除了属性和选择器，你还需要知道哪些带@的规则"
description: "前端部分，css是最缺乏标准的语言，不像html和js有着大量的规范标准，但是css你几乎找不到一个像他们一样的标准。 css的顶层样式表分为at-rule和qualified-rule 一个是at规则，一种是普通规则； 我们的at规则是由一个@发起，跟一个区…"
date: 2019-03-21
lang: zh
translationKey: "2019-03-21_85_前端专栏：除了属性和选择器，你还需要知道哪些带@的规则"
categories:
  - "唠嗑"
views: 5291
draft: false
---

前端部分，css是最缺乏标准的语言，不像html和js有着大量的规范标准，但是css你几乎找不到一个像他们一样的标准。
css的顶层样式表分为at-rule和qualified-rule 一个是at规则，一种是普通规则；
我们的at规则是由一个@发起，跟一个区块组成的，如果没有区块是以分号结束的；at规则是远远比普通规则少并且少用的，
所以大家可能会对at-rule比较陌生。

@charset ： https://www.w3.org/TR/css-syntax-3/ 
@import ：https://www.w3.org/TR/css-cascade-4/ 
@media ：https://www.w3.org/TR/css3-conditional/ 
@page ： https://www.w3.org/TR/css-page-3/ 
@counter-style ：https://www.w3.org/TR/css-counter-styles-3 
@keyframes ：https://www.w3.org/TR/css-animations-1/ 
@fontface ：https://www.w3.org/TR/css-fonts-3/ 
@supports ：https://www.w3.org/TR/css3-conditional/ 
@namespace ：https://www.w3.org/TR/css-namespaces-3/

上面这么多，是已经整理好的at文档
下面我们给所有的at规则做一个解释和demo

@charset "utf-8" ---- 规定css文件的编码
@import "index.css" ---- 引入对应的css文件（除了编码都可以全部引入） ->
@import url("index.css") ->
@import [  |  ]
 [ supports( [  |  ] ) ]?
 ? ;

@media print { ---- 他能对设备做一些判断，此方法体是普通规则
 body { font-size: 10pt }
}

---- @page，针对于分页媒体网页表现，除了设置页面本身自己，也可以设置周围其他盒

@page {
 size: 8.5in 11in;
 margin: 10%;

@top-left {
 content: "Hamlet";
 }
 @top-right {
 content: "Page " counter(page);
 }
}

-- counter-style 它可以自定义列表前缀表现，具体的方法可以百度有详细的api
@counter-style triangle {
 system: cyclic;
 symbols: ‣;
 suffix: " ";
}

@ support support --检查环境的特性，它与 media 比较类似。 
@ namespace --用于跟 XML 命名空间配合的一个规则，表示内部的 CSS 选择器全都带上特定命名空间。
@ viewport --用于设置视口的一些特性，不过兼容性目前不是很好，多数时候被 html 的 meta 代替。

普通规则：由选择器和声明区块构建的；声明区块又由属性和值构建而成；
下面这张图，就能很好的解释选择器的优先级和权重问题

![4fa32e5cf47c72a58f7a8211d4e8fc67.png](https://www.yinzhuoei.com/usr/uploads/2019/03/1433347872.png)

：我们在写属性的时候不要写两个--，否则会被当成css变量处理，与之配合的是var函数

:root {
 --main-color: #06c;
 --accent-color: #006;
}
/*The rest of the CSS file*/

# foo h1 {

color: var(--main-color);
}

css也支持一些计算属性：

calc() max() min() clamp() toggle() attr()

这些函数用的比较多的就是calc和max min函数，实际开发中我们可以用calc简单的计算出不同运算符加减乘除

# test{

height:calc(50% - 10px)
}

ps: 这些变量我们再做运算的时候，一定要空格隔开

css的函数有很多，欢迎提出你日常中用到过的函数以及应用场景吧！

本文部分demo摘自winter老师的专栏
