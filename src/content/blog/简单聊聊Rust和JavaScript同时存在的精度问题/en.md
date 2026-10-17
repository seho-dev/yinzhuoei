---
title: "A Brief Look at the Precision Issues Shared by Rust and JavaScript"
description: "While learning Rust, I discovered that its floating-point representation shares the same foundations as JavaScript's. That means the precision issues familiar from JavaScript can occur in Rust too. Here is a quick look at double precision, binary representation, and why rounding errors happen."
date: 2022-07-31
lang: en
translationKey: "2022-07-31_776_简单聊聊Rust和JavaScript同时存在的精度问题"
categories:
  - "Frontend"
  - "Rust"
views: 9305
draft: false
---

While learning Rust recently, I discovered that its floating-point representation works the same way as JavaScript's. That means the precision issues we encounter in JavaScript can also occur in Rust.

First, let us clarify the types involved. Rust's default floating-point type is f64. JavaScript, unlike many other languages, uses the number type for both integers and floating-point values. It also has a fixed width of 64 bits: the standard double-precision floating-point format.

> A double-precision floating-point number (double) is a computer data type that uses 64 bits (8 bytes) to store a floating-point value. It provides 15 or 16 significant decimal digits, with a representable range of approximately -1.79E+308 to +1.79E+308 [1].

Since both languages use the same underlying standard, [IEEE 754 double precision](https://baike.baidu.com/item/IEEE%20754/3869922), we can use the more familiar JavaScript for our examples.

## Why Use Double Precision?

Double precision takes more space than single precision (8 bytes versus 4 bytes), which can give single precision an advantage in CPU processing. The major drawback of single precision, however, is that it offers fewer significant digits and a smaller range, making it less broadly useful. On modern CPUs, the difference in processing speed is generally negligible. That is why Rust defaults to f64 for floating-point values; choose f32 (single precision) when you need it.

## How Double-Precision Numbers Are Stored

Here is a diagram borrowed straight from Wikipedia:

![618px-IEEE_754_Double_Floating_Point_Format.svg.png](https://static.yinzhuoei.com/typecho/2022/07/31/575123270334562/618px-IEEE_754_Double_Floating_Point_Format.svg.png)

- Sign: 1 bit (+ or -)
- Exponent: 11 bits (the power)
- Fraction: 52 bits

## The Calculation Process

We usually write floating-point numbers in decimal, but Rust and JavaScript represent them internally in binary. For example, suppose we write:

```
var a = 0.1;
```

To us as programmers, this may look exactly equal to 0.1. Internally, however, it must be converted to binary, where representing it exactly requires infinitely many digits. It looks like this:

```
0.1 -> 0.0001 1001 1001 1001...(1100 repeats)
```

But the underlying format has only 52 fraction bits. During floating-point calculations, digits beyond that limit are discarded, so converting the binary result back to decimal in JavaScript may not produce the answer we expected (although it is correct to a certain precision).
For the same reason, we should avoid relying on direct floating-point comparisons in Rust or JavaScript: the computed result may not be exact. Precision deserves serious attention, as conversion problems have caused some dangerous incidents:

> Working code from the Ariane 4 rocket was reused in Ariane 5, but Ariane 5's faster operation triggered a bug in an algorithm running on its onboard computer. The error occurred when converting a 64-bit floating-point value to a 16-bit signed integer. The higher values encountered on Ariane 5 exceeded those seen on Ariane 4, directly triggering an overflow and ultimately crashing the onboard computer. On Flight 501, the backup computer failed first, followed 0.05 seconds later by the primary computer. These failures led to erroneous commands from the rocket's main processor, and the rocket broke apart about 40 seconds after launch.

As an aside, Rust also handles integer overflow. In release builds, values wrap according to two's-complement rules, but this can still produce incorrect, unexpected results.

## How to Address It

Rust: I do not know yet—I have only just started learning Rust.
JavaScript: There are plenty of precision libraries. A popular approach is to use strings underneath; a library such as bignumber.js can help you avoid floating-point pitfalls.
