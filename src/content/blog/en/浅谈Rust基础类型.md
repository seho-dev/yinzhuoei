---
title: "A Brief Introduction to Rust's Basic Types"
description: "Rust is a statically typed language, so understanding its types is essential. These notes introduce basic and compound types, integers, floating-point numbers, characters, booleans, the unit type, and the distinction between statements and expressions."
date: 2022-07-31
lang: en
translationKey: "2022-07-31_775_浅谈Rust基础类型"
categories:
  - "Rust"
views: 3233
draft: false
---

# Basic Types

Rust is a statically typed language, so we need to understand its types. Rust's types can be divided into basic types and compound types (also called complex types). Basic types are the smallest, indivisible types; they cannot be broken down into other types.

Rust is different from TypeScript, a superset of JavaScript with strong type inference. Still, Rust has a smart compiler: you can often omit a type and let the compiler infer it. In some situations, however, the compiler cannot work out the type, as in this example:

```rust
let guess = \"42\".parse().expect(\"Not a number!\");
```

Who knows what type `guess` is supposed to be? The compiler certainly does not, so it reports an error. All you need to do is specify the type explicitly.

## Numeric Types

Creating a numeric value in Rust is straightforward:

```rust
let a = 1;
```

### Integers

Let us take a closer look at integer types. The i32 type we encountered earlier represents a signed 32-bit integer.

> The `i` stands for integer; its counterpart, `u`, indicates an unsigned integer.

These type names follow the pattern “signed or unsigned” + “number of bits.” Unsigned integers represent nonnegative values, while signed integers can be positive or negative. A simple rule of thumb: Rust defaults to i32 for integers, so start with i32; it is also a good choice for performance.

> When an integer value exceeds its range, Rust behaves differently depending on the build mode. In debug mode, the program reports an error and exits. In release mode, the value wraps around using two's-complement arithmetic to the lower end of the range. This can produce unexpected results and should be treated as a bug.

### Floating-Point Numbers

The default floating-point type is f64, but Rust has a floating-point pitfall. We usually express these numbers in decimal, while Rust represents them internally in binary. For example, 0.5 has an exact decimal representation but not an exact binary one, creating a discrepancy. Representing the full, exact value would therefore require unlimited floating-point precision.

Another point to watch: avoid comparing floating-point values directly. As in JavaScript, Rust's binary floating-point representation can introduce inaccuracies. Rust's floating-point types implement `PartialEq`, not `Eq`. Map keys require a type that implements `Eq`, so floating-point types do not meet that requirement. Attempting to use them where full equality is required results in a compiler error.

### NaN

As in JavaScript, we can write a defensive check in Rust:

```rust
fn main() {
    let x = (-42.0_f32).sqrt();
    if x.is_nan() {
        println!(\"未定义的数学行为\")
    }
}
```

### Ranges

Rust provides a concise way to generate consecutive values:

```rust
// 生成1-5 (包括5)
1..=5
// 生成1-5 (不包括5)
1..5
```

## Characters, Booleans, and the Unit Type

This part is fairly straightforward.

### char

```rust
fn main() {
    let c = \'z\';
    let z = \'ℤ\';
    let g = \'国\';
    let heart_eyed_cat = \'hhh\';
}
```

Rust's char type can represent both ASCII and Unicode characters. Characters are enclosed in single quotes (`''`), while double quotes (`""`) denote strings.

### bool

As in other languages, Rust's boolean type has the values true and false.

### The Unit Type

The unit type is a zero-length tuple, written as `()`. It can serve as a placeholder and occupies no memory. Rust's main function and print operations return the unit type. We should not say that main has no return value, `because Rust has a separate concept for functions that never return: diverging functions`—functions whose execution never reaches a normal return.

## Statements and Expressions

A Rust function body consists of a series of statements, with a final expression supplying the return value. For example:

```rust
fn add(x: i32, y: i32) -> i32 {
    let x = x + 2; // 语句
    let y = y + 3; // 语句
    x + y // 表达式
}
```

### Statements

```rust
let x = x + 2; // 语句
 let y = y + 3; // 语句
```

Because `let` is a statement, we cannot assign a `let` statement to another variable:

```rust
let b = (let a = 8);
```

The compiler will reject this…

### Expressions

Expressions evaluate to values. For example, 1 + 2 produces 3. In the section on statements, we wrote:

```rust
let x = x + 2;
```

Here, x + 2 is indeed an expression. `Just remember: if it evaluates to a value, it is an expression.` To use an expression as a block's return value, leave off the semicolon, as in this example:

```rust
let y = {
    let x = 3;
    x + 1
};
```

If we add a semicolon after x + 1, that line becomes a statement and the block no longer returns the calculated value. So when writing a Rust function, remember not to add a semicolon to the final expression if you want to return its value.

## Functions

Rust functions are simple. The example below consists of a keyword, a function name, parameter names and types, a return type, and a block of code. Together, these make a basic function:

```rust
fn add(i: i32, j: i32) -> i32 {
   i + j
 }
```

1. Rust is strongly typed, so function parameters must have explicit types. Omitting them causes a compiler error.
2. A function returns the value of the final expression in its body. You can also use the return keyword to return early.
3. As mentioned in the unit-type section, a function can return the unit type. If you accidentally add a semicolon to the final expression, turning it into a statement, the block will return unit instead.
4. For the diverging functions mentioned earlier, we can use `!` as the return type. This indicates that the function never returns, as is often the case for a function that terminates the program:

```rust
fn end() -> ! {
  panic!(\"it is over...\");
}
```
