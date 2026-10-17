---
title: "Reposted from Jianshu: JavaScript Constructors Anyone Can Understand"
description: "Prototypes and prototype chains are classic JavaScript topics, and constructors are their foundation. Understanding constructors and what happens when they run makes prototypes and prototype chains easier to learn. 1. What is a constructor? A function called with the new keyword is a constructor. 2. Why use constructors? Suppose you need to record information about every student in a class…"
date: 2019-06-26
lang: en
translationKey: "2019-06-26_97_简书转载：JS的构造函数人人都能懂"
categories:
  - "Frontend"
views: 5672
draft: false
---

Prototypes and prototype chains are classic JavaScript topics, and constructors are their foundation. Understanding constructors and what happens when they run makes prototypes and prototype chains easier to learn.

**1. What Is a Constructor?**

A function called with the `new` keyword is a constructor.

**2. Why Use Constructors?**

Suppose you need to record information about every student in a class:

```javascript
var p1 = { name: 'zs', age: 6, gender: 'male', hobby: 'basketball' };
var p2 = { name: 'ls', age: 6, gender: 'female', hobby: 'dancing' };
// ... Repeat many times
```

For 60 students, you'd have to write this 60 times, repeating the property names and producing redundant code.

A constructor makes things easier:

```javascript
function Person(name, gender, hobby) {
    this.name = name;
    this.gender = gender;
    this.hobby = hobby;
    this.age = 6;
}

var p1 = new Person('zs', 'male', 'basketball');
var p2 = new Person('ls', 'female', 'dancing');
```

Do the work of encapsulation once, and creating objects becomes much simpler.

**3. How a Constructor Executes**

```javascript
function Person(name, gender, hobby) {
    this.name = name;
    this.gender = gender;
    this.hobby = hobby;
    this.age = 6;
}

var p1 = new Person('zs', 'male', 'basketball');
```

The steps:

1. Calling `new` allocates a new area of memory and identifies it as a Person instance.
2. Inside the function, `this` points to that memory.
3. The function body executes: adding properties to `this` means adding properties to the instance.
4. By default, the function returns `this`.

Each new instance gets its own area of memory, and `this` points to the corresponding instance.

**4. Constructor Return Values**

- By default, a constructor returns `this`.
- Explicitly returning a primitive value → it still returns `this`.
- Explicitly returning an object → it returns that object instead.

```javascript
function Person1() {
    this.name = 'zhangsan';
}
var p1 = new Person1();  // p1 has a name property

function Person2() {
    this.age = 28;
    return 50;
}
var p2 = new Person2();
console.log(p2.age);  // 28, still returns this

function Person3() {
    this.height = '180';
    return ['a', 'b', 'c'];
}
var p3 = new Person3();
console.log(p3.height);  // undefined, returns the array
```

---

Constructors are the foundation of prototypes and prototype chains. Try these examples for yourself.

Original article: https://www.jianshu.com/p/95a5faee17f1
Author: Li Dengdeng Coding
