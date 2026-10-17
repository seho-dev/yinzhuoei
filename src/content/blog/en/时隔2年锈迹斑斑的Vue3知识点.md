---
title: "Brushing the Rust off My Vue 3 Knowledge After Two Years"
description: "These are just a few notes on the basics, not a guide to anything new. If you're already comfortable with Vue 3, feel free to move on. If you're still a beginner, this short recap of rendering, reactivity, and the Composition API may help…"
date: 2023-01-21
lang: en
translationKey: "2023-01-21_794_时隔2年锈迹斑斑的Vue3知识点"
categories:
  - "Life"
views: 5189
draft: false
---

These are just a few notes. The topics are simple, so this is only a recap—if you're looking to learn something new, you can close the tab now. But if you're still a Vue 3 beginner, this short write-up might help.

## The Renderer

As we know, a Vue SFC's template is compiled into a render function. That function ultimately returns a VDOM: Vue's own implementation of a virtual DOM, since virtual DOM itself is not a standard. Compared with earlier versions, Vue 3 makes many optimizations to its VDOM. At a high level, its rendering pipeline looks like this:

```
预编译/运行时编译出渲染函数 -> 进行渲染创建真实dom -> diff比对高效替换dom
```

The main optimizations happen during `precompilation`. Vue lets us write render functions by hand, but the official recommendation is to use `template syntax`. The biggest reason is that templates are easier to `analyze statically`, which makes compile-time optimization easier. The same principle underlies Vue's tree-shaking optimizations: ES modules can be analyzed statically, enabling dead-code elimination. For that reason, the rest of this discussion focuses on template syntax.

Think about how rendering works in Vue 2. Templates are compiled, but there is one major drawback: **static content is diffed again, too**.

What does that mean?

Suppose we write this in a template:

```js
<p>hello world</p>
```

This code cannot change: it has no bindings and reads no reactive variables. Vue 3 therefore uses `PatchFlag` markers to identify the types of VDOM child nodes, allowing the diffing process to skip work. PatchFlag is an enum in Vue's source code with many flags. They use bitwise operations, so checking them during runtime diffing has very little overhead.

```js
export const enum PatchFlags {
  TEXT = 1,// 动态的文本节点
  CLASS = 1 << 1,  // 2 动态的 class
  STYLE = 1 << 2,  // 4 动态的 style
  PROPS = 1 << 3,  // 8 动态属性，不包括类名和样式
  FULL_PROPS = 1 << 4,  // 16 动态 key，当 key 变化时需要完整的 diff 算法做比较
  HYDRATE_EVENTS = 1 << 5,  // 32 表示带有事件监听器的节点
  STABLE_FRAGMENT = 1 << 6,   // 64 一个不会改变子节点顺序的 Fragment
  KEYED_FRAGMENT = 1 << 7, // 128 带有 key 属性的 Fragment
  UNKEYED_FRAGMENT = 1 << 8, // 256 子节点没有 key 的 Fragment
  NEED_PATCH = 1 << 9,   // 512
  DYNAMIC_SLOTS = 1 << 10,  // 动态 solt
  HOISTED = -1,  // 特殊标志是负整数表示永远不会用作 diff
  BAIL = -2 // 一个特殊的标志，指代差异算法
}
```

Beyond PatchFlag, Vue's compiler provides other rendering optimizations, including static hoisting, tree flattening, and event handler caching. Let's go through them one by one.

When compiling a template, we can already identify its static content. Besides letting it skip diffing, we can reuse references to it when generating the VDOM tree. The following pseudocode illustrates the difference between Vue 2 and Vue 3:

```js
// vue2
const output = () => {
    const template = {text: \"hello world\"}
    return {
        children: [{template}]
    }
}
```

```js
// vue3
const template = {text: \"hello world\"}
const output = () => {
    return {
        children: [{template}]
    }
}
```

For large Vue projects, this kind of hoisting saves a significant amount of memory.

Tree flattening is also easy to understand, and it relates to the PatchFlag mechanism we just discussed. We know static content is skipped—but how? Through flattening. A section of HTML in a template can be treated as a block, and that block may contain many nodes. The Vue compiler collects the dynamic nodes among its descendants and produces a **flat list of VDOM nodes without their nesting hierarchy**. This greatly improves diffing and update efficiency.

Event handler caching is straightforward too. Earlier Vue versions treated the click handler below as dynamic content, so they needed to track it on every update:

```js
<div>
  <button @click = \'onClick\'>点我</button>
</div>
```

That is no longer necessary: an internal event handler cache solves the problem.

## Reactivity

This is one of the most important parts of Vue 3. Vue 2's limited reactivity led to some rather unpleasant APIs. It recursively walked the properties in data so that each object could have getters and setters attached. Its handling of arrays also left something to be desired. The reason was defineProperty—an API that I suspect has been burned into Vue developers' minds for years. I won't go into that here; let's focus on Vue 3's reactivity.

