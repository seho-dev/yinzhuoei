---
title: "I'm Building a Node.js Serverless Framework: A Preview"
description: "There aren't many Node.js frameworks that support both self-hosting and multiple serverless platforms. As more companies turn to serverless in 2022, I'm building a pluggable framework that runs on both conventional web servers and serverless platforms, starting with uniCloud."
date: 2022-02-27
lang: en
translationKey: "2022-02-27_764_我最近在写一款Nodejs serverless框架（预告）"
categories:
  - "Life"
views: 2694
draft: false
---

Are there many Node.js frameworks that support both self-hosting and a range of serverless platforms? Not really. In 2022, more and more companies will choose serverless to deploy their applications: it's lightweight and saves on operational costs, and writing an API might take only a few lines of code. More platforms are also offering their own cloud databases and message queues, so writing backend APIs is no longer such a headache for us frontend developers. Serverless is the future. Before April, I plan to finish a framework with a plugin system that can run on both web servers and serverless platforms. For serverless support, I'll prioritize uniCloud, and I'll enter the framework in DCloud's 2022 plugin competition.

Let me introduce the framework and explain why I'm building a Node.js framework in the first place.

## Why Reinvent the Wheel?

At the Sword team, we build applications with uniCloud and use CQRS. All our write operations are handled by uniCloud cloud functions. The uniCloud community already has plenty of excellent frameworks that handle URLs and dispatch logic. Some more specialized frameworks also provide uploads and wrappers around uniCloud-specific features. In my view, though, they don't really address developers' underlying needs. For example:

- I no longer want to use uniCloud; I want to run my functions on a conventional server.
- I want to decouple my code from the cloud platform, so my functions' features and implementation aren't tied to a particular provider.
- I want to develop in TypeScript.
- I want strong IDE support.
- I want ready-to-use features such as hooks and HMR.
- I want to write Node.js applications with ES syntax and bundle them using modern techniques such as tree shaking.

To meet all those requirements, the only option is midway.js. It's a cool framework, but it doesn't have a uniCloud FaaS plugin. I also want a framework that helps the Sword team build applications on our own terms. Put simply, we want to be in control of this, rather than Alibaba. So we're reinventing the wheel to solve these problems.

## Framework Development Progress

By the end of March, I'll complete the first stage: making applications bundled by our framework deployable on a web server. The framework consists of three main parts:

- framework runtime
- framework cli
- framework type

Here are our repositories:

- https://github.com/swordCodePractice/backend-framework
- https://github.com/swordCodePractice/backend-cli
- https://github.com/swordCodePractice/typescript-type
