---
title: "[See How] A Hands-On Guide to TSRPC, a Full-Stack Node.js and TypeScript Framework (Part 1)"
description: "One ordinary morning, a friend from our chat group and I were discussing frontend architecture. Her team was preparing new projects and had run into architectural problems, so she shared their scaffolding code. Their thoughtful architecture and thorough use of TypeScript taught me a lot—and our conversation eventually led me to TSRPC, a full-stack framework worth exploring…"
date: 2021-06-27
lang: en
translationKey: "2021-06-27_555_[See How]全栈Node TS框架TSRPC实践教程（一）"
categories:
  - "Frontend"
  - "Backend"
  - "News"
  - "Life"
  - "Deep Dive"
views: 7833
draft: false
---

## Introduction

One ordinary morning, a friend from our chat group and I were talking about frontend architecture. Her team was preparing a few new projects and had encountered problems while working on the architecture, so she shared their project scaffolding code with me. Looking through it, I was impressed by the frontend teams in Shenzhen: their architectural ideas were advanced, and they used TypeScript thoroughly and consistently. In the end, I didn't solve her problem—instead, I learned quite a bit myself. Our conversation eventually turned to full-stack development and runtime validation of protocol parameters. If you know my open-source project, Sword Code Practice, you'll know that my backend code is particularly weak when it comes to runtime validation. I was using TypeScript for the sake of using TypeScript, a common problem among developers adopting it. I'd been meaning to refactor part of my backend for a while. That's when my well-informed friend recommended a framework: **TSRPC**, the subject of this first tutorial in the [See How] series.

## About This Series

The name “See How” has a funny origin. Wang, the author of TSRPC, guessed that it was the meaning behind my name, seho. There wasn't actually any deeper meaning to it, but I liked his interpretation. Since I already wanted to write a TSRPC tutorial series and learn this excellent framework together with you, it seemed like a good fit for the first article in the See How column.

## About TSRPC

Before diving in, I hope you'll take a quick look at the relevant background material yourself. TSRPC is an open-source RPC framework written in TypeScript and built for full-stack projects. From my very first day using it, these were my impressions:

1. Binary transport built in
2. Pure TypeScript, preventing a large proportion of development errors
3. Powerful runtime validation of complex types
4. A frontend/backend development model unlike anything I'd encountered before

