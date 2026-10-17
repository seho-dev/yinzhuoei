---
title: "A Brief Discussion of HTML5 Semantics"
description: "HTML5 introduced many semantic elements, such as nav and footer. These notes look at those elements and when to use them. As programmers, we tend to think of HTML as a simple, entry-level language. But while HTML is easy to get started with, mastering it is a different story…"
date: 2019-01-25
lang: en
translationKey: "2019-01-25_83_关于HTML5的语义化的浅层讨论"
categories:
  - "Life"
views: 5392
draft: false
---

![Download.jpg](https://www.yinzhuoei.com/usr/uploads/2019/01/1553231164.jpg)

HTML5 introduced many semantic elements, including nav, footer, and others.

These notes focus on those elements and the situations in which they belong.

As a programmer, you probably think HTML is very simple: an entry-level language we all start with.

But I would argue that HTML is easy to get started with and very difficult to master—every bit as challenging as mastering backend development.

The difficult part is using elements correctly, something that may even depend on your broader knowledge and understanding of language:

For example:

Semantic elements are more developer-friendly. They improve readability, making a page's structure clear to developers even without styling, and help teams develop and maintain it. Beyond being human-friendly, semantic elements are also well suited to machine reading. Their rich descriptive meaning makes content easier for search engines to index (SEO), allowing crawlers to extract more useful information and helping pages attract more search traffic. Semantic elements can also support screen readers, automatically generated tables of contents, and more.

That passage comes from a Geek Time column. However, I am not convinced that semantic elements necessarily improve maintainability: not every frontend engineer has mastered them, and that can add to the cost of communication.

Here is a simple example: ul is an unordered list, and ol is an ordered list. Yet in day-to-day development, we tend to use ul for lists of related information regardless. Using a lot of this kind of markup can place a burden on machines reading the code

that is invisible to the naked eye, while also making the code more bloated.

So my attitude toward semantic elements is this: “Using them correctly” is better than “not using them,” and “not using them” is better than “using them incorrectly.” Of course, I believe frontend engineers with ambition should still strive to use them correctly.

That is another passage from the Geek Time column. Being a good frontend engineer is not just about implementing functionality; it is also about considering whether your markup has a certain elegance.

One final thought: semantic markup may not be an immediate concern for us, since it might have little to do with our current work. You can even keep using div and span without affecting how a page works. But semantics are the direction things are moving in, and we should help change the prevailing mindset.
