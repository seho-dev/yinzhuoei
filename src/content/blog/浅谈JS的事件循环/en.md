---
title: "A Brief Introduction to the JavaScript Event Loop"
description: "What does JavaScript's single-threaded model mean, and how does it handle asynchronous work? A brief introduction to the main thread, task queues, timers, and the event loop."
date: 2019-09-17
lang: en
translationKey: "2019-09-17_112_浅谈JS的事件循环"
categories:
  - "Life"
views: 5566
draft: false
---

We need a little background first: what is the single-threaded model?
JavaScript is a single-threaded scripting language for historical reasons. If it used multiple threads, one thread could modify the DOM while another did the same. Which one should the browser follow? For developers, multiple threads would bring more problems than benefits in this situation.

Without multithreaded execution, our tasks have to run on one thread. Although JavaScript is single-threaded, its runtime environment has other threads. Only one thread executes JavaScript event handlers at a time: the **main thread**.

But with a single thread, each task must wait for the previous one to finish. This is particularly inconvenient for I/O operations and Ajax requests: later tasks would have to wait for them to complete. Waiting for I/O or an Ajax response does not require CPU work, so spending time doing nothing would be wasteful. This is where the **message queue (task queue)** comes in.

When JavaScript executes tasks, it runs synchronous work first and leaves asynchronous work pending elsewhere. Once the synchronous work has finished, eligible asynchronous tasks can be queued for execution on the main thread. A classic example is **setTimeout**:

let timer = setTimeout(() => {
 console.log("This delay is not an exact deadline!")
 }, 1000)

A timer says: wait for a certain amount of time, then queue this task to run on the main thread. Passing 1000 does not guarantee execution after exactly one second. Earlier tasks on the main thread must finish first. If there are many time-consuming tasks ahead of it, 1000 represents the minimum delay, not the actual delay.

Once the main thread has finished its synchronous tasks, it checks the other queues for asynchronous work. If a task is ready, it is sent to the main thread and executed synchronously. When the main thread is free again, it looks for more asynchronous tasks. If the task queue is empty, there is no more work to execute. Each message is associated with a function, which runs when that task (message) is processed. Without an associated function, the message is lost.

This repeated process of checking whether asynchronous tasks are ready and running them on the main thread is called the **event loop**.

Wikipedia defines an event loop as
 “a programming construct that waits for and dispatches events or messages in a program.” You can think of it as the mechanism behind a dynamically updated message queue.

In code, it can be represented like this:
 while(queue.waitForMessage()){
 queue.processNextMessage();
 }

Tasks can be divided into two categories:

1. Macrotasks (synchronous):
**Tasks that are not suspended by the engine and execute on the main thread. Each must wait for the previous task to finish.**
2. Microtasks (asynchronous):
**Tasks suspended by the JavaScript engine and kept in a task queue. Once the engine considers them ready, they enter the main thread and execute synchronously. Code following an asynchronous operation does not wait for that operation to finish; it proceeds immediately.**

**On the question of single-threading: alongside the main thread, there are threads for Ajax, timers, and event listeners. In other words, JavaScript processes events on a single thread; that does not mean its runtime has only one thread.**

![20170804013026998.png](https://www.yinzhuoei.com/usr/uploads/2019/09/3861587696.png)
