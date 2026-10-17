---
title: "人类高质量男性开发的基于TS且自带运行时校验的unicloud云函数是什么样子的？"
description: "原文链接-因卓诶-人类高质量男性开发的基于TS且自带运行时校验的unicloud云函数是什么样子的？ 前言 去年年底在上一家团队的伦哥和我提到了TypeScript的运行时校验，当时由于没有使用TS开发过后端，所以也就不太关心这个事情。但是今年开发TS后端，尤…"
date: 2021-09-12
lang: zh
translationKey: "2021-09-12_568_人类高质量男性开发的基于TS且自带运行时校验的unicloud云函数是什么样子的？"
categories:
  - "前端"
  - "后端"
  - "唠嗑"
views: 10409
draft: false
---

![请输入图片描述](https://static.yinzhuoei.com/typecho/2021/09/05/435632711743942/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E7%99%BD%E8%89%B2%E7%89%88.png)

[原文链接-因卓诶-人类高质量男性开发的基于TS且自带运行时校验的unicloud云函数是什么样子的？](https://www.yinzhuoei.com/index.php/archives/568/)

## 前言

去年年底在上一家团队的伦哥和我提到了TypeScript的运行时校验，当时由于没有使用TS开发过后端，所以也就不太关心这个事情。但是今年开发TS后端，尤其是最近重构剑指题解开源项目的v
版本接口的时候，才觉得我必须要上运行时检测了。这篇文章内容不会很长（由于时间紧迫，我就简明扼要的写），我会从现有的云函数开始，然后和大家一步一步复盘改造细节。

## 改造开始

改造之前你需要了解为什么需要运行时检测？目前运行时检测有哪些方案，他们分别有什么弊端？
Nodejs开发中和我们客户端js开发都有共同问题，就是“undefined”，报各种定义找不到，而且后端规定API参数的时候很头疼。
往往要写这样繁琐的代码进行类型安全的控制:

```ts
// 添加文章
  async addArticle() {
    return handleMustRequireParam(
      [
        {
          key: \'title\',
          value: \'文章标题\'
        },
        {
          key: \'content\',
          value: \'content内容\'
        },
        {
          key: \'tagID\',
          value: \'标签内容\'
        },
        {
          key: \'desc\',
          value: \'描述\'
        }
      ],
      this.event.params
    )
      .then(async () => await this.handler(\'addArticle\'))
      .catch((err) => err);
  }
```

handleMustRequireParam这个方法是定义的一个函数，用于检测必传参数是否未传递或者为空。在每一个云函数中我们都要写这样一大段非常臃肿的代码。而且客户端鬼知道会给你传递什么乱七八糟的参数（这种情况在unicloud 文档云数据库经常出现）。所以swrod开源项目升级了explain.js到v2版本，加入了动态类型校验的中间件用来解决这个问题。

目前的运行检测方案你可以看一下这篇文章，[ts运行时检测](https://github.com/SunshowerC/blog/issues/13)
看完之后，其实最大的弊端就是它不支持复杂类型校验，我如果想要写如下的代码，以前的方案就不支持我们这样做

```ts
interface Test{
  code: string;
  flag: string;
}

type IApiRes = Pick<Test, \'code\' | \'flag\'>
```

类似Pick, Partial这样高级的TS泛型在开发中经常用，但是现在很少有一个库能够解决这样的问题。
综合上述，我们使用了tsrpc框架中的核心库: tsbuffer-validator

> 这个库目前是没有文档的，这次复盘所有的代码都是看test测试用例推出来的，感谢作者大大持续帮我解决开发中各种问题

如果是经常关注我博客的水友都知道，我在前段时间写了一个垃圾的教程专门用来入门tsrpc框架，[戳这里去看](https://www.yinzhuoei.com/index.php/archives/555/)，tsrpc中最亮眼的ts运行时检测功能就是tsbuffer-validator这个库提供功能。

在浏览了这个库的test用例之后，我这样去开发:

```
1. 使用tsbuffer-proto-generator这个库将proto转换成schemas.json
2. 添加一个模块去做校验功能，模块中参数就是生成出来的schemas.json和当前触发api路由
```

首先我们定义proto，去写一个简单的ts代码

```ts
// proto/question.ts

export interface AddQuestion {
  title: string;
  areaID: string;
  content: string;
  tagID: string[];
}
```

我们定义了一个[添加题目]的api请求类型，而实际上我们在云函数路由中是question/addQuestion，我们到时候在写中间件的时候，要记得做一下第一个字母大写的处理，否则会找不到我们写的这个请求类型。

然后我们开始生成schemas.json

```shell
npm i tsbuffer-proto-generator --save-dev
```

> 这个模块建议安装到云函数之外，即你的工程最外面，不要安装在云函数内部

然后我们在云函数根目录去新建一个schemas文件夹

```js
// schemas/genSchemas.js

const { TSBufferProtoGenerator } = require(\'tsbuffer-proto-generator\');
const glob = require(\'glob\');
const path = require(\'path\');
const fs = require(\'fs\');

async function main() {
  let generator = new TSBufferProtoGenerator({
    baseDir: path.resolve(__dirname, \'..\', \'proto\')
  });

  let files = glob.sync(\'**/*.ts\', {
    cwd: path.resolve(__dirname, \'..\', \'proto\')
  });
  console.log(\'Files: \', files);

  let result = await generator.generate(files);

  fs.writeFileSync(path.resolve(__dirname, \'schemas.json\'), JSON.stringify(result, null, 2));
}
main();
```

轮到我们的nodemon工具人登场，我们利用nodemon去监听proto文件夹协议的更改，从而触发genSchemas.js。

```json
// nodemon.proto.json

{
  \"watch\": [\"proto\"],
  \"ext\": \"ts\",
  \"exec\": \"node schemas/genSchemas.js\",
  \"legacyWatch\": true
}
```

package.json -> script

```
\"proto\": \"nodemon --config nodemon.proto.json\",
```

运行npm run proto之后就可以看到schemas文件夹中有一个schemas.json

```json
{
  \"question/AddQuestion\": {
    \"type\": \"Interface\",
    \"properties\": [
      {
        \"id\": 0,
        \"name\": \"title\",
        \"type\": {
          \"type\": \"String\"
        }
      },
      {
        \"id\": 1,
        \"name\": \"areaID\",
        \"type\": {
          \"type\": \"String\"
        }
      },
      {
        \"id\": 2,
        \"name\": \"content\",
        \"type\": {
          \"type\": \"String\"
        }
      },
      {
        \"id\": 3,
        \"name\": \"tagID\",
        \"type\": {
          \"type\": \"Array\",
          \"elementType\": {
            \"type\": \"String\"
          }
        }
      }
    ]
  }
}
```

细心的你可能会发现对象中有一个key为 “question/AddQuestion”，我们等会写中间件的时候，就拿api的url去匹配这个key从而拿到api的schema

写一个名为tsbuffer-params-validate的中间件

```js
const { TSBufferValidator } = require(\'tsbuffer-validator\');

module.exports = function (event) {
  // schemas 由ts的proto生成的schemas
  // params 参数
  // service 路由url中的service
  // action 具体的方法
  const { schemas, params, service, action } = event;
  const validator = new TSBufferValidator(schemas);
  let vRes = validator.validate(params, `${service}/${action.replace(/^\\S/, (s) => s.toUpperCase())}`);
  return vRes;
};
```

然后中间件会返回给我们结果：这个参数是否校验成功（如果出错误，会返回具体错误信息），然后我们就去云函数中去使用这个中间件。

```ts
// 添加校验参数中间件
      app.use(async ({ event }) => {
        const validateResult = await ParamsValidate({
          ...event,
          params: event.data,
          schemas
        });
        if (!validateResult.isSucc) {
          // 将响应信息改为异常信息
          explain.response.body = {
            message: validateResult.error
          };
        }
      });
```

到此为止我们都已经改造好了，我们可以测试一下访问云函数具体路由的时候，会不会去校验参数:

```json
\"data\": {
    \"title\": \"\",
    \"areaID\": \"\",
    \"content\": \"\",
    \"tagID\": [1]
},
```

如果我们传递一个这样的参数，中间件就会拦截，并且爆出这样的错误信息:

```json
{
    \"isSucc\": false,
    \"error\": {
        \"type\": \"TypeError\",
        \"params\": [\"string\", \"number\"],
        \"inner\": {
            \"property\": [\"tagID\", \"0\"],
            \"value\": 1,
            \"schema\": {
                \"type\": \"String\"
            }
        }
    }
}
```

提示我们的tagID需要是string[]，而不是number[]。

## 结束

这篇文章内容很简单，由于很多库没有文档，我还是花了一部分时间去推敲研究的。而且用tsrpc核心库的人太少了，这么好的东西必须要分享给大家，而且在unicloud领域，使用ts开发的人本来就是稀有，所以这篇文章的种种技巧都能实打实的解决各位云函数开发者的大问题，希望大家能用到工程上，用完就懂运行时检测类型有多香了。
