---
title: "《ECMAScript 6 入门》精读： 关于let和const的重要整理"
description: "周末有空，把 ES6 里 let 和 const 的知识点整理一下，加深对作用域和死区的理解。 学习方法分享 我的学习方法：项目实战 → 刷题 → 笔记和博客。养成习惯，地铁公交上也要把笔记写完。 --- let 基本用法 let 只在声明的代码块中生效，va…"
date: 2019-10-27
lang: zh
translationKey: "2019-10-27_129_《ECMAScript 6 入门》精读： 关于let和const的重要整理"
categories:
  - "精读"
views: 5181
draft: false
---

周末有空，把 ES6 里 let 和 const 的知识点整理一下，加深对作用域和死区的理解。

**学习方法分享**

我的学习方法：项目实战 → 刷题 → 笔记和博客。养成习惯，地铁公交上也要把笔记写完。

---

**let 基本用法**

```javascript
{
    let a = 1;
    var b = 10;
}
console.log(a); // ReferenceError
console.log(b); // 10
```

let 只在声明的代码块中生效，var 相反。

**for 循环中的 let**

```javascript
var a = [];
for (var i = 0; i < 10; i++) {
    a[i] = function () { console.log(i); };
}
a[1](); // 10
```

var 是全局变量，每次循环 i 都会改变，最后指向 10。

```javascript
var a = [];
for (let i = 0; i < 10; i++) {
    a[i] = function () { console.log(i); };
}
a[1](); // 1
```

let 只在当前块作用域，每次循环重新 let 变量，所以输出当前循环的 i。

**let 没有变量提升**

```javascript
console.log(a); // undefined
var a = "I love you"

// let 不会提前声明
console.log(b); // ReferenceError
let b = "yes";
```

**暂时性死区**

let 和 const 声明的变量会和当前作用域块绑定，声明前使用会报错，这就是死区。

```javascript
var a = "123";
{
    a = "125";
    let a = "456";  // ReferenceError
}
```

typeof 检测未声明的变量也会报错：

```javascript
typeof x; // ReferenceError
let x;
```

函数参数默认值：

```javascript
function test(x = y, y = 2) {}  // ReferenceError，y 未声明
```

**不能重复声明**

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

不同作用域可以：

```javascript
function test(arg) {
    {
        let arg = "12";
    }
}
```

**块级作用域**

ES6 新增块级作用域。var 会造成变量提升：

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

let 和 const 就是块级作用域：

```javascript
let a = 1;
if (true) {
    let a = "1111";
}
console.log(a); // 1
```

**块级作用域和函数声明**

ES6 规定块级作用域可以写函数声明，但类似 let，作用域外不能用。但浏览器为了兼容旧代码，有自己的实现方式。

**const**

常量，不可改变：

```javascript
const a = 1;
a = 12; // TypeError
const a; // 报错，不能先定义再赋值
```

const 和 let 一样：块级作用域、有死区、不能重复声明。

const 本质：指针（地址）固定，不是值不可变。

简单类型（数值、字符串、布尔值），值就是保存在变量指向的地址，等于常量。

复合类型（对象、数组），const 只保证指针固定，数据结构可以变：

```javascript
const props = {};
props.name = "1";  // 可以
props.age = "12";  // 可以
props = "12";      // 报错
```

---

原文：阮一峰老师 http://es6.ruanyifeng.com/#docs/let

![u=3907368649,2159858588&fm=26&gp=0.jpg](https://www.yinzhuoei.com/usr/uploads/2019/10/733055117.jpg)

![微信截图_20191027154441.png](https://www.yinzhuoei.com/usr/uploads/2019/10/1465992659.png)
