---
title: "Actually, YAPI Can Also Help Us Build More Robust TypeScript Applications"
description: "How to leverage YAPI and browser extensions to auto-generate TypeScript interface definitions, models, and controllers in frontend engineering architectures, streamlining API documentation and type reuse."
date: 2021-10-21
lang: en
translationKey: "2021-10-21_596_其实YAPI也可以帮助我们构建更加健壮的TS程序"
categories:
  - "Frontend"
  - "Life"
views: 2727
draft: false
---

## Preface

During daily development, we frequently run into the following pain points:

1. Ambiguous or poorly maintained API documentation
2. Lack of an established mock workflow
3. When developing with TypeScript, types have to be written manually, and reusing API types across frontend layers is cumbersome

There are countless API documentation tools in the developer ecosystem that support mocking and unit testing. However, open-source documentation platforms with thriving ecosystems and open APIs are surprisingly few and far between. YAPI is an open-source documentation management platform developed in China. By utilizing YAPI's open APIs, we can build custom extensions—ranging from browser plugins to VS Code extensions—with support for private on-premise deployments.

Today, we will use the engineering architecture template mentioned in our previous article to build a TodoList application. The backend APIs are rapidly developed using Midway and serverless functions.

If you are not yet familiar with the "engineering architecture template" we discussed earlier, feel free to check out [this article](https://www.yinzhuoei.com/index.php/archives/570/).

## YAPI

We prepared 4 APIs for our test case, all belonging to the `List` module. The API source code is [available here](https://github.com/seho-code-life/project_template_app_api). We need to register these APIs on the YAPI platform.

We created a test project, added a `list` category, and added 4 APIs:

```text
1. /v1/list get
2. /v1/list post
3. /v1/list delete
4. /v1/list put
```

![WX20211021-213731.png](https://static.yinzhuoei.com/typecho/2021/10/21/234632677387513/WX20211021-213731.png)

Our type declaration for the `List` module looks like this:

```typescript
export interface List {
  id: string;
  title: string;
  content: string;
}

export type AddItem = Omit<List, 'id'>;
export type UpdateItem = List;
```

For instance, when creating an item with the `POST` method, we need to pass `title` and `content`, and receive the newly created `id` in response. This is a very common business scenario. Let's define it in YAPI:

![1634827748418.jpg](https://static.yinzhuoei.com/typecho/2021/10/21/277673029719929/1634827748418.jpg)

This is where the power of the open-source community shines. There are browser extensions like `yapi2typescript` in the community. I forked one of these extensions and customized it to generate interface names, controller snippets, and model layer code suited to our conventions. If you would like to install or inspect this plugin, check out the repository: [Source Code](https://github.com/seho-code-life/yapi-interface-extension).

With the extension enabled, we can see auto-generated type hints directly beneath the API definition page:

![WX20211025-170349.png](https://static.yinzhuoei.com/typecho/2021/10/25/52652372578331/WX20211025-170349.png)

From there, we can simply copy them into our project. At this point, you might wonder: there are many `to-typescript` solutions in the YAPI community (e.g., VS Code extensions or CLI generators); why choose a browser extension? I opted for a browser extension for two reasons:

1. **Independent of IDEs**: It ensures better consistency across teams using different development environments.
2. **Avoids over-coupling with YAPI**: Many CLI generators are tightly coupled to YAPI and perform remote API diffs against local types, making it harder to customize individual types manually or adapt quickly to temporary, in-flux backend changes.

We use the VS Code command `model-init-type` to scaffold a `list.d.ts` file, and paste in the generated type definitions from YAPI:

```typescript
namespace TListApiModel {
  interface ReqAddList {
    /** List title */
    title: string;
    /** List content */
    content: string;
  }

  interface ResAddList {
    /** Data id */
    id: string;
  }
}

export default TListApiModel;
```

Next, we quickly scaffold the model layer and controller layer for the `list` module:

```typescript
// model api
import useRequest from '../../hook/useRequest';
import TListApiModel from '../../../typings/model/api/list';

export default class ListApiModel {
  addList(params: TListApiModel.ReqAddList): Promise<TListApiModel.ResAddList> {
    return useRequest({
      url: '/v1/list',
      method: 'POST',
      data: params
    });
  }
}
```

```typescript
// controller
import TListApiModel from '../../typings/model/api/list';
import ListApiModel from '../model/api/list';

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

## Testing

The enjoy template includes Jest out of the box, allowing us to unit test our logic directly:

```typescript
// tests/model/api/list.test.ts

import ListController from '../../../src/controller/list';

describe('addList', () => {
  const controller = new ListController();

  it('add parameters test 1', async () => {
    await controller.addList({
      title: 'test',
      content: 'hello'
    });
  });

  it('add parameters test 2', async () => {
    const result = await controller.addList({
      title: 'test2',
      content: 'hello?'
    });
    console.log(result.id);
  });
});
```

Run `npm run test tests/model/api/list.test.ts`:

![WX20211025-172728.png](https://static.yinzhuoei.com/typecho/2021/10/25/540582138503420/WX20211025-172728.png)

[Project Source Code Preview](https://github.com/seho-code-life/project_template/tree/vue3-vite2-ts-template(dev))
