---
title: "学习React无果后又一新目标：Vue！"
description: "之前一直在学 React，下载了不少教程，也买了一些套餐课程。但学起来很吃力——卡在 webpack 热加载这块。对，就卡在环境配置上。第一个教程配置挺简单，npm 装几个包就能跑，但配 webpack 的时候遇到 bug，问人也问不出结果，只好放弃了。 聊聊…"
date: 2018-07-20
lang: zh
translationKey: "2018-07-20_16_学习React无果后又一新目标：Vue！"
categories:
  - "前端"
views: 4981
draft: false
---

![下载.jpg](https://www.yinzhuoei.com/usr/uploads/2018/07/790164703.jpg)

之前一直在学 React，下载了不少教程，也买了一些套餐课程。但学起来很吃力——卡在 webpack 热加载这块。对，就卡在环境配置上。第一个教程配置挺简单，npm 装几个包就能跑，但配 webpack 的时候遇到 bug，问人也问不出结果，只好放弃了。

**聊聊 Vue**

班上同学一直想学 Vue，今天就入手了。学了几天基本语法，感觉入门跟 React 差不多，都挺简单的。不过 Vue 确实更好上手。既然有这个时间，就来带大家入门 hello world 吧。

**开始**

去 Vue 官网下载 js 文件，直接引入就行。

用 IDE 打开项目，引入 vue.js 之后，有一点很重要：在 body 结束标签之前写外链或内链 js，否则会报错。加载顺序的问题。

我们把 js 入口文件命名为 index.js：

```html
<div id="test"></div>
<script src="src/js/index.js"></script>
```

**index.js 的内容：**

```javascript
new Vue({
    el: '#test',
    data: function () {
        return {
            text: 'say no!'
        }
    },
    components: {
        'my-header': emple
    }
})
```

说明一下：

- `el`：渲染到哪个容器
- `data`：组件的数据，比如定义了一个 `text`，在模板里用 `{{text}}` 就能访问
- `components`：包含组件，这里定义了一个叫 `my-header` 的组件

**组件定义：**

```javascript
var emple = {
    template: '<p><my-child></my-child>这是我的第一个组件{{words}}</p>',
    data: function () {
        return {
            words: 'yes！'
        }
    },
    components: {
        'my-child': child
    }
};

var child = {
    template: '<p>i am child</p>'
};
```

在根组件里直接用 `<my-header>` 就行。子组件里的 `<my-child>` 也是组件，这里做了组件的嵌套。

流程是这样的：

1. 先定义一个根组件
2. 根组件的模板里引用了子组件
3. 子组件的模板里又引用了子子组件
4. 最后根组件返回到 HTML 里渲染

有不懂的可以私信我。wechat：meng99huan
