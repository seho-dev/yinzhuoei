---
title: "Key Review: Frontend Interview Questions (Days 60–111)"
description: "A focused compilation of essential frontend interview questions and answers covering Days 60 to 111, spanning HTML5, CSS layout & animations, JavaScript nuances, HTTP protocols, performance, and best practices."
date: 2019-12-29
lang: en
translationKey: "2019-12-29_158_重点复习：60-111天的面试题"
categories:
  - "Frontend"
views: 5450
draft: false
---

It has been a while since I last organized interview and written test questions. This collection spans two months of daily practice (roughly 3 questions per day, totaling about 180 questions). In this review, previously covered basics are filtered out so we can focus strictly on the most critical questions.

## What Are the Differences Between `src`, `href`, and `link`?

- **`src` (Source)**: Points to an external resource that is loaded and embedded into the current document (e.g., `<script src="...">`, `<img src="...">`). When the browser encounters `src`, it pauses parsing until the resource is downloaded and executed.
- **`href` (Hypertext Reference)**: Establishes a link pointing to an external resource or target address (e.g., `<a href="...">`), connecting the current document with the target.
- **`link`**: An HTML tag placed in `<head>` (e.g., `<link rel="stylesheet" href="...">`) used to associate external resources like stylesheets or icons with the current document.

None of these three are restricted by the Same-Origin Policy.

## Flattening Multidimensional Arrays

```javascript
// 1. Using toString and split (works for purely numeric arrays):
arr.toString().split(",");

// 2. Using Array.prototype.flat:
arr.flat(Infinity); // Infinity flattens all nested levels; 1 flattens 1 level, 2 flattens 2 levels...

// 3. Using reduce and recursion:
function flatten(arr) {
    return arr.reduce((prev, current) => {
        return prev.concat(Array.isArray(current) ? flatten(current) : current);
    }, []);
}
```

## Have You Used HTML5's Web SQL and IndexedDB? What Are Your Thoughts on Them?

Web SQL has been deprecated by the W3C. Modern web applications rely on IndexedDB, which offers:
- Significantly larger storage quotas (hundreds of megabytes or more).
- Non-blocking asynchronous storage.
- Key-value and object store models.
- Native support for JavaScript objects and indexes.

## How Do You Center a `div`? How Do You Center a Floated Element? How Do You Center an Absolutely Positioned `div`?

Common approaches:
- `margin: 0 auto;` (for normal block elements with an explicit width)
- `transform: translate(-50%, -50%);` paired with `top: 50%; left: 50%;`
- `margin-left: calc(50% - width / 2);`
- Absolute positioning: `position: absolute; top: 0; right: 0; bottom: 0; left: 0; margin: auto;`
- Flexbox: `display: flex; justify-content: center; align-items: center;`
- Grid: `display: grid; place-items: center;`
- Table / table-cell layout

## Write a Function to Get the Original Height and Width of an Image

Use an asynchronous `Image` object and listen for the `onload` event to read `naturalWidth` and `naturalHeight`:

```javascript
function getNaturalDimensions(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            resolve({
                width: img.naturalWidth,
                height: img.naturalHeight
            });
        };
        img.onerror = reject;
        img.src = src;
    });
}
```

## Have You Used HTML5 Drag and Drop API? Explain Briefly

`<img>` elements are draggable by default; other elements require setting `draggable="true"`.
HTML5 provides a set of drag-and-drop events (`dragstart`, `drag`, `dragend`, `dragenter`, `dragover`, `dragleave`, `drop`) to construct intuitive drag-and-drop interfaces.

## Have You Used HTML5 Web Workers? What Problems Do They Solve?

JavaScript runs on a single main thread. Web Workers allow developers to spawn background threads for computationally heavy tasks without blocking UI rendering on the main thread, greatly improving the execution efficiency of complex logic.

