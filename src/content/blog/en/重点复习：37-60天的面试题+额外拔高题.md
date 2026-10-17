---
title: "Key Review: Interview Questions from Days 37–60, Plus Extra Challenges"
description: "These answers may be incomplete and are provided only as references for interviews and written tests. Let's learn together. Topics include the difference between BOM and DOM, clearer font rendering, element display priority, line-height values, memory leaks, HTML5, CSS layout, JavaScript, and more…"
date: 2019-10-05
lang: en
translationKey: "2019-10-05_122_重点复习：37-60天的面试题+额外拔高题"
categories:
  - "Life"
views: 5655
draft: false
---

These answers may be incomplete. Use them only as references for interviews and written tests. Let's learn together.

**The Difference Between BOM and DOM**

BOM > DOM. BOM is the browser object model; DOM is the document object model. BOM provides browser APIs, while DOM provides document APIs. Neither exists in Node.

**Making Fonts Look Clearer**

- Choose a clearer font-family.
- Use images.
- Use Google's antialiasing property, `font-smoothing`, though compatibility is poor.

**HTML Element Display Priority**

- frameset has the highest priority.
- Windowed elements have higher priority than non-windowed elements (video, audio).
- Form elements have higher priority than non-form elements.
- z-index can raise an element within the same level, but cannot move it between levels.

**Five Ways to Set line-height**

- Default line height
- Number: a multiple of the parent element's font-size
- Fixed value: fixed line spacing
- Percentage: a percentage of the parent element's font-size
- inherit: inherit the value

**Operations That Can Cause Memory Leaks**

Recursion, closures, timers that aren't cleared, and so on.

**The Difference Between HTML and HTML5**

- Standard: HTML is based on SGML, while HTML5 is not, so HTML requires a DTD declaration.
- Semantics: HTML5 adds more useful semantic elements.
- SEO: better support.
- Features: canvas and audio/media support, allowing applications such as games and wearable-device interfaces.
- Full support for mobile development.

**Drawing a Triangle with CSS**

Use the triangular joins between borders. Set width and height to 0, hide two sides, and make one visible border wider.

**Understanding this**

this refers to the current runtime context and can change. apply, call, and bind can change this.

- In non-strict mode, the global this is window.
- In a function, this refers to the object calling it.

**Standards Mode vs. Quirks Mode**

- Standards mode: follows W3C standards.
- Quirks mode: maintains compatibility with older browsers.

In standards mode, width is the content width. In quirks mode, it includes border + padding + content. You can use `box-sizing: border-box` for the latter box model.

**How a Browser Checks Whether an Element Matches a CSS Selector**

When parsing the document, the browser collects elements matching the selector's rightmost part. It then matches from right to left, removing elements that do not match until only successful matches remain.

**Making a div Behave Like a textarea**

```html
<div contenteditable="true" style="resize: both; width: 300px; height: 200px; padding: 5px; border: solid 1px #ccc; overflow: auto;"></div>
```

**A Three-Column Layout with flex**

Put the center column first in the markup so it renders first:

```css
.container { display: flex; }
.left, .right { flex: 0 0 auto; }
.center { flex: 1 1 auto; }
```

**Why 10.toFixed(10) Throws an Error**

When parsing JavaScript, the dot can be either a decimal point or part of a method call. The dot immediately after 10 is interpreted as a decimal point rather than property access, creating a parsing conflict.

- `10..toFixed(10)` and `(10).toFixed(10)` do not throw an error.

**Frontend Performance Optimization**

- Sprites; WebSocket instead of polling
- Image servers, CDNs, code splitting
- Fewer DOM operations; avoid reflow
- Lazy loading, preloading

Webpack:

- Tree shaking, preload, prefetch
- Asynchronous module loading

PWA: offline storage, service workers

**The Difference Between HTML and XHTML**

XHTML requires correct nesting, lowercase element names, and closing tags.

**Browser-Specific CSS Prefixes**

- -webkit-: Chrome, Safari
- -o-: Opera
- -ms-: IE
- -moz-: Firefox

**Frontend Security**

- XSS: do not trust user input or content returned by the server; escape it all.
- CSRF: replace persistent verification with request-specific verification, such as adding hidden information to a form.

**Semantic Elements**

header, footer, menu, section, article, aside, main, nav, and so on.

**Finding the Longest Word in a String**

