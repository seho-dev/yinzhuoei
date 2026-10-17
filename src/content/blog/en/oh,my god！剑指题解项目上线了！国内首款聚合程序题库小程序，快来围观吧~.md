---
title: "Oh My God! Sword Code Practice Is Live—China's First Aggregated Programming Question Bank Mini Program!"
description: "Sword Code Practice: an interview-prep companion for tech professionals. Practice anywhere, free and ad-free, with personalized recommendations, automatic daily updates, and questions that broaden your knowledge across disciplines. The project began with a GitHub repository called Frontend Knowledge: Daily 3+1, which inspired our team to build an aggregated question bank…"
date: 2021-04-05
lang: en
translationKey: "2021-04-05_515_oh,my god！剑指题解项目上线了！国内首款聚合程序题库小程序，快来围观吧~"
categories:
  - "Frontend"
  - "Backend"
  - "News"
  - "Life"
views: 10812
draft: false
---

# Sword Code Practice

![](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-c7e81452-9d28-4486-bedc-5dbf7c8386a5/5623bee6-39a4-4f4b-9fab-e31d245f214e.png)

An interview-prep companion for tech professionals: the right tool to help you land that offer.

## Practice Anywhere | Free and Ad-Free | Personalized Recommendations | Automatic Daily Updates | Broaden Your Knowledge Across Disciplines

