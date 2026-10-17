---
title: "Trade-Offs in Framework Design: Vue.js and Sword.js"
description: "I'll be sharing more notes on framework design and architecture as I read Vue.js Design and Implementation and Introduction to Frontend Architecture and Micro Frontends. Drawing on Vue.js and my own Sword.js framework, this article explores trade-offs in programming paradigms, virtual DOM performance, and compile-time versus runtime work."
date: 2022-03-16
lang: en
translationKey: "2022-03-16_765_关于框架（vue.js_sword.js）设计中的“权衡”"
categories:
  - "Frontend"
  - "Life"
  - "Deep Dive"
views: 3181
draft: false
---

After this article, I'll be posting more about framework design and architecture as a way to keep reading notes. I've recently been reading books such as *Vue.js Design and Implementation* and *Introduction to Frontend Architecture and Micro Frontends*. Let me briefly introduce them in case you find them useful. The frontend architecture book has been on my bedside table for a long time, though it hasn't helped much with my day-to-day work so far; in my opinion, it leans toward theory. If you're patient and genuinely interested in getting started with frontend architecture, it's a very good introductory book. The Vue.js book, meanwhile, has become something of a sensation in frontend circles recently. If you've been using Vue 3 for a while and want to understand it in depth, this book will guide you through the whole framework, from its design to its implementation.

## Introduction

I've recently been writing the first framework of my life. It isn't anything particularly impressive, and I'm a little embarrassed that something so rudimentary is coming from a programmer with three years of development experience. I've made plenty of mistakes and accumulated technical debt along the way. Because I didn't plan the features and modules carefully at the start, I took quite a few detours. With no previous experience designing frameworks, I often struggle to decide whether a feature belongs at compile time or runtime. I also keep thinking about users' habits and comparing other backend frameworks, leaving my framework's API design feeling like an awkward mix of approaches. Still, however ugly it is, it's my own creation, and I hope to share it with everyone soon. In this article, I'll draw on my experience designing sword.js, alongside vue.js, to discuss how we make trade-offs in frameworks.

## What Is a Trade-Off?

In frameworks such as vue.js, modules aren't independent: they depend on and constrain one another. Framework authors need a view of the whole system before they can refine details, optimize, or split things apart. Imagine designing a frontend view-layer framework. First, you need to consider its paradigm: should it be declarative or imperative? What about the underlying HMR implementation, or even the build tool—webpack, Rollup, or esbuild? There are so many choices to make. This is the art of the trade-off. Every part of a framework, and even the application code we write every day, requires us to weigh multiple considerations.

## Declarative and Imperative Code

Let's start with plain JavaScript. Suppose I want to attach a click handler to a DOM element. I'll use pseudocode throughout:

```js
const e = document.querySelector(\"#app\");
e.innerText = \"foo\";
e.addEventListenner(\'click\', () => {
    alert(\"hello foo\")
})
```

This is typical imperative code. Its execution is predictable because the developer explicitly writes every step. But it runs into a difficult problem as the program grows: if multiple DOM elements need click handlers, we have to query them all and bind each handler individually. That quickly becomes painful. What about declarative code? Which of these problems can it solve?

```html
<div @click=\"() => {}\" id=\"app\">
</div>
```

If you've used vue.js, you've probably written countless snippets like this. We only provide a function for click; we don't care how Vue finds the DOM element and attaches the handler. We just care about the result. Of course, Vue's internal implementation must still be imperative, even though the interface exposed to users is declarative. Which performs better? The answer is predictable: imperative code has an inherent performance advantage:

```js
e.innerText = \'update text\';
```

With imperative code, that single statement is all we need. With declarative code, however, we first need to identify the differences between the new and old DOM representations, then update the text dynamically by calling the code above. So although declarative code cannot match the performance of directly written imperative code, we make a trade-off for maintainability. Given that performance gap, we lean toward maintainability and optimize the diff algorithm as much as possible to bring performance closer to the imperative approach.

## Virtual DOM Performance

We've just discussed the difference between declarative and imperative code. If you've used vue.js, you'll also be familiar with the virtual DOM. It's a favorite interview topic too, though I'm not sure why—there doesn't seem to be that much technical depth to the question itself. The virtual DOM exists to help Vue compare changes more effectively. Consider these two lines:

```html
<div @click=\"() => {}\" id=\"app\">hello foo</div> // old
<div @click=\"() => {}\" id=\"app\">hello bar</div> // new
```

How can we find their differences with as little overhead as possible? That's where the virtual DOM comes in. We already discussed the inherent gap between declarative and imperative code: a virtual DOM update cannot outperform an ideal direct DOM API update. In practice, though, it's hard to write perfectly optimized imperative code in 99% of situations, while it's easy to write reasonably good declarative code. To understand the virtual DOM, let's compare it with the DOM APIs mentioned above—such as createElement and innerHTML.

### innerHTML vs. the Virtual DOM

