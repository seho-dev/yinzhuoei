---
title: "A Brief Look at Compound Types in Rust"
description: "As the name suggests, compound types combine other types, with structs and enums being typical examples. This article explores Rust's strings, slices, tuples, structs, enums, Option, and arrays, including how UTF-8 and ownership affect their use."
date: 2022-09-18
lang: en
translationKey: "2022-09-18_785_简单聊聊Rust中的复合类型"
categories:
  - "Deep Dive"
  - "Rust"
views: 3829
draft: false
---

# Compound Types

As the name suggests, compound types are made by combining other types. The most typical examples are structs (`struct`) and enums (`enum`).

## Strings

Strings in Rust differ from those in the programming languages we may be used to. For example, the following code fails to compile:

```rust
fn main() {
  let my_name = "Pascal";
  greet(my_name);
}

fn greet(name: String) {
  println!("Hello, {}!", name);
}
```

## Slices

Slices are already familiar to many Go developers. They let you reference part of a collection rather than the whole thing. With strings, we can write:

```rust
let s = String::from("hello world");

let hello = &s[0..5];
let world = &s[6..11];
```

If the range starts at 0, you can omit the 0:

```rust
let hello = &s[..5];
```

Likewise, if you want to slice through to the end, you can omit the ending index:

```rust
let hello = &s[1..];
```

When working with Chinese text, however, you need to pay particular attention to UTF-8. A typical Chinese character occupies three bytes, so slicing at the second byte rather than at a character boundary causes an error.

A returned string slice is actually a reference into a string. Consider the following code:

```rust
fn main() {
    let mut s = String::from("hello world");

    let word = first_word(&s);

    s.clear(); // error!

    println!("the first word is: {}", word);
}
fn first_word(s: &String) -> &str {
    &s[..1]
}
```

Strings aren't the only things you can slice; arrays support slicing too:

```rust
let a = [1, 2, 3, 4, 5];
let slice = &a[1..3];
assert_eq!(slice, &[2, 3]);
```

When we create a string using a string literal, it looks like this:

```rust
let a = "hello";
```

Here, a has the type &str. We can write the type explicitly as shown below. The reference points to a location in the executable, which is also why a string created from a literal is immutable: &str is an immutable reference.

```rust
let a: &str = "hello";
```

## What Is a String?

Rust's character type represents Unicode characters, with each character occupying four bytes. Strings, on the other hand, use UTF-8, which takes between one and four bytes per character and therefore uses memory more efficiently.

### The Difference Between &str and String

At the language level, Rust has the str string type. String literals are hard-coded into the executable and cannot be modified. The standard library also provides String, which lets us create growable strings. String is UTF-8 encoded as well and follows Rust's ownership rules.

### Converting Between Them

str → string

```rust
let a = String::from("hello world");
let b = "hello world".to_string();
```

string → str

```rust
fn main() {
    let s = String::from("hello,world!");
    say_hello(&s);
    say_hello(&s[..]);
    say_hello(s.as_str());
}

fn say_hello(s: &str) {
    println!("{}",s);
}
```

## String Indexing

In JavaScript, we can easily access a string by index. Rust does not allow this:

```rust
let s1 = String::from("hello");
let h = s1[0];
```

A string is backed by a sequence of bytes, [u8]. A typical Chinese character takes three bytes, so indexing a Chinese string could produce something other than the character we expect. String indexing is therefore an operation that can easily be misleading, and Rust does not support it.

## Working Correctly with UTF-8 Strings

To work with a string as Unicode characters, use the .chars() method:

```rust
for c in "Chinese".chars() {
    println!("{}", c);
}
```

To inspect the string's underlying bytes, use the bytes() method:

```rust
for b in "Chinese".bytes() {
    println!("{}", b);
}
```

The corresponding byte sequence is:

```
67
104
105
110
101
115
101
```

P.S. For convenient UTF-8-aware substring extraction in Rust, you can use a library such as utf8_slice.

## Understanding Strings More Deeply

Why can a String be mutable while a string literal is immutable? The idea is straightforward: a literal's contents are known at compile time, so they can be embedded directly into the executable. In real applications, though, we can't use immutable literals for everything. Values are often produced by logic that runs at runtime, so we need a mutable String type. A String stores its contents in a region allocated on the heap. That memory is returned when it is released; the entire lifecycle happens at runtime.

## Tuples

A tuple combines values of different types. Its length and the order of its elements are fixed. We can create a tuple in a function like this:

```rust
fn main() {
    let tup: (i32, f64, u8) = (500, 6.4, 1);
}
```

We can destructure a tuple using pattern matching:

```rust
let (x, y, z) = tup;
```

We can also access tuple elements with a dot followed by an index:

```rust
tup.1
```

When a function needs to return multiple values, a tuple is an alternative to the structs we'll introduce next:

```rust
fn calculate_length(s: String) -> (String, usize) {
    let length = s.len();
    (s, length)
}
```

## Structs

