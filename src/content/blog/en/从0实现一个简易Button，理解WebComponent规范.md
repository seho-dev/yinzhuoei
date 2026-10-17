---
title: "Build a Simple Button from Scratch to Understand Web Components"
description: "Before we begin: I am looking for a frontend or full-stack position in Xi'an, ideally a mid-level frontend role with weekends off, an in-house product, and a strong engineering culture. If you know of an opening or work in HR, please get in touch. My résumé: Shen Hao.pdf. WeChat: npminstalls. Now, on to Web Components…"
date: 2021-04-09
lang: en
translationKey: "2021-04-09_501_从0实现一个简易Button，理解WebComponent规范"
categories:
  - "Frontend"
  - "Deep Dive"
views: 6155
draft: false
---

![WeChat screenshot_20210409201630.png](https://static.yinzhuoei.com/typecho/2021/04/09/706033098720605/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20210409201630.png)

## Before We Begin

I am looking for a good frontend or full-stack job in Xi'an, particularly a mid-level frontend position. Ideally, the company offers weekends off, develops its own products, and has a strong engineering culture. If you know of an opening, or you work in HR and happen to be reading this, please get in touch. Here is my résumé:
[Shen Hao.pdf](https://static.yinzhuoei.com/typecho/2021/04/08/493582078515407/%E6%B2%88%E6%98%8A.pdf)
**Contact me on WeChat: npm_install_s**

## Getting Started

I originally wanted to write about Web Components over the Lunar New Year, but my understanding was too superficial. Only recently did I start learning more and writing as I went. **I will abbreviate Web Components as WC below.** Since graduating, whenever I have interviewed candidates, I have tried asking whether they know about WC. Unfortunately, after interviewing around fifty people, I have not met anyone familiar even with Shadow DOM. Perhaps the salary range was too low, or perhaps developers with two or three years of experience simply had not paid attention to these standards. Today, let us take a proper look at what WC is and why it has influenced the way we develop frontends.

## What Are Web Components?

WC is a set of technologies that lets developers create customizable elements, or components. Their associated logic and styles are encapsulated inside the elements, which can then be used directly. WC addresses the code bloat caused by repeatedly copying and pasting similar functionality in frontend projects. It has also helped advance modular and component-based development, allowing more developers to enjoy the benefits of encapsulation.

---

WC has three main elements:

1. Custom Elements.
2. Shadow DOM.
3. HTML templates.

Many familiar HTML elements, such as input, video, audio, and select, already use related browser technologies. We will now build a Button component from scratch. The best way to learn WC is through practice.

## Shadow DOM

When writing HTML, we use tags to describe a page's appearance and structure. This is easy for humans to write, but machines need to turn that HTML into an actual document. The page structure is parsed into a data model of objects and nodes. By creating this node tree—the DOM—the browser determines the hierarchy of the HTML we wrote. A key feature of the DOM is that it is live: we can manipulate it programmatically.

```
const title = document.createElement(\"div\");
title.textContent = \"hello\"
document.body.appendChild(title);
```

The DOM is what lets us use JavaScript to change what appears on a page.
The meaning of Shadow DOM is hinted at by its name: DOM that is hidden away “in the shadows.” For a simple example, consider a video element:

```
<video>
   <source src=\"movie.mp4\" type=\"video/mp4\">
</video>
```

The developer tools show the following:

![WeChat screenshot_20210408113550.png](https://static.yinzhuoei.com/typecho/2021/04/08/52968343242373/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20210408113550.png)

An element such as video contains many hidden DOM nodes that provide its built-in functionality and styling. The styles and logic inside its Shadow DOM are isolated from the outside, avoiding CSS conflicts.

Here is how to create a simple Shadow DOM:

```
const title = document.getElementById(\"title\");
const shadowRoot = title.attachShadow({mode: \'open\'});
shadowRoot.innerHTML = \"<div>this is shadowDOM</div>\"
```

This shadowRoot sits beneath the title element in its node tree, forming a **shadow tree**, attached to title through a **shadow root**. The shadowRoot is separate from title's ordinary contents, and its content, styles, and logic are local to the component. That is why its CSS does not clash with the rest of the page.

However, not every element can host a Shadow DOM. The following cases are unsupported or result in an error:

1. Elements such as input and textarea that already have a built-in Shadow DOM.
2. An img element used as the shadow host.

In addition to an “open” Shadow DOM, we can create a closed one:

```
const shadowRoot = title.attachShadow({mode: \'closed\'});
```

The built-in video element uses a closed Shadow DOM. The main idea is that outside JavaScript cannot access it; techniques involving assignedSlot or composedPath do not expose its internals either. **Remember that a closed Shadow DOM is not especially useful in most cases. You do not need to use it, and it is not a “secure Shadow DOM.”**

## Creating a Custom Element

Let us create a custom element and combine it with Shadow DOM to build the button component mentioned at the start.

```
customElements.define(
  \"i-button\",
  class extends HTMLElement {
    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: \"open\" });
      shadowRoot.innerHTML = `
        <div class=\"button\">
            <slot name=\"icon\"></slot>
            <slot></slot>
        </div>
      `;
    }
  }
);
```

We register a custom component through the **customElements** object, passing in a class. The Shadow DOM of i-button is what we defined in the constructor, and its contents are HTML elements. We will discuss **slots** shortly. First, let us try using i-button:

```
<i-button>提交</i-button>
```

The page should render our button component. If everything works, you will see the custom element and its Shadow DOM in the developer tools.

## Composition and Slots

Composition is an important concept in Shadow DOM. We build HTML pages by combining different tags, and components work the same way. For example, a video element uses a child source element to specify the media URL, but source itself is not rendered.

First, let us clarify a few terms:

### Light DOM

This refers to the content written by the component's user. In the i-button example above, we wrote the word “Submit” inside the component. That text is its Light DOM: it exists as an actual child node, rather than inside the Shadow DOM.

### Shadow DOM

We covered its meaning above. One more detail: Shadow DOM is local to the component, and it can define **markers**, or **slots**.

If you have used Vue, you probably appreciate how convenient slots are. A slot is a placeholder inside a component that lets user-provided Light DOM appear alongside the component in a **specified way**. That **specified way** depends on the type of slot:

#### Named Slots

Once a named slot has been defined inside the component, we can use it like this:

```
<i-button>
    <img slot=\"icon\" src=\"icon.png\"></img>
    提交
</i-button>
```

#### Default Slots

The default slot displays content written inside the component without a slot attribute, such as the “Submit” text above. It is rendered at the default slot's position. If the user supplies no Light DOM, we can provide **fallback content**:

```
/* 默认渲染的位置 */
<slot></slot>
<slot>如果用户没传递内容，那么将会显示我</slot>
```

When a component's slot uses user-written Light DOM, the element is not actually moved. Slots do not move nodes. The browser simply renders the Light DOM element at the slot's position in the Shadow DOM.

Once we understand slots, we can combine more elements to build a more complete, useful component—with styling, of course!

## Styling

One of the most interesting features of Shadow DOM is scoped CSS. Outside CSS selectors do not affect its internals, and inside selectors do not affect the outside. The CSS is scoped to the **shadow root**.
Let us define some styles for our Button component:

```
#shadow-root
<style>
 .button{
   background: red;
 }
</style>
<div class=\"button\">
  <slot name=\"icon\"></slot>
  <slot></slot>
</div>
```

Oh no—the red background may look ugly, but it does not stop us from exploring scoped CSS.

```
<link rel=\"stylesheet\" href=\"styles.css\">
<div></div>
```

We can also add a link element to load a stylesheet. That CSS is scoped as well.
When building a WC, we want the component to manage its own styles, but we also need a way for users to customize its appearance from outside. This preserves encapsulation while providing flexibility. That is where the :host pseudo-class comes in.

:host selects the shadow host. We can use it to style the host and to qualify rules based on it:

```
<style>
    :host{
        color: #fff;
    }
</style>
```

We can also match a host with a particular class:

```
:host(.button){
    background: blue;
}
```

We can style slotted content, too:

```
::slotted(.icon){
   width: 2px;
   height: 2px;
}
```

To style a custom component from outside, use its element name directly:

```
i-button:hover{
    opacity: 0.8;
}
```

Externally applied styles take precedence over ordinary internal rules such as this:

```
:host{
   opacity: 0.1;
}
```

Component authors commonly expose CSS custom properties that users can override:

```
<style>
    i-button{
        /*我很喜欢红色*/
        --diy-bg: red;
    }
</style>
<i-button background></i-button>
```

Inside the Shadow DOM, write:

```
:host([background]){
    background: var(--diy-bg, black);
}
```

Here, the component user sets a CSS custom property to red and adds a “background” attribute to the custom element. Inside the Shadow DOM, we match hosts with that attribute: **the background uses the externally supplied “red,” or defaults to “black” if no value is provided.**

Of course, when developing a component, we need to document the CSS custom properties it exposes.

## Tips

### Use CSS Containment

We can use CSS containment to optimize layout and paint performance for web components. UI or position changes inside a component can trigger layout and repaint work. Containment tells the browser that this part of the DOM is independent, allowing it to limit that work to the component rather than the whole page.

```
:host {
  display: block;
  contain: content; /* Boom. CSS containment FTW. */
}
```

### Use Templates

Use a template instead of innerHTML. You will notice a similarity to how Vue presents components—the idea is much the same! A template makes the component's DOM structure easier to see.

```
<template id=\"i-button\">
    <div class=\"button\">
      <slot name=\"icon\"></slot>
      <slot></slot>
    </div>
</template>
<script>
    customElements.define(
      \"i-button\",
      class extends HTMLElement {
        constructor() {
          super();
          var template = document
            .getElementById(\'i-button\')
            .content;
          const shadowRoot = this.attachShadow({ mode: \"open\" }).appendChild(template.cloneNode(true));
          `;
        }
      }
    );
  </script>
    // 使用Button组件
    <i-button></i-button>
    <style>
         // 增加一些Style样式
    </style>
```
