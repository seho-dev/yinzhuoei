---
title: "我最近在写一款Nodejs serverless框架（预告）"
description: "现在支持私有部署同时也支持serverless各个平台的nodejs框架多么？答案是否定的，在2022年越来越多的企业会选择serverless来部署自己的应用，因为它足够轻巧省去了运维的成本，编写一个API可能只需要几行代码，越来越多的平台也推出了自己的云数…"
date: 2022-02-27
lang: zh
translationKey: "2022-02-27_764_我最近在写一款Nodejs serverless框架（预告）"
categories:
  - "唠嗑"
views: 2694
draft: false
---

现在支持私有部署同时也支持serverless各个平台的nodejs框架多么？答案是否定的，在2022年越来越多的企业会选择serverless来部署自己的应用，因为它足够轻巧省去了运维的成本，编写一个API可能只需要几行代码，越来越多的平台也推出了自己的云数据库以及云消息队列，我们前端开发编写后端api不再是一个头疼的事情。所以serverless是未来，我将在4月份之前完成一款具有插件机制的框架，它会在web服务器中运行也可以在serverless环境运行，在serverless中我会优先支持unicloud，我将使用这款框架参加2022年的dcloud插件大赛。

简单聊聊这款框架，我为什么要创建一款nodejs框架？

## 为什么要造轮子

在sword团队中我们使用unicloud构建应用程序，采用了CQRS，我们所有的写操作都由unicloud的云函数完成，但是你会发现在unicloud社区优秀的框架有很多，它们提供了url处理以及逻辑的分发，还有一些特色的框架也提供了诸如上传，和unicloud的部分特性封装，在我看来，这样的框架没有真正解决开发者的问题，比如:

- 我想现在不想用unicloud，我想用传统服务器运行函数
- 我想和云平台解耦，我希望我的云函数的特性和功能实现和某一平台无关
- 我想使用ts开发
- 我想有IDE强力支持
- 我想使用一些开箱即用的方案，比如说hook，又比如HMR
- 我想使用ES开发nodejs程序，使用先进的技术对程序进行捆绑（treeshaking...）

如果要满足上面的特性，那么只有midway.js了，midway.js很酷，但是它并没有unicloud的faas插件，而且我希望框架能够让sword团队更好的构建程序，简单就是说，我们想把控这个事情，而不是阿里；所以我们造一个轮子，来解决这些事情。

## 框架开发进度

我会在3月底前完成第一步的计划，即web服务器可以部署我们框架捆绑的应用，框架简单包含3部分

- framework runtime
- framework cli
- framework type

我po一下我们的仓库：

- https://github.com/swordCodePractice/backend-framework
- https://github.com/swordCodePractice/backend-cli
- https://github.com/swordCodePractice/typescript-type