Key Web Worker constraints:
1. **Same-Origin**: Worker scripts must share the same origin as the host page.
2. **No DOM Access**: Workers lack access to `window`, `document`, and `parent`. However, `navigator`, `location`, `setTimeout`, and `indexedDB` remain available.
3. **Message Passing**: Workers and the main thread communicate exclusively via messaging (`postMessage` and `onmessage`).
4. **No UI Dialogs**: Methods like `alert()` and `confirm()` are unavailable, though network requests (`fetch`, `XMLHttpRequest`) can be issued.
5. **Network Scripts Only**: Cannot load local `file://` resources; scripts must be fetched over HTTP/HTTPS.

## What Is Your Understanding of Isomorphic JavaScript and SSR?

- **Isomorphic (Universal) JavaScript**: Writing code that can execute seamlessly on both client and server environments.
- **SSR (Server-Side Rendering)**: Compiling components into HTML on the server before sending them to the client. This solves SEO indexing issues, speeds up First Contentful Paint (FCP), and eliminates white-screen lag on single-page apps.
  - Benefits: Faster initial page load, superior SEO, and fewer client-initiated API round trips during initialization.

> Note: SSR and SPA are not mutually exclusive. The true comparison is SPA vs. MPA (Multi-Page Application). MPAs (traditional PHP, JSP, ASP) generate distinct pages per request on the server, whereas modern SSR usually hydrates into an interactive SPA on the client.

## What Are the Similarities and Differences Between `position: absolute` and `position: fixed`?

- **Similarities**: Both remove elements entirely from the normal document flow and create new containing contexts.
- **Differences**:
  - `absolute` positions relative to the nearest positioned ancestor (an ancestor with `position` other than `static`).
  - `fixed` positions relative to the viewport (browser window) and does not move when the page scrolls.

## Illustrate Variable and Function Declaration Hoisting in JavaScript

Function declarations are hoisted before variable declarations, but variable assignments evaluate at runtime:

```javascript
var a = function a() {
    console.log(4);
};
function a() {
    console.log(5);
}

console.log(a()); // 4 (the function declaration is hoisted first, then reassigned by the variable assignment)
```

## Why Does HTML Collapse Multiple Consecutive Spaces into a Single Space?

This behavior is dictated by the CSS `white-space` property. Its default value `normal` collapses consecutive whitespace sequences into a single space and wraps text automatically. To preserve consecutive spaces, set `white-space: pre` or use `&nbsp;`.

## Will a Page Still Work Without `<!DOCTYPE html>` in HTML5?

Yes, but the browser drops into **Quirks Mode** instead of **Standards Mode**. In Quirks Mode, browsers emulate legacy box models and non-standard rendering bugs, leading to inconsistent behavior across different browsers.

## Are Vertical Percentages (e.g., `padding-top`, `margin-top`) Relative to Container Height?

No. In CSS specifications, vertical percentage margins and paddings (`margin-top`, `margin-bottom`, `padding-top`, `padding-bottom`) are computed relative to the **width** of the containing block, not its height. If they were relative to height, adding vertical padding would change the container's height, triggering an infinite recalculation loop.

## Provide Examples for Triggering Phone Calls, SMS, and Email Links

```html
<a href="tel:110">Call Phone</a>
<a href="sms:110">Send SMS</a>
<a href="mailto:example@domain.com">Send Email</a>
```

## How Does HTML5 Open Native Apps on Mobile Devices?

Via **Deep Linking** using custom URL schemes or Universal Links / App Links:

```html
<a href="myapp://path/to/screen">Open Native App</a>
```

## What Are the Differences Between CSS Animations and JavaScript Animations?

```text
1. Performance: CSS animations can leverage GPU compositing and run smoothly on the compositor thread without blocking the main JS thread.
2. Control: JavaScript animations provide fine-grained control (play, pause, reverse, physics-based springs, frame-by-frame scrubbing).
3. Compatibility & Simplicity: CSS transitions and keyframes are lightweight and require no external libraries.
```

