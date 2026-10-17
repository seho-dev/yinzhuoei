---
title: "重点复习：37-60天的面试题+额外拔高题"
description: "答案可能不完整，面试/笔试回答仅供参考，大家一起学习。 BOM 和 DOM 的区别 BOM DOM。BOM 是浏览器对象，DOM 是文档结构对象。BOM 提供浏览器 API，DOM 提供文档 API。两者在 Node 中不存在。 如何让字体更清晰 - 选用更清…"
date: 2019-10-05
lang: zh
translationKey: "2019-10-05_122_重点复习：37-60天的面试题+额外拔高题"
categories:
  - "唠嗑"
views: 5655
draft: false
---

答案可能不完整，面试/笔试回答仅供参考，大家一起学习。

**BOM 和 DOM 的区别**

BOM > DOM。BOM 是浏览器对象，DOM 是文档结构对象。BOM 提供浏览器 API，DOM 提供文档 API。两者在 Node 中不存在。

**如何让字体更清晰**

- 选用更清晰的 font-family
- 图片
- 谷歌属性抗锯齿 `font-smoothing`，但兼容性不好

**HTML 元素显示优先级**

- frameset 最高
- 有窗口的比没窗口的高（video、audio）
- 表单元素比非表单元素高
- z-index 能提升同等级元素的高度，不能跨等级

**line-height 5 种赋值方式的区别**

- 默认行高
- 数字：父元素 font-size 倍数
- 固定值：固定行间距
- %：父元素 font-size 百分比
- inherit：继承

**造成内存泄漏的操作**

递归、闭包、定时器没 clear 等。

**HTML 和 HTML5 的区别**

- 标准：HTML 基于 SGML，HTML5 不是，所以 HTML 要写 DTD 规范
- 语义化：H5 新增语义化标签更友好
- SEO：支持更好
- 功能：CANVAS、音频媒体支持，可以做游戏、可穿戴设备
- 全面拥抱移动端

**用 CSS 绘制三角形**

利用 border 切口是三角形的特性。宽高为 0，隐藏两边，显示一边扩大 border 宽度。

**对 this 的理解**

this 指的是当前运行时的上下文，会发生改变。apply、call、bind 可以改变 this。

- 非严格模式：全局 this 是 window
- 函数 this：谁调用它，谁就是 this

**Standards 和 Quirks 模式的区别**

- 标准模式：w3c 规定的标准
- 怪异模式：兼容旧浏览器

标准模式下宽度是内容宽度，怪异模式下是 border + padding + 内容。可以 `box-sizing: border-box` 使用怪异模式。

**浏览器判断元素是否匹配 CSS 选择器**

浏览器解析文档时，会把最后一个索引的元素集合到一个集合中。选择器从右到左查找，从集合中移除不匹配的元素，直到留下成功的。

**用 div 写出类似 textArea 的效果**

```html
<div contenteditable="true" style="resize: both; width: 300px; height: 200px; padding: 5px; border: solid 1px #ccc; overflow: auto;"></div>
```

**使用 flex 实现三栏布局**

中间写在最前面（优先渲染）：

```css
.container { display: flex; }
.left, .right { flex: 0 0 auto; }
.center { flex: 1 1 auto; }
```

**为什么 10.toFixed(10) 会报错**

浏览器解析 JS 时，小数点既是小数点也用于调用方法。10 后面跟的小数点被当成小数，不是方法调用，造成冲突。

- `10..toFixed(10)` 或 `(10).toFixed(10)` 不会报错

**前端性能优化**

- 雪碧图、WebSocket（不用轮询）
- 图片服务器、CDN、代码分割
- 减少 DOM 操作、避免重排
- 懒加载、预加载

Webpack：

- treeshaking、preload、prefetch
- 异步加载模块

PWA：离线存储、service-work

**HTML 与 XHTML 的区别**

XHTML 必须正确嵌套、必须小写、必须闭合标签。

**浏览器内核私有属性 css 前缀**

- -webkit-：谷歌、Safari
- -o-：欧朋
- -ms-：IE
- -moz-：火狐

**前端安全**

- XSS：不对用户输入和服务端返回的内容信任，全部转义
- CSRF：把持久化验证转为瞬时验证，比如给 form 表单加隐藏信息

