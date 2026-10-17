---
title: "【重跳坑指南】使用uniapp中的nvue结合weex开发APP"
description: "参考文档： uniapp使用Weex/nvue的注意事项 weex官方文档 v3引擎更新文档 Nvue 首页快速启动模式文档 作为一个有一年经验的uniapp的开发者，自从脱坑老老实实做web前端，已经蛮久没有使用dcloud家的东西，由于今年的工作计划中，u…"
date: 2020-01-27
lang: zh
translationKey: "2020-01-27_171_【重跳坑指南】使用uniapp中的nvue结合weex开发APP"
categories:
  - "唠嗑"
views: 8273
draft: false
---

参考文档：
[uniapp使用Weex/nvue的注意事项](https://uniapp.dcloud.io/use-weex)
[weex官方文档](https://weex.apache.org/zh/guide/introduction.html)
[v3引擎更新文档](https://ask.dcloud.net.cn/article/36599)
[Nvue 首页快速启动模式文档](https://ask.dcloud.net.cn/article/36749)

作为一个有一年经验的uniapp的开发者，自从脱坑老老实实做web前端，已经蛮久没有使用dcloud家的东西，由于今年的工作计划中，uniapp仍然占据着主导的地位，便老老实实的看看uniapp最近半年的更新文档，映入眼帘的就是v3引擎和一个fast极速启动的功能，下面会简单的提到我重新踩坑过程。

## 写在前面

本文需要一定的uniapp基础和必备的vue基础
在之前的开发中，并没有使用到nvue这个基于原生渲染的app页面，所以在计划中，nvue将会被app的组件/复杂计算较多的页面使用，采用vue+nvue结合的方式，所以我希望在功能开始之前，尝试一下所谓的v3引擎和fast启动有多么厉害

## fast模式

fast模式必须使用v3引擎，它能够让app启动时视图层不再等待服务层加载完毕，即可以同时渲染，所以在启动fast模式时，能肉眼直观的感觉到此模式有多么的快速，但是在nvue首页请避免采用***vuex和使用getApp()***方法，因为service层此时不一定初始化完毕。

## v3引擎

在之前的编译模式中，uniapp从最初的模板编译模式到之后的自定义组件模式，我在自定义组件模式尝到了很多甜头，在之前的业务中写过一个表单组件，很多的日期选择器和输入表单造成了输入的卡顿，所以就升级成了自定义组件模式就成功解决了问题，还有就是类似于电影院订座的页面，渲染了大量的dom造成了选中卡顿，采用了此模式也成功解决了性能上的问题，所以我准备花更多的心思研究了此次更新的模式：v3引擎

总结的常用优势有以下几项：

1. 开发编译速度更快
2. app运行更快
3. 支持视图层调试
4. 支持了更多的vue语法

这几项我最关心的是app运行时的流畅度，但是官方文档没有对这方面有测评说明，只能具体的在自己项目中感受了...

新增了部分的vue语法, 用的比较多的是filter和props中的特性:

![微信截图_20200127151840.png](https://www.yinzhuoei.com/usr/uploads/2020/01/2011416613.png)

![微信截图_20200127151917.png](https://www.yinzhuoei.com/usr/uploads/2020/01/2634001594.png)

## 使用nvue和weex

在hbuilder中有一个配置项是：纯nvue项目，如果勾选了可以加快app启动速度和减少包体积，但是为了更好的开发体验，全部用nvue写实在是一个噩梦，太多的特性在nvue中是不支持的，所以建议大家使用vue+nvue构造项目。

初次上手nvue发现了很多坑，以下我将把我遇到的部分问题结合文档阐述，如果想要更详细的兼容问题就去参考文档的第一个链接查看对应的内容。

官方文档里面有这样一句话：

> 如果你已经是 weex 的开发者，具有 weex 的填坑能力，那么 nvue 是你的更优选择，能切实提升你的开发效率，降低成本。
> 起初，我不以为然，到后来，css选择器，一些简写语法都编译不通过，使得一个简单的页面花了半天去填坑，所以weex是真的对我们写惯了web的人来说真的是很不友好呀。

---

**nvue的编译模式区别**

1. uniapp
2. weex

项目中选择的是uniapp编译模式；

1. 因为它可以写这样的组件，即可以发布在微信小程序和h5中，但是如果是weex，就只能写只能编译到APP中。
2. 因为它可以支持uniapp的生命周期，weex模式下只支持weex的生命周期
3. 调用API时，它们都相同，weexAPI，uniappApi, plusApi都可以调用
4. ***最主要的就是跨端，weex只支持APP，而uniapp是跨所有端***

> 提示：如果没有明确配置编译模式，默认是weex编译模式，因为要向下兼容;

配置方法：

```
// manifest.json
{
    \"app-plus\": {
        \"nvueCompiler\":\"uni-app\"  uniapp/weex
    }
}
```

**出现了同名的vue文件，该怎么办？**
如果nvue文件名和vue文件名出现了冲突，那么在app端会使用nvue的页面，vue页面不会被编译，反之亦然；那么如果只有一个nvue文件存在非app端，则要取决于nvue的编译模式，如果是uniapp端将会被编译，如果是weex不会被编译，**因为weex编译模式不支持非app端**

**开发nvue的注意事项（老沈心态崩溃的开始）**
模板：日常写法同vue一样，如果nvue模式是uniapp可以使用uniapp的组件（部分组件没有实现nvue）如果是weex模式，就如同weex组件的写法。

js：都是vue写法，支持weexAPI，uniappApi, plusApi这三种api方式，weexAPI需要按照模块引入的方式再调用API，uniappApi大部分都支持，小部分不支持调用，plusApi在自定义组件编译模式下可以自由使用，但是v3引擎下是否支持，官方文档暂未发现说明。

**样式**：这里加粗字体的原因是重点，nvue只支持flex布局，包括很多css都不支持，尤其是简写，举例子比如说是边框线，通常我们会这样写：

```
border: 1px solid red;
```

但是weex/nvue规定是这样的：

```
border-width: 1;
border-style: solid;
border-color: red;
```

**nvue 和 vue 相互通讯**
在vue和nvue页面混用的项目中，通讯是一个大问题，我认为的是直接路由传参即可和以前一样，但是没有我想象中那么简单；

nvue -> vue (data是键值对，值仅仅支持字符串)

```
nvue中使用:    uni.postMessage(data);
  vue中使用函数： onUniNViewMessage 监听
```

vue -> nvue

```
vue中使用plus的方法：
   plus.webview.postMessageToUniNView(data,nvueId)；
   参数说明： data同样是键值对，值必须是字符串， nvueId是nvue在webview中的id，可以通过
    $getAppWebview()获取到id

   在 nvue 里引用 globalEvent 模块监听 plusMessage 事件即可监听vue发送的数据
```

具体看这里的demo： [vue向nvue传值的方法](https://uniapp.dcloud.io/use-weex?id=vue-%e5%90%91-nvue-%e9%80%9a%e8%ae%af)

**vue和nvue共享的变量和数据**

- vuex（不支持直接引入store，要引入mapMutations等辅助方法或者this.$store；只支持uniapp编译模式，不支持weex编译模式；）
- 存储storge（vue和nvue互相通讯可以使用这个，但是过于扯淡，这个存储是持久化的）
- 小程序中有一个叫globalData的机制，从来没用过，从官方文档中了解的，操作如下：

```
App.vue:

     globalData: {
         text: \'text\'
     },
     onLaunch: function() {
         console.log(\'App Launch\')
     },
     onShow: function() {
         console.log(\'App Show\')
     },
     onHide: function() {
         console.log(\'App Hide\')
     }
```

在vue页面中使用： getApp().globalData.text就可以获取到值了，如果要在vue页面中绑定该值，在onShow钩子中变量再赋值即可，关于onShow机制有一些注意事项（从官方摘抄）

> 如果需要把globalData的数据绑定到页面上，可在页面的onShow声明周期里进行变量重赋值。HBuilderX
> 2.0.3起，nvue页面在uni-app编译模式下，也支持onShow。 weex编译模式不支持onShow，但熟悉5+的话，可利用监听webview的addEventListener
> show事件实现onShow效果。

ok，介绍到此为止，常见的日常开发遇到的问题其实看我这一篇不会有太大问题，如果你遇到了其他问题可以来找我，我们一起讨论学习，或者你也可以看文章顶部的参考文章，也可以去那里去寻找你想要的答案噢~

祝大家新年快乐，出门记得戴口罩噢
