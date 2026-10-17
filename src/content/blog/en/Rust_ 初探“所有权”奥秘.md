---
title: "Rust: A First Look at Ownership"
description: "For developers who have never learned C or C++—myself included—getting started with Rust means encountering concepts that do not exist in JavaScript. Ownership is one of Rust's core features. I wanted to document what I have learned in an article, covering a few fundamentals before the main topic and briefly exploring references and borrowing at the end…"
date: 2022-01-09
lang: en
translationKey: "2022-01-09_727_Rust_ 初探“所有权”奥秘"
categories:
  - "Backend"
  - "Rust"
views: 2692
draft: false
---

For developers who have never learned C or C++—myself included—getting started with Rust means encountering concepts that do not exist in JavaScript. Ownership is one of Rust's core features. I wanted to write an article to document what I have learned. Before getting into the main topic, I need to cover a few fundamentals, and at the end I also plan to touch on related Rust concepts such as references and borrowing, and slice types. As I am a Rust beginner, please read critically and think things through for yourself. Everyone approaches and understands these ideas differently, so there may be mistakes along the way...

References:

- [The Rust Programming Language: What Is Ownership?](https://kaisery.github.io/trpl-zh-cn/ch04-01-what-is-ownership.html)

## Warming Up

Every program must manage how it uses computer memory. Languages such as JavaScript have garbage collection (GC), which continually looks for memory that is no longer in use, so developers do not need to intervene manually. In some other languages, we have to allocate and free memory ourselves. Rust instead manages memory through ownership: the compiler checks a set of rules at compile time, without requiring programmers to manage memory manually. That work is handled by ownership and the compiler. So, more precisely, learning ownership in Rust means learning the *rules* the compiler uses to perform those checks. Those rules are what matter most to us.

## The Stack and the Heap

In everyday JavaScript application development, we do not usually need to think about the stack and the heap. In Rust, however, whether a value lives on the stack or the heap is closely tied to ownership. Let's briefly review the basics. The stack and the heap are both areas of memory available to code at runtime, but they work differently. As we know, a stack is `last in, first out`, like a stack of trays held by a waiter: the first tray placed on the stack is usually the last one removed from the top. All data stored on the stack has a fixed size. At compile time, the program needs to know the size of each value; data whose size may change needs storage on the heap. Heap memory is less orderly: an allocator must find a suitable region, mark it as in use, and return a `pointer`. This process is called `allocating memory on the heap`.

Pushing data directly onto the stack is faster than allocating memory on the heap. A stack push simply places data on top, whereas a heap allocation requires the allocator to inspect memory, allocate space, and maintain records for future allocations. Accessing heap data is also slower than accessing stack data because it involves following a pointer. Processor caches favor fewer jumps between memory locations: accessing nearby stack data is naturally faster, while moving between stack and heap data can be a little slower. `Ownership` helps us handle duplicate heap data, clean up unused data, and track which code uses data on the heap. In short, ownership exists to manage heap data.

## Ownership Rules

- Every value has a variable called its `owner`.
- A value can have only one `owner` at a time.
- When the owner—the variable—goes out of scope, the value is dropped.

These rules may seem a little abstract right now, but we can gradually make sense of them as we work through the notes.

## Scope

Since the ownership rules mention scope, let's take a quick look at it. It is not very different from JavaScript, so it should be easy to understand.

```rust
fn main(){ // a在这里无效
    let a = "hello seho" // a有效
} // 作用域结束了，a无效
```

> Looks simple, doesn't it? Just like JavaScript?

Here, `hello seho` is a hard-coded string literal bound to `a`. In this case, the binding has a fixed size and lives on the stack. When the scope ends, `a` is popped off the stack.

## Memory and Allocation

In real applications, fixed values such as `hello seho` are not always enough. More often, we need content of an unknown size that may grow or shrink at runtime. Supporting that requires allocating space on the heap. The program must request that region at runtime, then return the memory to the allocator once it has finished using the content.

The first step is straightforward: a call such as `String::from` allocates space on the heap. But how do we give it back?

In C, memory must be freed manually. But programs are written by people, and people sometimes forget to free memory, free it too early, or free it more than once. Any of these can cause bugs. In languages with `GC`, the garbage collector tracks and removes unused content to release memory. That is one reason I like JavaScript so much—it is wonderfully convenient...

Let's modify the earlier code:

```rust
fn main(){ // a在这里无效
    let a = String::from(""hello seho"") // a有效
} // 作用域结束了，a无效
```

> When the scope ends, Rust calls a special function, `drop`, to release the memory. The string type implements this function internally...

### Moves

We have all written plenty of JavaScript like this:

```
let a = 1;
let b = a;
```

Clearly, this creates two variables on the stack, `a` and `b`, both with the value `1`.

The same is true in Rust. But what if we create a variable with `String::from`? Does that change what happens on the stack and the heap?

```
let a = String::from("hello seho");
let b = a;
```

Here, `a` holds the string `hello seho`, and `b` “copies” the pointer from `a`. The bindings are on the stack, and the pointer refers to `hello seho` on the heap.

Wait—does that mean Rust behaves just like JavaScript? Earlier, we mentioned an ownership rule: **when a variable goes out of scope, its owned value is automatically freed**. But if `a` and `b` both point to the same heap allocation, wouldn't that free the same memory more than once? It would. As discussed above, failing to free memory, freeing it too early, and freeing it multiple times all cause problems. Rust therefore handles the assignment above differently: once `a` has been “copied” into `b`, `a` is no longer valid. Trying to use it afterward produces a compile-time error.

This avoids freeing the same memory twice. The “copy” is not really a copy at all—it is a `move`.

> If you genuinely want an independent duplicate of a value, you can call `clone`. Why did the integer example above work without calling `clone`? Because those values are stored entirely on the stack, where copying is fast. They can be copied without using the `move` mechanism.

At this point, we should have a basic understanding of ownership. These notes covered its concepts and rules, reviewed the stack and the heap, and explored memory allocation in Rust. I used JavaScript as a point of comparison throughout. If you are not familiar with JavaScript, I will leave out the language comparisons in the next set of notes, which should make things easier to follow. Leave a comment if you have any questions. And if you happen to be Daniel Wu or Dilraba Dilmurat, I will definitely reply!
