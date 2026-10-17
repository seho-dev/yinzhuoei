---
title: "Trust Me: Follow This Guide to Master JavaScript Prototypes"
description: "An intuitive, beginner-friendly guide breaking down JavaScript prototypes, prototype chains, constructor functions, __proto__, hasOwnProperty, and common object creation patterns."
date: 2019-09-29
lang: en
translationKey: "2019-09-29_116_相信我，跟着这个文章学习JS原型，你一定能看得懂"
categories:
  - "Frontend"
views: 5966
draft: false
---

Over the past couple of days, I've been consolidating knowledge around JavaScript prototypes. Today, I've summarized everything regarding prototypes, prototype chains, and related concepts into an easy-to-understand explanation.

If you spot any inaccuracies or mistakes, feel free to point them out in the comments!

## First, What Is a Prototype?

Prototypes are the foundation of inheritance in JavaScript; inheritance in JavaScript is essentially prototypal inheritance.

## The Prototype Object of a Function

Let's start with a diagram (drawn a bit informally):

![Prototype Diagram](https://www.yinzhuoei.com/usr/uploads/2019/09/3985109539.jpg)

> First, we create a function `person`. If we inspect this function, we find that it has a `prototype` property. This `prototype` property refers to the **prototype** of the `person` function. Within this prototype object, there is a **constructor** property that points back to the `person` function itself.

Now we understand that `prototype` on a function is its prototype object, and the `constructor` inside that prototype points right back to the function we declared.

Once that relationship is clear, we can use the `new` operator to create a new instance pointing to this constructor:

```javascript
var obj = new person();
```

Printing `obj` displays `__proto__`. This `__proto__` points to the prototype of `person`. Naturally, the `constructor` inside `__proto__` is also the `person` constructor **(confirming our earlier point)**.

---

1. *Once a constructor is invoked with `new`, the instance is no longer directly tied to the constructor function itself; it is tied to the constructor's prototype.*
2. *When we instantiate multiple objects via `new`, their implicit prototypes (`__proto__`) all point to the original constructor's prototype. Consequently, they share the properties and methods defined on that prototype.*
3. *When accessing a property on an object, if the object itself does not possess it, JavaScript traverses up to the object's prototype. If it is still not found anywhere along the chain, it returns `undefined`. If both the instance and the prototype have a property with the same name, the instance's own property is returned, shadowing the prototype's property (this lookup traversal is called the **prototype chain**).*
4. *We cannot mutate prototype values directly through an instance via `p1.name = "test"`. An instance can only read values from the prototype; writing to `p1.name` simply adds an own property `name` directly onto the instance itself.*

---

## Proving the Concepts with Code

```javascript
// Declare a constructor function
function person() {}
person.prototype.name = "name on prototype";
person.prototype.age = "age on prototype";

// 1. Instances created via 'new' share prototype properties and methods
var person1 = new person();
var person2 = new person();
console.log("person1 shares prototype property: " + person1.name); // "name on prototype"
console.log("person2 shares prototype property: " + person2.name); // "name on prototype"

// 2. Adding or modifying an instance property does not mutate the prototype
person1.others = "others on instance";
console.log("Instance property does not alter prototype: " + person1.others); // "others on instance"

// 3. When an instance has a property with the same name, it shadows the prototype property
person1.name = "name on instance";
console.log("Instance property shadows prototype: " + person1.name); // "name on instance"
```

---

## Prototype Properties & Methods

> **`prototype` property**: Exists on any standard function (not just constructor functions). Points to the prototype object of that function.  
> **`constructor` property**: Exists on the prototype and points back to the constructor function itself.

```javascript
function person() {}
console.log(person.prototype.constructor === person); // true

var person1 = new person();
console.log(person1 instanceof person); // true
```

If you reassign an entirely new object literal to `prototype`, like this:

```javascript
person.prototype = { namespace: "1" };
```

It leads to the following gotcha:

```javascript
var person1 = new person();
console.log(person.prototype.constructor === person); // false
```

To prevent this issue (where the `constructor` reference is lost), explicitly restore it:

```javascript
person.prototype = {
  constructor: person,
  namespace: "1"
};
```

---

> **`__proto__`**: Implicit prototype

Every object has an implicit prototype pointing to its constructor's `prototype`. Historically, this was an internal slot, though browsers like Chrome and Firefox exposed it via `__proto__`. Generally, developers should avoid mutating `__proto__` directly, as modifying it can degrade performance and disrupt inheritance chains.

```javascript
var person1 = new person();
console.log(person1.__proto__ === person.prototype); // true
```

> **`hasOwnProperty`**: Determines whether a property is an own property of the instance or inherited from the prototype chain.

```javascript
var person1 = new person();
person1.name = "shenhao";

console.log("Does 'name' exist directly on the instance? " + person1.hasOwnProperty("name")); // true
console.log("Does 'age' exist directly on the instance? " + person1.hasOwnProperty("age"));   // false
console.log("Does 'sex' exist directly on the instance? " + person1.hasOwnProperty("sex"));   // false
```

As we can see, `hasOwnProperty` checks only the object's own direct properties without traversing the prototype. If the property does not exist directly on the instance, it returns `false`.

***How can we tell whether a property exists specifically on the prototype?***

> **`in` operator**: Checks whether a property exists on the object or anywhere in its prototype chain.

```javascript
var person1 = new person();
person1.name = "shenhao";
person.prototype.sex = "male";

console.log("sex" in person1); // true
```

However, there is a catch: the `in` operator returns `true` if the property exists either on the instance or on its prototype.

To reliably check whether a property exists specifically on the prototype and not on the instance itself, we can combine both:

```javascript
function hasProto(obj, key) {
  if (!(key in obj)) {
    // Property does not exist on either the instance or its prototype
    console.log(`${key} does not exist on ${obj} or its prototype`);
  } else if (obj.hasOwnProperty(key)) {
    console.log(`${key} exists directly on the object ${obj}`);
  } else {
    // 'in' succeeded, but 'hasOwnProperty' returned false -> exists on prototype
    console.log(`${key} exists on the prototype of ${obj}`);
  }
}
```

## Common Object Creation Patterns

> **Prototype Pattern**: Defining all properties and methods directly on `prototype`. Every instance shares them. Sharing methods is great for memory efficiency, but sharing mutable reference properties across all instances often conflicts with business logic. This is its biggest flaw.

> **Constructor Pattern**: Every constructor invocation defines independent properties and methods on `this`. Having separate instance properties is expected, but redefining identical methods for every instance is redundant and wastes memory.

In the constructor pattern, developers sometimes extracted methods outside:

```javascript
function person() {
  this.name = "shenhao";
  this.age = "12";
  this.story = story;
}

function story() {
  return "A happy story";
}

var person1 = new person();
console.log(person1.story()); // "A happy story"
```

*For an object-oriented language, pulling methods out of the object just for memory optimization feels rather clunky.*

> **Combination Pattern (Constructor + Prototype Pattern)**: Instance properties are initialized in the constructor (taking arguments), while shared methods are attached to `prototype`.

```javascript
function person(name, age) {
  this.name = name;
  this.age = age;
}

person.prototype.story = function(context) {
  return context;
};

var person1 = new person("shenhao", "18");
console.log(person1.story("123"));
```

> **Dynamic Prototype Pattern**: An even cleaner encapsulation where the constructor and prototype setup are bundled inside the constructor function itself.

```javascript
function person(name, age) {
  this.name = name;
  this.age = age;

  // Initialize prototype method only once on first instantiation
  if (typeof this.story !== "function") {
    person.prototype.story = function(context) {
      return this.name + ": " + context;
    };
  }
}

var person1 = new person("shenhao", "18");
console.log(person1.story("hello world"));
```

That's a wrap! Hopefully, this guide gives you a solid and intuitive grasp of JavaScript prototypes.
