---
title: "重点复习：37天面试题 + 额外企业真实面试题小练习 (140道左右的题)"
description: "页面引入样式的时候，link和@import有什么区别？ 首先一个是html标签，一个是css语法 兼容性上，link兼容所有浏览器，import是css3语法只兼容高级浏览器 执行顺序上，link引入的css是在文档加载的时候引入，而import会在执行cs…"
date: 2019-08-18
lang: zh
translationKey: "2019-08-18_99_重点复习：37天面试题 + 额外企业真实面试题小练习 (140道左右的题)"
categories:
  - "唠嗑"
views: 5768
draft: false
---

## 页面引入样式的时候，link和@import有什么区别？

首先一个是html标签，一个是css语法
兼容性上，link兼容所有浏览器，import是css3语法只兼容高级浏览器
执行顺序上，link引入的css是在文档加载的时候引入，而import会在执行css的时候引入样式
控制上，link可以通过js来改变引入的css，而import由于是css语法是不可以的

---

## 圣杯布局和双飞翼布局的区别和理解

理解：圣杯布局和双飞翼布局都是为了解决两边定宽，中间自适应且优先渲染的布局需求，那么为了自适应且优先渲染，必须要把中间的dom放在最顶端，以保证主要内容能最先被浏览器解析；

而圣杯布局的核心概念就是，通过父容器撑出左右2个 “预留区域”

![微信截图_20190818135602.png](https://www.yinzhuoei.com/usr/uploads/2019/08/1792369603.png)

圣杯布局代码（在线调试）： https://codesandbox.io/embed/red-platform-vtrct
总结圣杯布局：圣杯布局的核心就是父盒子用padding预留区域，然后center设置宽100%，并且把中左右3个盒子浮动，由于浮动的效果且中间center的宽度沾满了全部，所以左右两个盒子会被“挤下去”，我们需要把2个盒子放到padding给它们预留的地方，左边盒子先使用margin-right负值100%移动到父盒子中心（和中盒子共享第一行，其实就是盖住了中盒子的一半，因为有浮动的原因脱离了文档流）然后再可以使用定位向左移动padding的宽度，就把左盒子移动到了预留的padding中了，右盒子就是直接给一个margin-right负值（父值得值就是预留的padding大小）

双飞翼布局 (在线调试) ： https://codesandbox.io/embed/elated-kilby-6vqjp
总结双飞翼布局：双飞翼布局的核心就是center通过包裹一个父元素，给父元素设置width： 100%和浮动，子元素用margin撑出其他两块的预留位置，然后在left和right上，通过margin-right负值进行移动到对应位置上；

两种布局方式的总结：个人来讲圣杯布局在dom上能够更清爽且更能让人理解，但是在css实现上比较复杂难懂，但是双飞翼布局在dom上没有圣杯那么容易懂，但是在css实现上更让人理解，不难发现，2种布局方式都需要引入一个div，因为（既要设置中间的浮动且可以设置宽度又能计算预留位置），基于双飞翼布局，我们可以通过calc函数（ie9已支持），把多余的div去掉，可以使用calc（100% - 400px）这样的方式就可以自适应啦，但是需要牺牲兼容性，同理还可以用border-box和flex布局，具体移步： https://www.jianshu.com/p/81ef7e7094e8

我的这次总结有少数代码和部分借鉴此处，尤其是给大家提供了不考虑兼容性情况下，如何用额外的方法布局；

---

## 这是一道大题目，把考点拆成了4个小项；需要侯选人用递归算法实现（限制15行代码以内实现；限制时间10分钟内完成）：

a) 生成一个长度为5的空数组arr。
b) 生成一个（2－32）之间的随机整数rand。
c) 把随机数rand插入到数组arr内，如果数组arr内已存在与rand相同的数字，则重新生成随机数rand并插入到arr内[需要使用递归实现，不能使用for/while等循环]
d) 最终输出一个长度为5，且内容不重复的数组arr。

https://codesandbox.io/embed/elastic-tesla-5eko4

---

## html的元素有哪些（包含H5）？区分出行内元素、块级元素、空元素并在后面简要标注下作用

```
比如说div, form,acticle, head,meta,body,header,footer,menu
table, ul,li,ol
行内元素：span, a , input, select,button,strong
```

---

## CSS3有哪些新增的特性

```
border-shadow
transition系列
transform系列
border-radius
text-shadow
animation
opacity
渐变（线性渐变和径向渐变）
flexboxdeng\'deng
```

---

## 写一个方法去掉字符串中的空格，要求传入不同的类型分别能去掉前、后、前后、中间的空格

```
最简单的去掉空格可以去掉全部空格: str.replace(/\\s/g, \"\");
str.replace(/\\s*/g,\"\"); //去除字符串内所有的空格
str.replace(/^\\s*|\\s*$/g,\"\"); //去除字符串内两头的空格
str.replace(/^\\s*/,\"\"); //去除字符串内左侧的空格
str.replace(/(\\s*$)/g,\"\"); //去除字符串内右侧的空格
```

这个题主要考察了js中的正则表达式最基本的常见用法

---

## HTML全局属性(global attribute)有哪些（包含H5）

这个比较多，比如常见的class，id，href，target，value, type, src ， for，alt，width，height
placeholder

h5中新增的自定义的attribute非常的方便，我们可以自己定义data-***这样的全局属性，然后可以存储
一些值，通过js去取，大多数的图片懒加载的库原理都是通过这个h5新属性的

---

在页面上隐藏元素的方法有哪些？并简述出第一种方法的应用场景和优劣势

1. 宽高设置为0
2. opacity为0
3. margin偏移-100%
4. 同上原理，还可以用定位
5. display： none
6. 还可以用transform的scale，通过缩放也可以看不见
7. 同上，还可以用translateX/translateY\translate来让view隐藏
8. filter的opactiy透明度也可以，高斯模糊（这个不能隐藏，但是可以让元素变的模糊的看不清）

---

## 去除字符串中最后一个指定的字符

```
思路： 查询字符串在目标的第几个，然后通过截取字符串（或者其他办法，具体看js代码）
// 去掉一个字符串中的指定字符串
function one(target, str) {
  // 查询字符串的最后一个索引
  let lastIndex = str.lastIndexOf(target);
  return str.substr(0, lastIndex) + str.substr(lastIndex + 1, str.length);
}

function two(target, str) {
  return str
    .split(\"\")
    .reverse()
    .join(\"\")
    .replace(target, \"\")
    .split(\"\")
    .reverse()
    .join(\"\");
}

console.log(one(\"b\", \"abcdef\"));
```

写的比较简单的方法，如果有好的方法在评论秀一下

---

## HTML5的文件离线储存怎么使用，工作原理是什么？

提到存储，大部分的前端可以可能会想到，h5的lcoalstorage或者seesionstorage，再或者就是cookie，或者一系列的数据库，又或者是h5本身就是对本地文件有操作权限的，所以存储到本地也是一个办法

但是h5可以让我们用manifest来构建一个文件，只要有html页面使用了它，就会读取一个文件，这个文件里我们可以配置文件名称，尽管在网络断开，这些资源是可用的（前提是你打开过页面，已经下载了这个manifest中的文件了），关于这块的知识点，在这里讲一点点：

```
<!DOCTYPE HTML>
<html manifest=\"demo.appcache\">

<body>
The content of the document......
</body>

</html>
```

内容来自：w3c

这个存储的文件后缀建议是appcache，在这个appcache我们可以配置几项内容（和java中的springboot很像）

