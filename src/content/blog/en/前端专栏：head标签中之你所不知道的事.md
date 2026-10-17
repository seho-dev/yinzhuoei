---
title: "Frontend Column: Things You Might Not Know About the head Element"
description: "The head element carries no content of its own; it primarily serves as a container for other semantic elements. HTML requires head to be the first element inside html. It must contain a title element for the site's title and may contain at most one base element. If the document's title is supplied another way, such as in an iframe…"
date: 2019-03-30
lang: en
translationKey: "2019-03-30_96_前端专栏：head标签中之你所不知道的事"
categories:
  - "Frontend"
views: 5524
draft: false
---

The head element carries no content of its own; it primarily serves as a container for other semantic elements.
HTML requires head to be the first element inside html. It must contain a title element for the site's title and may contain at most one base element. If the document's title is supplied another way, such as through an iframe, title may be omitted.

Let's discuss title. It means, well, a title, but HTML also has h1–h6 headings, which serve a similar purpose. In Chinese, these terms are difficult to tell apart, and the terminology can be confusing in English too.
This was discussed when HTML was being developed. The distinction is that title, as a metadata element, may be used in shared link cards or bookmarks, so it should summarize the entire document. An h1, on the other hand, has the context of the surrounding page. It is only displayed on the page, so it matters less if it does not spell everything out.

Now for a less common element: base, a legacy element from HTML's early days. It supplies a base URL for the document. By specifying a URL in base, you can omit that URL prefix throughout the document. However, this element can be dangerous and can easily conflict with JS, so I don't recommend using it.

Next is meta, one of the most important elements. It represents key-value pairs and is a general-purpose metadata element.
A typical meta element is defined using the name and content attributes: name specifies the metadata's name, and content specifies its value.

For example, it can indicate that the web application containing the page is named IsForums.

HTML5 introduced charset for setting the character encoding; it does not use content or name.

This is extremely important, so I recommend putting it first in the document.

Browsers initially read HTML as ASCII characters. As we know, ASCII is a subset of UTF and most other encodings. Ordinarily, the server specifies the correct encoding in an HTTP header. In special cases, however, such as opening HTML with the file protocol, there is no HTTP header, so you need to specify the encoding yourself.

Meta elements with the http-equiv attribute:

A meta element with http-equiv represents an instruction. These meta elements do not need a name attribute.

Meta with name set to viewport:

Its content consists of key-value pairs. Viewport is not defined in the HTML standard; it can be used freely as long as both sides agree on the convention.

![QQ screenshot 20190330104716.png](https://www.yinzhuoei.com/usr/uploads/2019/03/1004218792.png)

Other predefined values for meta's name attribute:

![QQ screenshot 20190330104844.png](https://www.yinzhuoei.com/usr/uploads/2019/03/3945738537.png)

Summary: head is the metadata container, title is the document title, base sets the page's base URL, and meta is a general-purpose metadata element.

I found some useful tips in the comments that are worth a look:

 Use the latest browser mode by default

 Prevent page transcoding by web acceleration services

 Control search engine crawling

 Remove Apple's default toolbar and menu bar

 Set the color of Apple's toolbar

Another common one:

format-detection: disable automatic recognition on iPhone →

P.S. Viewport as a meta name is not specified by HTML, so you won't find it there. It is an industry convention, but an extremely important one.
