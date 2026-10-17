---
title: "After Getting Stuck with React, a New Goal: Vue!"
description: "I had been learning React, downloading plenty of tutorials and even buying a few course bundles. But it was a struggle: I got stuck on webpack hot reloading. Yes, environment setup was what stopped me. The first tutorial was straightforward—install a few npm packages and it worked—but a bug in the webpack configuration left me stumped…"
date: 2018-07-20
lang: en
translationKey: "2018-07-20_16_学习React无果后又一新目标：Vue！"
categories:
  - "Frontend"
views: 4981
draft: false
---

![Download.jpg](https://www.yinzhuoei.com/usr/uploads/2018/07/790164703.jpg)

I had been learning React, downloading plenty of tutorials and buying a few course bundles. But it was a struggle: I got stuck on webpack hot reloading. Yes, environment setup was what stopped me. The first tutorial had a fairly simple setup—install a few npm packages and it would run—but I hit a bug while configuring webpack. Asking around got me nowhere, so I had to give up.

**Let's Talk About Vue**

My classmates had wanted to learn Vue for a while, so I decided to give it a go. After a few days with the basic syntax, getting started felt much like React: fairly simple. Vue does seem easier to pick up, though. Since I have some time, let's walk through a hello world example together.

**Getting Started**

Download the JS file from the Vue website and include it directly.

Open your project in an IDE. Once you have included vue.js, one thing is important: put your external or inline JS before the closing body tag. Otherwise, you will get an error because of the loading order.

Let's call our JS entry file index.js:

```html
<div id="test"></div>
<script src="src/js/index.js"></script>
```

**Contents of index.js:**

```javascript
new Vue({
    el: '#test',
    data: function () {
        return {
            text: 'say no!'
        }
    },
    components: {
        'my-header': emple
    }
})
```

Here's what each part does:

- `el`: the container to render into
- `data`: the component's data; for example, we define `text` and access it in the template using `{{text}}`
- `components`: the components to include; here, we define one called `my-header`

**Component Definitions:**

```javascript
var emple = {
    template: '<p><my-child></my-child>This is my first component{{words}}</p>',
    data: function () {
        return {
            words: 'yes!'
        }
    },
    components: {
        'my-child': child
    }
};

var child = {
    template: '<p>i am child</p>'
};
```

Use `<my-header>` directly in the root component. The `<my-child>` inside the child component is another component: this is component nesting.

The flow looks like this:

1. Define a root component.
2. Reference a child component in the root component's template.
3. Reference another child component inside that child's template.
4. Finally, render the root component into the HTML.

If anything is unclear, feel free to message me. WeChat: meng99huan
