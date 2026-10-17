---
title: "Frontend Notes: Beyond Properties and Selectors, Which CSS @ Rules Should You Know?"
description: "CSS standards can feel less unified than those for HTML and JavaScript. At the top level, a CSS stylesheet contains at-rules and qualified rules. At-rules begin with @ and contain a block or end with a semicolon. Here's a tour of these less familiar rules, followed by custom properties and CSS functions."
date: 2019-03-21
lang: en
translationKey: "2019-03-21_85_前端专栏：除了属性和选择器，你还需要知道哪些带@的规则"
categories:
  - "Life"
views: 5291
draft: false
---

Among frontend languages, CSS is the one whose standards feel the least unified. Unlike HTML and JavaScript, which have extensive, readily identifiable specifications, CSS doesn't seem to have a single equivalent standard to turn to.
At the top level, a CSS stylesheet consists of at-rules and qualified rules—the latter being ordinary style rules.
An at-rule begins with @ and is followed by a block; if it has no block, it ends with a semicolon. There are far fewer at-rules than ordinary rules, and they are used less often,
so they may be less familiar to you.

@charset: https://www.w3.org/TR/css-syntax-3/ 
@import: https://www.w3.org/TR/css-cascade-4/ 
@media: https://www.w3.org/TR/css3-conditional/ 
@page: https://www.w3.org/TR/css-page-3/ 
@counter-style: https://www.w3.org/TR/css-counter-styles-3 
@keyframes: https://www.w3.org/TR/css-animations-1/ 
@fontface: https://www.w3.org/TR/css-fonts-3/ 
@supports: https://www.w3.org/TR/css3-conditional/ 
@namespace: https://www.w3.org/TR/css-namespaces-3/

The links above are a collection of specifications for at-rules.
Let's go through the rules with explanations and examples.

@charset "utf-8" ---- Specifies the CSS file's encoding
@import "index.css" ---- Imports another CSS file, including everything except its encoding declaration ->
@import url("index.css") ->
@import [  |  ]
 [ supports( [  |  ] ) ]?
 ? ;

@media print { ---- Tests device or media conditions; its block contains ordinary rules
 body { font-size: 10pt }
}

---- @page controls how a document appears in paged media. Besides the page itself, it can also configure the surrounding margin boxes.

@page {
 size: 8.5in 11in;
 margin: 10%;

@top-left {
 content: "Hamlet";
 }
 @top-right {
 content: "Page " counter(page);
 }
}

-- counter-style lets you customize list markers. Search for its detailed API documentation for more usage examples.
@counter-style triangle {
 system: cyclic;
 symbols: ‣;
 suffix: " ";
}

@ support support -- Checks which features the environment supports, much like media queries.
@ namespace -- Works with XML namespaces, giving the CSS selectors inside a specific namespace.
@ viewport -- Sets viewport properties, though browser support is currently limited. HTML meta tags are usually used instead.

Ordinary rules consist of a selector and a declaration block; the declaration block, in turn, consists of properties and values.
The diagram below provides a useful explanation of selector priority and specificity.

![CSS selector specificity diagram](https://www.yinzhuoei.com/usr/uploads/2019/03/1433347872.png)

Note: Don't prefix an ordinary property name with two hyphens (--), or it will be treated as a CSS custom property. Custom properties are used with the var function.

:root {
 --main-color: #06c;
 --accent-color: #006;
}
/*The rest of the CSS file*/

# foo h1 {

color: var(--main-color);
}

CSS also supports functions for calculating values:

calc() max() min() clamp() toggle() attr()

The most commonly used of these include calc, max, and min. In everyday development, calc lets us perform simple arithmetic using addition, subtraction, multiplication, and division.

# test{

height:calc(50% - 10px)
}

P.S. Remember to separate the operands and operators with spaces when writing these calculations.

CSS has plenty of functions. Feel free to share the ones you use in your day-to-day work and how you use them!

Some examples in this article are taken from Winter's column.
