---
title: "Programming Language Theory and Implementation: An Introduction to Compiler Technology"
description: "Course Overview and Introduction to Compiler Technology. This course uses ReScript, with the main goal of implementing a programming language. Why ReScript? Primarily because it is a metalanguage and a dialect of OCaml. It is not simply JavaScript with stronger types, like TypeScript…"
date: 2022-12-07
lang: en
translationKey: "2022-12-07_789_程序语言理论与实现_ 编译技术概论"
categories:
  - "Deep Dive"
views: 4164
draft: false
---

# Course Overview and Introduction to Compiler Technology

This course uses `rescript`, with the main goal of implementing a programming language. Why learn with `rescript`? Primarily because `rescript` is a metalanguage and a dialect of OCaml. Rather than simply strengthening JS's types, as TypeScript does, it reworks a subset of JS with a well-designed syntax and compiles to performance-optimized JS. You could say it and TS are in different lanes, but they serve the same purpose: helping programmers avoid JS's many pitfalls and adding types during development.

## Why Learn About Compilers and Interpreters?

- It's meaningful work. Writing things in your own programming language is a lot of fun.
- Fully understanding a familiar programming language such as JS can be difficult, but we can try to understand a minimal implementation of a language. This helps us learn how languages work underneath. We can also study each language's abstraction mechanisms and their costs. Every language has its strengths: some advertise `zero runtime cost`, but that means taking on considerable cost during compilation. JS, by contrast, is a typical example of a language with significant runtime costs. Learning different abstraction mechanisms makes it easier to debug tricky JS problems, such as the classic memory leaks involving closures…
- Try writing a DSL. Vue's SFCs are a typical example, as is SQL. Compiler techniques can turn templates into data structures suitable for rendering.
- Develop better taste (and show off a little).

## The Compilation Pipeline

![Untitled 1.png](https://static.yinzhuoei.com/typecho/2022/12/07/27869240521681/Untitled%201.png)

- Start with a string.
- Parse it into an abstract syntax tree.
- Perform type checking to produce a typed abstract syntax tree.
- Produce multiple levels of IR (intermediate representation).
- Linearize it into a lower-level IR.
- Generate machine code.

We tend to think of a compiler's backend as the heavyweight part and its frontend as relatively “simple.” For modern languages, however, the frontend and middle end are often more important, requiring more innovation and type checking. The backend has become reusable and less burdensome: LLVM can process the IR, generate efficient code, and make extension straightforward.

> Saying the backend isn't “heavyweight” applies to most modern use cases. Compute-intensive tasks or neural network acceleration can place much higher demands on it.

![Untitled.png](https://static.yinzhuoei.com/typecho/2022/12/07/278702093222784/Untitled.png)

## Distinguishing a Few Important Concepts

- Compilation is offline. The phase before a program runs is called compile time, or ahead-of-time compilation.
- Execution (including interpretation) is online. Every program ultimately has a runtime, including C/C++; those programs simply execute on the CPU.
- Transpilation means translating from A to B when the two are relatively similar.

## Lexical Analysis and Parsing (the Frontend)

We start with plain text and parse it into an abstract syntax tree. Broadly speaking, the text is broken into individual `token` units, which are then parsed into syntactic constructs, with elements such as whitespace and comments handled along the way. The result is an abstract syntax tree.

![Untitled 2.png](https://static.yinzhuoei.com/typecho/2022/12/07/278703213952423/Untitled%202.png)

> Syntax has a limited effect on semantics, but a major effect on the user experience. Essentially, once we've settled on the abstract syntax tree, the concrete syntax just needs to conform to the rules.

## Semantic Analysis

Semantic analysis follows parsing and depends on the AST. Its goal is straightforward: determine what the code means. It also adds annotations to syntactic constructs, covering matters such as type checking and scope. This stage can report familiar errors:

- Incorrect types
- Use of undefined variables

Alongside reporting errors, it enriches the AST with useful information in preparation for the next stage.

One technical term worth mentioning here is `type soundness`: a property of a type system stating that, when code has been typed, it will follow those types at runtime without type errors. Many languages provide type soundness, including OCaml and ReScript.

> As someone who likes to criticize Java, I'll mention the long-running debate over Java being type-safe but not type-sound: when the types do not match, it simply throws an error. Still, even at its worst, it's better than JS.

## Language-Specific Optimizations

- Modules
- Object orientation
- Pattern matching
- Classes
- Other optimizations
- Translation through one or multiple levels of IR

## Optimizations on Linear IR

A CPU has a pipelined architecture and only understands linear sequences, so we need a linear IR. This stage primarily optimizes that IR, using techniques such as:

- Constant folding
- Constant propagation
- …and other compiler optimizations

## Platform-Specific Code Generation

Each platform has a different `ISA (instruction set architecture)`. One of the most important optimizations here is `register allocation`. The goal is simple: move frequently used variables from the stack into registers so execution is faster and we make better use of the computer's resources.

> Registers reside on the CPU and are controlled directly by it, so accessing them is faster than communicating with memory. But they have far less capacity, so registers must be shared across different parts of a program. The compiler therefore needs to allocate them during compilation.

When discussing stack-based virtual machines, we usually put variables on the stack. But stack access is slower than register access, so we want to place stored data in registers—in other words, move from stack allocation to register allocation. This is another language optimization. For the compiler, allocating registers also improves the compiled result by allowing safe, conflict-free reuse of storage.

After register allocation comes instruction scheduling and machine-specific optimizations, such as the classic backend technique known as `peephole` optimization.

> This looks for optimization opportunities within a short sequence of instructions to improve execution efficiency and reduce code size.

As mentioned earlier, in most scenarios, compiler backends don't need extensive optimization unless they involve computation-heavy tasks such as neural networks. Familiar language compilers such as Go's don't do an enormous amount of backend optimization. As long as the language's semantics are sufficiently static and reasonable optimization techniques are used when writing the compiler, the results are broadly comparable.

## Abstract Syntax vs. Concrete Syntax

Parsing in modern programming languages does not involve semantics. One abstract syntax can map to multiple concrete syntaxes.

Abstract syntax is the theoretical structure of a language: the structural form of statements and their meaning. Concrete syntax is what we actually write. In short, abstract syntax is the theory built on a language's fundamental rules, while concrete syntax is one way of using and implementing it.

For example, Git's core implements a set of abstract syntax, while graphical tools provide concrete ways to use it. Underneath, they are still operating on Git's abstract syntax.
