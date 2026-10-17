---
title: "[See How]全栈Node TS框架TSRPC实践教程（一）"
description: "前言 某个普通的一天的早晨，水友群的小姐姐和我聊前端架构，因为她们组最近要筹备一些新项目，在做架构的中途出现了很多问题，所以我拿到了她们的架构项目脚手架代码。拿到代码之后我发现深圳那边的前端团队普遍做的很好，有先进的架构思想，也把ts用的很纯粹，最后没帮人家解…"
date: 2021-06-27
lang: zh
translationKey: "2021-06-27_555_[See How]全栈Node TS框架TSRPC实践教程（一）"
categories:
  - "前端"
  - "后端"
  - "资讯"
  - "唠嗑"
  - "精读"
views: 7833
draft: false
---

## 前言

某个普通的一天的早晨，水友群的小姐姐和我聊前端架构，因为她们组最近要筹备一些新项目，在做架构的中途出现了很多问题，所以我拿到了她们的架构项目脚手架代码。拿到代码之后我发现深圳那边的前端团队普遍做的很好，有先进的架构思想，也把ts用的很纯粹，最后没帮人家解决问题，反倒是自己学到了不少。最后我们聊到了前后端全栈开发，如何动态校验协议参数等问题，因为熟悉我开源项目（剑指题解）的朋友都知道，我的后端代码尤其是动态校验那块写的是真差，为了ts而用ts，这也是目前很多用ts的小伙伴的通病，所以我一直打算重构我的一部分后端代码，这个时候见多识广的小姐姐就推荐给我了一个框架，这个框架也是[see how]系列第一篇教程的主角，这个框架就叫做**TSRPC**

## 关于专栏

关于see how是什么，说来很巧，这也是TSRPC作者王大大对我的seho这个名字的猜测，其实我的一个名字也没那么多深意，然后被大佬解读成了see how，所以我感觉这是一个不错的idea，那么本来就是想要出一个tsrpc的系列教程，和大家一起学习这个优秀的框架，就正好作为see how 专栏的第一篇文章吧。

## 关于TSRPC

在正文开始之前，我希望大家可以去自行先去简单快速的浏览相关知识，tsrpc是一个ts的开源rpc框架，它是为了全栈项目而生的，从我上手的第一天开始，我就对这个框架有了以下的第一印象:

1. 天然二进制传输
2. 纯粹的ts，规避了极大部分开发中的错误
3. 强大的运行时复杂检测
4. 这种前后端开发模式，我闻所未闻