innerHTML was a nightmare when I was writing jQuery and JSP. As a beginner, I spent late nights debugging HTML strings in messy projects just to construct a page. It was painful:

```js
const html = `
<div>
    <span>innerHTML</span>
</div>
`
dom.innerHTML = html;
```

Even a JavaScript beginner knows that DOM operations and JavaScript computations differ enormously in cost. To display a page with innerHTML, the HTML string must be parsed into a DOM tree. Creating a page with the virtual DOM, on the other hand, involves two steps:

1. Convert our template code into JavaScript objects.
2. Recursively traverse those objects to create real DOM elements.

From this perspective, innerHTML looks more direct. Parsing an HTML string into a DOM tree is a single, efficient operation at the browser's DOM layer. Initial page creation with the virtual DOM therefore doesn't perform as well as innerHTML. When updating the page, however, the virtual DOM's advantages become apparent. innerHTML not only processes the HTML string again but also destroys the old DOM and creates a new one—frustrating! The virtual DOM only needs to create a new JavaScript object and compare it with the old virtual DOM, then update the parts that changed. Although this adds a diff operation, it's still JavaScript computation, which is fast. As a page grows, innerHTML's full replacement approach becomes increasingly expensive, widening the gap between it and the virtual DOM.

### A Rough Comparison of the Three Creation and Update Approaches

- Performance: plain JavaScript > virtual DOM > innerHTML.
- When balancing maintainability, performance, and cognitive load, the virtual DOM is a good choice.

## Runtime and Compile Time

As framework authors, how do we want our programs to run? Let's use vue.js again. We've discussed the virtual DOM without yet looking at what its JavaScript objects look like. This section will help bring the idea together:

```js
const obj = {
    tag: \"div\",
    children: [{
        tag: \"p\",
        children: \"hello bar\"
    }]
}
```

This virtual DOM object describes each node and its children. To implement a render function, we need to traverse the virtual DOM object recursively. Here's a simple implementation:

```js
const obj = {
  tag: \"div\",
  children: [
    {
      tag: \"p\",
      children: \"hello bar\"
    }
  ]
};

const render = (obj, root) => {
  // Create a parent node
  const element = document.createElement(obj.tag);
  if (typeof obj.children === \"string\") {
    // text node
    element.appendChild(document.createTextNode(obj.children));
  } else if (obj.children) {
    obj.children.forEach((e) => {
      // Recursively create multiple child nodes
      render(e, element);
    });
  }
  root.appendChild(element);
};

render(obj, document.body);
```

We've now implemented a render function that works entirely at runtime. Users can call it to create page elements, but nobody wants to write these awkward data structures all day. We therefore need a compilation step to convert template syntax into those structures. That gives us a compile-time-plus-runtime approach, which is how Vue usually works: Vite or vue-cli compiles single-file components. If a runtime-only approach is possible, so is a compile-time-only approach: we can compile templates directly into imperative code. For example:

```html
<div @click=\"() => {}\" id=\"app\">hello foo</div> // old
```

Becomes:

```js
const e = document.querySelector(\"#app\");
e.innerText = \"foo\";
e.addEventListenner(\'click\', () => {
    alert(\"hello foo\")
})
```

No virtual DOM, no diff—just compilation! This is the cool approach [svelte.js](https://svelte.dev/) takes. As framework designers, we need to make our own trade-offs between runtime and compile time. Although vue.js uses both, its compiler identifies which parts can never change and which are dynamic, enabling further optimizations at runtime. Neither approach is absolutely good or bad; it depends on the framework's goals and the author's choices. No framework wars intended!

## Trade-Offs in sword.js

If you don't yet know what sword.js does, take a look at my earlier [article](https://www.yinzhuoei.com/index.php/archives/764/). In short, it's a Node.js framework with both runtime and compile-time components: framework-core and a CLI. One fun feature is runtime TypeScript type checking. The basic idea is to analyze TypeScript types and generate a schema, then use a function to check whether an object matches that schema. If it matches, validation passes. This works particularly well for validating request parameters, for example:

```js
export interface ReqParams{
    title: string;
    name: \"alice\" | \"bob\"
}

const obj = {
    title: \"test\',
    name: \"alice\"
}
validate(obj, schema); // Here, schema is the interface converted to a json object
```

I implemented this in two stages: schema generation and validation. I put generation in the CLI's compilation layer, where the program automatically reads the types for each API and turns them into a proto.json file. At runtime, that JSON can be used to check whether the corresponding objects satisfy the requirements. Deciding carefully what belongs at runtime and what belongs at compile time lets us make both tools much smaller.

Another example is logging. When developing Node.js applications, we need logs from both the core and the CLI. How those logs appear in the terminal also requires trade-offs.

## Closing Thoughts

I've had very little time to write articles this year, so I'm taking the opportunity to jot down some thoughts while reading and building my framework. I hope this makes sense—the content is fairly light, so it should be easy enough to follow.