## How Do You Disable Form Password Autofill?

```html
<input type="password" autocomplete="new-password" />
```

Or set `autocomplete="off"` on the `<form>` or `<input>`.

## What Is the Purpose and Benefit of `* { box-sizing: border-box; }`?

Switches elements to the border-box model (alternative box model), where `padding` and `border` are included within the specified `width` and `height`. This aligns with natural spatial reasoning and prevents layout breaking when adding padding or borders.

## What Is Your Understanding of Base64?

Base64 encodes binary data into 64 ASCII characters.
- Inlining small icons or fonts into CSS/HTML reduces HTTP requests.
- Useful for passing binary payloads across text-only protocols.
- Trade-off: Base64 encoding increases data payload size by ~33%.

## What Is the Purpose of the `rel="nofollow"` Attribute on `<a>` Tags?

It instructs search engine crawlers not to follow the linked URL or pass SEO link equity (PageRank) to the destination page.

## What Are the Differences Between GET and POST in Ajax? When Should Each Be Used?

- **GET**:
  - Parameters are appended to the URL query string.
  - Subject to URL length limitations imposed by browsers and servers.
  - Cached by default and stored in browser history.
  - Suitable for idempotent, read-only data fetching.
- **POST**:
  - Data is transmitted in the HTTP request body.
  - No size restrictions.
  - Parameters are not exposed in the browser address bar.
  - Suitable for non-idempotent operations, data mutations, and sensitive data transfers.

## How Do You Enable HTML5 Compatibility in IE8 and Below?

Use the `html5shiv` library. It uses `document.createElement('header')` so that older versions of Internet Explorer can recognize and style HTML5 semantic tags.

## Write a String `repeat` Function

```javascript
// Method 1: Using Array join
function repeat(str, n) {
    return new Array(n + 1).join(str);
}

// Method 2: String concatenation loop
function repeat(str, n) {
    let res = "";
    for (let i = 0; i < n; i++) {
        res += str;
    }
    return res;
}

// Modern ES6 standard:
"abc".repeat(3); // "abcabcabc"
```

## What Browser Compatibility Issues Have You Encountered in CSS, and How Did You Solve Them?

- Differences in vendor-prefixed CSS3 features (`-webkit-`, `-moz-`, `-ms-`). Solved using PostCSS with Autoprefixer and `browserslist`.
- Flexbox / Grid inconsistencies in older browsers. Handled with `@supports` feature queries, polyfills, or fallback styling.
- Baseline style discrepancies across browsers. Resolved with `normalize.css` or custom CSS resets.

## Why Is There a 300ms Delay on Mobile Click Events? How Can It Be Resolved?

Early mobile browsers added a 300ms delay after the first tap to determine whether the user was double-tapping to zoom the webpage.

Solutions:
1. Disable zoom via the viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">`.
2. Add `touch-action: manipulation;` in CSS.
3. Use libraries like FastClick, which trigger simulated click events on `touchend` while suppressing default click events.

## What Is the Execution Order of Pseudo-Classes on `<a>` Tags?

The correct order is `:link`, `:visited`, `:hover`, `:active`.  
Mnemonic: **LVHA** ("LoVe HAte"). Out-of-order declarations cause cascading overrides that prevent states like `:hover` from activating on visited links.

## What Is Your Understanding of `!important`? When Should It Be Used?

`!important` grants a CSS declaration the highest specificity weighting, bypassing standard cascade rules. Its use is generally discouraged because it creates maintenance hurdles and breaks stylesheet predictability. It is acceptable in utility classes (e.g., `.hidden { display: none !important; }`) or when overriding aggressive third-party styles.

## Write a Function to Generate a Random String of Specified Length

```javascript
function randomString(len = 8) {
    return Math.random().toString(36).substring(2, 2 + len);
}
```

## What Is CSS Float, How Does It Work, and What Problems Does It Cause?

