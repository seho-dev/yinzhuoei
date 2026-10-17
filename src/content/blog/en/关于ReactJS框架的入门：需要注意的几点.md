---
title: "Getting Started with ReactJS: A Few Things to Keep in Mind"
description: "React began as an internal Facebook project. Dissatisfied with the JavaScript MVC frameworks available, the team built its own for Instagram's website and open-sourced it in May 2013. A few introductory notes on installation, loading the scripts, writing components, and rendering them…"
date: 2018-07-11
lang: en
translationKey: "2018-07-11_8_关于ReactJS框架的入门：需要注意的几点"
categories:
  - "Frontend"
views: 7792
draft: false
---

![Download.jpg](https://www.yinzhuoei.com/usr/uploads/2018/07/2443341939.jpg)

React began as an internal Facebook project. Dissatisfied with all the JavaScript MVC frameworks available, the team decided to build its own for Instagram's website. It was open-sourced in May 2013.

**A Few Things to Keep in Mind**

1.Use Bower to install React if possible, and make sure Git is installed. Once installation succeeds, include the JavaScript files.

2.You can also load scripts directly from hosted URLs. Here are a few library URLs that are relatively fast to access from China:

```html
<script src="http://apps.bdimg.com/libs/jquery/2.1.1/jquery.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.13.3/react.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.13.3/JSXTransformer.js"></script>
```

3.Prepare a div container:

```html
<div id="main"></div>
```

4.Write the JavaScript. React's component-based approach makes later improvements easier and avoids duplicated code:

```javascript
var Box = React.createClass({
    render: function () {
        var style = {
            height: '100px',
            color: 'red'
        }
        return <p style={style}>hello world</p>
    }
});
```

Note: wrap the JavaScript in `<script type="text/jsx">`, not `text/javascript`. JSX combines JavaScript and XML-style syntax and is the special syntax used here with React.

5.Render it onto the page:

```javascript
React.render(<Box/>,
    document.getElementById("main"),
    function () {
        console.log("渲染完毕")
    }
)
```

The render function takes three arguments:

- The first is the component. Its variable name must begin with an uppercase letter.
- The second identifies the container.
- The third is optional: a callback executed when rendering finishes.
