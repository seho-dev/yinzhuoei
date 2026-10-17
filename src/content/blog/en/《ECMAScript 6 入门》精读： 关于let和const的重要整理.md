---
title: "A Deep Dive into Introduction to ECMAScript 6: Key Notes on let and const"
description: "With some free time over the weekend, I put together these notes on let and const in ES6 to deepen my understanding of scope and the temporal dead zone. My learning routine is hands-on projects, practice problems, then notes and blog posts—even on the subway or bus…"
date: 2019-10-27
lang: en
translationKey: "2019-10-27_129_《ECMAScript 6 入门》精读： 关于let和const的重要整理"
categories:
  - "Deep Dive"
views: 5181
draft: false
---

With some free time over the weekend, I put together these notes on let and const in ES6 to deepen my understanding of scope and the temporal dead zone.

**How I Study**

My learning routine: hands-on projects → practice problems → notes and blog posts. Make it a habit, and finish your notes even on the subway or bus.

---

**Basic let Usage**

```javascript
{
    let a = 1;
    var b = 10;
}
console.log(a); // ReferenceError
console.log(b); // 10
```

let is only available inside the block where it is declared; var is not block-scoped.

**let in for Loops**

```javascript
var a = [];
for (var i = 0; i < 10; i++) {
    a[i] = function () { console.log(i); };
}
a[1](); // 10
```

Here, var declares a global variable. Every iteration changes the same i, which ends up at 10.

```javascript
var a = [];
for (let i = 0; i < 10; i++) {
    a[i] = function () { console.log(i); };
}
a[1](); // 1
```

let is limited to the current block scope. A new binding is created for each iteration, so the function prints the i for that iteration.

**let Does Not Behave Like a Hoisted var**

```javascript
console.log(a); // undefined
var a = "I love you"

// let 不会提前声明
console.log(b); // ReferenceError
let b = "yes";
```

**The Temporal Dead Zone**

Variables declared with let and const are bound to their current block scope. Using them before their declaration causes an error; this period is called the temporal dead zone.

```javascript
var a = "123";
{
    a = "125";
    let a = "456";  // ReferenceError
}
```

Even typeof throws an error when used before the declaration in this case:

```javascript
typeof x; // ReferenceError
let x;
```

Default function parameters:

```javascript
function test(x = y, y = 2) {}  // ReferenceError，y 未声明
```

**Redeclaration Is Not Allowed**

```javascript
{
    var a = 1;
    let a = 1;  // 报错
}
{
    let a = 1;
    let a = 1;  // 报错
}
```

Declarations in different scopes are allowed:

```javascript
function test(arg) {
    {
        let arg = "12";
    }
}
```

**Block Scope**

ES6 introduced block scope. var declarations are hoisted:

```javascript
var temp = new Date();
function test() {
    console.log(temp);
    if (true) {
        var temp = "hello";
    }
}
test(); // undefined，var 提升到函数顶部
```

let and const, on the other hand, are block-scoped:

```javascript
let a = 1;
if (true) {
    let a = "1111";
}
console.log(a); // 1
```

**Block Scope and Function Declarations**

ES6 allows function declarations inside blocks. Like let, these functions are scoped to the block and cannot be used outside it. However, browsers have their own compatibility behavior for older code.

**const**

A constant cannot be reassigned:

```javascript
const a = 1;
a = 12; // TypeError
const a; // 报错，不能先定义再赋值
```

Like let, const is block-scoped, has a temporal dead zone, and cannot be redeclared in the same scope.

What const actually fixes is the binding—the pointer or address—not the contents of the value.

For primitive types such as numbers, strings, and booleans, the value is stored at the address associated with the variable, so it behaves as a constant.

For composite types such as objects and arrays, const only fixes the reference. The data structure can still change:

```javascript
const props = {};
props.name = "1";  // 可以
props.age = "12";  // 可以
props = "12";      // 报错
```

---

Original text by Ruan Yifeng: http://es6.ruanyifeng.com/#docs/let

![u=3907368649,2159858588&fm=26&gp=0.jpg](https://www.yinzhuoei.com/usr/uploads/2019/10/733055117.jpg)

![Screenshot_20191027154441.png](https://www.yinzhuoei.com/usr/uploads/2019/10/1465992659.png)