`float` removes an element from normal block flow, shifting it to the left or right edge of its parent container or against another floated element.  
**Problems**: Parent height collapse. Because floated children are removed from normal flow, the parent container collapses if it contains no other in-flow elements.  
**Solutions**: Clearfix hack (`.clearfix::after { content: ''; display: table; clear: both; }`), `overflow: hidden` to create a Block Formatting Context (BFC), or modern Flexbox/Grid layouts.

## What Are the Differences Between `=`, `==`, and `===` in JavaScript?

- `=`: Assignment operator; assigns values to variables.
- `==`: Loose equality; performs implicit type coercion before comparing values.
- `===`: Strict equality; compares both data type and value without type conversion.

## What Are the Differences Between `transition`, `animation`, and `transform`?

1. **`transition`**: Animates the smooth transition between two states when triggered by property changes (e.g., `:hover`).
2. **`animation`**: Keyframe-driven animations (`@keyframes`) that run automatically, support iterative loops, and allow frame-by-frame control.
3. **`transform`**: A CSS property that modifies geometry in 2D or 3D space (translate, rotate, scale, skew) without altering normal document layout.

## What Is the Output of the Following Code, and Why?

```javascript
var type = 'images';
var size = { width: 800, height: 600 };
var format = ['jpg', 'png'];

function change(type, size, format) {
    type = 'video';
    size = { width: 1024, height: 768 };
    format.push('map');
}
change(type, size, format);
console.log(type, size, format);
```

**Output**:  
`images`, `{ width: 800, height: 600 }`, `['jpg', 'png', 'map']`

**Explanation**:  
JavaScript passes parameters by value (for objects, the reference pointer is passed by value). Reassigning `type` and `size` inside `change` only rebinds the local function parameters to new values in memory, leaving the outer variables unchanged. In contrast, `format.push('map')` mutates the existing array referenced by both the local parameter and the outer variable.

## Have You Used WebSockets in Production? What Problems Do They Solve?

WebSockets provide full-duplex, persistent bidirectional communication over a single TCP connection. They are widely used for real-time messaging, collaborative editing, and live dashboards, replacing inefficient HTTP polling and long-polling.

## How Do You Fix Non-Smooth Scrolling on `overflow: scroll` in iOS?

```css
-webkit-overflow-scrolling: touch;
```

## List Iteration Methods for Arrays and Objects

- **Arrays**:
  - ES5: `for`, `forEach`, `some`, `reduce`, `reduceRight`, `map`, `for...in`, `every`, `filter`
  - ES6+: `for...of`, `find`, `findIndex`, `keys()`, `values()`, `entries()`
- **Objects**:
  - ES5: `for...in`, `Object.keys()`
  - ES6+: `Object.entries()`, `Object.values()`

## Quick Quiz: What Is the Value of `x + y` Given `var x, y = 1;`?

**Answer**: `NaN`.  
`y` is assigned `1`, but `x` is merely declared and remains `undefined`. `undefined + 1` evaluates to `NaN`.

## How Does HTML5 Application Cache / PWA Offline Cache Differ from Browser Cache?

Standard browser caching handles individual HTTP resource caching based on response headers. In contrast, modern PWA offline caching (Service Workers + Cache Storage API) provides programmable whole-site offline caching, allowing web applications to work completely offline.

## What Is Your Understanding of the BEM Methodology? What Are Other Common CSS Methodologies?

BEM stands for **Block, Element, Modifier**. It structures CSS class names into modular, predictable blocks:
- `block`: Standalone component (e.g., `header`)
- `block__element`: Child part of a block (e.g., `header__button`)
- `block__element--modifier`: Variation of a block or element (e.g., `header__button--primary`)

Other methodologies include OOCSS, SMACSS, and ITCSS.

## What Is an IIFE? What Are Its Benefits?

An Immediately Invoked Function Expression:

```javascript
(function() {
    // Isolated execution scope
})();

// Alternative forms:
!function() {}();
~function() {}();
```