**语义化标签**

header、footer、menu、section、article、aside、main、nav 等。

**找到字符串中最长的单词**

```javascript
function test1(str) {
    str = str.split(" ");
    return str.reduce((start, end) => {
        return start.length > end.length ? start : end;
    })
}
```

**cookie 和 session 的区别**

cookie 客户端产生，只有 4k，可设置时间。session 服务端生成，返回 sessionid 存在 cookie 中鉴权。

**对 eval 的理解**

小型语言解释器，执行 JS 代码字符串。不建议用，不安全且不好维护。webpack 的 sourcemap 用到了 eval。

**网页三剑客**

Dreamweaver、Firework、Flash。

**title 与 h1、b 与 strong、i 与 em 的区别**

- title：网页标题，在 head 中
- h1：网页大标题，SEO 权重高
- b 和 strong 都加粗，strong 有警告作用
- i 和 em 是物理标记，告诉浏览器以什么格式渲染

**CSS 水平垂直居中的方法**

- flex
- 定位 + margin：50% 减自身宽高一半
- transform
- calc 函数

**对模块化的理解**

前端工程化背景下，模块化有利于代码维护、修正、复用。AMD、CommonJS、ES module 是常用方案。

**HTML5 新特性 / 移除元素**

新增：表单新 type、CANVAS、存储支持 data-、媒体支持。

移除：center、frame、frameset。

**图文不可复制**

```css
-webkit-user-select: none;
```

**跨域及解决办法**

浏览器同源策略，为了安全。

- JSONP：只能 GET
- CORS：后端配合
- proxy：代理转发

**兼容 WebSocket**

- 轮询：定时请求，并发压力大
- 长轮询：服务端返回再发下一次请求
- SSE：EventSource

**英文单词首字母大写**

```css
text-transform: uppercase;
```

**对 IIFE 的理解**

立即执行函数，形成闭包，变量不污染全局。

必要条件：

1. 必须是函数表达式
2. 声明后必须立即调用

```javascript
(function(){}())
(function()){}
!function(){}()
```

**重置 css 的作用**

重置业务相关 CSS，利于还原设计图，多浏览器样式校对。

**深拷贝实现**

```javascript
function deepClone(obj) {
    let _obj = {};
    for (let key in obj) {
        if (obj[key] && typeof obj[key] === 'object') {
            _obj[key] = deepClone(obj[key]);
        } else {
            _obj[key] = obj[key]
        }
    }
    return _obj;
}
```

**等高布局**

1. padding-bottom: 9999999px; margin-top: -9999999px; 清除浮动
2. flex 默认就是等高

**事件冒泡机制**

三个阶段：捕获 → 目标 → 冒泡。冒泡从内向外传递，子元素点击会触发父级元素事件。用 `event.stopPropagation()` 阻止。

列表不必给每行绑事件，可以在父级监听，通过事件对象判断点击了哪个，这是优化长列表的常见手段。

**全屏滚动原理**

类似轮播图。高度占满屏幕，`overflow: hidden`，监听滑动事件进行 DOM 切换。

**事件循环**

JS 单线程，同步任务在主线程执行。微任务产生回调放入任务队列，主线程空时检查队列，把可用的异步任务转同步执行。这个检查过程叫事件循环。

**target="_blank" 安全性问题**

目标页面可通过 `document.referer` 查询源路径。加 `rel="noreferrer"` 解决。

**JSONP 原理**

解决同源策略，只能 GET。

```javascript
function jsonp(url, params, callback) {
    var script = document.createElement("script");
    script.src = url + parseObjParams({...params, callback: "jsonp"});
    document.appendChild(script);
    window.jsonp = callback;
    script.onload = () => {
        document.removeChild(script);
    }
}
```

**box-sizing 常用属性**

- `border-box`：怪异模式，width 包含 padding 和 border
- `content-box`：标准模式，width 只是内容宽度

****proto** 和 prototype**

- prototype：函数都有，指向函数原型，原型中 constructor 指向构造函数
- _proto_：对象都有，指向构造它的原型对象

**渐进式渲染**

先保证基础兼容，再增强体验。