This project began with a GitHub repository called [Frontend Knowledge: Daily 3+1](https://github.com/haizlin/fe-interview). That excellent question bank inspired our team to build an aggregated one. In China's developer community, many of us work through practice questions to broaden our knowledge, improve our skills, and secure better offers. Those questions cover everything from algorithms and business problems to soft skills. But because our environments and priorities differ, so do the projects and questions we encounter. Few products bring question banks from different communities together in one place. **Sword Code Practice** is our answer: an aggregated question bank for the tech industry.

![](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-86dc45ba-28e8-4734-a880-bbf700b08cf9/19fe73b3-bd01-4c7e-8418-4c90c25c4035.png)

![](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-c7e81452-9d28-4486-bedc-5dbf7c8386a5/c1746d60-2e22-4161-b23d-38b910b73c91.jpg)

##### Keeping an Open-Source Project Free Isn't Easy—Please Follow Our Official Account and Repository

[![Shen Hao Seho/InternetQuestionBank](https://gitee.com/yinzhuoei/InternetQuestionBank/widgets/widget_card.svg?colors=393222,ebdfc1,fffae5,d8ca9f,393222,a28b40)](https://gitee.com/yinzhuoei/InternetQuestionBank)<br/>
[Star us on GitHub; choose the latest branch when pulling the code](https://github.com/swordCodePractice/InternetQuestionBank)
[Support us on the DCloud Plugin Marketplace](https://ext.dcloud.net.cn/plugin?id=4637)

# Contents

- [Features](#特点)
- [Tech Stack](#技术栈)
- [Installation](./install.md)
- [UML](#UML)
- [Design Overview](#设计概览)
- [API](#API)
- [Contributors](#贡献者)
- [Core Maintainers](#核心维护者)
- [Related Open-Source Resources](#相关开源物料)
- [Question Bank Partners](#题库合作伙伴)
- [Contact Us](#联系我们)
- [License](#许可)

# Features

1. A practice app built around technical communities, bringing together excellent open-source questions.
2. The latest relevant questions recommended according to your interests, so you won't keep getting irrelevant ones.
3. Integration with a WeChat service account to send users new questions at a fixed time each day—start your morning with a little momentum.
4. No ads or forced promotions. Revenue comes only from sponsorships and traffic to our website.
5. Plenty of interesting features are still planned, including expert mentoring for beginners and dedicated channels for schools and companies, helping students and employees keep improving wherever they are.
6. Everything in Sword Code Practice will be freely open-sourced: prototypes, the mini program, UI designs, UML diagrams, API documentation, third-party API integration guides, and user instructions. Fellow developers are welcome to build on it and make the industry better. We'll do our best to help you solve technical problems along the way.

# Tech Stack

- [uniapp](https://uniapp.dcloud.io/)
- [unicloud](https://unicloud.dcloud.net.cn/home)
- [unicloud frontend web hosting](https://unicloud.dcloud.net.cn/home)
- [vue3](https://vue3js.cn/)
- [typescript](https://www.tslang.cn/)

For the reasoning behind our technology choices, see our Yuque documentation.
We also want to thank Mockplus and Yuque for supporting our open-source design and documentation resources:

[![](http://static.yinzhuoei.com/typecho/2021/01/17/69752764374919.png)](https://www.mockplus.cn/)
[![](http://static.yinzhuoei.com/typecho/2021/01/17/697832282748067.jpg)](https://www.yuque.com/)

# UML

These diagrams may change as we develop new features, and they may already contain substantive mistakes. We'd be very grateful if you reported any errors you find.

## Class Diagram

![](https://github.com/swordCodePractice/InternetQuestionBank/blob/v1.0.0-dev/out/doc/db/core/core.png?raw=true)

## Fetch Tasks

![](https://github.com/swordCodePractice/InternetQuestionBank/blob/v1.0.0-dev/out/doc/db/pull/pull.png?raw=true)

## More

For additional resources, see
`out/doc` or [Yuque: UML](https://www.yuque.com/u509950/lmm8g4/hho30u).

# Design Overview

![](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-c7e81452-9d28-4486-bedc-5dbf7c8386a5/634202cd-6b93-4712-9cfc-4141b535a8aa.png)

![](http://static.yinzhuoei.com/typecho/2021/01/17/721852972570223.png)

 

![](http://static.yinzhuoei.com/typecho/2021/01/17/72195918714747.png)

Design source files: [View here—please download the latest designs for the best experience](https://www.yuque.com/u509950/lmm8g4/oy2ztb)
Online prototype preview: [View here; contact us if the link no longer works](https://app.mockplus.cn/s/16Fus8k9TTz)

# API

The Sword Code Practice team can only open-source a limited portion of the API layer because it involves question bank licenses from several partners. If you want to use the aggregated question bank API, please contact us to discuss it. If you're learning, the API documentation on Yuque should help. Here is a brief introduction.

This was our first experience developing cloud functions with uniapp, so we did a lot of research beforehand. We discuss the role of explain.js below, and we're grateful to the early unicloud framework developers producing such high-quality work in the uniapp open-source community. After consulting the official team, we learned that developing with TypeScript requires compiling TS into JS and putting the results in the cloud function directory. We chose the following tools to make writing unicloud cloud functions in TypeScript a pleasant experience:

- esbuild-node-tsc
- nodemon

esbuild-node-tsc is based on esbuild. By taking advantage of esbuild, it can compile tens or even hundreds of times faster than TypeScript's official tsc compiler. This is thanks to esbuild's implementation in Go.

nodemon watches files in a directory and runs the TypeScript build command whenever they change, putting the compiled JavaScript directly into the designated directory.
We adjusted the explain.js configuration accordingly: our TypeScript files live in services, while the compiled JavaScript goes into dist, the directory explain needs:

```js
config.init({
  baseDir: __dirname,
  serviceDir: "/dist/",
});
```

One thing to note:
because cloud functions have a size limit, we need to install the relevant dependencies globally, including TypeScript.

## Command Query Responsibility Segregation

Command Query Responsibility Segregation (CQRS) separates data queries from data updates by giving each its own interface.
Uniapp's unicloud is excellent, and its JQL was a real eye-opener. It provides a consistent, frontend-friendly way to work with a database. For our CQRS approach, however, we don't use those convenient APIs for everything:

- The frontend uses JQL to read the data it needs.
- Cloud functions handle writes.

For example, here is how the frontend reads a list:

```js
const db = uniCloud.database();
const databaseName = "testInit";
// 获取测试数据列表
export function getTestList() {
  return new Promise((resolve) => {
    db.collection(databaseName)
      .get()
      .then((res) => {
        // res 为数据库查询结果
        resolve(res);
      })
      .catch((err) => {
        // err.message 错误信息
        // err.code 错误码
      });
  });
}
```

We extract files like this into individual query modules, each corresponding to a database collection (testInit in this case), and keep them in the API folder.

![](https://cdn.nlark.com/yuque/0/2020/png/710380/1604849161872-36fc9bd2-1988-430c-9f75-d8b989782737.png?x-oss-process=image%2Fresize%2Cw_513)

A Vue page calls them as follows. This lets us process data in the API query layer so Vue receives clean data that is ready to render.

```js
import { getTestList } from "../../api/test";
const data = getTestList();
```

For writes, we call cloud functions directly. The main design difference is that we've changed how we organize those cloud functions: rather than treating each as a separate function, we group them into modules.

During our initial technical research, Uni did not provide an official cloud function development framework. We did, however, find one called explain in the plugin marketplace. It quickly lets us build REST API-style cloud functions behind a single entry point. We won't go into the framework in detail here; its documentation is available at [explain.js: a framework for rapidly developing uni cloud functions](https://ext.dcloud.net.cn/plugin?id=3312).

```js
// 注册用户根据手机号
  addUserByPhone() {
    return handleMustRequireParam(
        [{
            key: "username",
            value: "用户名",
          },
          {
            key: "password",
            value: "密码",
          },
        ],
        this.event.params
      )
      .then(async () => {
        const {
          username,
          password
        } = this.event.params;
        if (!/^1[3456789]\\d{9}$/.test(username)) {
          return appErrorMessage("用户名格式不正确");
        } else if (password === "" || password.length < 6) {
          return appErrorMessage("密码格式不正确");
        } else {
          // 校验手机号
          return await uniID.register({
            username,
            password,
          });
        }
      })
      .catch((err) => {
        return err;
      });
  }
```

To invoke an add operation in a module such as testPrint:

```js
uniCloud.callFunction({
  name: "application",
  data: {
    route: "api/user",
    method: "POST",
    params: {
      username: "18291563764",
      password: "sas",
    },
  },
});
```

# Contributors

Thanks to everyone who has contributed to making Sword Code Practice a great project:

| [![](https://avatars1.githubusercontent.com/u/35763284?s=460&u=018d91407ac17ac3b6abbd16cdca5b080b385b32&v=4)](https://github.com/1018715564) | [![](https://avatars0.githubusercontent.com/u/41415464?s=460&u=4e8e3f255ba143921d7eb3489cdb1be0ee4cbf4c&v=4)](https://github.com/maruichao52) | [![](https://avatars3.githubusercontent.com/u/20768069?s=460&u=2b274b4c5c123e727cad136e52ed116507e1c8f7&v=4)](https://github.com/githubbfw) |
| --- | --- | --- |

If you'd like to join our contributors, [please contact us. This page also introduces the contributors and may be helpful](https://www.yuque.com/u509950/lmm8g4/bw6hgz).

# Core Maintainers

- [@Seho: frontend and backend development, product design, market research, and community maintenance and promotion](https://github.com/1018715564)
- [@maruichao52: backend development and analysis, plus community maintenance and promotion](https://github.com/maruichao52)
- [@Maria ^Min: app UI and promotional design materials. For design collaborations, add P309033661 and mention Sword Code Practice](https://dribbble.com/BigMonsterQueen)

# Related Open-Source Resources

- [Yuque](https://www.yuque.com/books/share/7825dfb4-e7d2-403a-b462-21eaf9d3017e?#)
- [Mockplus product designs—contact @seho for the prototypes](https://app.mockplus.cn/s/ceKIIx7cyes)

# Question Bank Partners

- [Frontend Interview 3+1 Open-Source Question Bank](https://github.com/haizlin/fe-interview)
- [JavaGuide's Java Question Bank](https://github.com/Snailclimb/JavaGuide)
- [Dada Frontend](https://github.com/webVueBlog/interview-answe)

# Join Our QQ and DingTalk Groups

![](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-c7e81452-9d28-4486-bedc-5dbf7c8386a5/6f5b6587-8efe-400f-8fcb-f277892a9854.png)

![](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-c7e81452-9d28-4486-bedc-5dbf7c8386a5/309debe7-7f2a-47ae-a415-875e5b1f4922.jpg)

# License

Apache License © Sword Code Practice
If you find a conflicting license in any of our other documentation, please contact us. It may be a leftover from an earlier version of the code.
