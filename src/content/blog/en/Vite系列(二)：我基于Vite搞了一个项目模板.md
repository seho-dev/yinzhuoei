---
title: "Vite Series (Part 2): I Built a Project Template Based on Vite"
description: "A comprehensive project template based on Vite 2, Vue 3, and TypeScript featuring on-demand Ant Design Vue loading, lint-staged/husky git hooks, modular MVC architecture, and Pinia state management."
date: 2021-09-25
lang: en
translationKey: "2021-09-25_570_Vite系列(二)：我基于Vite搞了一个项目模板"
categories:
  - "Frontend"
views: 7241
draft: false
---

# vue3-vite2-ts-template

Repository: [github-vue3-vite2-ts-template](https://github.com/seho-code-life/project_template)

- [x] Uses the latest versions of Vite and Vue 3
- [x] True on-demand loading of Ant Design Vue components and component CSS
- [x] Pre-commit lint-staged + husky verification and code formatting (Prettier) for unified team code styles
- [x] Preset ESLint verification with auto-fix and EditorConfig
- [x] Bundled common development dependencies: antdv, axios, dayjs, querystring...
- [x] TypeScript MVC-style architecture suited for small to medium projects
- [x] Hook-style utility methods, pre-installed with [vueuse](https://github.com/vueuse/vueuse)
- [x] Encapsulated SCSS base utility library; no manual imports needed across pages, directly use predefined global variables/functions
- [x] Vite/Rollup build optimizations
- [x] Modular TypeScript storage and cookie solutions
- [x] Preset Pinia modular state management and type declarations
- [x] Preset `vite-plugin-mock` for development environments
- [x] Preset automatic route loading with [vite-plugin-pages](https://www.npmjs.com/package/vite-plugin-pages)
- [ ] SSR/CSR optimizations
- [ ] Auto-generation of business component/type documentation that opens automatically when dev server starts
- [ ] Animation solutions
- [ ] Pre-packaged business Web Components (team-developed component library)

## Commands

| Command | Description |
| --- | --- |
| dev | Quickly launch the local development server |
| lint | Run ESLint check with `--fix` |
| prettier | Format code using eslint-prettier |
| prepare | Husky installation command executed automatically on `npm install` (ignore if not using) |
| lint-stage | Run lint-staged operations on Git staged files |
| build | Build bundle using Vite's built-in Rollup with scaffold optimizations |
| serve | Locally preview the production build |

### Start / Build Commands

| Command | Description |
| --- | --- |
| dev:test | Quickly start local dev server (test environment) |
| dev:prod | Quickly start local dev server (prod environment) |
| build:test | Build bundle (test environment) |
| build:prod | Build bundle (prod environment) |

## Tech Stack

1. [vue3](https://vue3js.cn/)
2. [vueRouter4](https://next.router.vuejs.org/guide/)
3. pinia
4. typescript

## CLI Tool

You can use the project template interactively via a companion CLI tool. Since most projects won't need everything included in the repo, you can bring in features on demand using the tool:

```shell
npm i enjoy-project-tool -g
```

Create a project from the template:

```shell
enjoy create
```

As a companion tool to the template, I will continue maintaining it and rolling out new features to streamline development workflows.

The tool is developed with TypeScript. If you're interested, PRs are welcome: [Tool Repository](https://github.com/seho-code-life/project_tool).

## Type & Component Documentation

Documentation is still being supplemented. Tentatively adopting:

1. [dumi](https://d.umijs.org/zh-CN) for component library documentation

## Code Commits

Modern Husky versions differ significantly from older ones. If you have used older versions of Husky before and want to add custom logic to the commit workflow, refer to the latest official documentation.

In this template, only the `pre-commit` hook is intercepted to run linting, auto-fixing, and formatting on staged files using `lint-staged`. This combination is widely used. Developers with additional requirements can extend this setup and submit a PR.

Another common requirement is validating Git commit message formatting. For smaller teams, strictly enforcing this may introduce unnecessary friction without immediate payoff, but feel free to explore it if you'd like.

I recommend that team members use [git-commit-plugin-vscode](https://marketplace.visualstudio.com/items?itemName=redjue.git-commit-plugin).

## VS Code Development Guide

I recommend using the Volar extension. If your IDE belongs to the JetBrains family, you might not need it as much, but for VS Code, Volar is strongly recommended. With Volar, you not only achieve development parity with JetBrains IDEs for Vue, but also obtain better Vue 3 tooling support—even enabling early access to experimental and draft syntactic features.

[Download Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

This template provides first-class support for VS Code. When opening in VS Code, you can leverage preset workspace settings such as format/fix-on-save with ESLint and Prettier.

### Helpful Code Snippets

The template includes several VS Code snippets that will be updated continuously. Tailored specifically for this architecture, they help eliminate repetitive boilerplate. Here is what each snippet provides:

- `model-init-type`

> Scaffolds `@types/model/api` definitions, automatically declaring the namespace and exports.

![](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-86dc45ba-28e8-4734-a880-bbf700b08cf9/cd983ea7-89a9-42f5-ab95-019190a805e8.gif)

- `model-init-api`

> Scaffolds an API class inside `model`, automatically importing matching type declarations and common dependencies.

![](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-86dc45ba-28e8-4734-a880-bbf700b08cf9/12b51827-c296-49cf-a16f-a790d6213390.gif)

- `model-init-cache`

> Scaffolds a cache class inside `model`, automatically importing matching type declarations and common dependencies.

![](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-86dc45ba-28e8-4734-a880-bbf700b08cf9/3974f3d2-2eba-44c9-b621-6c30e6241ce3.gif)

- `controller-init`

> Scaffolds a controller class.

![](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-86dc45ba-28e8-4734-a880-bbf700b08cf9/3f1939a3-6657-44eb-8125-6ac141e7d138.gif)

- `vue-init`

> Scaffolds a Vue page or component.

![](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-86dc45ba-28e8-4734-a880-bbf700b08cf9/3a5e4588-72ec-49f7-8a49-f390b9966bfd.gif)

## Ant Design Vue Development Guide

Traditional Ant Design Vue on-demand loading relied on `babel-plugin-import` to analyze and import components automatically. However, AntDV includes many nested parent-child components:

```html
<a-menu>
  <a-menu-item></a-menu-item>
</a-menu>
```

Due to internal design reasons, that plugin couldn't reliably import these on demand. More importantly, since we are using Vite, on-demand component loading is already available out of the box—we only need to manage on-demand loading of component CSS. Two plugins are used to handle this:

1. `vite-plugin-components`
2. `vite-plugin-style-import`

The first plugin automatically detects components used in templates and imports them automatically. When using a component library like AntDV, you do not need to import the full library or even write manual `import` statements; components are automatically resolved:

![](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-c7e81452-9d28-4486-bedc-5dbf7c8386a5/1e56ccda-acb2-4db0-bfd0-3d852ee6173a.png)

Furthermore, the scaffold has built-in logic for on-demand CSS imports, freeing developers from worrying about AntDV's CSS import quirks.

The second plugin primarily assists the first one with on-demand CSS imports. The first plugin has minor limitations: for example, AntDV includes API-driven components like `message`. When invoking a component imperatively via `message`, styles wouldn't apply automatically, which is where the second plugin steps in.

> The reason styles failed for API components like `message` is simple: the first plugin only inspects components referenced inside `<template>` to import CSS, but cannot intercept imperatively imported API methods. The second plugin resolves this.

## Architecture & Development Guide

This section evolves according to team habits and project needs, so details here will update over time.

This lightweight architecture is well-suited for small-to-medium web apps while staying simple: primarily an MVC + TypeScript approach. Reading through the template code, you will notice clean modularization across business domains. This addresses a common issue in team workflows: one developer enjoys building features quickly, but subsequent maintainers struggle—configurations, APIs, and component parameters are hard to find, leading people to copy-paste code from older pages. While that is technically "reuse", it is not standardized. Only by cleanly delineating business concerns can we quickly locate core logic and achieve maintainable reuse.

### Types

`src/@types`

As in most disciplined projects, extractable types are placed inside `@types`. They are divided into:

1. controller
2. model
3. hook
4. store

The most heavily utilized is `model`. We define TypeScript interfaces matching business APIs, such as `user.ts`:

```ts
namespace TUserApiModel {
  type ReqLogin = {
    captcha: string;
    password: string;
    username: string;
    uuid: string;
  };

  type ResLogin = Promise<
    ActionResult<{
      token: string;
    }>
  >;
}

export default TUserApiModel;
```

These represent the API layer inside `model` (detailed below). Using `Req` and `Res` prefixes denotes request and response payload types. Once declared, you can reference them throughout the codebase:

```ts
TUserModel.ReqLogin
```

Similarly, folders like `store` and `hook` within `@types` define types grouped by business domains.

### Models

`src/model`

Currently, `model` covers two domains:

1. api
2. cache

Together they cover most frontend data sources. The API model defines API request methods for each domain, such as `user.ts`:

```ts
import useRequest from '../../hook/useRequest';

export default class UserApiModel {
  async login(params: TUserModel.ReqLogin): TUserModel.ResLogin {
    return await useRequest({
      url: `${params}`,
      method: 'get',
      options: {
        authApi: true
      }
    });
  }
}
```

`useRequest` is a custom hook function for dispatching HTTP requests. In this class, the `login` method takes `params: TUserModel.ReqLogin` and returns `TUserModel.ResLogin`, both defined in `@types`.

Additionally, we pair with `kurimudb` for modular caching, with popular cache drivers pre-configured:

`/model/cache/user.ts`

```ts
import { Models } from 'kurimudb';
import { LocalStorageDriver } from 'kurimudb-driver-localstorage';
import { CookieDriver } from 'kurimudb-driver-cookie';

export class UserLocalStorage extends Models.keyValue {
  constructor() {
    super({
      name: 'user',
      driver: LocalStorageDriver
    });
  }
}

export class UserCookie extends Models.keyValue {
  constructor() {
    super({
      name: 'user',
      driver: CookieDriver
    });
  }
}
```

Two kurimudb classes are defined here: one for localStorage and one for cookies. You can add custom methods or export them directly for controllers to use, since `kurimudb` provides built-in CRUD methods out of the box.

`kurimudb` cleanly addresses storage modularity: you don't need to worry about key collisions across modules—just provide a unique `name`, and it exposes a clean set of APIs. `kurimudb` also supports drivers for sessionStorage and IndexedDB, making it straightforward to add more storage backends as needed.

### Controllers

`src/controller`

The template includes a `user.ts` controller example. After defining `apiModel` and `cacheModel`, the controller imports them and exposes unified entry points:

```ts
import UserApiModel from '../model/api/user';
import { UserLocalStorage, UserCookie } from '../model/cache/user';

export default class UserController {
  private localStorageModel: UserLocalStorage;
  private cookieModel: UserCookie;
  private apiModel: UserApiModel;

  constructor() {
    this.apiModel = new UserApiModel();
    this.localStorageModel = new UserLocalStorage();
    this.cookieModel = new UserCookie();
  }
  async login(req: TUserModel.ReqLogin): TUserModel.ResLogin {
    return await this.apiModel.login(req);
  }
}
```

Controllers can also transform data fetched from API or cache layers. For example, if backend response formats aren't convenient for direct display in UI components, normalize them in the controller:

```ts
transform(): { text: string; value: string }[] {
    const data = {
      '0': 'Xiao Ming',
      '1': 'Xiao Hong'
    };
    let _arr = [];
    let key: keyof typeof data;
    for (key in data) {
      _arr.push({
        text: data[key],
        value: key
      });
    }
    return _arr;
  }
```

### Views (`.vue`)

Taking Vue as an example, how do we cleanly call controllers in views and use types from `@types` to safeguard our components?

```ts
import TUserApiModel from '../../@types/model/api/user';

const login = async (params: TUserModel.ReqLogin) => {
  await userController.login(params);
};

// Calling login
login({
  captcha: "",
  password: "",
  username: "",
  uuid: ""
});
```

If the payload passed to `login` does not conform to `ReqLogin`, TypeScript reports an error immediately. Similarly for cache access: encapsulate cache operations inside the controller, then expose clean methods to Vue components.

## Environment Variables

Configure environment modes according to business requirements ([Vite Modes Documentation](https://vitejs.dev/guide/env-and-mode.html#modes)).

Three environment files are provided in the root directory by default, corresponding to local, test, and production environments:

1. `.env`
2. `.env.dev`
3. `.env.prod`

Example content:

```
VITE_APP_API=
VITE_APP_SECRET=
```

Similarly, when custom environment variables are added, declare their types in `src/vite-env.d.ts`:

```ts
/// <reference types="vite/client" />
interface ImportMetaEnv {
  VITE_APP_API: string;
  VITE_APP_SECRET: string;
  // Declare new environment variables here
}
```

## Mocking

We use `vite-plugin-mock` for local development mocking (production mocks are not enabled by default):

```ts
// vite.config.ts
viteMockServe({
  localEnabled: true // Enable local mock service
}),
```

Define mock APIs:

```ts
// /mock/user.ts

import { MockMethod } from 'vite-plugin-mock';
export default [
  {
    url: '/api/get',
    method: 'get',
    response: (res: any) => {
      return {
        code: 0,
        data: {
          name: 'this is mock name'
        }
      };
    }
  }
] as MockMethod[];
```

## Other Bundled Libraries

1. dayjs
2. axios
3. vueuse
4. kurimudb
5. query-string