In the tuple example, calculate_length returns a tuple. This can make a program harder to maintain because the returned values don't have names explaining what they mean. Rust has another compound type, the struct, that addresses this. You can think of a struct as similar to an object or a record in TypeScript. A struct combines multiple types and gives each field a name (a key), making it more flexible than a tuple.

Defining a struct is straightforward:

```rust
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}
```

Creating an instance of that struct is just as simple:

```rust
let user1 = User {
      email: String::from("someone@example.com"),
      username: String::from("someusername123"),
      active: true,
      sign_in_count: 1,
  };
```

As with TypeScript, we need to initialize the struct completely: the data must match the struct's definition.

To change a field of user1, we must make the entire user1 binding mutable with mut. Rust does not let us mark only an individual struct field as mutable:

```rust
user1.email = String::from("anotheremail@example.com");
```

When a field name and its value's variable name are identical, we can use shorthand syntax:

```rust
fn build_user(email: String, username: String) -> User {
    User {
        email,
        username,
        active: true,
        sign_in_count: 1,
    }
}
```

In TypeScript, we often use the ES spread operator to update objects. Rust has similar syntax for creating an updated struct, and it must appear at the end:

```rust
let user2 = User {
    email: String::from("another@example.com"),
    ..user1
};
```

Ownership also matters when using struct update syntax. Types that implement Copy have their data copied. For example, bool and u64 implement Copy, so their values are simply copied in the update expression. But username is a String, so its ownership moves to user2. After that, we can no longer use username through user1.

Structs aren't limited to named key-value fields. They can take other forms too:

```rust
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);

let black = Color(0, 0, 0);
let origin = Point(0, 0, 0);
```

## Enums

An enum defines a type with multiple variants. An enum value is an instance of one of those variants:

```rust
enum PokerSuit {
  Clubs,
  Spades,
  Diamonds,
  Hearts,
}
```

In some situations, you can associate types with enum variants and use them in place of a separate struct to simplify your code. In TypeScript, enums exist at runtime as objects produced by the compiler. In Rust, enums are types in their own right, with associated data provided when a variant is instantiated.

Using a conventional struct, we would write:

```rust
enum PokerSuit {
    Clubs,
    Spades,
    Diamonds,
    Hearts,
}

struct PokerCard {
    suit: PokerSuit,
    value: u8
}

fn main() {
   let c1 = PokerCard {
       suit: PokerSuit::Clubs,
       value: 1,
   };
   let c2 = PokerCard {
       suit: PokerSuit::Diamonds,
       value: 12,
   };
}
```

Refactoring this into an enum makes the code much simpler:

```rust
enum PokerCard {
    Clubs(u8),
    Spades(u8),
    Diamonds(u8),
    Hearts(u8),
}

fn main() {
   let c1 = PokerCard::Spades(5);
   let c2 = PokerCard::Diamonds(13);
}
```

Variants can have different associated types:

```rust
enum PokerCard {
    Clubs(u8),
    Spades(u8),
    Diamonds(char),
    Hearts(char),
}
```

They can also carry more complex types, such as structs:

```rust
struct Ipv4Addr {
    // --snip--
}

struct Ipv6Addr {
    // --snip--
}

enum IpAddr {
    V4(Ipv4Addr),
    V6(Ipv6Addr),
}
```

Compared with separate tuple structs, enums provide more concise syntax and keep related variants together.

### Option

Rust avoids the null concept used in most languages and uses Option instead. Option is itself an enum:

```rust
enum Option<T> {
    Some(T),
    None,
}
```

Some means that a value exists, and that value has type T, where T is a generic type parameter. None represents the absence of a value.

Option does not need an explicit import: it is provided by the standard library and brought into scope automatically. The same is true of Some and None, which we can use without a :: prefix:

```rust
let some_number = Some(5);
let some_string = Some("a string");

let absent_number: Option<i32> = None;
```

If you want to represent something like null in Rust, you must tell the compiler what type the missing value would have, as in the third line above. Conversely, using Some tells the compiler that a value is present inside it. Why does Rust go to the trouble of introducing an Option enum for this?

The main reason is safety. Rust's compiler needs to ensure data is used safely at compile time, rather than letting misuse of null cause errors later. Without Option to mark a potentially absent value, you might forget that it can be absent and use it in an operation with another value, only for null to blow up at runtime. Marking the value with Option lets Rust detect the issue at compile time and alert the developer.

## Arrays

Arrays are straightforward, and Rust lets us specify their type explicitly:

```rust
fn main() {
    let a = [1, 2, 3, 4, 5];
        // In this type declaration, ; follows the element type, ; precedes the repetition count
        let b: [i32; 5] = [1, 2, 3, 4, 5];
        // The same syntax, for faster array initialization, uses an initial value of 3, repeated 5 times
        let c = [3; 5];
}
```

Access an array element:

```rust
a[0]
```

Arrays can also be sliced:

```rust
let slice: &[i32] = &a[1..3];
```
