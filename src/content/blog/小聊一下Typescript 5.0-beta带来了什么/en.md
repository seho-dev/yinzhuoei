---
title: "A Quick Look at What's New in TypeScript 5.0 Beta"
description: "Today, let's take a quick look at what TypeScript 5 brings. My recent open-source work made me curious about its decorator implementation, so I spent some time studying it today. This isn't a particularly deep or substantial article, though: time is tight as I settle into a new work environment and develop Sword.js 2.0, so there may be long gaps between posts for a while…"
date: 2023-03-05
lang: en
translationKey: "2023-03-05_813_小聊一下Typescript 5.0-beta带来了什么"
categories:
  - "Frontend"
views: 5547
draft: false
---

Today, let's take a quick look at what TypeScript 5 brings. My recent open-source work made me curious about its decorator implementation, so I spent some time studying it today. This isn't a particularly deep or substantial article, though: time is tight as I settle into a new work environment and develop Sword.js 2.0, so there may be long gaps between posts for a while. Without further ado, let's get to it.

## Decorators

The latest version of TS implements the latest decorators proposal, which is still at ECMAScript Stage 3. We've occasionally used decorators in TS before, but its previous [decorator implementation](https://github.com/tc39/proposal-decorators) predates the TC39 standard and is experimental. That's why we had to enable experimental decorators in tsconfig.json using **experimentalDecorators**:

