---
title: "重点复习：60-111天的面试题"
description: "写在前面，很久没有整理面试，笔试题了，这次准备了2个月的题，理论来讲是一天3道，一共是180道题，我们这篇文章会自动跳过一些之前说过的题，尽量挑重要的整理 src、href、link的区别是什么？ src：指的是指向资源，比如srcipt和img标签使用src…"
date: 2019-12-29
lang: zh
translationKey: "2019-12-29_158_重点复习：60-111天的面试题"
categories:
  - "前端"
views: 5450
draft: false
---

写在前面，很久没有整理面试，笔试题了，这次准备了2个月的题，理论来讲是一天3道，一共是180道题，我们这篇文章会自动跳过一些之前说过的题，尽量挑重要的整理

## src、href、link的区别是什么？

src：指的是指向资源，比如srcipt和img标签使用src来表达资源路径
href：指的是指向路径，比如a标签，表达了跳转的路径
link：指的是css中的link，用来表达层叠样式表的资源路径

这三者都不受同源限制影响

## 多维数组扁平化

```
1. arr.toString().split(\",\");
2. arr.flat(Infintity); // 多维转换，参数表示正无穷，写1就是只转换一维，写2转换2维......

3. return arr.reduce((prev, current) => {
    return prev.concat(Array.isArray(current) ? 递归函数(current) : current)
},[])
```

## 有用过HTML5的webSQL和IndexedDB吗？说说你对它们的理解

没有用过，但是websql是被废弃的，现在大多数都使用indexedDB，空间大，存储多，可以异步存储，支持键值对，也支持js对象

## 怎样把一个div居中？怎样把一个浮动元素居中？怎样把绝对定位的div居中？

```
margin 0 auto
transform
margin-left clac(50% - width/2)
position: absolute left: 0 top: 0 bottom 0 top 0 ; margin 0 auto
flex
grid
table
```

## 写一个方法获取图片的原始高度和宽度

用异步，new image对象，监听onload并取naturalWidth和naturalHeight即可,记得赋值src给img

## 有使用过html5的拖放API吗？简单说一下

简单使用过，img标签默认可拖拽，其他标签需要开启拖拽开关drage=true
h5提供了一系列元素的监听事件，可以用拖拽事件来做出一些有趣的效果

## 有用过HTML5的WebWork吗？它主要解决了什么问题？

js是单线程语言，webwork允许我们注册一个服务，让这个服务在一个单独的线程进行处理，不会影响到主线程，大大提高了js的
复杂业务执行效率
但是在这个线程中，

1. 必须是和主线程是同源
2. 没有parent，window，document不能更改dom，navigator和location是可以用的
3. woker和主线程必须通过消息进行传递
4. 没有alert等，可以发送ajax请求
5. 不能加载本地文件，资源必须来源于网络

## 说说你对同构和SSR的理解（理解，简单过一下）

同构，就是一套代码能在客户端允许也能在服务端允许
ssr就是为了爬虫的需要/框架初始化/单页面的卡顿，在service端把数据处理好返回给页面
优点：首页加载快，seo好，请求次数减少

ssr和spa不是相对概念
spa和mpa是相对概念，多页应用在以前非常火，有多个前端入口，路由后端控制等，比如php和jsp都是经典的mpa应用

## 说说position的absolute和fixed共同与不同点分别是什么？

都脱离了文档流
一个是可以相对父元素，一个是相对于浏览器

## 举例子说明javascript的变量声明提升和函数声明提升

```
var a = funtion a(){
    console.log(4)
}
funtion a(){
    console.log(5)
}

console.log(a()) // 4
```

## html直接输入多个空格为什么只能显示一个空格？

该行为由css的white-space控制，默认值normal会把多个空格压缩成一个空格

## HTML5如果不写<! DOCTYPE html> ，页面还会正常工作么？

可以，只不过浏览器会以自己默认的规则进行加载网页，每个浏览器的规则都有区别
所以会造成多个浏览器不兼容的情况

## 元素竖向的百分比设置时相对容器的高度吗？

不是，如果是的话，那么高度是相对高度，父元素根据子元素的高度会自动撑开，然后子元素
知道父元素撑开为了百分比要去弥补这个差距，会造成一个死循环

所以是相对容器的宽度不是高度

## 请写出唤醒拔打电话、发送邮件、发送短信的例子

```
<a href=\"tel: 110\">拨号</a>
<a href=\"sms: 110\">发短信</a>
<a href=\"emilto: 1018715564@qq.com\">邮箱</a>
```

## 写个例子说明HTML5在移动端如何打开APP？

原理deeplink
使用a标签中的href=\"应用名称（问具体开发）://\"

## css和动画和js动画区别

```
1. 性能不差
2. 部分场景下优于js
3. 比较多的兼容问题
```

## 怎样禁止表单记住密码自动填充？

```
autocomplate=\"off\"
```

## 请说说*{box-sizing: border-box;}的作用及好处有哪些？

怪异盒模型，会把border，padding算在盒子的宽，比较符合人类的认知

## 对base64的理解

上传图片可以用base64上传
url参数加密也可以用base64

## html的a标签属性rel=\'nofollow\'有什么作用

告诉爬虫不要爬链接中的内容了

## Ajax请求中get和post方式有什么区别呢？分别在哪些场景下使用？

get参数内存小，因为是通过url传参，浏览器的url参数有限制
get请求参数会暴漏在用户表面
get请求可以被历史记录

get请求通常是获取一个仅读资源

## 怎么在IE8及以下实现HTML5的兼容？

使用这个插件html2shiv， 原理就是创建element

## 写一个字符串重复的repeat函数

