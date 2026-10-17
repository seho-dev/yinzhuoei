---
title: "What Does a TypeScript uniCloud Function with Runtime Validation Look Like, Courtesy of a 'High-Quality Male'?"
description: "Original article on Yinzhuoei: a TypeScript-based uniCloud function with built-in runtime validation. Late last year, Lun from my previous team mentioned TypeScript runtime validation to me. Since I had never used TS for backend development, I did not give it much thought. This year, while building TS backends and refactoring the Sword open-source project's APIs, I realized I needed it…"
date: 2021-09-12
lang: en
translationKey: "2021-09-12_568_人类高质量男性开发的基于TS且自带运行时校验的unicloud云函数是什么样子的？"
categories:
  - "Frontend"
  - "Backend"
  - "Life"
views: 10409
draft: false
---

![Image description](https://static.yinzhuoei.com/typecho/2021/09/05/435632711743942/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E7%99%BD%E8%89%B2%E7%89%88.png)

[Original article on Yinzhuoei: What Does a TypeScript uniCloud Function with Runtime Validation Look Like, Courtesy of a 'High-Quality Male'?](https://www.yinzhuoei.com/index.php/archives/568/)

## Introduction

Late last year, Lun from my previous team mentioned TypeScript runtime validation to me. Since I had never used TS for backend development, I did not pay much attention. But while developing TS backends this year—especially during a recent API version refactor for the open-source Sword coding-solutions project—I realized that I really needed runtime validation. This will be a short post (I am pressed for time, so I will keep it brief). We will start with an existing cloud function and walk through the changes step by step.

## Getting Started

Before making changes, we need to understand why runtime validation is necessary, what solutions are available, and what their limitations are.
Node.js development shares a familiar problem with client-side JavaScript: “undefined,” along with all those errors about missing definitions. Specifying backend API parameters is a headache, too.
We often end up writing verbose code like this to enforce type safety:

```ts
// Add an article
  async addArticle() {
    return handleMustRequireParam(
      [
        {
          key: \'title\',
          value: \'Article title\'
        },
        {
          key: \'content\',
          value: \'content text\'
        },
        {
          key: \'tagID\',
          value: \'Tag content\'
        },
        {
          key: \'desc\',
          value: \'Description\'
        }
      ],
      this.event.params
    )
      .then(async () => await this.handler(\'addArticle\'))
      .catch((err) => err);
  }
```

handleMustRequireParam is a helper we defined to check whether required parameters are missing or empty. Every cloud function needs this big, bloated chunk of code. And who knows what strange parameters a client might send? This comes up often when working with uniCloud's document database. To address the problem, the swrod open-source project upgraded explain.js to v2 and added middleware for dynamic type validation.

For an overview of existing runtime validation approaches, read this post: [TypeScript runtime validation](https://github.com/SunshowerC/blog/issues/13).
The biggest limitation of those approaches is that they do not support validation of complex types. If I wanted to write the following code, earlier solutions would not handle it:

```ts
interface Test{
  code: string;
  flag: string;
}

type IApiRes = Pick<Test, \'code\' | \'flag\'>
```

Advanced TypeScript utility types such as Pick and Partial are common in everyday development, yet few libraries currently solve this problem.
With that in mind, we chose a core library from the TSRPC framework: tsbuffer-validator.

> This library currently has no documentation. All the code in this walkthrough was worked out by reading its test cases. Many thanks to the author for continually helping me resolve the issues I ran into.

Regular readers may remember the rather rough introductory TSRPC tutorial I wrote a while ago—[read it here](https://www.yinzhuoei.com/index.php/archives/555/). TSRPC's standout TypeScript runtime validation feature is powered by tsbuffer-validator.

After looking through the library's tests, I settled on this approach:

```
1. Use tsbuffer-proto-generator to convert proto to schemas.json
2. Add a validation module; pass in the generated schemas.json and the current api route
```

First, define the protocol with a simple TypeScript interface:

```ts
// proto/question.ts

export interface AddQuestion {
  title: string;
  areaID: string;
  content: string;
  tagID: string[];
}
```

This defines the request type for an “add question” API. The actual route in our cloud function is question/addQuestion, so when we write the middleware, we need to capitalize the first letter of the action name. Otherwise, it will not find the request type we defined.

Next, generate schemas.json:

```shell
npm i tsbuffer-proto-generator --save-dev
```

> I recommend installing this module outside the cloud function, at the top level of your project, rather than inside the cloud function itself.

Then create a schemas folder in the cloud function's root directory:

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

Now it is time for nodemon to do the busywork. We use it to watch the protocol definitions in the proto folder and trigger genSchemas.js whenever they change.

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

After running npm run proto, you should see a schemas.json file in the schemas folder:

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

You may have noticed the key “question/AddQuestion.” In the middleware, we will match the API URL against this key to retrieve the API's schema.

Write a middleware module named tsbuffer-params-validate:

```js
const { TSBufferValidator } = require(\'tsbuffer-validator\');

module.exports = function (event) {
  // schemas The schemas generated from the ts proto
  // params Parameters
  // service The service in the route url
  // action The specific method
  const { schemas, params, service, action } = event;
  const validator = new TSBufferValidator(schemas);
  let vRes = validator.validate(params, `${service}/${action.replace(/^\\S/, (s) => s.toUpperCase())}`);
  return vRes;
};
```

The middleware returns a result indicating whether the parameters passed validation, along with detailed error information if they did not. Now we can use it in the cloud function:

```ts
// Add parameter validation middleware
      app.use(async ({ event }) => {
        const validateResult = await ParamsValidate({
          ...event,
          params: event.data,
          schemas
        });
        if (!validateResult.isSucc) {
          // Replace the response with the error details
          explain.response.body = {
            message: validateResult.error
          };
        }
      });
```

The refactor is complete. Let's test whether requests to a specific cloud function route trigger parameter validation:

```json
\"data\": {
    \"title\": \"\",
    \"areaID\": \"\",
    \"content\": \"\",
    \"tagID\": [1]
},
```

If we send parameters like these, the middleware intercepts the request and reports this error:

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

It tells us that tagID should be a string[], not a number[].

## Wrapping Up

The material in this post is straightforward, but the lack of documentation for several libraries meant I still spent a fair amount of time figuring it out. Too few people are using TSRPC's core libraries, and something this useful deserves to be shared. TypeScript developers are already a rare breed in the uniCloud ecosystem, so the techniques here can solve very real problems for cloud function developers. I hope you put them to work in your projects. Once you try runtime type validation, you will see just how useful it is.