First, Vue 3's reactivity is based on Proxy, and this API cannot be polyfilled. But browsers keep getting more capable, and using modern APIs to improve the development experience is worthwhile—especially now that IE is dead. Proxy provides powerful interception capabilities for objects, including operations involving arrays, such as deletion and push. Vue also performs plenty of magic inside its reactivity core, including tracking reads in for loops and binding new values…

Like Vue 2, Vue 3 provides an observer-like mechanism, although I prefer to call it publish–subscribe. To me, the observer pattern implies a direct, tightly coupled relationship, whereas publish–subscribe usually has a central dispatcher. In Vue, effect functions subscribe to reactive variables. Whenever code uses a reactive variable, Vue tracks that use and records the effect in a `WeakMap`-based dependency structure. When the variable changes, its associated effects are executed.

But how do we know where a reactive variable has been read? That is where Proxy comes in: it can intercept property reads. Similarly, when we use ref to create a primitive value:

```js
const foo = ref(1)
```

It is wrapped in an object as well. If you pass an object to ref, its underlying reactive handling is essentially the same as reactive.

Vue 3 also provides compiler macros that make reactive variables more convenient to work with. For example, to work with a ref variable:

```js
const foo = $ref(1)

foo = 2
```

The compiler macro automatically adds .value for us. Destructuring a reactive object can also make the extracted values lose their reactivity. The `$()` compiler macro can simplify the equivalent toRef operations:

```js
const { x, y } = $(useXXX())
```

## Composition API

Some interviewers particularly like asking about the differences between the Composition API and the Options API. Others ask about the relative strengths and weaknesses of React Hooks and the Composition API. The first question is easy; the second requires taking the wider ecosystem into account. (Ha!)

First, the difference between Options and Composition.

Composition primarily addresses code reuse and maintainability, especially reuse. Previously, if we wanted to reuse logic in a component, we would typically choose mixins. To be honest, I've never used mixins myself, but I've seen other people use them and found the experience baffling…

You can write multiple mixins and mix them all into one component. To put it bluntly, it's like being blindfolded while someone dumps a mess on your head: you don't know which mixin caused an error. There are no namespaces, either, so logic can clash.

Composition, by contrast, works like ordinary functions: import them normally, without those restrictions.

As a Vue file grows, we stop thinking primarily in terms of methods and computed properties. We think in terms of features, and we need to find their code quickly. In Vue 2, a feature's code ends up scattered across different sections, making it hard to focus on that feature. In Vue 3, we aren't constrained by the Options API's structure, so we can group code by feature and find what we need quickly.

So how does it differ from React Hooks? Vue's own team has said that the Composition API was inspired by React Hooks, but the internal implementations are very different. As I've said on Zhihu before, I think React carries a lot of historical baggage: its design priorities are not simply those of ordinary applications, and internal requirements come first. React Hook variables rely on closures, and React's rendering model reruns the component's Hooks whenever it renders. As a result, you may frequently use `useMemo` and `useCallback` to avoid unnecessary work.

Vue 3 doesn't have that particular issue: the Composition API setup code runs only once, and accessing the latest values is straightforward. In React, you need to pay more attention to dependencies and effects, which adds mental overhead. That isn't to say React is bad—experienced React developers acknowledge these trade-offs too. For a JavaScript developer, Vue can simply impose less of that burden.

In an interview, though, try to work out whether the interviewer is a React superfan. If they are, praise React as enthusiastically as possible.

## Common Questions

- When should you use watch or watchEffect, and how do they differ?

> I'd hope they wouldn't ask something quite this basic. watch runs lazily and has explicit dependencies. watchEffect discovers its dependencies automatically and runs immediately. If you need logic to run both on initialization and when its dependencies change, consider watchEffect.

- Why use Proxy to implement reactivity?

> See above; this was covered earlier in the article.

- How does tree shaking work?

> It relies on static analysis of ES modules. Vue 2 uses a singleton-style API, which prevents the same kind of on-demand imports.

- What are Vue 3's overall improvements over Vue 2?

> They span the whole framework. As we've discussed, reactivity and the renderer address shortcomings in Vue 2, while Composition addresses limitations of the Options API. The source is written in TypeScript. Although type hints in Vue 3 SFCs can still be awkward, they are much better than the type gymnastics needed in Vue 2—the sort that must have cost Evan You a few hairs. The source is also organized as a monorepo, which makes it easier to read: every module is independent, especially the reactivity module. If you want to use reactivity on another platform, just install it with npm. Vue's core is independent too, supporting many platforms. You can even use Vue to write terminal applications; it doesn't restrict the rendering target.
