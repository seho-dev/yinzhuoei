---
title: "vue工程从10s+加载到1s加载的优化实践"
description: "这篇文章的背景就是在公司的一个项目，使用的技术栈是vue + vuecli3 + antdesign，由于早期的API接口有坑，antdesign的upload组件上传满足不了业务需求就用了iview的组件，所以当时是ant是全量引入，iview是按需引入了一…"
date: 2020-06-06
lang: zh
translationKey: "2020-06-06_241_vue工程从10s+加载到1s加载的优化实践"
categories:
  - "前端"
views: 7081
draft: false
---

这篇文章的背景就是在公司的一个项目，使用的技术栈是vue + vuecli3 + antdesign，由于早期的API接口有坑，antdesign的upload组件上传满足不了业务需求就用了iview的组件，所以当时是ant是全量引入，iview是按需引入了一个upload模块，当我们的打包出来的时候发现chunkjs很大，足足有近8m多，导致首屏加载时间很长，所以针对这一个问题通过几个方面来分析和优化。

## 分析模块

分析模块使用的是webpack-bundle-analyzer这个插件，按照说明的配置在plugins中即可，由于插件使用过于简单，我推荐的参考文章是
[打包分析插件webpack-bundle-analyzer简介](https://www.jianshu.com/p/e85d6a4f68c0)

像我所说的antdesign和iview技术栈混用这样的方式，本身就是不提倡的，所以大家在使用这个分析插件的时候，看看js文件的大小哪个是最大的，比如chunk vendors很大那就要看我们下面的配置说明来进行一步一步优化了

## webpack4的splitchunks和runtimechunks (剖析被引用的js次数来缓存js)

我在看这方面的知识的时候，仅仅凭着以前一点点笔记来实践，总知踩了不少坑的;
首先来了解一下splitchunks的默认配置，这些配置讲真话不会用到全部的，很多的配置还存在着一知半解的状态下

```
optimization: {
    splitChunks: { // 如果这是一个空对象，那么分割的代码则是按照默认配置进行
    chunks: \"all\", // 只对异步或者同步或者全部的模块引入方式进行分割，all / async / initial
    minSize: 30000, // 引入的模块最小体积如果在值之类进行分割，否则不分割，这个是字节，计算/1000是kb
    // 同理还有maxSize，如果代码超出，将再次分割
    minChunks: 1, // 模块最小引入数量
    maxAsyncRequests: 5, // 最大异步并行最大请求数量，用途：控制分割的代码数量（默认是5）轻易不要更改
    maxInitialRequests: 3, // 入口并行最大请求数量，轻易不要更改
    automaticNameDelimiter: \'~\', // 分割代码连接字符串
    name: true, // 开启分割代码的文件名可定义（filename）
    cacheGroups: { // 缓存分组，此分组配置和chunks配置项必须是搭配，在判断引入的模块是异步还是同步之后需要走这个配置项进行分组，可以配置vendors为false
// 缓存组：顾名思义，将分割的代码暂时缓存起来，把所有匹配成功的分割代码进行整合打包在一个文件中
vendors: {
    test: /[\\\\/]node_modules[\\\\/]/,
    priority: -10, // 优先级：越小优先级越高，如果模块分别匹配条件和default成功，将通过此参数决定具体分配到哪个模块
    filename: \"ventor.js\" // 分割代码分组之后一起打包到哪个文件，这里设置文件名
},
default: { // 如果满足不了上面的缓存组，将执行下面的配置
    minChunks: 2, // 模块引入数量
    priority: -20,
    reuseExistingChunk: true // 如果开启了此配置，将分割代码中引入的模块（分割过的）直接引入分割后的地址，不再进行分割
    }
}
}
}
```

我们可以将工程中的vue，lodash，moment等等js（分析出来的比较大的js）进行分割
在缓存组可以这样写

```
vue: {
    test: /vue/,
    chunks: \"initial\",
    name: \"vuw\",
    enforce: true,
}
```

依次类推，我们的lodash和moment将会被提炼出来；

![微信截图_20200607004425.png](https://www.yinzhuoei.com/usr/uploads/2020/06/1707593622.png)

那么从分割文件之后，我们的chunks vendors肯定会小，我们也可以加入runtimechunks来进行小文件的优化，将webpack的运行时文件进行打包，那么多个js文件将会共享这个运行时文件  [runtimechunks文档](https://webpack.js.org/configuration/optimization/#optimizationruntimechunk)

## 图片压缩

这一块图片压缩算是一个小小的技巧，也是通过tinypng进行的，这一节我们只讨论压缩，不讨论CDN之类的
首先tinypng有一个官网，它可以提供[在线压缩免费服务](https://tinypng.com/)的，一天也是50张压缩图片的额度且单张图片不能超过5m，一般来讲开发过程中也够用了，如果要在web服务中加入tingpng，那么需要[获取key](https://tinypng.com/developers)，再去npm[安装相关tingpng依赖](https://www.npmjs.com/search?q=tinypng)

我们来看一下无损压缩图片的压缩率和质量

![微信截图_20200607002606.png](https://www.yinzhuoei.com/usr/uploads/2020/06/4009353833.png)

![微信截图_20200607002802.png](https://www.yinzhuoei.com/usr/uploads/2020/06/1581031140.png)

> 另外说一句tinypng是提供ps插件的，价格也还算便宜，60刀，另外也有额外热心网友提供的tinypng无限制的API和压缩服务[破解版tinypng](https://juejin.im/post/5e7710285188252bea6f4054)

## gzip服务

作为一个靠谱的前端从业者，gzip压缩技术一定要知晓并且最好会用，我们都知道在前端工程中js，css等资源在webpack的生产环境下会压缩，那么gzip技术会在这个的基础上再压缩至少百分之50以上，对webpack进行一些配置，就可以打包出来如下图的js

![微信截图_20200607232243.png](http://static.yinzhuoei.com/typecho/2020/06/07/43816917449480.png)

并不是每个浏览器都支持gzip的，所以服务端会根据浏览器的请求头

> Accept-Encoding: gzip, deflate；
> 这个是谷歌浏览器的支持程度，如果服务端解析请求体收到了gzip的兼容请求后会返回对应的gzip文件，反之如果不支持将会返回普通的js资源

```
npm i compression-webpack-plugin -d

vue.config.js配置代码:
plugins: [
  new CompressionWebpackPlugin({
    algorithm: \'gzip\',
    test: /\\.js$|\\.html$|\\.json$|\\.css/,
    threshold: 10240,
    minRatio: 0.8
   })
]
```

后端nginx只需要简单的配置即可开启，[开启方法](https://juejin.im/post/5af78fc06fb9a07ac3638da2)

> 这里有一个小坑，vuecli2是可以支持productionGzip只需要配置true或者false即可，不需要在脚手架配置额外其他内容，但是vuecli3是需要配置的

## vue路由懒加载

曾经在做路由懒加载的时候有一段时间疑惑，既然是懒加载，为什么在打包出全部js后，浏览器还需要加载全部的js呢，如图:

![微信截图_20200607235625.png](http://static.yinzhuoei.com/typecho/2020/06/07/45542483992753.png)

那么懒加载是不是就失去了它存在的意义，当我细细研究的时候，发现在加载第一次的时候，那些原本懒加载的js都打不开

![微信截图_20200607235949.png](http://static.yinzhuoei.com/typecho/2020/06/08/457452223843459.png)

那么继续往下研究，通过和群友的探讨，他找到了关键性的代码（真心惭愧）

1. 首先他找到的是一句追加script的代码

![微信图片_20200608000935.png](http://static.yinzhuoei.com/typecho/2020/06/08/46335859755242.png)

1. 我这边找到的是每一句js都会把当前路由写入到webpackJsonp这个数组中

(window[\"webpackJsonp\"] = window[\"webpackJsonp\"] || []).push([[12]) //这里的12代表模块ID
然后在控制台中打印webpackJsonp这个全局变量会发现

![微信截图_20200608000752.png](http://static.yinzhuoei.com/typecho/2020/06/08/462552358863895.png)

对应的数组中不仅仅有模块ID还有对应需要加载的模块，那么如果细细看每个被懒加载的js文件就会发现其中的require函数内部其实都做了一层优化，当第二次访问此模块就从这个数组拿取上次的缓存；

```
__webpack_require__.e和webpackJsonp
```

那么对代码分割的内部异步加载模块的源码解读可以[看这篇文章](https://imweb.io/topic/5a4cce35a192c3b460fce39b)，这也是我在总结这篇文章的时候给我很大帮助的资料

> 这篇文章中出现的CommonsChunkPlugin等等概念是webpack老版本出现，新版本则是spiltchunks

## IgnorePlugin忽略指定的打包模块

使用IgnorePlugin插件可以帮助我们讲不必要的内容不进行打包

```
let webpack = require(\'webpack\');
plugins: [
  // 忽略解析三方包里插件
  new webpack.IgnorePlugin(/\\.\\/locale/, /moment/)
]
```

场景： moment中只引入了中文的包，可以通过这个配置进行把非中文的包去掉

## OSS对象存储

这里说一下，OSS也是我近两年知道的，几年前在搭建这个博客的时候，阿里云有一些类似的活动套餐才让我了解这个东西，但是今年做开发的时候却第一次实际用到了OSS作为文件的存储服务，目前我的博客也采用了OSS作为附件资源的存储，价格也非常便宜，一年40G只需要9元

因为OSS经过了淘宝双十一的多年考验，同时OSS采用了高可用的架构设计，OSS的多重冗余架构设计，为数据持久存储提供可靠保障。
对比自建服务器存储，原始的存储方式基于硬件的影响，可能会出现各种突发问题，且人工数据的恢复有成本

安全方面oss为企业提供了很多的基础建设，加密相关

在我们这篇博客的主题，从10s到1s有很大一部分的功劳都是归于OSS

## HTTP2

HTTP2在这次实践没有使用到，这块也和大家一起复习，因为在筹备这次的资料的时候，也补充了相关很多东西，在以前的HTTP1时代，前端如果被问到优化相关内容时候，一般通常会说雪碧图，内联样式，合并代码之类的，通过这些手端来达到HTTP的优化

HTTP1的一个概念叫做线头阻塞，会同时发起多个TCP请求，而这些请求都是线性流程的，一个资源下载完毕之后才能下载下一个资源，所以我们之前的优化手端“合并代码”才会非常流行，把所有的资源放在一个连接下去请求，但是在HTTP2看来，这些做法都不推荐。

![微信图片_20200613223716.jpg](http://static.yinzhuoei.com/typecho/2020/06/13/59238963901370.jpg)

那么HTTP2主要有以下几个特性关乎到我们的优化

1. 多路复用
HTTP2允许我们将多个HTTP请求放在一个TCP连接中，避免了HTTP1中的建立多个TCP连接的开销，HTTP将会并行这些HTTP请求
2. 头部压缩
HTTP2减少了多个HTTP请求的开销，因为每一次的http2的请求都少于没压缩的http1的请求
3. 流的优先级
HTTP2可以浏览器指定接受资源的顺序，我们可以将较为重要的文件优先安排在前面
4. 服务端推送
服务端也可以主动推送额外的资源到客户端

那么HTTP1的优化观念是需要我们转变的呢？

【1】 不需要合并文件
不需要合并文件了，通常我们会把css放在一个文件中，js也是如此，webpack打包出来的chunk.js，合并过的css，多个图片合成的雪碧图，这样的作法太老套，如果现在这个时代还有人热衷于雪碧图，我会对此前端开发者的技术打一个大大的问号，必经这个玩意流行的时间是我入行之前都流行的（狗头）

![微信图片_20200613223720.jpg](http://static.yinzhuoei.com/typecho/2020/06/13/59678197871446.jpg)

HTTP2中，合并文件虽然能压缩更多的文件体积，但是却增加了缓存的开销，一个被合并过的js，其中的内容被改变，那么浏览器承担的确是重新缓存整个合并的js，这样代价很大，而http2提倡的是【颗粒化】的传输，将多个文件的缓存利用到极致，这就是比http1好处的地方，还有一个关键的点就是在http1中你的网站可能没有全部使用合并的css和js，这样也无所谓，但是http2中加载这些没有使用过的资源，字节，是会缓慢首次加载的。

![微信图片_20200613223724.jpg](http://static.yinzhuoei.com/typecho/2020/06/13/59789100759013.jpg)

我们可以将经常改动的内容js和不经常改动内容的js做一个区分，比如nodemodules打出来的chunk则是不经常改动的js，我们可以把这一块的资源进行CDN。

【2】不需要样式内联

在http1中，样式内联比如

```
<body style=\"color: red\"></body>
```

这样单个的css不会产出新的css，浏览器不会去重新请求一个css，而是直接读取html，这样做的确可以达到优化目的在http1

![微信图片_20200613223727.jpg](http://static.yinzhuoei.com/typecho/2020/06/13/598831658928204.jpg)

如图，多个HTML引入了同样的css内联，那么样式发生变化时，还需要请求多个html从服务端，这导致了用户在访问每一个页面都要额外的传输更多的东西。内联同样也会破坏优先级，因为我们在上面提到了http2是可以浏览器指定处理的优先级的，如果内联在html中，那么意味着这些css会和html同样的优先级，会导致http2的【流的优先级】没用，也就是说没按照偏好加载资源，但是在我查到的资料中，提到了

> 可以使用http2的服务端推送，告诉浏览器 “稍等，你刚请求的HTML页面过会渲染时会用到这些图像和CSS文件”，这样其实是和内联一样，还不会被破坏流的优先级，可以单独利用CDN缓存它们

【3】不需要细分域名
浏览器规定，单个域开通的tcp数量优先，原先为了浏览器能够并行的下载更多的资源，那么就开通多个域名，让浏览器有“并行”效果，但是http2出现了，多个域反而会造成多余的DNS查询和tcp连接，因为http2本来可以共享tcp进行多个http请求，同样的它也会破坏流的优先级，因为浏览器不会通过域不同比较其谁更优先

关于域名细分更多的内容都在参考文章中

还有很多http1和http2公用的优化手端

比如CDN，浏览器缓存

那么更重要的一点就是，http2的性能提升还是得看自己的业务，要是http请求很少，那我个人觉得没有必要

关于http2的服务端推送这个知识点我没有听说过和使用过，所以大家可以查询更多相关资料了解并且实践它们

## 结语

在以后的面试中，webpack，gulp等打包工具，浏览器性能，CDN，优化手端已经成为了高级前端的必考点，所以雪碧图，合并文件等等这些手端就尽量别说了，这篇文章从vue技术栈出发，讲解了企业实战的优化指南，从发现性能问题到解决性能问题提供了一系列的思路，那么这不是最终版，优化的方案远远不止这么多，希望大家一起学习，还有一些手写的图，字很丑多见谅

## 参考文章

[关于入门了解splitchunks](https://juejin.im/post/5af1677c6fb9a07ab508dabb)
[webpack输出文件分析源码](https://imweb.io/topic/5a4cce35a192c3b460fce39b)
[oss相关优势-阿里云官网](https://help.aliyun.com/document_detail/31818.html)
[http2性能优化指南](https://juejin.im/entry/56ce7d1a1532bc005372a7fa)
