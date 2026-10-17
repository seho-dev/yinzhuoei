---
title: "Wow, So This Is mustache.js! A Template Engine with Soul"
description: "A practice question today asked what Vue's template syntax is based on. Curiosity led me to Mustache and its distinctive double braces. Its website lists support for more than 20 programming languages. Here's a small npm-based demo of the JavaScript implementation…"
date: 2019-09-09
lang: en
translationKey: "2019-09-09_110_WOW！这就是mustache.js！一个有灵魂的模板引擎"
categories:
  - "Life"
views: 7319
draft: false
---

A practice question today asked what Vue's template syntax is based on. My curiosity led me to Mustache—the aptly named double-brace syntax.
I opened its website and found support for more than 20 programming languages, along with an open-source JavaScript implementation that I understood to be from Node's creator.

Screenshot_20190909220549.png

Git repository: https://github.com/janl/mustache.js

Template engines are very useful. This isn't some obscure topic; it's something worth understanding.

Let's follow the installation instructions on GitHub and work through the basic API step by step.

I looked through a lot of material, but the examples I found all called render directly rather than demonstrating an npm-based workflow. Since we use npm so often in everyday development, I put together an npm-based demo.

First, initialize an empty project with npm init.

Then install Mustache:

npm i mustache -s -d

Add the following to package.json:

"scripts": {
 "build": "mustache dataView.json myTemplate.mustache>public/output.html",
 },

As this command suggests, we need to create a JSON file to supply the variable values, along with a template file. The template serves the role of the template passed to the render function, making this workflow easier to follow.

Let's create those files. I'm using VS Code with a Mustache extension installed, so I get syntax assistance.

Screenshot_20190909221112.png

Start by adding an object with a value to the JSON file, then use {{}} in the template to render it.

Then run:

npm run build

An HTML file will be generated under public. If you get an error, your directory structure probably differs from mine.

Our JSON file contains several kinds of values: ordinary values, booleans, arrays, and so on.

{
 "name": "shenhao",
 "age": "19",
 "html": "

123

",
 "isTrue": true,
 "thisIsObject": {
 "name": "shenhao",
 "age": "19"
 },
 "isArray": [{
 "name" : "shenhao"
 },{
 "name" : "shenhao"
 },{
 "name" : "shenhao"
 }]
 }

Here's what we write in the template. I've used a simple bit of HTML:

<!DOCTYPE html>
 
 
 
 
 
 Document
 
 
 {{name}} has a {{&html}}

---

 {{thisIsObject.name}} {{thisIsObject.age}}
 

---

 -webkit- {{#isTrue}} This is displayed when the value is true {{/isTrue}}
 

---

 Loop through the following content. For an array, use . to refer to each element in the loop.
 {{#isArray}} {{name}} {{/isArray}}
 

---

 {{!^}} is the opposite of {{!#}}: it outputs the content when the variable is null, undefined, false, or an empty array.
