---
title: "简书转载：JS的构造函数人人都能懂"
description: "原型和原型链是 JavaScript 的经典问题，构造函数是它们的基础。搞清楚构造函数和它的执行过程，能更好地学习原型和原型链。 1. 什么是构造函数 用 new 关键字调用的函数，就是构造函数。 2. 为什么要用构造函数 假设要录入班级里每个同学的信息： 6…"
date: 2019-06-26
lang: zh
translationKey: "2019-06-26_97_简书转载：JS的构造函数人人都能懂"
categories:
  - "前端"
views: 5672
draft: false
---

原型和原型链是 JavaScript 的经典问题，构造函数是它们的基础。搞清楚构造函数和它的执行过程，能更好地学习原型和原型链。

**1. 什么是构造函数**

用 `new` 关键字调用的函数，就是构造函数。

**2. 为什么要用构造函数**

假设要录入班级里每个同学的信息：

```javascript
var p1 = { name: 'zs', age: 6, gender: '男', hobby: 'basketball' };
var p2 = { name: 'ls', age: 6, gender: '女', hobby: 'dancing' };
// ... 重复写很多遍
```

60 个学生要写 60 遍，属性名重复，代码冗余。

用构造函数就方便了：

```javascript
function Person(name, gender, hobby) {
    this.name = name;
    this.gender = gender;
    this.hobby = hobby;
    this.age = 6;
}

var p1 = new Person('zs', '男', 'basketball');
var p2 = new Person('ls', '女', 'dancing');
```

封装麻烦一次，创建对象就轻松多了。

**3. 构造函数的执行过程**

```javascript
function Person(name, gender, hobby) {
    this.name = name;
    this.gender = gender;
    this.hobby = hobby;
    this.age = 6;
}

var p1 = new Person('zs', '男', 'basketball');
```

步骤：

1. `new` 调用时创建新的内存空间，标记为 Person 实例
2. 函数内部的 `this` 指向该内存空间
3. 执行函数体代码（给 `this` 添加属性 = 给实例添加属性）
4. 默认返回 `this`

每创建一次实例就创建一个新内存空间，`this` 分别指向各个空间。

**4. 构造函数的返回值**

- 默认返回 `this`
- 手动返回基本类型 → 仍然返回 `this`
- 手动返回对象 → 返回该对象

```javascript
function Person1() {
    this.name = 'zhangsan';
}
var p1 = new Person1();  // p1 有 name 属性

function Person2() {
    this.age = 28;
    return 50;
}
var p2 = new Person2();
console.log(p2.age);  // 28，仍然返回 this

function Person3() {
    this.height = '180';
    return ['a', 'b', 'c'];
}
var p3 = new Person3();
console.log(p3.height);  // undefined，返回了数组
```

---

构造函数是原型和原型链的基础，建议动手试试。

原文链接: https://www.jianshu.com/p/95a5faee17f1
作者：李等等扣丁