![img_jsconfig-json.png](https://static.yinzhuoei.com/typecho/2023/03/05/09941872631731/img_jsconfig-json.png)

Otherwise, our code would report errors. This configuration option will remain available. Without it, the new decorator syntax will now be valid and won't trigger errors. However, the old and new decorators differ substantially in both type checking and tsc's output. Although it's possible to write decorators that support both versions, doing so for an older codebase isn't necessarily a wise choice.

The new decorators do not support **decorating parameters**. Hopefully a future ECMAScript standard will support this:

```js
class Person {
    @required
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    greet() {
        console.log(`Hello, my name is ${this.name}.`);
    }
}
```

Let's write a decorator function that, for example, adds log statements before and after a method executes:

```js
function loggedMethod(originalMethod: any, _context: any) {

    function replacementMethod(this: any, ...args: any[]) {
        console.log(\"LOG: Entering method.\")
        const result = originalMethod.call(this, ...args);
        console.log(\"LOG: Exiting method.\")
        return result;
    }

    return replacementMethod;
}
```

To keep things easy to follow, both parameters are temporarily typed as any. The first parameter, `originalMethod`, represents the original method; the second, `context`, represents its context. Our decorator returns a new function to replace the original. Applying it as shown below gives us logging before and after execution:

```js
@loggedMethod
greet() {
    console.log(`Hello, my name is ${this.name}.`);
}
```

Sometimes, we might call a method like this:

```js
class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  greet() {
    console.log(`Hello, my name is ${this.name}.`);
  }
}

const greet = new Person(\"Ray\").greet;

greet();
```

This code throws an error because the method is called on its own, without rebinding this. Traditionally, we could bind this again in the constructor:

```js
this.greet = this.greet.bind(this);
```

Let's try writing a decorator to replace that approach:

```js
function bound(originalMethod: any, context: ClassMethodDecoratorContext) {
    const methodName = context.name;
    if (context.private) {
        throw new Error(`\'bound\' cannot decorate private properties like ${methodName as string}.`);
    }
    context.addInitializer(function () {
        this[methodName] = this[methodName].bind(this);
    });
}
```

We can pass a callback to `context`'s `addInitializer` function, which allows us to add initialization logic before the constructor's body runs. That callback handles binding this. We can now use bound as a decorator on greet:

```js
@bound
@loggedMethod
greet() {
    console.log(`Hello, my name is ${this.name}.`);
}
```

They are applied in reverse order: the original method is decorated first, and then that result is decorated. You can also put the decorators on the same line:

```js
@bound @loggedMethod greet() {
    console.log(`Hello, my name is ${this.name}.`);
}
```

As before, you can pass arguments to a decorator factory. The function it returns forms a closure. For example:

```js
function loggedMethod(headMessage = \"LOG:\") {
    return function actualDecorator(originalMethod: any, context: ClassMethodDecoratorContext) {
        const methodName = String(context.name);
        function replacementMethod(this: any, ...args: any[]) {
            console.log(`${headMessage} Entering method \'${methodName}\'.`)
            const result = originalMethod.call(this, ...args);
            console.log(`${headMessage} Exiting method \'${methodName}\'.`)
            return result;
        }
        return replacementMethod;
    }
}
```

```js
@loggedMethod(\"seho\")
```

The official guidance is to write typed decorators according to your needs and keep things as simple as possible. Obsessing over types while writing a decorator can hurt readability. Here's a typed version implemented with generics:

```js
function loggedMethod<This, Args extends any[], Return>(
    target: (this: This, ...args: Args) => Return,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
) {
    const methodName = String(context.name);
    function replacementMethod(this: This, ...args: Args): Return {
        console.log(`LOG: Entering method \'${methodName}\'.`)
        const result = target.call(this, ...args);
        console.log(`LOG: Exiting method \'${methodName}\'.`)
        return result;
    }
    return replacementMethod;
}
```

## const

TS 5 also changes how const can be used. Previously, type inference would usually choose a more general type. For example, if we wanted the keys of a record, they might be inferred as string by default. During development, we sometimes want specific literal types instead, and would usually add `const` to influence inference. Let's revisit the classic use of const assertions:

```js
const x = \'x\';
let y = \'x\'; // string
```

```js
let y = \'x\' as const; // string
```

A small gripe: the official explanation says people sometimes forget the as const assertion, then offers what I personally find to be an even more complicated approach:

```js
type HasNames = { names: readonly string[] };
function getNamesExactly<const T extends HasNames>(arg: T): T[\"names\"] {
//                       ^^^^^
    return arg.names;
}

// Inferred type: readonly [\"Alice\", \"Bob\", \"Eve\"]
// Note: Didn\'t need to write \'as const\' here
const names = getNamesExactly({ names: [\"Alice\", \"Bob\", \"Eve\"] });
```

Put const before the type parameter to preserve specific values in the inferred object type. I won't explain it further; I feel like I might never use this in my life, haha.

## Extending Multiple Configuration Files

```json
{
    \"compilerOptions\": {
        \"extends\": [\"a\", \"b\", \"c\"]
    }
}
```

## Enum Improvements

Previously, there were two types of enums: numeric enums and string enums, which couldn't be mixed. TS 5 brings them together. In other words, an enum is now a union of its member types, and an enum member can be initialized with either a constant or an expression:

```js
enum E {
    A = 10 * 10,  // Numeric literal enum member
    B = \"foo\",    // String literal enum member
    C = bar(42)   // Opaque computed enum member
}
```

Here, E's type is E.A | E.B | E.C. Note that any constants we reference must be declared first, or an error will occur. For example:

```js
enum E {
    a = b,
}

const b = 1
```

## New Module Resolution Rules

Simply put, modern bundlers have accustomed us to leaving file extensions off relative imports, but TS previously didn't support this in the relevant resolution modes. TS 5 adds a new module resolution strategy that lets us write code like this when using a modern bundler:

```js
import * as utils from \"./utils\";
```

```json
{
    \"compilerOptions\": {
        \"target\": \"esnext\",
        \"moduleResolution\": \"bundler\"
    }
}
```

A related set of configuration options has also been updated: https://devblogs.microsoft.com/typescript/announcing-typescript-5-0-beta/#resolution-customization-flags

## Support for export type *

```js
export type * from \"mod\"
```

```js
export type * as ns from \"mod\"
```

## TSC Updates

I don't really use this, since I don't think I've used tsc to bundle a TS program in years. Just keep these updates on your radar:

- declaration
- emitDeclarationOnly
- declarationMap
- soureMap
- inlineSourceMap

## Source Code Improvements

In short, algorithms, data structures, and package size have all improved considerably. Both installation and usage are significantly faster than in 4.x. Here's a brief summary of TS's optimizations:

- namespace -> module (finally moving away from namespaces; modules let TS use modern tooling to optimize the overall bundle size)
- Caching conversions of information into strings so they can be reused in some operations
- Reducing memory usage, primarily by making internal object types more uniform, slimming down certain object types, and reducing polymorphism

## The Version Number Debate

Some people online weren't happy with this update. They argued that without breaking changes, calling it 5.0 was inappropriate. Personally, I think the new module resolution strategy, enum improvements, and support for more modern ES features are enough to justify 5.0. I can't wait to use it once it's had a little time to stabilize.

## References

- https://devblogs.microsoft.com/typescript/announcing-typescript-5-0-beta/
- https://2ality.com/2022/10/javascript-decorators.html
- https://github.com/microsoft/TypeScript/pull/50528