```javascript
function test1(str) {
    str = str.split(" ");
    return str.reduce((start, end) => {
        return start.length > end.length ? start : end;
    })
}
```

**The Difference Between Cookies and Sessions**

A cookie is created on the client, is limited to 4 KB, and can have an expiration time. A session is created on the server, which returns a session ID stored in a cookie for authentication.

**Understanding eval**

A small language interpreter that executes a string of JavaScript code. Not recommended: it is insecure and difficult to maintain. Webpack's source maps make use of eval.

**The Three Classic Web Design Tools**

Dreamweaver, Fireworks, and Flash.

**title vs. h1, b vs. strong, and i vs. em**

- title: the page title, placed in head.
- h1: the page's main heading, with high SEO importance.
- b and strong both produce bold text; strong also conveys a warning or importance.
- i and em indicate how the browser should render the text.

**Horizontal and Vertical Centering with CSS**

- flex
- Positioning + margin: 50% minus half the element's own width or height
- transform
- The calc function

**Understanding Modularization**

In frontend engineering, modularization makes code easier to maintain, fix, and reuse. Common approaches include AMD, CommonJS, and ES modules.

**HTML5 Additions and Removed Elements**

Added: new form input types, canvas, storage support, data- attributes, and media support.

Removed: center, frame, frameset.

**Preventing Text and Images from Being Copied**

```css
-webkit-user-select: none;
```

**Cross-Origin Requests and Solutions**

Browsers enforce the same-origin policy for security.

- JSONP: GET only
- CORS: requires backend support
- Proxy: forward requests through a proxy

**Alternatives for WebSocket Compatibility**

- Polling: make requests at regular intervals, creating significant concurrency load.
- Long polling: send the next request after the server returns a response.
- SSE: EventSource.

**Capitalizing the First Letter of English Words**

```css
text-transform: uppercase;
```

**Understanding IIFEs**

An immediately invoked function expression creates a closure and keeps variables out of global scope.

Requirements:

1. It must be a function expression.
2. It must be invoked immediately after being declared.

```javascript
(function(){}())
(function()){}
!function(){}()
```

**The Purpose of a CSS Reset**

Reset default styles so application CSS can reproduce the design consistently across browsers.

**Implementing a Deep Copy**

```javascript
function deepClone(obj) {
    let _obj = {};
    for (let key in obj) {
        if (obj[key] && typeof obj[key] === 'object') {
            _obj[key] = deepClone(obj[key]);
        } else {
            _obj[key] = obj[key]
        }
    }
    return _obj;
}
```

**Equal-Height Layouts**

1. padding-bottom: 9999999px; margin-top: -9999999px; clear the floats.
2. flex produces equal heights by default.

**Event Bubbling**

There are three phases: capture → target → bubble. Bubbling proceeds from the inside out, so clicking a child element also triggers events on its parents. Use `event.stopPropagation()` to stop it.

You do not need to bind an event handler to every row of a list. Listen on the parent and use the event object to determine which row was clicked. This is a common optimization for long lists.

**How Full-Screen Scrolling Works**

Similar to a carousel. Make each section fill the screen, use `overflow: hidden`, and listen for scrolling gestures to switch the displayed DOM content.

**The Event Loop**

JavaScript is single-threaded, and synchronous tasks run on the main thread. Microtask callbacks enter a queue. When the main thread is free, it checks the queue and runs available asynchronous work synchronously. This checking process is called the event loop.

**Security Issues with target="_blank"**

The destination page can obtain the source URL through `document.referer`. Add `rel="noreferrer"` to prevent this.

**How JSONP Works**

It works around the same-origin policy and only supports GET.

```javascript
function jsonp(url, params, callback) {
    var script = document.createElement("script");
    script.src = url + parseObjParams({...params, callback: "jsonp"});
    document.appendChild(script);
    window.jsonp = callback;
    script.onload = () => {
        document.removeChild(script);
    }
}
```

**Common box-sizing Values**

- `border-box`: the quirks-style box model; width includes padding and border.
- `content-box`: the standards-style box model; width is only the content width.

****proto** and prototype**

- prototype: a property of functions that points to the function's prototype object, whose constructor points back to the constructor function.
- _proto_: a property of objects that points to the prototype object used to construct them.

**Progressive Rendering**

Ensure basic compatibility first, then enhance the experience.
