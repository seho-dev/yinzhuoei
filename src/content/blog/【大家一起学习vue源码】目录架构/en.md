---
title: "[Let's Read the Vue Source Together] Directory Structure"
description: "Would you believe me if I said I wrote three uni-app articles over the Lunar New Year, only for them to disappear after publishing? It really happened: my home internet was unstable, and two publishing attempts left only a single paragraph in the preview. Everything else was gone. Now I am back to sharing weekly notes and reflections…"
date: 2020-03-15
lang: en
translationKey: "2020-03-15_177_【大家一起学习vue源码】目录架构"
categories:
  - "Frontend"
  - "Life"
  - "Deep Dive"
views: 5327
draft: false
---

Would you believe me if I said I wrote three uni-app articles over the Lunar New Year, only for them to mysteriously disappear after publishing?

![timg.jpg](https://www.yinzhuoei.com/usr/uploads/2020/03/3729318075.jpg)

It really happened. My home internet was extremely unstable. I tried publishing twice, but the preview showed just one paragraph; everything else was gone. Gradually, I lost the motivation to keep trying. Then, before I knew it, April had arrived. I will still keep sharing notes and reflections with you every week.

This is a new project: analyzing Vue's source code. I need a course to guide me, because honestly, there is a learning curve. When I first looked at the internals, I had no idea where to start. There are countless explanations online of how individual Vue features work, such as methods and computed, but they are too narrowly focused. I found a course on YouTube by ustbhuangyi, a highly regarded instructor on imooc.

Here are the course resources at the top of this article:
[His blog and Vue source-code analysis materials](https://ustbhuangyi.github.io/vue-analysis/v2/prepare/)
[The official course: please buy it to support the creator after watching, although I have not bought it myself](https://coding.imooc.com/class/228.html)
[Free high-definition course on YouTube; the full series is available if you can access the site](https://www.youtube.com/watch?v=bg82rhdj0pI&list=PLMMJeBtTp27e4mY4iY_O8FxGXrB0Xkx-w&index=2)

---

The accompanying source code is version 2.6.11 as of this article's publication. When studying Vue's core, using a recent Vue 2.x version should not materially affect your understanding of its underlying ideas.

---

As the title suggests, this article briefly introduces the responsibilities of the directories inside Vue's src folder. In ordinary Vue projects, we split code across many files for modular development: api, common, util, components, assets, static, pages, and so on. That is standard practice. But a framework's directory structure can be confusing for beginners like me, so let us look through it together.

## compiler

This contains Vue.js compilation code, including the conversion of Vue templates into an AST, or abstract syntax tree. Compilation is generally performed at build time because it can be time-consuming, using tools such as webpack and vue-loader.

## core

This directory contains the heart of Vue.js. Features associated with Vue 2.0, such as the virtual DOM, observation, state, initialization, and rendering, all live here.

## platforms

We normally use Vue.js on the web, but it can also target native frameworks such as [Weex](https://weex.apache.org/zh/).
This directory contains Vue.js entry points for different platforms.

## server

Vue.js supports server-side rendering. The code in this directory runs in Node and returns an HTML string for rendering. This is the server-side version of Vue.js, rather than the browser version.

## sfc

The parser.js file here converts the .vue files we write into JavaScript objects.

## shared

Shared utility functions used by Vue.js live here and are available to all the other directories.

---

I will add more content over the next couple of days according to the plan. This series will continue, with updates from time to time.
