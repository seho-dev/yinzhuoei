---
title: "Exploring React Hooks (Part 1)"
description: "An introduction to React Hooks, contrasting class components with function components, explaining useState, useEffect lifecycle semantics, rules of hooks, and custom hooks."
date: 2020-10-09
lang: en
translationKey: "2020-10-09_418_初探reactHook（一）"
categories:
  - "Frontend"
  - "Deep Dive"
views: 5777
draft: false
---

![1_-Ijet6kVJqGgul6adezDLQ.png](http://static.yinzhuoei.com/typecho/2020/10/09/347711333845510.png)

In earlier React development, we routinely wrote components using ES6 classes. However, as functional programming gained popularity—and with functions being first-class citizens in JavaScript—writing business components with functions became increasingly desirable. Previously, function components were strictly stateless without local state of their own. The advent of Hooks allows function components to "hook into" React state and lifecycle features. In this note, we summarize key concepts from the official React Hook documentation.

[Introducing Hooks - React](https://legacy.reactjs.org/docs/hooks-intro.html)

## State Hook

```jsx
import React, { useState } from "react";

// Counter component
function Main() {
  const [count, setCount] = useState(0);
  return (
    <div>
      {count}
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Increment
      </button>
    </div>
  );
}

export default Main;
```

We declare state using the `useState` hook. It returns a tuple (array) containing the current state variable and a function to update it. By destructuring this array, we can directly read `count` within the component scope and call `setCount` to trigger updates.

Notice that the update function in Hooks differs from `setState` in class components: in a class component, `setState` merges into the existing state object, often requiring manual object shallow-merging, whereas the setter returned by `useState` replaces the value directly.

```jsx
setCount(100);
```

You can declare multiple state variables within the same component:

```jsx
const [age, setAge] = useState(42);
const [fruit, setFruit] = useState('banana');
const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
```

You don't have to separate every single variable into its own `useState` call—the documentation offers further recommendations on grouping related state.

## Effect Hook

Lifecycle methods in class components are replaced by Effect Hooks in function components. Operations executed after component rendering are called side effects (data fetching, DOM manipulation, subscriptions), hence the name `useEffect`.

Let's compare class syntax with Hooks:

```jsx
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
  }
  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```

In the class component, updating the document title requires duplicating the exact same logic across both `componentDidMount` and `componentDidUpdate`. This boilerplate makes code redundant and harder to maintain. With Hooks, it becomes concise:

```jsx
import React, { useState, useEffect } from "react";

// Counter component
function Main() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = "You clicked " + count + " times";
  });
  return (
    <div>
      {count}
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Increment
      </button>
    </div>
  );
}

export default Main;
```

`useEffect` accepts a callback function. Calling `useEffect` covers both initial mounting and subsequent updates. When an effect requires cleanup (e.g., unsubscribing), return a cleanup function from the callback:

```jsx
useEffect(() => {
  API.on(); // Subscribe to API when component mounts
  return () => {
    API.off(); // Unsubscribe when unmounting or before re-running
  };
});
```

By default, `useEffect` runs on both the initial render and after every update.

Compared to class lifecycle methods, `useEffect` does not block browser painting, keeping the user interface smooth and responsive.

### Separating Unrelated Concerns

In class components, developers frequently write lifecycle methods that clump unrelated logic together:

```jsx
componentDidMount() {
  document.title = `You clicked ${this.state.count} times`;
  // Call API A
  A();
  // Call API B
  B();
  // Call API C
  C();
}
```

Cramming multiple unrelated concerns into a single lifecycle method makes code brittle and difficult to reason about. With Hooks, you can split unrelated logic across multiple `useEffect` calls:

```jsx
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
  useEffect(() => {
    API.on(); // Subscribe to API
    return () => {
      API.off(); // Cleanup subscription
    };
  });
  // ...
}
```

React executes multiple Effect Hooks sequentially in the order they were defined.

### Why Effects Run on Every Update

When learning `useEffect`, many developers wonder: why does the effect run on every update by default?

Consider a component fetching friend details based on a `friendId` prop. If the prop updates to a new ID, a class component that fails to implement `componentDidUpdate` would continue displaying information for the previous friend, or encounter bugs during cleanup:

```jsx
componentDidUpdate(prevProps) {
  // Unsubscribe from previous friend.id
  API.off(prevProps.id);
  // Subscribe to new friend.id
  API.on(this.props.id);
}
```

With `useEffect`, this class of bugs is eliminated automatically. Before applying a new effect on an update, React cleans up the previous render's effect first.

### Skipping Effects for Performance Optimization

What if running an effect on every single re-render incurs unnecessary performance overhead?

In class components, you compare previous and current props/state manually:

```jsx
// Class approach: compare count before updating
componentDidUpdate(prevProps, prevState) {
  if (prevState.count !== this.state.count) {
    document.title = `You clicked ${this.state.count} times`;
  }
}
```

With `useEffect`, pass a dependency array as the second argument:

```jsx
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // Only re-run the effect if count changes
```

Passing an empty dependency array (`[]`):

```jsx
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, []);
```

This tells React that the effect doesn't depend on any values from props or state, running only once on mount and cleaning up on unmount. Be mindful of stale closures when using empty dependency arrays.

### Summary of Effect Hooks:

1. **Automatic cleanup**: Prevents bugs caused by forgetting to handle updates in class components.
2. **Separation of concerns**: Decouples independent business logic into isolated hooks rather than tangling them inside monolithic lifecycle methods.

---

## Rules of Hooks

Hooks are regular JavaScript functions under the hood, but they must follow two essential rules (enforced via [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)):

1. **Only call Hooks at the top level**: Do not call Hooks inside loops, conditions, or nested functions.
2. **Only call Hooks from React function components or custom Hooks**: Do not call Hooks from regular JavaScript functions.

Official documentation: [Rules of Hooks - React](https://legacy.reactjs.org/docs/hooks-rules.html)

### Why Top-Level Invocations Matter

```jsx
function Form() {
  // 1. Use the name state variable
  const [name, setName] = useState('Mary');

  // 2. Use an effect for persisting the form
  useEffect(function persistForm() {
    localStorage.setItem('formData', name);
  });

  // 3. Use the surname state variable
  const [surname, setSurname] = useState('Poppins');

  // 4. Use an effect for updating the title
  useEffect(function updateTitle() {
    document.title = name + ' ' + surname;
  });

  // ...
}
```

When Hooks are called at the top level, React reliably matches the state variables across renders by relying on the **exact invocation order**: `Mary` matches `name`, and `Poppins` matches `surname`. Every render traverses the hooks in the exact same sequence.

If you place a Hook inside a condition:

```jsx
if (name !== null) {
  useEffect(function persistForm() {
    localStorage.setItem('name', name);
  });
}
```

If the condition evaluates to `false` on a subsequent render, the hook is skipped. The entire sequence shifts, causing all subsequent Hooks to misalign and triggering unexpected bugs.

---

## Implementing Custom Hooks

Let's build a simple custom hook that calculates the difference between two numbers:

When `count` changes in the parent component, it triggers the effect inside the custom hook, recomputing and returning the difference:

```tsx
import { useState, useEffect } from "react";

export function useSeekingDifference(
  subtraction: number,
  minuend: number
): number {
  const [difference, setDifference] = useState(0);
  useEffect(() => {
    setDifference(subtraction - minuend);
  }, [subtraction, minuend]);
  return difference;
}
```

Using the custom hook in a component:

```tsx
import React, { useState, useEffect } from "react";
// Import custom hook
import { useSeekingDifference } from "./../hook/computed";

// Counter component
function Main() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = "You clicked " + count + " times";
  });
  console.log(useSeekingDifference(count * 2, count)); // Using custom hook
}

export default Main;
```

### Goals of Custom Hooks:

1. **Extracting and reusing stateful business logic across components.**
   For complex global state orchestration, dedicated state libraries like Redux or Zustand remain appropriate.

### Key Points When Writing Custom Hooks:

1. **Hooks are standard JavaScript functions** that follow React Hook conventions.
2. **Hook names must start with `use`**, which signals that it is a Hook and allows ESLint plugins to validate rules of hooks.
3. **Each Hook call has isolated state**: multiple components (or multiple calls within the same component) calling the same custom hook do not share state. Hooks reuse *stateful logic*, not the state itself.