repeat函数
使用array.join()；
循环拼接变量，然后循环完毕返回
循环放入数组，输入变成字符串返回

## 在实际编写css中你有遇到过哪些浏览器兼容性的问题？怎么解决的？

低版本得IE的CSS特效等

postcss autoprefixer，browerlist

## 移动端点击事件为什么会有延迟？有哪些方法可以解决？

因为早期的浏览器规定的就是，点击一下，如果300ms之内又点了第二下会放大屏幕

那么解决办法就是不让他放大，设置meta标签，禁止缩放
还有就是使用fastclick这个库，原理：可以在点击的第一下上生成一个div并且触发点击事件然后把默认事件屏蔽掉

## 在a标签上的四个伪类执行顺序是什么？

link visited hover active      记忆法：lvha（lv好）

## 说说你对!important的理解，一般在哪些场景使用？

不建议使用，提高css样式的最高权重，非常不利用维护

## 写一个方法随机生成指定位数的字符串

```
Math.random().toString(36).substr(2); .// 生成一个随机字符串
```

## 请你解释下什么是浮动和它的工作原理是什么？同时浮动会引起什么问题？

浮动会脱离标准文档流， 浮动元素会互相紧贴，可能会造成高度塌陷

## js中=、==、===三个的区别是什么？并说明它们各自的工作过程

```
=赋值操作
== 比较值，会隐式转换，简单比较
=== 不仅会比较值，还会比较内存地址，复杂比较
```

## transition、animation、transform三者有什么区别？

```
1. 过渡：无非就是图像元素在做偏移/变化时，过渡动画能更好的让用户接受，不再生硬
2. 自定义动画：可以让开发者逐帧操控动画，可玩度更高
3. 图像转换移动： 2d,3d移动，放大缩小等等都是经典的场景
```

## 请写出如下代码运行的结果并解释为什么？[代码]

代码是这个：

```
var type = \'images\';
var size = {width: 800, height: 600};
var format = [\'jpg\', \'png\'];

function change(type, size, format){
    type = \'video\';
    size = {width: 1024, height: 768};
    format.push(\'map\');
}
change(type, size, format);
console.log(type, size, format);
```

change中的更改几个变量，都是更改的行参的值，而传递的format，push更改了原数据，所以只有数组增加了，其他都没变化

## 你在工作中有用到过websocket吗？用它来解决什么问题？

用到过，聊天的时候做过，兼容不太好，但是有解决方案，用于客户端和服务端进行互相推送的功能，解决了传统的推送传输耗费性能

## 遇到overflow: scroll不能平滑滚动怎么解决？

ios： -weibit-overflow-scorlling:touch;

## 举例说明数组和对象的迭代方法分别有哪些？

es5: for,forEach,some,reduce,reduceRight,map,for-in,every,filter
es6: for-of,find,findIndex
对象：
es5: for-in,Object.keys()
es6: Object.entries(); Object.values();

## 请快速答出此题的答案并解释：var x, y = 1; x + y = ?

NaN, y是等于1 ,x只是定义了没赋值  undefined+1=NaN

## HTML5的应用程序缓存与浏览器缓存有什么不同？

浏览器缓存提供的就是单个文件的缓存，而HTML5的PWA中的离线缓存技术是整站缓存，即没有存在网络也可以访问网站，基于service-woker标准实现

## 说说你对BEM规范的理解，同时举例说明常见的CSS规范有哪些？

指的是css命名规范，bem认为所有的网页是一个一个块组成的，block，element，modifier（修饰语）
header-button-primary 类似于这样

## 举例说明什么是IIFEs？它有什么好处？

立即执行函数

```
(funtion(){
    // code something
})();

也可以这样哦!function(){}()， ~function(){}()  let a = function(){}()

节约变量，独立作用域，立即运行
```

## 简述下HTML的快捷键属性是哪个？并举例说明有什么用？

accesskey，h5支持每个元素都可以注入accesskey，搭配浏览器快捷组合键，实现快速访问的功能

这无疑推广了无障碍的发展，让更多不健全的人也能更方便使用web网页

## 举例说明什么是decodeURI()和encodeURI()是什么？

对内容进行解码，对内容进行加码

## 你有用过HTML5的Device API吗？说说它都有哪些应用场景？

没有用过，听说过，是html5的一种规范api，可以监听手机屏幕亮度，电量，振动，打电话之类的‘

## js实现99乘法表

```
function nine(num){
for(var i = 1;i<=num;i++){//控制行
var expression = \"\";
for(var j = 1;j<=i;j++){//j<=i 控制每行的个数
expression +=`${j}*${i}=${i*j}`;
}
console.log(expression)
}
}
nine(9);
```

## 在新窗口打开链接的方法是什么？那怎么设置全站链接都在新窗口打开？

target=\"_blank\";

## a标签下的href =“ javascript：void（0）”实现了什么作用？说说你对javascript：void（0）的理解？

void是js的一个关键字，表示没返回值，这句代码主要是不让a链接产生跳转（默认行为）

## 如何理解同源策略

同源策略就是浏览器的一种安全策略，避免和不安全的资源进行通信

```
1. 不同协议
2. 不同域名
3. 不同端口
```

解决办法： cors jsonp proxy代理等

## 怎么让body高度自适应屏幕？为什么？

html,body{height: 100%}  把html带上是因为，如果只给body加不是真正的高自适应，因为会继承html的高度，html高度未必是100%，所以两个都要加100%
body{height: 100vh} vh不会继承父类，直接是视口的高度

## js延迟加载的方式有哪些？

async defer setTimeout 动态绑定src 动态创建script标签

## display有哪些值？分别说明他们的作用是什么？

table
flex
grid
inlie-block
none
block

## 把Script标签放在页面最底部的