[官方文档](https://tsrpc.cn/docs/introduction)
[视频教程](https://www.bilibili.com/video/BV1hM4y1u7B4?share_source=copy_web)

## 前期准备

学习tsrpc需要你有一些前置知识和其他准备:

1. 熟悉typescript基本语法
2. 准备一个mongodb数据库

## 开发

使用tsrpc开发全栈应用简单到没朋友，可以从官方提供的cli快速创建前后端一体项目:

```bash
npx create-tsrpc-app@latest
```

按照指引选择浏览器应用，等待完成安装之后，你的目录中会出现2个目录:

```
- backend 后端
- frontend 前端
```

我们直接一睹为快，在前端项目根目录运行

```bash
npm run dev
```

官方的脚手架为我们准备了一个简单的todolist应用

![WX20210706-072702@2x.png](https://static.yinzhuoei.com/typecho/2021/07/06/276873779374042/WX20210706-072702@2x.png)

整个前后端的目录结构（摘抄官网）

```
|- backend --------------------------- 后端项目
    |- src
        |- shared -------------------- 前后端共享代码（同步至前端）
            |- protocols ------------- 协议定义
        |- api ----------------------- API 实现
        index.ts

|- frontend -------------------------- 前端项目
    |- src
        |- shared -------------------- 前后端共享代码（只读）
            |- protocols
        |- index.ts
```

诶，你可能会疑问了，为啥会有一个莫名其妙的shared目录，还要给前端项目去分享这个目录。是因为在shared这个目录我们要定义协议，啥玩意是协议呢？我们通过一个小小的接口来给大家解释什么是协议；

```js
// PtlAddPost.ts

export interface ReqAddPost {
  newPost: {
     name: string;
  };
}

export interface ResAddPost {
  insertedId: string;
}
```

我们可以在shared/protocols中新建了一个文件**PtlAddPost.ts**，我们必须以Ptl进行开头定义协议，协议是用来描述一个接口的请求和响应的结构体的文件，你可以这么理解。协议文件通过shared目录共享到前端，你知道会发生什么事情吗？造成了我们前端在对接口的时候，全程代码提示以及严格和请求和返回类型校验。

那么我们接着后端继续聊，协议定义之后该如何做呢？

```bash
npm run proto 每当协议更改后，需要重新运行这个命令
```

tsrpc的设计是协议和api分离，我们必须要清楚，api在我的认知里就是一个异步函数，tsrpc可以帮助我们根据我们刚刚写的协议生成api，比如刚刚我们实现的PtlAddPost.ts，我们运行

```bash
npm run api 新协议生成一个新的api
```

在api目录中会多出一个ApiAddPost.ts

```js
import { ApiCall } from \"tsrpc\";
import { ReqAddPost, ResAddPost } from \"../shared/protocols/PtlAddPost\";

export async function ApiAddPost(call: ApiCall<ReqAddPost, ResAddPost>) {

}
```

我们通过call这个方法获取请求参数以及响应给客户端一些信息，我们来一个简单的例子:

```js
export async function ApiAddPost(call: ApiCall<ReqAddPost, ResAddPost>) {
  if(call.req.newpost.name){
     call.success({
         msg: \"hello,\" + call.req.newpost.name
     })
  }else{
     call.error(\'Invalid name\');
  }
}
```

我们的第一个api已经写完了，我们需要正常的过一次test，然后我们在让前端去调用。

> tsrpc使用的是mocha这个测试框架。

```js
// /test/api/**.test.ts

import { HttpClient } from \"tsrpc\";
import { serviceProto } from \"../../src/shared/protocols/serviceProto\";

// 1. EXECUTE `npm run dev` TO START A LOCAL DEV SERVER
// 2. EXECUTE `npm test` TO START UNIT TEST

describe(\"api 测试\", async function () {
  let client = new HttpClient(serviceProto, {
    server: \"http://127.0.0.1:3000\",
    logger: console,
  });
  let ret = await client.callApi(\"AddTest\", {
    newPost: {
      name: \"seho\"
    },
  });
});
```

这是我们后端的一个简单的测试用例，在运行这个测试用例之前，您必须要开启后端的服务:

```bash
npm run dev
```

然后可以再开启一个窗口运行npm run test，如果一切正常，你可以看到下面的控制台输出:

![1625806333932.jpg](https://static.yinzhuoei.com/typecho/2021/07/09/063471825904760/1625806333932.jpg)

粗略计算了一下，我们从开始定义协议到api测试完成，一个简单的接口不到5分钟就已经完成。

这个时候我们可以把这个接口放到前端再继续测试一下。

当然在此之前，我们需要运行以下命令:

```bash
npm run sync
```

我们之前提到过，前后端有一个共享的目录，运行此命令我们就可以把协议等信息同步过来，这个时候我们可以在前端的index.ts文件中，可以获得非常完善的代码提示。

```js
// frontend/src/index.ts

import { HttpClient } from \"tsrpc-browser\";
import { serviceProto } from \"./shared/protocols/serviceProto\";

// This is a demo code file
// Feel free to modify or clear it

// Create Client
let client = new HttpClient(serviceProto, {
  server: \"http://127.0.0.1:3000\",
  logger: console,
});

client.callApi(\"AddTest\", {
  newPost: {
    name: \"hello, seho\"
  },
});
```

当我们回到浏览器前端页面上时，这个请求就会发出，如果你仔细观察控制台，会看到以下的场景:

![1626042788250.jpg](https://static.yinzhuoei.com/typecho/2021/07/12/42799238422993/1626042788250.jpg)

我们的请求体被二进制序列化了，这也是tsrpc的特点之一，我们会在稍后的段落中对tsrpc各个特性做介绍，但是此时此刻我们已经完成了一个api的后端开发->test测试->前端调用。

## 完善我们的程序

上一个部分相信大家已经学会了如何使用tsrpc开发第一个api，这个部分结合了tsrpc的视频教程中的案例，我们需要做一个简单的CRUD，使用mongoDB。

我们需要在本地启动我们的mongoDB服务，然后我们需要添加一些代码到后端backend项目中。

代码开始之前，我们需要安装mongoDB的依赖，我们可以更方便的引入类型定义以及各种数据库方法。

```bash
npm install mongodb -s
```

为了和视频教程统一，我们的工具类/架构方式，将直接挪用视频教程中的代码:

- **写一个数据库的表模型，名为Post.ts**

```js
// shared/protocols/models/Post.ts

export interface Post {
  _id: string;
  author: string;
  title: string;
  content: string;
  visitedNum: number;

  create: {
    uid: string;
    time: Date;
  };

  update?: {
    uid: string;
    time: Date;
  };
}
```

我们的数据库模型是需要共享到前端的，方便前端工程能够复用，但是为了确保后端的类型安全，我们需要在模型上多做一层处理。mongodb的id属性不是string，而是ObjectID，所以我们需要在后端对模型进行类型重写（只重写id字段）。

> 关于为什么要在后端多做一层封装是因为不可能在前端引入mongodb中的objectID

```js
// shared/protocols/models/dbItems/DbPost.ts

import { ObjectID } from \"mongodb\";
import { Overwrite } from \"tsrpc\";
import { Post } from \"../Post\";

export type DbPost = Overwrite<Post, {
    _id: ObjectID
}>
```

我们使用tsrpc提供的Overwrite泛型对刚刚写的Post类型进行改写，将mongodb中的objectID类型引入进来进行替换，然后我们后端工程就要使用这个Dbpost类型，而不是刚刚我们写的Post类型。

- **数据库相关配置**

```js
// 配置文件
// shared/protocols/models/BackConfig.ts (models文件夹是新建的)
export const BackConfig = {
  // 替换数据库url，数据库名test
  mongoDb: \"mongodb://localhost:27017/test\",
};
```

- **定义数据库初始化类**

```js
// 全局一个类，里面写了初始化数据库的内容
// shared/protocols/models/Global.ts

import { Collection, Db, MongoClient } from \"mongodb\";
import { Logger } from \"tsrpc\";
import { BackConfig } from \"./BackConfig\";
import { DbPost } from \"./dbItems/DbPost\";

export class Global {
  static db: Db;

  static async init(logger?: Logger) {
    logger?.log(`Start connecting db...`);
    const client = await new MongoClient(BackConfig.mongoDb).connect();
    logger?.log(`Db connected successfully...`);
    this.db = client.db();
  }

  static collection<T extends keyof DbCollectionType>(
    col: T
  ): Collection<DbCollectionType[T]> {
    return this.db.collection(col);
  }
}

export interface DbCollectionType {
  Post: DbPost;
}
```

- **改写后端index.ts**

```js
// backend/index.ts 添加如下内容

import { Global } from \"../src/shared/protocols/models/Global\";

async function main() {
    // Auto implement APIs
    await server.autoImplementApi(path.resolve(__dirname, \'api\'));
    // TODO：在这里初始化了数据库
    await Global.init(server.logger);
    await server.start();
};
```

ok,截止到目前,我们把第一张表的相关配置已经搞定了,请确保数据库已打开且配置正确，然后我们直接运行
一下服务器:

```bash
npm run dev
```

如果你运气好（狗头），那么你应该是成功开启这个服务器，并且控制台能看到连接成功的信息:

![WX20210719-223641@2x.png](https://static.yinzhuoei.com/typecho/2021/07/19/054171714321065/WX20210719-223641@2x.png)

然后我们快速开发一下新增API，其他的更新和删除API，希望能大家举一反三，自行开发。

```js
// shared/protocols/PtlAddPost.ts

import { Post } from \"./models/Post\";

export interface ReqAddPost {
  newPost: Omit<Post, \"_id\" | \"create\" | \"update\" | \"visitedNum\">;
}

export interface ResAddPost {
  insertedId: string;
}
```

我们规定的请求类型是只能让客户端传递除了id，create，update，visitedNum的Post类型。
然后我们还是运行那几个熟悉的命令:

```bash
npm run proto
npm run api
```

```js
// api/ApiAddPost.ts

import { ApiCall } from \"tsrpc\";
import { Global } from \"../shared/protocols/models/Global\";
import { ReqAddPost, ResAddPost } from \"../shared/protocols/PtlAddPost\";

export async function ApiAddPost(call: ApiCall<ReqAddPost, ResAddPost>) {
  let op = await Global.collection(\"Post\").insertOne({
    ...call.req.newPost,
    create: {
      uid: \"xxx\",
      time: new Date(),
    },
    visitedNum: 0,
  });
  call.succ({
    insertedId: op.insertedId.toHexString(),
  });
}
```

这一part完成～

## 如何做到动态类型校验

之前我们就提到过，前端在调用后端的api时候，会给出完整的代码提示，从api名称到api的请求体类型等等，那么这一定程度上杜绝了开发中常见的接口联调不细心的问题。在传统的前后端开发中，尤其是分离模式，有一个非常常见的问题就是动态类型校验。每个语言/框架都有自己类型校验的手段，比如springmvc我们可以通过注解的方式来校验(下面展示了控制器中的校验，还有其他校验手段):

```java
@Controller
@RequestMapping(\"valid\")
@Slf4j
public class ValidateController {
 private static final String BASE_PATH = \"/valid/\";
 @RequestMapping(\"index\")
 public String index(@Validated() Student student,BindingResult result){
        return BASE_PATH + \"index\";
    }
}
```

那么tsrpc是如何保证数据传输的正确性的呢，首先我们如果在前端使用tsrpc的浏览器请求包，我们调用api时候不仅会在开发中提示开发者这个字段是错误的，而且会在请求发出之前做前端方面的遏制。在后端请求到达异步函数之前，也会去做第三次校验；所以我们在后端异步函数中使用到的参数一定是类型安全，完全不需要担心安全问题。

市面上有很多js领域解决动态校验的方案；最常见应该就是json schema，可以基于json自己实现一套校验方法可以在运行时来做校验。但是仍然有很多缺点，比如不能在前端进行运行时提示且可能重复写很多类型定义。那么tsrpc核心中使用到了一个库（这个库也是同个作者开发的）:

[tsrpc-buffer](https://github.com/k8w/tsbuffer)

为了实现ts动态类型校验，不可能把整个ts加进去，因为那有足足60m多，这是不现实的。所以作者开发了这个库。tsrpc依赖了这个库，它对ts的语法进行了兼容，目前支持了大部分的ts的写法，包括我们常用的string，number等，还支持一些复杂的泛形。

[如果你想细细了解这方面，可以看一下文档支持的ts类型有哪些](https://tsrpc.cn/docs/tsrpc-inside/supported-types)

当然，随着ts的更新，这个buffer也会支持更多的ts类型，可以做更完善的全栈应用。而且我们可以使用tsrpc进行原汁原味的ts开发，市面上的第三方工具/框架需要借助另外编程语言/DSL，tsrpc-buffer完全让你使用ts，你不会感觉到一丝违和感。

## 二进制序列化

tsrpc的二进制序列化机制是由我们上文中提到的tsrpc-buffer中实现的，那么这个特性带给我们的是比json更小的传输体积且支持更多的数据类型，ArrayBuffer, Date等。这意味着使用tsrpc的全栈应用在应对上传图片这种业务的时候简直就像是小儿科，我们可以用一个例子来证明。

```js
// 定义一个协议在后端，PtlUpload.ts
export interface ReqUpload {
    fileName: string,
    fileData: Uint8Array
}

export interface ResUpload {
    url: string;
}
```

我们通过刚刚学到的一些命令，来生成协议以及api

```bash
npm run proto
npm run api
```

```js
// api实现, 先提前把uploads文件夹建立好，或者使用mkdir方法
import { ApiCall } from \"tsrpc\";
import { ReqUpload, ResUpload } from \"../shared/protocols/PtlUpload\";
import fs from \"fs/promises\";

export async function ApiUpload(call: ApiCall<ReqUpload, ResUpload>) {
  await fs.writeFile(\"uploads/\" + call.req.fileName, call.req.fileData);
  call.succ({
    url: \"http://127.0.0.1:3000/uploads/\" + call.req.fileName,
  });
}
```

为了让前端调用，同步shared下的协议

```bash
npm run sync
```

写一个简单的file选择器在index.html中

```html
<input type=\"file\" id=\"fileInput\">
```

```js
// index.ts
import { HttpClient } from \"tsrpc-browser\";
import { serviceProto } from \"./shared/protocols/serviceProto\";

// Create Client
let client = new HttpClient(serviceProto, {
  server: \"http://127.0.0.1:3000\",
  logger: console,
});

const input = document.getElementById(\"fileInput\") as HTMLInputElement;

input.addEventListener(\"change\", async () => {
  if (input.files) {
    const fileData = await loadFile(input.files?.[0]);
    upload(fileData, input.files?.[0].name);
  }
});

const upload = async (fileData: Uint8Array, fileName: string) => {
  const fr = new FileReader();
  client.callApi(\"Upload\", {
    fileData,
    fileName,
  });
};

function loadFile(file: File): Promise<Uint8Array> {
  return new Promise((rs) => {
    let reader = new FileReader();
    reader.onload = (e) => {
      rs(new Uint8Array(e.target!.result as ArrayBuffer));
    };
    reader.readAsArrayBuffer(file);
  });
}
```

```bash
// 同步到前端
npm run sync
```

开发完毕，我们可以仔细看一下控制台:

![1626218954109.jpg](https://static.yinzhuoei.com/typecho/2021/07/14/189701546607794/1626218954109.jpg)

![1626218957442.jpg](https://static.yinzhuoei.com/typecho/2021/07/14/189801232175467/1626218957442.jpg)

尽管我们在日常开发中会用到一些组件库，组件库帮助我们做了上传的大部分工作，所以我们写原生的上传可能在代码量上更多，但是省去了前后端转换Formdata的时间。

## 向后兼容http(json)和WebSocket

tsrpc也向后支持json，我们可以在客户端进行一个简单的配置，发送的请求就是json啦:

```js
// Create Client
let client = new HttpClient(serviceProto, {
  server: \"http://127.0.0.1:3000\",
  json: true,
  logger: console,
});
```

![1626391401179.jpg](https://static.yinzhuoei.com/typecho/2021/07/16/914132075967493/1626391401179.jpg)

我其实暂时没有想到非要使用json的场景，使用二进制序列化比json体积更小传输更快，本地开发的日志也在控制台随时打印，所以我还是建议大家使用默认的二进制序列化的传输模式。

tsrpc设计之初是为了游戏，因为传输特性能让websocket更高效，我们可以用tsrpc简单做一个websocket-demo，具体实现我参考了官网的实现，如果你想直接了解官网的这一part的内容，直接移步:

[websocket实时服务-tsrpc](https://tsrpc.cn/docs/get-started/realtime-service)

tsrpc的实现和协议无关，意味着咱们之前写的代码都可以用，仅仅做一个简单的调整替换即可。

websocket的消息是tsrpc传输中最小单元，我们需要用另外一个方法去定义协议，我们的websocket例子如下:

> 客户端发起一个请求，服务端接收并且向所有客户端发送一个消息

首先我们需要定义一个MsgHello.ts这样的协议:

```js
// shared/protocols/MsgHello.ts

export interface MsgHello {
  time: Date;
  content: string;
}
```

这个协议规定了前后端通讯的请求体。

我们需要改写后端backend中的index.ts，将原先的HTTP服务，改成Websocket服务

```js
import { HttpServer, WsServer } from \"tsrpc\";

export const server = new WsServer(serviceProto, {
    port: 3000,
    logMsg: true
});
```

**这里导出server是有用意的，我们将在之后的代码中会用到这个server。**

改写frontend前端中的index.ts

```js
import { HttpClient, WsClient } from \"tsrpc-browser\";

let ws = new WsClient(serviceProto, {
  server: \"ws://127.0.0.1:3000\",
  logger: console,
});

const init = async () => {
  // 与后端webscoket服务建立连接
  let result = await ws.connect();
};

init();
```

我们需要一个api来触发后端给client发送websocket消息:

```js
// shared/protocols/PtlSend.ts

export interface ReqSend {
  content: string;
}

export interface ResSend {
  time: Date;
}
```

定义成功后，我们运行以下几个命令:

```bash
npm run proto
npm run api
```

运行成功，我们可以在api文件夹下的ApiSend.ts中写入以下内容：

```js
import { ApiCall } from \"tsrpc\";
// 这里引入banckend/index.ts 导出的server
import { server } from \"..\";
import { ReqSend, ResSend } from \"../shared/protocols/PtlSend\";

export async function ApiSend(call: ApiCall<ReqSend, ResSend>) {
  const time = new Date();
  call.succ({
    time,
  });
  // 广播给所有客户端
  server.broadcastMsg(\"Hello\", {
    content: call.req.content,
    time,
  });
}
```

我们的后端逻辑写完了，我们运行以下命令，将协议同步到前端

```bash
npm run sync
```

我们进一步改写前端frontend/src/index.ts:

```bash
import { HttpClient, WsClient } from \"tsrpc-browser\";
import { serviceProto } from \"./shared/protocols/serviceProto\";

let ws = new WsClient(serviceProto, {
  server: \"ws://127.0.0.1:3000\",
  logger: console,
});

const init = async () => {
  let result = await ws.connect();
  console.log(result)
  if (result.isSucc) {
    // ws.callApi
    ws.callApi(\"Send\", {
      content: \"hello websocket\",
    });
  }
};

init();
```

我们在页面初始化的时候，向后端发送刚刚写好的SendApi，这个时候我们既能收到api的返回，也能收到websocket的消息推送。

![WX20210719-073153@2x.png](https://static.yinzhuoei.com/typecho/2021/07/19/51142564841530/WX20210719-073153@2x.png)

![WX20210719-073210@2x.png](https://static.yinzhuoei.com/typecho/2021/07/19/511833897773085/WX20210719-073210@2x.png)

可以看到websocket传输也是二进制的，我们在开发中，也能发现，无论是callApi和发送websocket通知，从始至终都有类型推导，永远不会在传输中出现类型上的错误，这就是tsrpc的强大之处。

## 多平台

tsrpc支持多个平台，支持浏览器/小程序/原生ios 安卓/nodejs，甚至它还支持serverless，可以使用tsrpc开发基于阿里云/腾讯云的云函数；在后续我也会对tsrpc生态开发更多插件，使其兼容uniapp&unicloud，让他严格严格意义上跨多端，我相信tsrpc可以改变unicloud的开发习惯，让全栈应用更简单。

## 结语

本篇文章所有的知识点均在官网&视频教程有体现，视频教程在文章开始之前就有链接，非常希望大家能够先去看一下那个视频。tsrpc的教程还会出，下一篇关于tsrpc文章主要还是讲一下如何和serverless（unicloud）融合。这篇文章正在写大纲，相信也会在这个月之内能和大家见到。