![微信截图_20190818225721.png](https://www.yinzhuoei.com/usr/uploads/2019/08/3875776220.png)

这个是其中的必填项，我们配置了这么多的文件，那么缓存过一次之后就可以没网络都可以跑了！
总结：manifest的特点：
1.没有网络状态下，依然可以跑资源
2.减少了服务器的请求带宽，当文件没有被更新/更改时，他就不会请求服务器进行下载
3.已缓存的资源加载的更快！

w3c学习本知识点的地址： https://www.w3school.com.cn/html5/html_5_app_cache.asp

---

## CSS选择器有哪些？哪些属性可以继承？

id，class，通配符，后代，兄弟，标签，属性，伪类，伪元素

color，font-size，font-weight，font-family，text-shdow等

---

## 写一个方法把下划线命名转换为驼峰

```
function one(str) {
  let arr = str.split(\"_\");
  let result = [];
  for (let key in arr) {
    if (key > 0) {
      result.push(
        arr[key][0].toUpperCase() + arr[key].substr(1, arr[key].length)
      );
    } else {
      result.push(arr[0]);
    }
  }
  return result.join(\"\");
}

console.log(one(\"two_three\"));
```

---

## 简述超链接target属性的取值和作用

_blank 在新标签页面打开
_self 在本标签页打开
_top 在此iframe窗口“顶部”打开

---

## CSS3新增伪类有哪些并简要描述

可能是平时写css不太多，常用的也就是first-child, last-child,nth-child()等，具体是有很多的，比如说only-child, checked, disabled

这个面试的时候，考察的应该不太多，知道这些基本的就够了，而且为了写出更加nice的css，尽量少使用权重很低的css伪类，first-child这样的，效率很不高

![58444428-caa60c00-812a-11e9-84d9-a40b4b22adde.png](https://www.yinzhuoei.com/usr/uploads/2019/08/1235630850.png)

这个应该是比较全面的了

---

## 写一个把字符串大小写切换的方法

```
function one(str) {
  let arr = str.split(\"\");
  let result = [];
  for (let item of arr) {
    if (item.toUpperCase() === item) {
      // 如果是大写的话，就转换为小写
      result.push(item.toLowerCase());
    } else {
      result.push(item.toUpperCase());
    }
  }
  return result.join(\"\");
}

console.log(one(\"two_tHree\"));

function two(str) {
  return str.replace(/([a-z]*)([A-Z]*)/g, ($m, $s1, $s2) => {
    return `${$s1.toUpperCase()}${$s2.toLowerCase()}`;
  });
}
```

很多种办法，我挑的是我最容易理解，也是相对来说简单的

---

## label都有哪些作用？并举相应的例子说明

如果你说只能通过label关联input等表单的话，为了增加点击区域，那你就大错特错了

1. 文本显示，也可以用label，因为不用理会宽高设置（不建议但是可以写）
2. 移动端下可以呼起键盘，原理就是用label，模拟点击
3. 还可以用label来解决，不同浏览器原生button样式不一样的问题，如下：

Button

<br> input[type=\&#039;button\&#039;] {<br>   display: none;<br> }</p><p>label {<br>   display: inline-block;<br>   padding: 10px 20px;<br>   background: #456;<br>   color: #fff;<br>   cursor: pointer;<br>   box-shadow: 2px 2px 4px 0 rgba(0,0,0,.3);<br>   border-radius: 2px;<br> }<br>

我们还可以用label来实现控制radio或者checkbox来控制媒体播放暂停等等，也可以做一些选项卡等等；
更多nice的功能大家可以去看看：

https://github.com/haizlin/fe-interview/issues/16#issuecomment-504650203

---

## 用css创建一个三角形，并简述原理

这个应该是高频面试题了吧！这个再不会，真的，一言难尽，如果不会就赶紧来看看实现原理吧

```
width: 0;
        height: 0;
        margin: 100px auto;
        border-top: 50px solid transparent;
        border-left: 50px solid transparent;
        border-right: 50px solid transparent;
        border-bottom: 50px solid red;
```

原理就是：利用box边框的切口是一个三角形（写一个很粗的border线放大可以仔细发现切口就是一个三角形，而css绘制三角形，就是隐藏掉其他三个边的边框，让一个边的border线放大，这样就是一个三角形了...）

---

## 写一个去除制表符和换行符的方法

```
str.replace(/\\t\\n\\v\
```

\f/g, \"\");

\s会匹配空格，用上面这个...

---

## iframe框架都有哪些优缺点？

复习到这一块的时候，愣了一下，但是可以勉强说出几个优缺点：
优点：可以很快的搭建一个导航栏
重载页面不需要重载整个页面，只需要加载其中一个页面即可
技术容易掌握，可以用来不用seo的页面来，大多数会用来做后台管理

缺点就是： seo很差
会产生很多页面，不易于调试或者打印
多框架的页面对服务器请求次数会变多

---

## 简述你对BFC规范的理解

刚好借这个题，我们来简述一下BFC，w3c和MDN给出的解释太模糊，太难懂，导致感觉是一个很难的概念，其实并没有那么难；
BFC其实就是一个“结界”，里面的元素和外面的元素互不干涉，给大家举一个例子

在线调试：https://codesandbox.io/embed/modest-microservice-kn04o
在这个代码里，可以看到，我只给了外部盒子加了一个overflow：auto，里面的元素会呈垂直居中排列，

构成BFC规则的条件，满足以下其一即可；

float的值不是none
position 的值不是static或者relative
display的值是inline-block,table-cell,flex,table-caption或者inline-flex
overflow的值不是visible

而BFC的特点就是：

内部的盒子会在垂直方向上一个接一个的放置
对于同一个BFC的俩个相邻的盒子的margin会发生重叠，与方向无关。
每个元素的左外边距与包含块的左边界相接触（从左到右），即使浮动元素也是如此
BFC的区域不会与float的元素区域重叠
计算BFC的高度时，浮动子元素也参与计算
BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素，反之亦然

上面这几个特点，面试/笔试理解即可，BFC这个概念只要知道开发中如何调试或者知道它的概念：
是一个css渲染机制，BFC相当于一个盒子，里面的元素和外面的元素互不干扰，知道这个即可

---

## 统计某一字符或字符串在另一个字符串中出现的次数

这个应该是面试/笔试高频出现的题了，有太多解题方式了，这里只产出3种简单易懂的

https://codesandbox.io/embed/unruffled-kare-8onfk

---

## 清除浮动的方式有哪些及优缺点？

在日常的开发中，已经非常少使用浮动了，平时的flex或者grid和标准文档流就能应付绝大部分需求，浮动带来的最大缺陷就是高度塌陷问题，主要来解决这个问题

造成高度塌陷的原因就是：父元素包含了浮动元素（脱离文档流）则高度是0，所以就会造成高度塌陷
解决方案：

把父元素也从标准文档流抽离出来和 ”孩子们“见面  （可能会造成全部页面的布局，可读性差，不明白为什么要抽离父元素）

在浮动元素下方引入带有clear: both的div （引入多余的元素，可读性差，不建议）

给父元素用overflow：hidden清除浮动 （可能会造成父容器多余内容不可见）

用伪元素after给父元素清空浮动，这也是bootstrap解决浮动的方案；

如果页面很少发生变动，那么给死父元素盒子的宽高也是最好的一种办法，兼容性也是非常棒的

---

## 写一个加密字符串的方法

```
function encode (str) {
        return btoa(encodeURIComponent(str));
    }

    function decode (str) {
        return decodeURIComponent(atob(str));
    }
```

仅仅支持浏览器端，btoa是浏览器自带的base64操作函数，atob是解密函数

---

## 浏览器内多个标签页之间的通信方式有哪些？

这个当时复习到这一块的时候，蒙了一下，然后脑子里迅速的想到了几种方法
多个表单页面通讯方式，可以说是传值等方式，可以用postmessage，只知道有这个东西，但是没有使用过；
还有就是storage，通过缓存存值取值也可以；
bus也可以，同理vuex也可以

---

## 简述下你理解的优雅降级和渐进增强

优雅降级：先出一个完美具备体验功能的版本，再向下兼容
渐进增强：先出一个

---

## 写一个判断数据类型的方法

typeof 不能判断数组和对象

Object.prototype.toString.call([])  //\"[object Array]\"
Object.prototype.toString.call({})  //\"[object Object]\"

---

## viewport常见设置都有哪些？

这个写不出来，如果是笔试的话，面试可以叙述一下作用（移动端窗口缩放倍数等）

width: width=device-width
initial-scale
maximum-scale
user-scalable

---

## 对比下px、em、rem有什么不同？

后2者都会转换为px，默认情况下： 1em等于10px，1rem等于16px
px是css中的逻辑像素，和移动端的物理像素有一个dpr
em是相对于父元素的大小
rem中的r是root，也就是相对于根节点（html）的大小

---

## 简要描述下什么是回调函数并写一个例子出来

通常将一个函数a作为参数传到函数b中，在适当时间调用函数a就是回调函数

比如说： dom.addEventerlisten(\"click\", () => {

```
// something
```

})

总结：当回调函数定义时候，不会立即执行而是等待一定时机执行的函数，如果有多个任务要有顺序的执行的话，那么如果使用回调函数这样的写法会容易造成回调地狱，为了避免回调地狱，es6引入了非常nice的promise和async/await来更优雅的处理回调

---

## 你对标签语义化的理解是什么？

说到语义化，提到我们公司有一个后端php小哥哥写前端代码的时候，几乎都使用H5的语义化标签，这种h5新语义化标签能给人带来 ”愉悦感“, 它能够让开发者或者机器解码的时候，更好的帮助机器去解码（因为语义化的缘故），也更利于seo的优化

---

## css常用的布局方式有哪些？

这是一个老生长谈的话题了，在我8岁那年（哈哈哈），table布局非常流行（我也是看其他博主说的，10年的时候，特别喜欢用table）因为非常快速，尤其是布局三栏，内容居中，又是自适应弹性，在那个时候不要太好用，但是非常不利于seo优化，因为table标签原因，而且在布局稍微复杂的页面，table中可能嵌套好几个table，那么代码变得非常的大且无用

再后来就是很流行的浮动布局，定位布局
再后来更先进的flex和grid出现，再加上css3的媒体查询的成熟，响应式网站层出不穷，而且布局变得越来越优雅且强大！

---

## 简要描述下JS有哪些内置的对象

Object, Array, Number,Regxp, Image, Symbol, Math , Date, Boolean , Error, Function
ps： 估计面试或者笔试没有人会问这种题，因为太....，你们懂的

---

## 常见的浏览器内核都有哪些？并介绍下你对内核的理解

webkit(谷歌) Blink Gecko（FireFox） Trident（IE）
内核 =》 渲染引擎 =》 js引擎 不知道这么理解是否通俗或者正确？

---

## 说说你对css盒子模型的理解

在面试中，非常容易问道，其实css盒子模型有2层，一个是外层，控制着于其他元素的距离，我们称之为外边距，一个是内层，控制着border和内容的距离，我们称之为内边距；我们一般使用的块级元素，一般是内层和外层都是块级，怎么解释呢？比如我们经常写的代码：display: block，它的全程是display: block-block，代表了外层和内层，inline-block同理；

每一个盒子的内盒子都会有一些属性，width/height，padding，border等控制
对于早期，计算一个元素的占据位置：会width + 2*padding + 2*border来计算，css3提出了box-sizeing：border-box，通过这样的设置，使得最终的大小就是设置的宽高，浏览器会自动调整；

---

## 写一个获取当前url查询字符串中的参数的方法

const getLocationParams = () => {
  const paramsMap = new Map();
  if (location.search) {

```
// 第一个字符串为 ?
location.search
  .substr(1)
  .split(\"&\")
  .forEach((param) => {
    const [key, value] = param.split(\"=\");
    paramsMap.set(key, value);
  });
  }

  return paramsMap;
};
```

笔试应该很少会考，知道用search提取就可以了；

---

## 网页应用从服务器主动推送到客户端有那些方式？

轮询根本不算，有些博客写的，用过轮询的人都知道（我没用过，哈哈），是客户端频繁发送请求，服务端给响应；

webscoket应该算一个主动推送，只要建立了连接
还有SSE, server send Event事件，也可以通过服务端自主推送 EventSouce对象

---

## html5中的form怎么关闭自动完成？

算冷知识了，autoComplate = off就关闭了

---

## ::before和:after中单冒号和双冒号的区别是什么，这两个伪元素有什么作用？

2019年了，不知道哪个公司还会问这种题，哎
在css老版本中，伪元素是用：的，但是为了区别新出的伪类，就改成了：：
作用：在元素的开头和结尾添加内容，不写content都是无用功；
可以用伪元素做一些非常nice的事情，比如用content做动画，清除浮动，取值等等，因为确实content玩法真的挺多，但是平时用的最多的还是清除浮动，clear：both；

![微信截图_20190819212524.png](https://www.yinzhuoei.com/usr/uploads/2019/08/3817492790.png)

---

## 说说你对javascript的作用域的理解

js中的作用域分为：全局作用域和局部作用域，srcipt包裹的标签中称之为最大的作用域，最大的作用域访问不了函数作用域中的变量，但是函数作用域可以（除非闭包）
函数体内定义的变量我们称之为函数作用域中的变量
对于es6新增的局部作用域可以用let表示，而常量可以用const表示不可修改的变量

关于作用域链：

要理解作用域链，我们可以用一个小demo来了解：

function funcA () {
let a;
function funcB () {
let b;
}
}

当创建了函数a中的变量a的时候，此函数作用域会入栈，又在函数a中定义了函数b，函数b也会入栈，那么在函数b中的变量是函数作用域，首先在本函数作用域中查找，如果没有根据栈中顺序，向上查找，如果在顶级作用域找不到的话，那么就是未定义的undefiend值

---

## 为什么HTML5只需要写<!DOCTYPE HTML>就可以？

因为HTML5和HTML4不一样，HTML4是基于SGML的标记语言，而H5不是，SGML规定需要引入DTD来规范浏览器的渲染模式，是严格模式和标准模式，如果不写会变成怪异模式

SGML是通用标记语言的集合，HTML和XML必须要引入DTD规范

---

## 什么是闭包？优缺点分别是什么？

这个应该是任何前端面试中必问的知识点了吧
了解闭包，我们需要通过一个demo

```
(fucntion(){
})()
function(){
  var a = 0;
 return function(){
   return a++
 }
}
```

如代码可见，我们在看作用于的时候就知道了，外部作用域是无法访问到函数作用域的，但是我们可以通过这样的方式来访问函数作用域中的变量，通过闭包可以拿到a的值

优点：有独立的作用域，方便访问函数作用域中的值
缺点：不会被自动销毁，如果不手动销毁，可能会造成内存泄漏

---

## title与h1的区别、b与strong的区别、i与em的区别？

这个笔试题比较常见噢

title是head标签中描述网页标签标题的标签，在seo中有很大的比重，代表了网站的名称信息
h1类似于word中的h1，粗体，html中最大原始字体

b代表着加粗，类似于word的加粗
strong表示加粗，强调作用

i代表着斜体，多用于图标字体
em代表着斜体，代表着注释，注解等等

---

## style标签写在body前和body后的区别是什么？

面试笔试常见题

dom和cssdom是并行解析的，如果把css放在dom之前解析，那么css组成样式附到dom树上，正常显示没有任何问题，但是如果写在body后或者中间，可能会造成FOUC，即一瞬间白屏，因为dom解析过程中，css发生了变化，要重绘/重排样式，会阻塞dom的渲染；

---

## 写一个数组去重的办法，支持多维数组

https://codesandbox.io/embed/currying-architecture-opq5p

---

## 元素的alt和title有什么区别？

alt最常见的是用在img标签上，当我们的img的src错误或者因为网络的原因加载不出来，那么alt的就指代当前图片的信息（比如：这是一个头像），在一些屏幕阅读器，alt也可以很好的帮助视觉障碍的残疾人辨别内容，再或者就是浏览器禁止了浏览图像，alt也会出现，现在的浏览器是鼠标放上去就会显示alt，但是这是不规范的行为，浏览器也在慢慢的转变的展现方式；
alt基本用在img，a，input中
img如上，是允许我们有1024个字符串，做一个图片的描述
a中的alt，也是在链接上做一些提示，让用户知道点击这个链接去了哪里？

title标签通常作为网页标题出现，是head标签中唯一要求的标签，通常也用在a，form中，为用户提供目标的简单信息

---

## 请描述margin边界叠加是什么及解决方案

只会在竖直盒子上出现，解决方案：给父元素加BFC，关于BFC，前面有提到，可以去看看

---

## 返回到顶部的方法有哪些？把其中一个方法出来

我记得好像是：
window.location.href + = \"#\"
document.documentElement.scrollTop = 0;

---

## 你认为table的作用和优缺点是什么呢

首先优点很多：提供的功能很强大，在我们做表格的时候，在以前做布局的时候，经常使用table，实现三栏布局非常快，而且天然弹性；
缺点：seo不好，如果作为布局来讲，代码会乱，阅读性差

---

## CSS sprites的原理和优缺点分别是什么？

这玩意就是我们工作中经常使用的雪碧图
原理：把多张图片/icon等图片素材通过工具拼成一张图片，然后利用backgroud-position，在业务中只需要知道图片的定位，就可以通过这样的方式来引入图片；

优点：避免了多张图片的请求，而且在一些业务中，比如点击某处换图片，如果网络有很大延迟，会造成图片丢失或者图片加载慢，那么就可以利用雪碧图来做；还有某些业务中制作帧动画用，非常nice
缺点：制作雪碧图需要时间，使用雪碧图需要时间，比如缺点它的位置，如果位置计算不好，很容易露出其他图片，如果要更新某一张icon的话，需要请求一整张图片，缓存会不起作用

而且在http2下，雪碧图请求次数减少这个优势已经荡然无存；

---

## typeof(\'abc\')和typeof \'abc\'都是string, 那么typeof是操作符还是函数？

记住，这个题，是个坑，很多人喜欢用前者
但是这个typeof是操作符，MDN截图：

![微信截图_20190822124212.png](https://www.yinzhuoei.com/usr/uploads/2019/08/1424617438.png)

typeof()，这个是一个可选选项，里面可以运算的！一般都会使用type0f校验undefined；
前面的题已经看过了，如何校验一个值的类型，typeof不可以校验Array和Object，一般都会使用
Object.prototype.toString.call();

---

## 说说你对SVN和GIT的理解和区别

一个软技能的题：SVN是集中管理，git是分布式管理
现在很多公司慢慢的摒弃了SVN，git是他们的最nice的选择

---

## 怎样在页面上实现一个圆形的可点击区域？

用canvas画一个圆形，然后监听点击事件
用map和area实现一个圆形，判断点击点是否在半径内
用css画一个radius 50%
用svg做一个圆

---

## 什么是FOUC？你是如何避免FOUC的？

FOUC个人理解就是：网页加载的时候一瞬间的白屏，是因为cssdom的渲染阻塞了html的渲染，导致domTree重新生成，所以会有一个一瞬间白屏；
通常只需要把cssdom优先解析htmlDom之前就好了
就是把style写在head中

---

## 你理解的\"use strict\";是什么?使用它有什么优缺点？

顾名思义，js中的严格模式，我们一般使用的是标准模式，在严格模式下有和标准模式区别的几点；
严格模式下，全局的this不是window是undefined
arguments不再追踪参数变化
禁止在函数内部遍历调用栈
全局变量必须显示声明

---

## 说说你对html中的置换元素和非置换元素的理解

html面试高频题目，一般技术官会这样挖坑：
请问img是行内元素嘛？
-是的
那么行内元素能设置宽高嘛
-不能
那么img既然是行内元素为什么能设置宽高等属性呢？
-沉默三分钟

那是因为img是行内置换元素，所谓置换元素是指，这个元素天生的属性，它不受css视觉模型化控制，所以说css渲染不会考虑对这个元素进行渲染，而img就是典型例子，非置换元素没有明确的定义，但是我们知道，除了置换元素之外的都是非置换元素；

---

## css的属性content有什么作用呢？有哪些场景可以用到？

是css伪元素的必写属性，不写content这个伪元素没用滴，之前前面介绍了伪元素after中的content用法，
可以做文本显示，动画显示，url锚点，还可以取dom值

---

## \"attribute\"和\"property\"有什么不同？

前者是HTML的DOM中的属性节点，后者是JS对象中的属性节点
前者是后者的集合
前者对大小写不敏感，后者对大小写敏感
前者只能存储字符串

---

## 请描述HTML元素的显示优先级

首先frameSet优先级最高
其次有窗口的比没窗口的优先级要高
最后是表单元素比普通元素高

css中的z-index可以调整他们的优先级，但是只能调整同等级的显示优先级，不在一个等级是不ok的，比如说我给input加z-index = 1个亿，都没用，大不了frameSet

---

## 要让Chrome支持小于12px的文字怎么做？

完了，冷知识来了，我想想
首先解释一下，为什么chrome浏览器不能允许比12px更小的字，因为他们认为12px是人类最低接受的最小文字字号，所以理论上来讲是不行的
如果真的有这样的业务，我们可以通过css来解决

有一个属性叫做（我去查一下，太冷门了）-webkit-text-size-adjust:none;
这个属性可以把这个限制去掉，但是只针对7版本（好像是），所以兼容是一个大问题，不推荐哦

要么就是用图片
要么就是用transform缩小
被榨干了，，，没办法了

---

## 写一个验证身份证号的方法

我实话实说吧，一般公司面试或者笔试不会出这样的问题，我选择go die，因为身份证它的规则我不知道呀，什么省区，代表的是啥我都不晓得，何谈正则去验证

```
function check(val){
    var reg=/^[1-9]\\d{5}(19|20)\\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|(10|20|30|31))\\d{3}[0-9Xx]$/;
     return reg.test(val);
}
```

---

## 谈谈你对input元素中readonly和disabled属性的理解

这个问题算是一个高频面试题啦，考察的点就是input中的只读2个属性
样式：前者背景透明，后者背景灰色并且鼠标呈不可选中状态
功能：前者可以通过js取值，但是后者不行（但是我试了，可以欸，你们自己测试一下）
请求：readonly在form表单提交中，会提交，后者不会提交
场景：前者只对input生效，后者可以对大多数表单元素生效

---

## 说说你对line-height是如何理解的？

行高，一般取值是整数，2，3这样子，意思是字体的多大倍数，也可以具体值12px，13px这样来取
指的是：2行文字之间的基线距离，偶尔会用它来做文本居中，这个居中严格意义来讲不是最精确居中而是近似居中；
而且对于非置换元素的行内元素来讲，line-height决定了他们的高

---

## 写一个方法验证是否为中文

这个...，只知道用unicode编码校验，中文都是有一个区间的，我去百度一下

```
function isChinese(str) {
  const re = /^[\\u4e00-\\u9fa5]+$/;
  return re.test(str);
}
```

这个正常智商的面试题是不会考的，太难记忆

---

## 来说说你对重绘和重排的理解，以及如何优化？

干货来了，目前我觉得最牛逼的一道软技能题
在构建标准html的时候，会分别构建cssDom和HTMLDom

![68747470733a2f2f696d61676573323031372e636e626c6f67732e636f6d2f626c6f672f313230393230352f3230313731302f313230393230352d32303137313031303135313933383032372d3538373338383838362e706e67.png](https://www.yinzhuoei.com/usr/uploads/2019/08/916479448.png)

如图，是这样的，看不懂没关系，我也看不懂；
首先我们要理解重绘和重排的概念到底是什么；
重绘：当颜色，字号，背景等表面纯样式发生了变化的话，要对对应的一小块dom进行重绘，就是把新的css挂到dom树上；
重排：当dom的位置，比如margin，padding，定位等元素的结构发生了变化，那么会触发重排，重排（回流），把所有的dom重新构建一遍，再进行重绘。。。
所以：重绘不一定会触发重排，但是重排一定会触发重绘
在浏览器加载网页的时候，最少会有一次重排+重绘，这一次是不可能优化的；

所以如何优化？
这个嘛，我想想；
浏览器会有一次自己的优化，会把所有的重流重绘操作放在一个队列中，等待达到一定数量或者时间，会一次执行，避免了浏览器多次执行重绘和重排
减少重排，再进行dom的移动等，可以把dom变为none或者透明度降低，或者脱离文档流
创建多个文档节点，用DocumentFragment，重排一次即可
使用cloneNode(true or false) 和 replaceChild 技术，引发一次回流和重绘；（这个是github的小伙伴说的，没用过也不太懂，这个你们可以了解一下，反正我不会了解的，哈哈）

---

## js放在html的和有什么区别？

js写在body前head中，在文档执行的时候，会下载并且执行js文件，那么这种情况下，势必会对后面的dom渲染进行阻塞，而且在大多数网站中，对于js文件放在head中的情况往往都是这些js文件将保证了下面的js文件能够正常访问，能够取绝项目的运行的关键js文件，才会放在最前面执行；

如果放在body中，那么会按照从上到下的解析规则不会对html造成阻塞；

---

## 说说浏览器解析CSS选择器的过程？

选择器是从右到左进行解析的，原因也很简单，这样的性能更棒，如果选择器是从左到右解析的话，会匹配出大量的错误结果，但是从右到左进行匹配就不一样了，一开始就是近似正确的结果，然后再匹配左边的依赖关系进行判断，性能要好得多；无非就是匹配范围的问题；

---

## 你对new操作符的理解是什么？手动实现一个new方法

算是一个比较基础的问题啦，
new是创建一个用户自定义的对象示例/具有构造函数的内置对象类型之一；
我们搞清楚，当new的时候，里面做了什么；
1.创建了新的对象
2.把新对象的原型指向了构造函数的prototype（new了一个示例）
3.把构造函数的this指向了新对象（用apply）
4.返回这个新的对象

```
function myNew(fn){
    let obj = {};
    Object.setPrototypeOf(obj , fn.prototype);
    obj.apply(fn)
    return obj;
}
```

---

## 关于标签的enctype属性你有哪些了解？

这个个人觉得是冷门知识了，但是有必要了解一下，这个属性规定了form表单传输数据的格式，
就是和请求头contentType一样，只不过他是写在form上而已，取值也很content-type一样

默认是会对所有字符进行编码，空格转换+，特殊字符转换ASCLL
muitipart/form-data 不对字符进行编码，传递文件时该值是必需的
text/plain 对空格进行编码，剩余不编码

---

## 说说CSS的优先级是如何计算的？

首先我们得聊聊选择器的种类，css有3大基本选择器，标签选择器，id，class，其余的兄弟选择器，通配符等等那都是后来的拓展，要说这个优先级，我们来说说一个名词叫做 “**特指度**”   ，顾名思义，表达了一个选择器的权重程度，除了这个名词还需要提到一个名词叫做：**ICE计算公式**
I：id，
C: class,
E: Element (标签选择器)

这个分别啊，他们的值是100，10，1 （权重大小）

注意：!important高于一切，*通配符低于一切
这个关于简洁css，高效css如何写呢？
之前也复习到了关于css的解析顺序是从右到左进行解析的，那么我们就可以知道这样是为了匹配速度更快，那么要写出高效的css，就要让浏览器（火眼金睛）一秒看到对于的dom是什么再渲染，那么就要减少这样的匹配，其实看一些ui框架，他们的类名嵌套，有1m多长，我很少写css，但是不太明白，写那么长，有一个class来的实在嘛，这样真的高效嘛？（其实另外的思路就是：ui框架的样式本来就是比较权重低的，为了用户更方便的覆盖他的样式，这样的解释也ok）；

---

## 0.1 + 0.2、0.1 + 0.3和0.1 * 0.2分别等于多少？并解释下为什么？

电脑面前的你不要算了，你的脱口而出的答案是不对的，当我们算这个数的时候，给他保留几十位数字看看，你会发现是这样的

```
0.100000000000000002 === 0.1//true
```

这是为什么呢？这也是一些面试官喜欢刁难小白程序员的题，其实js采用的是IEEE754双精度标准，这个数不用刻意记忆，只需要知道js是双精度标准的，js在一些运算上是有一个理论值，这个理论值只能保证它的前几位是正确的，后几十位不正确说明了精度不足；不是所有的浮点数都会有误差噢，二进制能精准的表现出位数有限且分母是2的小数，向题这种情况，就是避开了这个选择导致精度不足滴；

---

## 说说你对属性data-的理解

这个属性是H5新出来的，我称之为（DIY属性）它允许我们刻意使用data-来在标签中存储一个值，并且刻意通过js取出，一些图片懒加载的库就是基于这种原理+视口移动加载做出来的；一般业务偶尔可能会遇到用data-**来携带一些参数做跳转等；

---

## 你有用过CSS预处理器吗？喜欢用哪个？原理是什么？

一直在用，一般使用stylus，这个处理器比较年轻，平时用预处理器用的一般都是嵌套css，不用写冒号，这种普通的减少代码，再然后就是函数，比如字超出使用省略号表达，可以通过stylus来封装一个函数，在css引入并且调用，当然写一个复杂逻辑样式，也可以使用变量做一些运算，但是用的比较少，普遍来讲用calc比较多；它的作用无非就是上面说的，还有就是为了css，js的模块化吧，这也是我个人的理解；

关于原理：问道预处理器的原理来说，我估计很少会问道，可能面试官自己也不知道，但是如果有兴趣的朋友可以了解一下**AST抽象语法树**，了解这个不仅仅是为了应付这个题，也不是应付面试，而是为自己知识做扩充

这一块，就不细说了，因为原理这一块也是本人的薄弱...

---

## 如何快速让一个数组乱序，写出来

别用sort()，对一些大样本进行乱序的时候，会发现原本的值会停留在本来的位置
引用github一位网友的话说的特别好：

v8处理排序是小于10个是插入排序，大于10个是快排，排序算法复杂度介于O(n)与O(n2)之间，也就是存在两个元素都没有比较的机会，因此不是完全随机

少年，务实一点，写一个洗牌吧！

```
function shuffle(arr){
    let _arr = arr.slice();
    _for (let i = 0; i < _arr.length; i++) {
        let j = getRanDomNumber(0, i);
        let t = _arr[i];
        _arr[i] = _arr[j];
        _arr[j] = t;
    }
    return _arr
    }

    function getRanDomNumber(min,max){
        return Math.floor(Math.random() * (max - min + 1))
    }
```

---

## 请说说、<script async>和<script defer>的区别</h2><p>高频面试：<br>第一个：在执行html的时候，会下载并且立刻执行js内容，会阻塞html的渲染<br>第二个，在执行HTML的时候，会异步下载并且异步执行不会阻碍html渲染<br>第三个，在执行HTML的时候，会异步下载，但是是等到所有文档渲染完毕之后再执行</p><hr><h2>在页面中的应该使用奇数还是偶数的字体？为什么呢？</h2><p>习惯：佛系<br>但是，哈哈哈，正确标准来讲，还是使用偶数吧，因为计算好算，而且一般ui给的也是偶数像素，建议使用偶数，因为之前瞟了一眼一个文章标题：在1.5dpr的屏幕上奇数字体有坑，具体没有看，看官可以搜一下；</p><hr><h2>写一个判断设备来源的方法</h2><p>navigator.userAgent;</p><hr><h2>解释下你对GBK和UTF-8的理解？并说说页面上产生乱码的可能原因</h2><p>高频面试题了<br>首先GBK是简体中文，UTF-8是全世界通用的编码，里面涵盖了人类基本上能叽里呱啦说的全部语言，在web方向写html的时候，UTF-8也是不成文的规定，产生乱码的原因有很多种，大多数都是编码导致的，由于UTF-8涵盖语言很多，所以内存也会大，所以在加载网页肯定是要比GBK慢的</p><p>关于解决乱码：一般来讲，设置meta标签（content，charset），搞一下编码足矣，但是不排除特殊情况<br>产生乱码的原因</p><p>html乱码原因与网页乱码解决方法： <a href="http://www.akhtm.com/manual/charset-error.htm">http://www.akhtm.com/manual/charset-error.htm</a><br>网页乱码的产生原因与解决：<a href="http://www.akhtm.com/manual/charset-error.htm">http://www.akhtm.com/manual/charset-error.htm</a><br>参考：<br>让你彻底搞定各种编码来源ASCII、ANSI、GBK、unicode、UTF-8等<a href="https://blog.csdn.net/wskzgz/article/details/88710263">https://blog.csdn.net/wskzgz/article/details/88710263</a><br>web程序网页出现乱码的原因分析：<a href="https://blog.csdn.net/senlin1202/article/details/50800187">https://blog.csdn.net/senlin1202/article/details/50800187</a></p><hr><h2>说说你对z-index的理解</h2><p>这道题之前说过，z-index允许我们操作同等级的html元素在view视觉效果上，也就是x,y,z中的z轴距离我们的眼球更近（说的这么抽象，也就是谁在上面，谁在下面显示），一些基本元素，背景，颜色等会自带层级，日常基本不会使用到z-index，除了一些弹窗布局，如果你使用z-index比2大，那么就证明你的布局能力不行；细细想想会觉得我说的很有道理</p><hr><h2>说说bind、call、apply的区别？并手写实现一个bind的方法</h2><p>这个绝对算高频了，也是日常开发中比较常用到的，3种调用函数的方式，首先他们都可以改变调用函数的this并且执行（bind不会立刻执行）</p><p>apply支持传入一个数组参数<br>apply(this, [1,2,3,4]);<br>call(this, 1,2,3,4);<br>这就是apply和call的不同，传递参数的方式<br>bind也是支持传入一个数组，但是不会立刻执行，会返回一个新的函数，在适当的时机进行调用；</p><p>实现一个bind</p><pre><code>Function.prototype.myBind(context,...args){
 return function(){
   return this.apply(context,args)
 }
}
</code></pre><hr><h2>说说你对影子(Shadow)DOM的了解</h2><p>算是一个比较少问道的面试题，也算是一个很有技术含量的话题，这里的shadowDom不是你们说的box-shadow那个盒子阴影</p><p>shadowBox可以理解为web方向的components，就像我们写react和vue一样，一个一个组件，这个shadow也是一样，它允许我们引入一个tamplate，将模板中的内容push到正常dom的children中，通常来讲，他们是不互通的，在正常dom是取不到影子dom中的东西，内部的样式影响不了外面，外部也如此，是一个独立的结界；它有2种模式，close和open，open模式下可以访问到shdow中的内容，close下虽然表面不可以，但是可以通过一些其他办法来访问...</p><p>个人对shdow的理解，其实会好奇，vue，react遍地的前端，shadowdom真的有人会用么，其实大家熟悉的video标签就是shadow最经典的实现</p><p>github答题者的图，感谢了</p><p><img src="https://www.yinzhuoei.com/usr/uploads/2019/08/1908115104.png" alt="68747470733a2f2f696d6731322e333630627579696d672e636f6d2f6c696e672f6a66732f74312f38313530372f33352f323234362f3730373333372f35643038646165394562643234373230612f396663623835623732616433333738392e706e67.png" title="68747470733a2f2f696d6731322e333630627579696d672e636f6d2f6c696e672f6a66732f74312f38313530372f33352f323234362f3730373333372f35643038646165394562643234373230612f396663623835623732616433333738392e706e67.png"></p><p>刚刚提到的原理，MDN图</p><p><img src="https://www.yinzhuoei.com/usr/uploads/2019/08/2596065513.png" alt="68747470733a2f2f6d646e2e6d6f7a696c6c6164656d6f732e6f72672f66696c65732f31353738382f736861646f772d646f6d2e706e67.png" title="68747470733a2f2f6d646e2e6d6f7a696c6c6164656d6f732e6f72672f66696c65732f31353738382f736861646f772d646f6d2e706e67.png"></p><hr><h2>怎样修改chrome记住密码后自动填充表单的黄色背景？</h2><p>这个算什么题...<br>首先我们知道填充表单的黄色背景是autoComplate=“on”自动开启的，如何改变样式，看看浏览器提供样式是什么？</p><p>这题，老沈就撤了，没遇到过这样的需求，给大家贴一个<a href="https://segmentfault.com/q/1010000000671971">https://segmentfault.com/q/1010000000671971</a></p><p>很多网站用的是内阴影实现的，具体你们可以参考一下</p><hr><h2>说说你对arguments的理解，它是数组吗？</h2><p>他不是数组，他是类数组对象，什么叫做类数组对象，类数组对象顾名思义，类似数组的对象，有着几个特性：</p><p>有着自增key，<br>它的length是自增的</p><p>arguments是实参对象的一个引用，当我们改变arguments中的值，也会改变实参中的值，可以方便的使用arguments[0],[1]方便取参数，非常好用</p><p>我们可以使用Array.from(arguments)转换真正的数组</p><p>和arguments类似的类数组对象还有：document.getElementByClassName(\&quot;**\&quot;)[1]，这个取出来也是类数组</p><hr><h2>说说你对<meta>标签的理解</h2><p>meta标签，在HTML的定义中，meta算是一个空白，它更像是一个行业约定，你可以在meta中定义作者，viewport视口，编码，seo等等事情，你甚至可以自定义</p><p>这一块，属于硬核知识点，需要大家去总结和慢慢啃<br><a href="https://segmentfault.com/a/1190000004279791">https://segmentfault.com/a/1190000004279791</a></p><hr><h2>rgba()和opacity这两个的透明效果有什么区别呢？</h2><p>opacity是纯透明设置，可以把一个块都消失了<br>但是rgba可以设置颜色，透明度只是它额外的选项，只对颜色有效<br>opactiy是一个属性，rgba是一个函数，计算后是某一个属性值<br>transparent 也是透明，是个属性值，颜色值，跟#000是一类，不过它是关键字来描述。</p><hr><h2>[].forEach.call($$(\&quot;<em>\&quot;),function(a){ a.style.outline=\&quot;1px solid #\&quot;+(~~(Math.random()</em>(1&lt;&lt;24))).toString(16) })解释一下这个代码的意思</h2><p>这是一个很新潮的代码，把他运行在自己的浏览器中，你会发现很好玩的一幕</p><p>我们来逐步解析一下这句代码：<br>[].forEach.call =》 调用数组的foreach方法<br>$$(\&quot;<em>\&quot;) =》document.querySelectorAll(\&quot;</em>\&quot;); 取所有的dom<br>a.style.outline =》 这个a不是a标签，是循环出来的每个dom，这个就是给每个dom加边框线样式<br>~~ =》 parseInt() 转换整数<br>Math.random()*(1&lt;&lt;24))).toString(16) 获得了一个位于0-16777216之间的随机整数，也就是随机颜色，再使用toString(16)将它转化为十六进制数。</p><p>作用：给网页的每个dom上，绘制了一个五颜六色的边框线</p><p>这种题，当作一个乐呵就行，也没人会考，知道干啥，说出思路就行了</p><hr><h2>在浏览器中输入url到页面显示出来的过程发生了什么？</h2><p>老生长谈的话题呀：<br>首先我们输入百度.com，通过DNS解析得到ip，再通过ip向服务器发起tcp链接，发送请求，服务端返回结果，浏览器进行html的重排解析，关闭链接</p><p>这个只是概述，其实还是比较复杂的</p><p>就比如说DNS解析这一块，客户端会解析http或者https，再寻找ip，从DNS服务器找，一层一层找，直到找到ip，和HTTP建立（3次握手），建立成功，服务端返回数据，html进行dom构建，css构建，js的资源下载<br>这里面又会牵扯到重排和重绘的概念，又可能会牵扯到FOUC的问题，js资源阻塞问题等等</p><hr><h2>你了解什么是无障碍web（WAI）吗？在开发过程中要怎么做呢？</h2><p>简单了解过；是给残障人士的一种web方向的特殊关怀，前端在编码过程中，需要注意，比如图片img标签，写好alt，做好描述，button添加标题，尽量使用语义化标签，表单尽量使用label关联input</p><hr><h2>请描述css的权重计算规则</h2><p>这个我之前好像大篇幅的描述过了，简单来讲就是，!import最高，下来是标签中的css，再下来根据ICE计算公式，id=1000, class=100, elment = 10,其余全部是1，记住*通配符是最小的</p><p>关于权重计算规则，要知道，class中，引入的class和引入顺序没关系，是和css代码/文件引入有关系</p><pre><code>这道题去年推特上一个大神发的，几千个人只有一半人对。。。

两个123颜色是啥？

&lt;div class=\&quot;red blue\&quot;&gt;123&lt;/div&gt;
&lt;div class=\&quot;blue red\&quot;&gt;123&lt;/div&gt;
.red {
  color: red;
}

.blue {
  color: blue
}
</code></pre><p>都是蓝色，因为.blue在.red下面，css权重解析式不看你class引入顺序的，看你文件中的顺序</p><hr><h2>写一个获取数组的最大值、最小值的方法</h2><p>Math.max(...arr);<br>Math.min(...arr);<br>es5兼容写法：<br>Math.max.apply(this, arr);<br>补充:<br>Array.prototype.max = function() {<br>   return Math.max.apply(null, this)<br>}</p><hr><h2>网页上的验证码是为了解决什么问题？说说你了解的验证码种类有哪些</h2><p>图片，滑块，点击识字，拼图，短信，语音，密保，盾牌<br>奇葩的是：12306的验证码</p><hr><h2>描述下你所了解的图片格式及使用场景</h2><p>gif： 动态图片，支持无损耗压缩<br>png: 图片清晰，饱和，边线锋利，内存大，能够在保证不失真情况下压缩，表现特别好，不适合web，会加载过多资源<br>jpg：有损压缩，内存小，加载速度快，色彩饱和，多用于摄影作品<br>svg: 矢量图形，没有像素这一说，可以通过js实现nice动画效果，和html不太好搭配，加载慢</p><hr><h2>写一个方法判断字符串是否为回文字符串</h2><pre><code>function test(str){
    let _str = str.split(\&quot;\&quot;).reverse().join(\&quot;\&quot;);
    if(_str === str){
        return true
    }
}
</code></pre><p>过几天如果有时间会更新企业面试题，期待吧，收藏先！！</p>        </div>
        <p itemprop="keywords" class="tags">标签: none</p>
    </article>

    <div id="comments">
        
        <div id="respond-post-99" class="respond">
        <div class="cancel-comment-reply">
        <a id="cancel-comment-reply-link" href="https://yinzhuoei.com/index.php/archives/99/#respond-post-99" rel="nofollow" style="display:none" onclick="return TypechoComment.cancelReply();">取消回复</a>        </div>
    
    	<h3 id="response">添加新评论</h3>
    	<form method="post" action="https://yinzhuoei.com/index.php/archives/99/comment" id="comment-form" role="form">
                		<p>
                <label for="author" class="required">称呼</label>
    			<input type="text" name="author" id="author" class="text" value="" required />
    		</p>
    		<p>
                <label for="mail">Email</label>
    			<input type="email" name="mail" id="mail" class="text" value="" />
    		</p>
    		<p>
                <label for="url">网站</label>
    			<input type="url" name="url" id="url" class="text" placeholder="http://" value="" />
    		</p>
                		<p>
                <label for="textarea" class="required">内容</label>
                <textarea rows="8" cols="50" name="text" id="textarea" class="textarea" required ></textarea>
            </p>
    		<p>
                <button type="submit" class="submit">提交评论</button>
            </p>
    	</form>
    </div>
    </div>

    <ul class="post-near">
        <li>上一篇: <a href="https://yinzhuoei.com/index.php/archives/98/" title="前端3周的面试题大总结附全套的答案心得">前端3周的面试题大总结附全套的答案心得</a></li>
        <li>下一篇: <a href="https://yinzhuoei.com/index.php/archives/110/" title="WOW！这就是mustache.js！一个有灵魂的模板引擎">WOW！这就是mustache.js！一个有灵魂的模板引擎</a></li>
    </ul>
</div><!-- end #main-->

<div class="col-mb-12 col-offset-1 col-3 kit-hidden-tb" id="secondary" role="complementary">
        <section class="widget">
		<h3 class="widget-title">最新文章</h3>
        <ul class="widget-list">
            <li><a href="https://yinzhuoei.com/index.php/archives/874/">2025 年终总结：婚姻、代码与荧幕</a></li><li><a href="https://yinzhuoei.com/index.php/archives/851/">2026 AI 编程工具大逃杀：从 Vibe Coding 到生产力革命</a></li><li><a href="https://yinzhuoei.com/index.php/archives/830/">吉隆坡-兰卡威之行简版攻略</a></li><li><a href="https://yinzhuoei.com/index.php/archives/829/">2024年终总结</a></li><li><a href="https://yinzhuoei.com/index.php/archives/824/">一个关于GUI面板软件的想法</a></li><li><a href="https://yinzhuoei.com/index.php/archives/818/">时间紧迫，我们快速过一下最新的Vue3.3</a></li><li><a href="https://yinzhuoei.com/index.php/archives/813/">小聊一下Typescript 5.0-beta带来了什么</a></li><li><a href="https://yinzhuoei.com/index.php/archives/803/">前端人需要掌握的HTTP知识</a></li><li><a href="https://yinzhuoei.com/index.php/archives/794/">时隔2年锈迹斑斑的Vue3知识点</a></li><li><a href="https://yinzhuoei.com/index.php/archives/793/">2022年终总结</a></li>        </ul>
    </section>
    
        <section class="widget">
		<h3 class="widget-title">最近回复</h3>
        <ul class="widget-list">
                            <li><a href="https://yinzhuoei.com/index.php/mylife.html/comment-page-1#comment-299">seho</a>: 最近在工作中高强度的在OMO上使用GPT-5.6 Sol作为主编...</li>
                    <li><a href="https://yinzhuoei.com/index.php/mylife.html/comment-page-1#comment-298">seho</a>: 最近使用OpenClaw，把我博客最近9年的文章全部润色了一遍，...</li>
                    <li><a href="https://yinzhuoei.com/index.php/archives/692/comment-page-1#comment-230">wer</a>: wer</li>
                    <li><a href="https://yinzhuoei.com/index.php/archives/776/comment-page-1#comment-229">Zoupers</a>: rust 也有库, 名字就叫 numhttps://crates...</li>
                    <li><a href="https://yinzhuoei.com/index.php/archives/793/comment-page-1#comment-228">Aye</a>: 多谢大佬的分享交流回复，关于语言的学习很有帮助，谢谢啦（∩▽∩）</li>
                    <li><a href="https://yinzhuoei.com/index.php/archives/793/comment-page-1#comment-227">seho</a>: 确实没错, ts本身我们在学习很多概念, 比如元组, 联合类型,...</li>
                    <li><a href="https://yinzhuoei.com/index.php/archives/793/comment-page-1#comment-226">seho</a>: hello, 先回复你的第一个问题, 你在写react的时候有拆...</li>
                    <li><a href="https://yinzhuoei.com/index.php/archives/793/comment-page-1#comment-225">Aye</a>: 今年主要学了学react，很喜欢jsx混合的写法，写的时候很方便...</li>
                    <li><a href="https://yinzhuoei.com/index.php/mylife.html/comment-page-1#comment-224">왕선생</a>: 포기하지</li>
                    <li><a href="https://yinzhuoei.com/index.php/mylife.html/comment-page-1#comment-223">seho</a>: 离职之后的打算就是, 下周周内等一个offer, 差不多下周就入...</li>
                </ul>
    </section>
    
        <section class="widget">
		<h3 class="widget-title">分类</h3>
        <ul class="widget-list"><li class="category-level-0 category-parent"><a href="https://yinzhuoei.com/index.php/category/qianduan/">前端</a></li><li class="category-level-0 category-parent"><a href="https://yinzhuoei.com/index.php/category/houtai/">后端</a></li><li class="category-level-0 category-parent"><a href="https://yinzhuoei.com/index.php/category/zixunnews/">资讯</a></li><li class="category-level-0 category-parent"><a href="https://yinzhuoei.com/index.php/category/laoke/">唠嗑</a></li><li class="category-level-0 category-parent"><a href="https://yinzhuoei.com/index.php/category/%E7%B2%BE%E8%AF%BB/">精读</a></li><li class="category-level-0 category-parent"><a href="https://yinzhuoei.com/index.php/category/rust/">Rust</a></li><li class="category-level-0 category-parent"><a href="https://yinzhuoei.com/index.php/category/Go/">Go</a></li><li class="category-level-0 category-parent"><a href="https://yinzhuoei.com/index.php/category/design/">设计</a></li><li class="category-level-0 category-parent"><a href="https://yinzhuoei.com/index.php/category/%E4%BA%91%E5%8E%9F%E7%94%9F-K8S/">云原生/K8S</a></li><li class="category-level-0 category-parent"><a href="https://yinzhuoei.com/index.php/category/Serverless-Faas/">Serverless/Faas</a></li><li class="category-level-0 category-parent"><a href="https://yinzhuoei.com/index.php/category/%E7%A8%8B%E5%BA%8F%E5%91%98%E6%8A%A4%E8%82%A4%E5%85%BB%E7%94%9F%E6%8C%87%E5%8D%97/">程序员护肤养生指南</a></li></ul>	</section>
    
        <section class="widget">
		<h3 class="widget-title">归档</h3>
        <ul class="widget-list">
            <li><a href="https://yinzhuoei.com/index.php/2026/02/">February 2026</a></li><li><a href="https://yinzhuoei.com/index.php/2026/01/">January 2026</a></li><li><a href="https://yinzhuoei.com/index.php/2025/04/">April 2025</a></li><li><a href="https://yinzhuoei.com/index.php/2025/01/">January 2025</a></li><li><a href="https://yinzhuoei.com/index.php/2023/09/">September 2023</a></li><li><a href="https://yinzhuoei.com/index.php/2023/05/">May 2023</a></li><li><a href="https://yinzhuoei.com/index.php/2023/03/">March 2023</a></li><li><a href="https://yinzhuoei.com/index.php/2023/01/">January 2023</a></li><li><a href="https://yinzhuoei.com/index.php/2022/12/">December 2022</a></li><li><a href="https://yinzhuoei.com/index.php/2022/10/">October 2022</a></li><li><a href="https://yinzhuoei.com/index.php/2022/09/">September 2022</a></li><li><a href="https://yinzhuoei.com/index.php/2022/07/">July 2022</a></li><li><a href="https://yinzhuoei.com/index.php/2022/06/">June 2022</a></li><li><a href="https://yinzhuoei.com/index.php/2022/03/">March 2022</a></li><li><a href="https://yinzhuoei.com/index.php/2022/02/">February 2022</a></li><li><a href="https://yinzhuoei.com/index.php/2022/01/">January 2022</a></li><li><a href="https://yinzhuoei.com/index.php/2021/12/">December 2021</a></li><li><a href="https://yinzhuoei.com/index.php/2021/11/">November 2021</a></li><li><a href="https://yinzhuoei.com/index.php/2021/10/">October 2021</a></li><li><a href="https://yinzhuoei.com/index.php/2021/09/">September 2021</a></li><li><a href="https://yinzhuoei.com/index.php/2021/08/">August 2021</a></li><li><a href="https://yinzhuoei.com/index.php/2021/06/">June 2021</a></li><li><a href="https://yinzhuoei.com/index.php/2021/04/">April 2021</a></li><li><a href="https://yinzhuoei.com/index.php/2021/03/">March 2021</a></li><li><a href="https://yinzhuoei.com/index.php/2021/02/">February 2021</a></li><li><a href="https://yinzhuoei.com/index.php/2020/12/">December 2020</a></li><li><a href="https://yinzhuoei.com/index.php/2020/11/">November 2020</a></li><li><a href="https://yinzhuoei.com/index.php/2020/10/">October 2020</a></li><li><a href="https://yinzhuoei.com/index.php/2020/09/">September 2020</a></li><li><a href="https://yinzhuoei.com/index.php/2020/08/">August 2020</a></li><li><a href="https://yinzhuoei.com/index.php/2020/06/">June 2020</a></li><li><a href="https://yinzhuoei.com/index.php/2020/05/">May 2020</a></li><li><a href="https://yinzhuoei.com/index.php/2020/04/">April 2020</a></li><li><a href="https://yinzhuoei.com/index.php/2020/03/">March 2020</a></li><li><a href="https://yinzhuoei.com/index.php/2020/01/">January 2020</a></li><li><a href="https://yinzhuoei.com/index.php/2019/12/">December 2019</a></li><li><a href="https://yinzhuoei.com/index.php/2019/11/">November 2019</a></li><li><a href="https://yinzhuoei.com/index.php/2019/10/">October 2019</a></li><li><a href="https://yinzhuoei.com/index.php/2019/09/">September 2019</a></li><li><a href="https://yinzhuoei.com/index.php/2019/08/">August 2019</a></li><li><a href="https://yinzhuoei.com/index.php/2019/06/">June 2019</a></li><li><a href="https://yinzhuoei.com/index.php/2019/03/">March 2019</a></li><li><a href="https://yinzhuoei.com/index.php/2019/01/">January 2019</a></li><li><a href="https://yinzhuoei.com/index.php/2018/12/">December 2018</a></li><li><a href="https://yinzhuoei.com/index.php/2018/11/">November 2018</a></li><li><a href="https://yinzhuoei.com/index.php/2018/10/">October 2018</a></li><li><a href="https://yinzhuoei.com/index.php/2018/09/">September 2018</a></li><li><a href="https://yinzhuoei.com/index.php/2018/08/">August 2018</a></li><li><a href="https://yinzhuoei.com/index.php/2018/07/">July 2018</a></li>        </ul>
	</section>
    
    	<section class="widget">
		<h3 class="widget-title">其它</h3>
        <ul class="widget-list">
                            <li class="last"><a href="https://yinzhuoei.com/admin/login.php">登录</a></li>
                        <li><a href="https://yinzhuoei.com/index.php/feed/">文章 RSS</a></li>
            <li><a href="https://yinzhuoei.com/index.php/feed/comments/">评论 RSS</a></li>
            <li><a href="http://www.typecho.org">Typecho</a></li>
        </ul>
	</section>
    
</div><!-- end #sidebar -->

        </div><!-- end .row -->
    </div>
</div><!-- end #body -->

<footer id="footer" role="contentinfo">
    &copy; 2026 <a href="https://www.yinzhuoei.com/">因卓诶-爱分享爱原创Blog</a>.
    由 <a href="http://www.typecho.org">Typecho</a> 强力驱动.
</footer><!-- end #footer -->

<script type="text/javascript">
	(function(){
		var pres = document.querySelectorAll('pre');
		var lineNumberClassName = 'line-numbers';
		pres.forEach(function (item, index) {
			item.className = item.className == '' ? lineNumberClassName : item.className + ' ' + lineNumberClassName;
		});
	})();
