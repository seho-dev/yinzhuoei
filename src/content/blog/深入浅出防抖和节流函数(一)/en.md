---
title: "Debounce and Throttle Functions Explained, Part 1"
description: "Junior and mid-level frontend interviews often expect candidates to understand how debouncing and throttling work—not just basic implementations, but more advanced versions such as those in Lodash. This series starts with the basics and builds up that knowledge, with companion code available to edit and debug online…"
date: 2020-04-19
lang: en
translationKey: "2020-04-19_198_深入浅出防抖和节流函数(一)"
categories:
  - "Frontend"
  - "Deep Dive"
views: 6126
draft: false
---

Junior and mid-level frontend interviews and written tests often expect candidates to understand—or thoroughly master—the mechanisms behind debouncing and throttling. You need to know not only the basic versions, but also more advanced implementations, such as those in Lodash. This series starts with the basics, and we will build up that knowledge together.

---

[Companion code: debug and edit online](https://codesandbox.io/s/admiring-feistel-l4vdq?fontsize=14&hidenavigation=1&theme=dark)
[Reference article](https://juejin.im/entry/58c0379e44d9040068dc952f)

## Debouncing

[A little background story]
An office building's elevators are always crowded during the morning rush. Normally, an elevator takes several people at once, waiting for everyone to get in rather than giving each passenger a separate trip. This saves resources for both passengers and the elevator. It is a useful analogy for a debounce function.

> Whenever an elevator stops at a floor, it waits for people to get in. It only leaves for its destination once boarding is finished or nobody else is coming.
> On the web, a common example is a search input. After the user enters a character, we wait for a specified interval to see whether more characters arrive. If none do, we execute the function. This prevents requests from being sent for every keystroke and putting unnecessary pressure on the server.

```
// Debounce function
function debounce(fn, time = 300) {
  let timer = null;
  return function() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, time);
  };
}
```

Let us walk through this basic implementation. Pass fn into this function to debounce it. When the user enters the first character, we assign a timeout to timer. After the delay, it calls fn. The this argument preserves the calling context, while arguments is the array-like object containing the function's arguments. If the user types another character before the timeout fires, clearTimeout cancels the previous timer. The closure keeps timer alive between calls. In short, whenever the function is called again during the delay, it clears the previous timeout and starts waiting all over again, and so on...

## Throttling

[A little background story]
Back in the 2000s, and perhaps even today, many households knew that turning a tap down to a tiny drip could keep the water meter from registering the flow, avoiding a charge. I knew about this when I was little. We no longer do it, but I still feel embarrassed about it. A throttle function has a similar regulating effect: it turns frequent calls into a sequence with controlled intervals.

Take listening for scroll events as an example:

```
// Throttle function
function throttle(fn, time = 300) {
  let canRun = true;
  return function() {
    if (!canRun) return;
    canRun = false;
    setTimeout(() => {
      fn.apply(this, arguments);
      canRun = true;
    }, time);
  };
}

$(window).on(
  "scroll",
  throttle(() => {
    console.log("Triggered scroll");
  }, 300)
);
```

In this function, canRun goes through three stages. A guard returns immediately if it is false:

1. It starts as true.
2. After checking whether canRun is false, we set it to false.
3. Once the event handler finishes, we set canRun back to true. Otherwise, the next throttled call would never be allowed through.

The changing value of canRun forms a cycle. Its key guarantee is that the next event handler can start only after the current one finishes.

## Summary

Throttling: ensures the callback runs regularly at a specified interval.
Debouncing: waits for a specified interval to see whether another call arrives. If not, it executes the callback; if so, it resets the timer and keeps waiting.
