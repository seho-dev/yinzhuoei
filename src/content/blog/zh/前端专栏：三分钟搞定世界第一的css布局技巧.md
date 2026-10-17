---
title: "前端专栏：三分钟搞定世界第一的css布局技巧"
description: "众所周知，css的世界，网页布局技术一直是占据着前端工程师几乎每天都会接触的东西； 从最早的，table布局，定位，浮动，margin，padding 到现在比较先进的flex 但是讲真，在flex之前，我们的布局技术感觉力不从心，flex问世之后布局的春天也…"
date: 2019-03-25
lang: zh
translationKey: "2019-03-25_91_前端专栏：三分钟搞定世界第一的css布局技巧"
categories:
  - "唠嗑"
views: 6448
draft: false
---

众所周知，css的世界，网页布局技术一直是占据着前端工程师几乎每天都会接触的东西；
从最早的，table布局，定位，浮动，margin，padding
到现在比较先进的flex
但是讲真，在flex之前，我们的布局技术感觉力不从心，flex问世之后布局的春天也慢慢来了，但是作为IT界，越晚来的技术一定是最牛逼的，这一点已经在很多框架和技术点上已经见证了，这个技术就是grid!

grid作为最先进的网格布局，上手非常快，也非常简单，但是还是有很多专门写css的前端程序员不知道grid，压根没听过，说明渗透率比flex低，所以今天这个文章，老沈保证三分钟看完所有常用知识点，就可以在项目中进行实战练习了。

---

第一分钟：

建立dom和初始化grid布局

HEADER
MENU
CONTENT
FOOTER

.container {
 display: grid;
 grid-template-columns: repeat(12, 1fr);
 grid-template-rows: 50px 350px 50px;
 grid-gap: 5px;
 }
网格布局的容器：
1.声明display:grid 
2.行 用repeat函数拆分成12列，每一列为1fr（份） 份的意思：除去确定尺寸，剩下将会自动平均分配，1fr就是一份
3.列 确定了3行，第一行的高是50，第二行是350px，第三行是50px
4.（可选）网格之间的间隙，还可传入2个参数，一个是列 / 行

---

第一分钟看完了？我们看看实际的效果。

![QQ截图20190325142412.png](https://www.yinzhuoei.com/usr/uploads/2019/03/1187606891.png)

---

第二分钟：
其次，为了把网格利用的非常好，我们需要来用div填格子；
1.在子div中我们可以通过grid-column-start 和 grid-column-end来规定开始和结束的网格线，ps:如果宽12列，那么加上最左边和最右边就是13条网格线（11+2，12列11条线），所以如果要沾满第一行，就必须是从1到13，可以用代码这样写：

grid-column-start:1
 grid-column-end:13
为了简写我们可以grid-column:1/13
2.行是这样，列也是同理

---

第二分钟看完了？我们看看实际的效果

## ![QQ截图20190325143906.png](https://www.yinzhuoei.com/usr/uploads/2019/03/1392284816.png)

第三分钟

我们再来一种不一样的方式布局，如果数格子太low了，我们有没有更简单的方法，答案是有
我们可以利用

grid-template-areas:
 "h h h h h h h h h h h h"
 "m m c c c c c c c c c c"
 "f f f f f f f f f f f f";
第一眼是不是没看懂？hhh mm cc ff是啥玩意啊，这个是自己定义，这个代码的意思就是说我在父元素定义了这个布局，我的子元素只要和这个hh mm进行一个标识匹配就可以不用数格子，那如何匹配呢？

.header {
 grid-area: h;
 }

天哪，这么秀的吗？不仅仅可以这么秀，如果你要空隙咋办？

grid-template-areas:
 ". h h h h h h h h h h ."
 "m m c c c c c c c c c c"
 "f f f f f f f f f f f f";

通过.的占位符就可以留出空隙了，我们可以结合媒体查询写一个非常简单的响应式布局；

---

@charset "utf-8";
.container {
 display: grid;
 grid-template-columns: repeat(12, 1fr);
 grid-template-rows: 50px 350px 50px;
 grid-gap: 5px;
 /*图表可视化表示*/
 grid-template-areas:
 "m m h h h h h h h h h h"
 "m m c c c c c c c c c c"
 "f f f f f f f f f f f f";
}

.header {
 grid-area: h;
 background: red;
}
.menu {
 grid-area: m;
 background: blue;
}
.content {
 grid-area: c;
 background: yellowgreen;
}
.footer {
 grid-area: f;
 background: black;
}
@media screen and (max-width: 640px){
 .container {
 display: grid;
 grid-template-columns: repeat(12, 1fr);
 grid-template-rows: 50px 350px 50px;
 grid-gap: 5px;
 /*图表可视化表示*/
 grid-template-areas:
 "h h h h h h h h h h m m"
 "c c c c c c c c c c c c"
 "f f f f f f f f f f f f";
 }
}

---

结束；转载请说明出处-因卓诶老沈
