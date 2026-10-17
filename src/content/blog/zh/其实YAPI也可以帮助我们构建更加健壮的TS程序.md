---
title: "其实YAPI也可以帮助我们构建更加健壮的TS程序"
description: "前言 我们在开发中可能会经常遇到以下几个事情: 1. api接口文档描述不清 2. 没有mock流程 3. 如果使用ts开发，需要手动的描述类型，而且在前端中较难把api类型复用 社区中有大量的api文档工具，支持mock，单测的数不胜数。但是有生态，而且有开…"
date: 2021-10-21
lang: zh
translationKey: "2021-10-21_596_其实YAPI也可以帮助我们构建更加健壮的TS程序"
categories:
  - "前端"
  - "唠嗑"
views: 2727
draft: false
---

## 前言

我们在开发中可能会经常遇到以下几个事情:

1. api接口文档描述不清
2. 没有mock流程
3. 如果使用ts开发，需要手动的描述类型，而且在前端中较难把api类型复用

社区中有大量的api文档工具，支持mock，单测的数不胜数。但是有生态，而且有开放api的开源文档工具其实寥寥无几。yapi是开源的国产文档管理工具，我们可以用yapi的开放api去做一系列拓展，在市面上就有许多浏览器插件/vscode插件，而且它支持私有部署。我们今天就使用我们之前文档提到过的工程架构模板，去构建一个todolist应用，我们的api则是使用midway和serverless快速开发的。

如果你还不太了解我们之前使用的“工程架构模板”，那你可以看一下[这篇文章](https://www.yinzhuoei.com/index.php/archives/570/)

## YAPI

准备了4个api供我们测试，它们都是隶属于List模块，api的源码[在这里](https://github.com/seho-code-life/project_template_app_api)，我们需要在yapi平台上把这些api进行登记。
我们新建了一个测试项目，并且新建了一个list分类，同时新增了4个api:

```
1. /v1/list get
2. /v1/list post
3. /v1/list delete
4. /v1/list put
```

![WX20211021-213731.png](https://static.yinzhuoei.com/typecho/2021/10/21/234632677387513/WX20211021-213731.png)

我们list模块类型声明如下:

```js
export interface List {
  id: string;
  title: string;
  content: string;
}

export type AddItem = Omit<List, \'id\'>;
export type UpdateItem = List;
```

比如说新增的api，在post方法下，我们需要传递title,content，返回一个新增成功的id，这是一个很常见的业务场景，我们在yapi定义一下。

![1634827748418.jpg](https://static.yinzhuoei.com/typecho/2021/10/21/277673029719929/1634827748418.jpg)

这个时候就需要体现出社区的强大了，在社区中有类似yapi2typescript的浏览器插件，所以我就fork一份，再插件之上重新修改了interface名等&新增了controller，modle层代码片段，如果你需要安装这个插件，你可以到这个仓库[查看源码](https://github.com/seho-code-life/yapi-interface-extension)

我们就可以在页面下面看到，如下的类型提示：

![WX20211025-170349.png](https://static.yinzhuoei.com/typecho/2021/10/25/52652372578331/WX20211025-170349.png)

然后我们就可以copy到我们的工程中进行使用，这个时候你可能会问，yapi社区里有很多to typescript的方案，比如说vscode或者命令行工具，为什么要使用浏览器插件？出于以下几点原因，我使用浏览器插件:

1. 不依赖IDE，让团队能更好的统一
2. 不过度依赖yapi，大多数生成方案强绑定yapi，通过api去和本地type diff，这样不容易去单独修改type，难以和临时变化的api协调。

我们通过vscode命令`model-init-type` 去生成一个list.d.ts文件内容, 然后把yapi的类型提示进行粘贴:

```js
namespace TListApiModel {
  interface ReqAddList {
    /** 列表标题 */
    title: string;
    /** 列表内容 */
    content: string;
  }

  interface ResAddList {
    /** 数据id */
    id: string;
  }
}

export default TListApiModel;
```

然后我们就使用命令快速实现一下，list模块的model层和controller层:

```js
// model api
import useRequest from \'../../hook/useRequest\';
import TListApiModel from \'../../../typings/model/api/list\';
export default class ListApiModel {
  addList(params: TListApiModel.ReqAddList): Promise<TListApiModel.ResAddList> {
    return useRequest({
      url: \'/v1/list\',
      method: \'POST\',
      data: params
    });
  }
}
```

```js
// controller
import TListApiModel from \'../../typings/model/api/list\';
import ListApiModel from \'../model/api/list\';
export default class ListController {
  private apiModel: ListApiModel;
  constructor() {
    this.apiModel = new ListApiModel();
  }
  addList(params: TListApiModel.ReqAddList) {
    return this.apiModel.addList(params);
  }
}
```

## 测试

enjoy模板新增了jest，我们可以直接使用jest对功能进行测试，如下:

```js
// tests/model/api/list.test.ts

import ListController from \'../../../src/controller/list\';

describe(\'addList\', () => {
  const controller = new ListController();
  it(\'添加参数测试-1\', async () => {
    await controller.addList({
      title: \'test\',
      content: \'nihao\'
    });
  });
  it(\'添加参数测试-2\', async () => {
    const result = await controller.addList({
      title: \'test2\',
      content: \'hello?\'
    });
    console.log(result.id);
  });
});
```

运行`npm run test tests/model/api/list.test.ts`

![WX20211025-172728.png](https://static.yinzhuoei.com/typecho/2021/10/25/540582138503420/WX20211025-172728.png)

[文章源代码预览](https://github.com/seho-code-life/project_template/tree/vue3-vite2-ts-template(dev)
