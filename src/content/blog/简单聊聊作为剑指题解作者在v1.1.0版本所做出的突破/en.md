---
title: "Reflections from the Author of 'Sword Code Practice' on the Breakthroughs in v1.1.0"
description: "A reflection on the journey of Sword Code Practice over the past year and an overview of the major breakthroughs in v1.1.0, including backend architecture overhaul, TypeScript runtime validation, npm type packages, and ecosystem expansion."
date: 2021-09-28
lang: en
translationKey: "2021-09-28_590_简单聊聊作为剑指题解作者在v1.1.0版本所做出的突破"
categories:
  - "Life"
  - "Deep Dive"
views: 5727
draft: false
---

## Preface

Before I knew it, Sword Code Practice has accompanied everyone for nearly a whole year. The idea and direction of the project first started taking shape in mid-October 2020, but it wasn't until March of this year that substantial code development began. Using my daily spare time to design, operate, and develop my own product, I poured everything I learned and experienced into this project. The outcome was rewarding: I won 3rd prize in the DCloud developer contest in June, and keeping my promise, I open-sourced every single line of code and every design asset.

Here, I want to express my deepest gratitude to @Xie Min and @Ma Ruichao for their immense support. Without Xie Min, there would be no rich and beautiful UI interface for the app. She thoughtfully incorporated code-themed color palettes throughout the UI, making it deeply resonant with developers, resulting in a polished product. After open-sourcing, many people referenced or reused her designs, which is a great testament to her work. In the early stages, Ma Ruichao helped untangle the system logic and participated in architecture design, enabling a frontend-heavy pseudo-full-stack developer like me to comfortably handle serverless functions and document databases.

In October, we will welcome a brand new "Release Version: v1.1.0". This article highlights the key breakthroughs and new additions in v1.1.0!

## Release Notes v1.1.0

- **[npm package]** Added core `typescript-type` package, refactoring all type hints for uniCloud, explain, sword-core, etc.
- **[Backend]** Major architecture overhaul of uniCloud backend, migrating from explain1 to explain2; all core cloud functions now adopt HTTP URL endpoints.
- **[Backend]** Backend architecture restructuring, code cleanup, and formatting.
- **[Backend]** Added TypeScript runtime validation.
- **[Backend]** Added middleware system to core backend functions.
- **[Backend]** Modified core code in explain2.
- **[Backend]** Replaced CommonJS (cjs) with ES modules (esm) in core functions.
- **[Ecosystem]** QQ Bot system delivering a massive repository of coding interview questions.
- **[Ecosystem]** WeChat Mini Program passed official review; both WeChat and QQ Mini Programs will iterate regularly from now on.
- **[Frontend]** Refactored and cleaned up all API layer code (*major focus for the next version).
- **[Official Website]** Updated website content.
- **[Dependencies]** Upgraded all dependencies in the core app project to the latest versions (*will fix deployment bugs encountered on Windows in subsequent updates).
- **[App]** Introduced husky, lint-staged, and eslint across the entire app project.

## Architecture Overhaul

![Architecture Diagram](https://camo.githubusercontent.com/466ddfb420b6e920d83aafcd1d27839c08ccb3a1ca525f44cd1d7d321bc145cd/68747470733a2f2f63646e2e6e6c61726b2e636f6d2f79757175652f302f323032312f7376672f3731303338302f313633313435323338303631392d61626431616439642d333362652d346638352d393134322d3334383365363266623630302e737667)

## Code Refactoring & Beautification

Before controller refactoring:

![WX20211006-144636.png](https://static.yinzhuoei.com/typecho/2021/10/06/028111794653961/WX20211006-144636.png)

After controller refactoring:

![WX20211006-144603.png](https://static.yinzhuoei.com/typecho/2021/10/06/028551986295290/WX20211006-144603.png)

## TypeScript Runtime Validation

![1633503145303.jpg](https://static.yinzhuoei.com/typecho/2021/10/06/031572919252324/1633503145303.jpg)

## QQ Bot

![WX20211006-145431.png](https://static.yinzhuoei.com/typecho/2021/10/06/03279359804779/WX20211006-145431.png)

## New Global Type npm Package

[GitHub: sword-typescript-type-core](https://github.com/swordCodePractice/typescript-type)  
[npm: sword-typescript-type-core](https://www.npmjs.com/package/sword-typescript-type-core)

![WX20211006-145610.png](https://static.yinzhuoei.com/typecho/2021/10/06/03431817780067/WX20211006-145610.png)

## Patch & Preview of v1.1.0 Next

- **[Frontend]** API type hints
- **[Frontend]** Code cleanup & refactoring for select pages
- **[Frontend]** Comprehensive user experience enhancements
- **[Ecosystem]** WeChat Service Account push & notifications
- **[Ecosystem]** QQ Group collaborations
- **[Ecosystem]** Question bank expansion: adding Java & PHP interview questions
- **[Backend]** Completing remaining cloud functions (* OpenAPI)
