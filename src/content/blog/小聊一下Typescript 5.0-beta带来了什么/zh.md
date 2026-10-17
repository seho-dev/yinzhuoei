---
title: "小聊一下Typescript 5.0-beta带来了什么"
description: "今天我们简单聊一下Typescript5带来了什么，因为最近开源工作的需要，对于其装饰器的实现好奇，今天就去着重学习了一下。但是这篇文章其实并没有什么深度和内容，时间紧迫，我最近在适应新的工作环境以及Sword.js 2.0开发，这段时间的文章可能间隔时间会很…"
date: 2023-03-05
lang: zh
translationKey: "2023-03-05_813_小聊一下Typescript 5.0-beta带来了什么"
categories:
  - "前端"
views: 5547
draft: false
---

今天我们简单聊一下Typescript5带来了什么，因为最近开源工作的需要，对于其装饰器的实现好奇，今天就去着重学习了一下。但是这篇文章其实并没有什么深度和内容，时间紧迫，我最近在适应新的工作环境以及Sword.js 2.0开发，这段时间的文章可能间隔时间会很长，话不多说，言归正传。

## 装饰器

在ts最新的版本中对（还在ecma stage-3阶段）装饰器最新的提案进行了实现，在我们之前使用ts时也偶尔使用装饰器，但是之前ts实现的[装饰器版本](https://github.com/tc39/proposal-decorators)是比标准tc39的更早（实验性质），所以我们不得不在tsconfig.json去打开实验性装饰器的开关（**experimentalDecorators**）：

![img_jsconfig-json.png](https://static.yinzhuoei.com/typecho/2023/03/05/09941872631731/img_jsconfig-json.png)

否则我们的代码会报错，在未来，这个配置仍然会继续存在，假如没有这个配置，那么现在装饰器的语法将是有效的，不会报错。但是无论是类型检查和tsc，新旧装饰器会有很大不同，尽管我们可以编写装饰器去兼容新旧装饰器，但是如果是老版本的代码，这样做不是一个明智的选择。

新的装饰器不支持**装饰参数**，希望未来ecma标准会支持这一行为：

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

下面我们可以编写一个装饰器函数，比如在一个函数中添加输出前和输出后的语句：

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

为了便于理解，2个参数都暂时使用了any，可以看到第一个参数为`originalMethod`代表了原method，第二个参数`context`代表了上下文。在装饰器函数中我们返回了一个新的函数去代替，像下面一样使用装饰器，就可以得到一个输出前和输出后的功能：

```js
@loggedMethod
greet() {
    console.log(`Hello, my name is ${this.name}.`);
}
```

有时候，我们也可能这样调用一个方法：

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

这段代码将会报错，原因是作为单独调用，没有重新绑定this；按照以往，我们可以在构造时重新绑定this：

```js
this.greet = this.greet.bind(this);
```

我们尝试编写一个装饰器来替代这种写法：

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

在context中我们可以给其中的`addInitializer`函数创建一个回调，（`addInitializer`函数可以允许我们将对应的逻辑添加在构造函数之前），将绑定this的操作更新上去，此时我们可以将bound函数作为装饰器给greet方法：

```js
@bound
@loggedMethod
greet() {
    console.log(`Hello, my name is ${this.name}.`);
}
```

它们的调用顺序是相反的，即先装饰原有方法并修饰结果。也可以将装饰器放在同一行：

```js
@bound @loggedMethod greet() {
    console.log(`Hello, my name is ${this.name}.`);
}
```

和以前一样，也可以给装饰器函数传递参数，在其内部返回的函数将构建成为一个闭包，比如：

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

官方建议我们，在编写装饰器时，应该根据自己的需求来编写带类型的装饰器，即尽量保持简单，因为在编写装饰器时如果非要死磕类型的话，那么也会损失可读性，下面是一个通过泛型实现的类型版本装饰器：

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

ts5中也对const做出了调整，在以前推断类型时，通常会选择一个更通用的类型，比方说我们需要取record的key，那么会被默认推断为string；在之前的开发过程中也时常会想获取到具体的字面类型，通常会在推断之后加入`const`，比如我们回忆一下const断言的经典使用场景：

```js
const x = \'x\';
let y = \'x\'; // string
```

```js
let y = \'x\' as const; // string
```

默默吐槽一句，官方说有时候会忘记as const断言，然后提供了一个我个人认为更复杂的写法：

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

给类型前面挂一个const，这样推断出来的对象key值才是具体的（不做任何讲解，我觉得我一辈子也用不到这个东西hh）

## 支持配置文件多个继承

```json
{
    \"compilerOptions\": {
        \"extends\": [\"a\", \"b\", \"c\"]
    }
}
```

## 改进枚举

在以前，枚举有2种类型，一种是数字枚举，一种是文本类型枚举，它们是不能混用的。但是在ts5中将它们进行了融合，换句话说此时枚举其实就是它的成员类型的联合，并且初始化枚举时，可以是常量也可以是一个表达式：

```js
enum E {
    A = 10 * 10,  // Numeric literal enum member
    B = \"foo\",    // String literal enum member
    C = bar(42)   // Opaque computed enum member
}
```

那么此时E的类型就是E.A | E.B | E.C；值得注意的是我们应用的常量必须事先声明，否则也会报错，比如：

```js
enum E {
    a = b,
}

const b = 1
```

## 新的模块查找规则

简单的说对于现代捆绑器而言，我们都已习惯了在相对导入下不用编写文件后缀，但是在ts之前没有支持，ts5新增了一个模块查找规则，可以帮助我们使用现代捆绑器时，直接编写如下的代码：

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

同时，与之相关，还有一批和此功能类似的配置项更新：https://devblogs.microsoft.com/typescript/announcing-typescript-5-0-beta/#resolution-customization-flags

## 支持export type *

```js
export type * from \"mod\"
```

```js
export type * as ns from \"mod\"
```

## TSC更新

这块我不咋用，因为我捆绑ts程序好像好多年都不用tsc了，这个更新大家就主要过个眼熟吧：

- declaration
- emitDeclarationOnly
- declarationMap
- soureMap
- inlineSourceMap

## 源码改进

大概就是，算法，数据结构，包体积有了显著的升级，不管是安装速度还是使用速度上，相较于4.x版本有个幅度较高的升级。我简单整理了一下ts的优化方案：

- namespace -> module （终于舍弃了namespace，得益于module，ts可以用现代的工具链来优化整个打包体积）
- 缓存了信息到字符串这一过程，在一些操作中可以重用
- 减少了内存占用，主要是内部对象类型增加统一性，对某些对象类型进行瘦身，减少了多态使用次数

## 关于版本号的争议

有网友说对此次的更新不满意，认为这没有breakchange，版本号变更到5.0是不妥的，我个人感觉不管是新的模块查找规则，还有枚举，面向更现代的es等等更新都可以算的上是5.0；等过段时间稳定之后，我已经迫不及待的想使用5.0啦。

## 参考资料

- https://devblogs.microsoft.com/typescript/announcing-typescript-5-0-beta/
- https://2ality.com/2022/10/javascript-decorators.html
- https://github.com/microsoft/TypeScript/pull/50528