[Official documentation](https://tsrpc.cn/docs/introduction)
[Video tutorial](https://www.bilibili.com/video/BV1hM4y1u7B4?share_source=copy_web)

## Prerequisites

To learn TSRPC, you'll need a little background knowledge and some preparation:

1. Familiarity with basic TypeScript syntax
2. A MongoDB database

## Development

Building a full-stack application with TSRPC is remarkably straightforward. The official CLI can quickly scaffold a project containing both frontend and backend:

```bash
npx create-tsrpc-app@latest
```

Follow the prompts and choose a browser application. Once installation finishes, you'll find two directories:

```
- backend Backend
- frontend Frontend
```

Let's take a look right away. Run this in the frontend project root:

```bash
npm run dev
```

The official scaffold includes a simple to-do list application.

![WX20210706-072702@2x.png](https://static.yinzhuoei.com/typecho/2021/07/06/276873779374042/WX20210706-072702@2x.png)

Here is the overall frontend/backend directory structure, taken from the official website:

```
|- backend --------------------------- Backend project
    |- src
        |- shared -------------------- Shared frontend/backend code (synced to the frontend)
            |- protocols ------------- Protocol definitions
        |- api ----------------------- API implementation
        index.ts

|- frontend -------------------------- Frontend project
    |- src
        |- shared -------------------- Shared frontend/backend code (read-only)
            |- protocols
        |- index.ts
```

You might be wondering why there's a shared directory and why it needs to be shared with the frontend project. It's because shared is where we define our protocols. What exactly is a protocol? Let's explain it with a small API example:

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

Create a file named **PtlAddPost.ts** in shared/protocols. Protocol filenames must start with Ptl. Think of a protocol file as a description of the request and response structures for an API. The shared directory then makes that file available to the frontend. And what does that give us? Complete code completion when integrating the API, along with strict checking of request and response types.

Let's continue on the backend. Once the protocol is defined, what's next?

```bash
npm run proto Rerun this command whenever the protocol changes
```

TSRPC separates protocols from API implementations. In my mental model, an API implementation is simply an async function. TSRPC can generate it from the protocol we just wrote. For PtlAddPost.ts, run:

```bash
npm run api For a new protocol, generate a new api
```

A file called ApiAddPost.ts will appear in the api directory:

```js
import { ApiCall } from \"tsrpc\";
import { ReqAddPost, ResAddPost } from \"../shared/protocols/PtlAddPost\";

export async function ApiAddPost(call: ApiCall<ReqAddPost, ResAddPost>) {

}
```

We use call to obtain request parameters and send information back to the client. Here's a simple example:

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

Our first API is written. Let's test it properly before calling it from the frontend.

> TSRPC uses the Mocha testing framework.

```js
// /test/api/**.test.ts

import { HttpClient } from \"tsrpc\";
import { serviceProto } from \"../../src/shared/protocols/serviceProto\";

// 1. EXECUTE `npm run dev` TO START A LOCAL DEV SERVER
// 2. EXECUTE `npm test` TO START UNIT TEST

describe(\"api tests\", async function () {
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

This is a simple backend test case. Before running it, you must start the backend service:

```bash
npm run dev
```

Then open another terminal and run npm run test. If everything is working, you should see the following console output:

![1625806333932.jpg](https://static.yinzhuoei.com/typecho/2021/07/09/063471825904760/1625806333932.jpg)

By my rough estimate, going from the protocol definition to a tested, simple API takes less than five minutes.

Now let's try calling that API from the frontend.

First, of course, we need to run:

```bash
npm run sync
```

As mentioned earlier, the frontend and backend share a directory. This command synchronizes the protocols and other shared information to the frontend. We can now enjoy comprehensive code completion in the frontend's index.ts file.

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

When we return to the frontend page in the browser, the request is sent. Look closely at the console and you'll see this:

![1626042788250.jpg](https://static.yinzhuoei.com/typecho/2021/07/12/42799238422993/1626042788250.jpg)

Our request body has been serialized into binary, one of TSRPC's defining features. We'll explore its features in more detail shortly. For now, we've already completed the full workflow: backend API development -> testing -> frontend invocation.

## Extending Our Application

By now, you should know how to build your first API with TSRPC. In this section, we'll borrow an example from the TSRPC video tutorial and implement a simple CRUD workflow using MongoDB.

Start your local MongoDB service, then add some code to the backend project.

Before writing code, install the MongoDB dependency so we can conveniently import its type definitions and database methods.

```bash
npm install mongodb -s
```

To stay consistent with the video tutorial, we'll use its utility classes and architectural approach directly:

- **Write a database model named Post.ts**

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

The database model needs to be shared with the frontend for reuse. To preserve type safety on the backend, though, we need one additional step. MongoDB's ID is an ObjectID, not a string, so the backend needs a version of the model with that field's type overwritten—and only that field.

> We need this extra backend type because we can't import MongoDB's ObjectID into the frontend.

```js
// shared/protocols/models/dbItems/DbPost.ts

import { ObjectID } from \"mongodb\";
import { Overwrite } from \"tsrpc\";
import { Post } from \"../Post\";

export type DbPost = Overwrite<Post, {
    _id: ObjectID
}>
```

Using TSRPC's Overwrite generic, we modify the Post type we just defined, replacing the ID type with MongoDB's ObjectID. The backend should then use DbPost rather than the original Post type.

- **Database configuration**

```js
// Configuration file
// shared/protocols/models/BackConfig.ts (models folder is newly created)
export const BackConfig = {
  // Replace the database url, database name: test
  mongoDb: \"mongodb://localhost:27017/test\",
};
```

- **Define a database initialization class**

```js
// Global class containing database initialization logic
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

- **Update the backend's index.ts**

```js
// backend/index.ts Add the following

import { Global } from \"../src/shared/protocols/models/Global\";

async function main() {
    // Auto implement APIs
    await server.autoImplementApi(path.resolve(__dirname, \'api\'));
    // TODO: Initialize the database here
    await Global.init(server.logger);
    await server.start();
};
```

Okay, the configuration for our first collection is now complete. Make sure the database is running and configured correctly, then start
the server:

```bash
npm run dev
```

If you're lucky (just kidding), the server should start successfully, and you'll see a successful connection message in the console:

![WX20210719-223641@2x.png](https://static.yinzhuoei.com/typecho/2021/07/19/054171714321065/WX20210719-223641@2x.png)

Let's quickly build the create API. I'll leave the update and delete APIs for you to implement by applying the same ideas.

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

Our request type lets the client send a Post without _id, create, update, or visitedNum.
Now run the familiar commands:

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

That part is done~

## How Runtime Type Validation Works

As mentioned earlier, calling backend APIs from the frontend gives us complete code completion, covering everything from API names to request body types. This helps prevent common mistakes when integrating APIs. In conventional frontend/backend development, especially with separate frontend and backend projects, runtime type validation is a frequent concern. Every language or framework has its own validation mechanisms. In Spring MVC, for example, annotations can perform validation (the following shows validation in a controller; other methods are available):

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

How does TSRPC ensure that transmitted data is valid? If the frontend uses TSRPC's browser client package, an incorrect field is flagged during development and checked again before the request is sent. The backend performs a third check before the request reaches the async API function. As a result, the parameters used inside that backend function are type-safe, without requiring us to worry about invalid parameter types there.

There are many runtime validation solutions in the JavaScript ecosystem. JSON Schema is probably the most common: you can define a schema in JSON and use it to validate values at runtime. But there are still drawbacks, including limitations around frontend feedback and the possibility of duplicating a lot of type definitions. TSRPC's core uses a library written by the same author:

[tsrpc-buffer](https://github.com/k8w/tsbuffer)

Shipping the entire TypeScript package just to implement runtime validation isn't realistic—it is over 60 MB. So the author built this library instead. TSRPC depends on it to support TypeScript syntax, and it already handles most common TypeScript constructs, including string, number, and some complex generics.

[For a closer look, see the supported TypeScript types in the documentation](https://tsrpc.cn/docs/tsrpc-inside/supported-types)

As TypeScript evolves, the buffer library will support more types, enabling even more complete full-stack applications. What's more, TSRPC lets us develop in plain, idiomatic TypeScript. Other third-party tools and frameworks may require a separate programming language or DSL; with tsrpc-buffer, you stay entirely within TypeScript, without anything feeling out of place.

## Binary Serialization

TSRPC's binary serialization is implemented by the tsrpc-buffer library discussed above. It provides smaller payloads than JSON and supports more data types, including ArrayBuffer and Date. That makes tasks such as uploading images remarkably straightforward in a TSRPC full-stack application. Let's demonstrate with an example.

```js
// Define a protocol on the backend, PtlUpload.ts
export interface ReqUpload {
    fileName: string,
    fileData: Uint8Array
}

export interface ResUpload {
    url: string;
}
```

Use the commands we learned earlier to generate the protocol metadata and API:

```bash
npm run proto
npm run api
```

```js
// api implementation, create the uploads folder first, or use the mkdir method
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

Synchronize the protocols under shared so the frontend can call the API:

```bash
npm run sync
```

Add a simple file picker to index.html:

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
// Sync to the frontend
npm run sync
```

With development complete, let's take a closer look at the console:

![1626218954109.jpg](https://static.yinzhuoei.com/typecho/2021/07/14/189701546607794/1626218954109.jpg)

![1626218957442.jpg](https://static.yinzhuoei.com/typecho/2021/07/14/189801232175467/1626218957442.jpg)

In everyday development, we may use component libraries that handle most of the upload work for us. Writing the upload in native browser APIs may take more code, but this approach saves us the effort of converting to and from FormData on the frontend and backend.

## Compatibility with HTTP (JSON) and WebSocket

TSRPC also supports JSON. With a small client configuration change, requests are sent as JSON:

```js
// Create Client
let client = new HttpClient(serviceProto, {
  server: \"http://127.0.0.1:3000\",
  json: true,
  logger: console,
});
```

![1626391401179.jpg](https://static.yinzhuoei.com/typecho/2021/07/16/914132075967493/1626391401179.jpg)

I can't currently think of a situation where I would have to use JSON. Binary serialization produces smaller payloads and faster transfers, while local development logs are readily available in the console. I'd therefore recommend sticking with the default binary transport mode.

TSRPC was originally designed for games, where its transport features make WebSocket more efficient. Let's use it to build a simple WebSocket demo. My implementation follows the official website; if you'd rather go directly to that section of the documentation, see:

[WebSocket real-time services with TSRPC](https://tsrpc.cn/docs/get-started/realtime-service)

TSRPC's API implementation is independent of the transport protocol, which means our earlier code can still be used with only a few small changes.

A WebSocket message is the smallest messaging unit in TSRPC, and defining its protocol uses a different convention. Our example will work like this:

> The client makes a request. The server receives it and sends a message to every client.

First, define a protocol such as MsgHello.ts:

```js
// shared/protocols/MsgHello.ts

export interface MsgHello {
  time: Date;
  content: string;
}
```

This protocol specifies the message body used for frontend/backend communication.

Update index.ts in the backend project, replacing the HTTP server with a WebSocket server:

```js
import { HttpServer, WsServer } from \"tsrpc\";

export const server = new WsServer(serviceProto, {
    port: 3000,
    logMsg: true
});
```

**Exporting server here is intentional: we'll use it in the code below.**

Update index.ts in the frontend project:

```js
import { HttpClient, WsClient } from \"tsrpc-browser\";

let ws = new WsClient(serviceProto, {
  server: \"ws://127.0.0.1:3000\",
  logger: console,
});

const init = async () => {
  // Connect to the backend webscoket service
  let result = await ws.connect();
};

init();
```

We need an API that triggers the backend to send WebSocket messages to clients:

```js
// shared/protocols/PtlSend.ts

export interface ReqSend {
  content: string;
}

export interface ResSend {
  time: Date;
}
```

Once the definitions are ready, run:

```bash
npm run proto
npm run api
```

After the commands succeed, add the following to ApiSend.ts in the api folder:

```js
import { ApiCall } from \"tsrpc\";
// Import banckend/index.ts export: server
import { server } from \"..\";
import { ReqSend, ResSend } from \"../shared/protocols/PtlSend\";

export async function ApiSend(call: ApiCall<ReqSend, ResSend>) {
  const time = new Date();
  call.succ({
    time,
  });
  // Broadcast to all clients
  server.broadcastMsg(\"Hello\", {
    content: call.req.content,
    time,
  });
}
```

The backend logic is complete. Run the following to synchronize the protocols to the frontend:

```bash
npm run sync
```

Now make a further change to frontend/src/index.ts:

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

When the page initializes, it calls the Send API we just wrote. We can then receive both the API response and the WebSocket push message.

![WX20210719-073153@2x.png](https://static.yinzhuoei.com/typecho/2021/07/19/51142564841530/WX20210719-073153@2x.png)

![WX20210719-073210@2x.png](https://static.yinzhuoei.com/typecho/2021/07/19/511833897773085/WX20210719-073210@2x.png)

As you can see, WebSocket transport is binary as well. During development, both callApi and WebSocket notifications benefit from type inference throughout, helping prevent type errors in transmitted data. That's the power of TSRPC.

## Multiple Platforms

TSRPC supports multiple platforms: browsers, mini programs, native iOS and Android, and Node.js. It even supports serverless, allowing us to build cloud functions for Alibaba Cloud and Tencent Cloud. In the future, I also plan to develop more plugins for the TSRPC ecosystem, making it compatible with uniapp and unicloud so it can truly span multiple platforms. I believe TSRPC can change how we develop with unicloud and make full-stack applications simpler.

## Conclusion

Everything covered in this article is also available in the official documentation and video tutorial. The video is linked near the beginning, and I strongly encourage you to watch it first. More TSRPC tutorials are on the way. The next article will focus on integration with serverless, specifically unicloud. I'm working on the outline now, and I hope to have it ready for you later this month.