**Benefits**: Encapsulates variables, avoids global namespace pollution, and executes immediately.

## What Is HTML's `accesskey` Attribute? What Is Its Purpose?

`accesskey` assigns a keyboard shortcut to an HTML element, enabling quick navigation in combination with browser shortcut keys (e.g., `Alt + Key` or `Ctrl + Option + Key`), significantly improving accessibility.

## What Are `encodeURI()` and `decodeURI()`?

Built-in URI functions: `encodeURI()` encodes special URI characters into escape sequences, while `decodeURI()` decodes encoded escape sequences back into unencoded strings. (For encoding query parameter values containing characters like `&` and `=`, use `encodeURIComponent()`).

## Have You Used HTML5 Device APIs? What Are Their Use Cases?

HTML5 provides hardware integration APIs such as the Ambient Light Sensor API, Battery Status API, Vibration API, and Device Orientation API for detecting screen tilt, motion, battery level, and vibration.

## JavaScript Implementation of the 9x9 Multiplication Table

```javascript
function nine(num) {
    for (let i = 1; i <= num; i++) {
        let expression = "";
        for (let j = 1; j <= i; j++) {
            expression += `${j} * ${i} = ${i * j}\t`;
        }
        console.log(expression);
    }
}
nine(9);
```

## How Do You Open a Link in a New Window? How Do You Make All Site Links Open in a New Window?

- For an individual link: `<a href="..." target="_blank" rel="noopener noreferrer">`.
- For the entire document: Add `<base target="_blank">` within the `<head>` section.

## What Does `href="javascript:void(0)"` Do on an `<a>` Tag?

`void` is a JavaScript operator that evaluates an expression and returns `undefined`. `javascript:void(0)` prevents the hyperlink from executing its default navigation action without scrolling to the top of the page.

## Understanding the Same-Origin Policy

The Same-Origin Policy is a fundamental browser security mechanism that restricts documents or scripts from one origin from accessing resources of another origin.
Two URLs share the same origin only if their **protocol**, **domain**, and **port** are identical.  
Cross-origin workarounds: CORS, JSONP, reverse proxies, and WebSockets.

## How Do You Make `<body>` Height Fill the Entire Screen? Why?

```css
html, body {
    height: 100%;
}
```
Setting `height: 100%` on `<body>` alone is insufficient because percentage heights depend on the parent element's height; if `<html>` lacks an explicit height, `<body>` collapses to its content height.

Alternatively:
```css
body {
    min-height: 100vh;
}
```
`100vh` directly matches 100% of the viewport height without relying on parent inheritance.

## What Are the Ways to Defer/Asynchronously Load JavaScript?

- `<script defer>` (preserves execution order, runs after DOM parsing)
- `<script async>` (executes as soon as downloaded, unordered)
- `setTimeout` / event-driven deferred execution
- Dynamic script element creation (`document.createElement('script')`)
- Dynamic ES modules (`import()`)

## What Values Does `display` Support, and What Do They Do?

- `none`: Removes element completely from layout and accessibility tree.
- `block`: Generates a block box; starts on a new line and stretches to available width.
- `inline`: Generates an inline box; flows with text content without custom width/height.
- `inline-block`: Flows inline externally, but formats as a block box internally (respects width/height).
- `flex` / `inline-flex`: Generates a Flexbox layout container.
- `grid` / `inline-grid`: Generates a Grid layout container.
- `table`, `table-row`, `table-cell`: Generates table-formatting structures.

## Why Place `<script>` Tags at the Very Bottom of the Page?

Placing `<script>` tags immediately before the closing `</body>` tag prevents script downloading and execution from blocking HTML parsing and DOM tree construction, ensuring that content and styles render immediately for a faster First Contentful Paint. (In modern web development, using `<script defer>` or `<script type="module">` in the `<head>` achieves the same non-blocking behavior).
