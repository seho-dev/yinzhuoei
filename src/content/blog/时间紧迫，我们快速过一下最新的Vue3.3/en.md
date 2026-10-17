---
title: "Short on Time? A Quick Tour of Vue 3.3"
description: "After three busy months at a new job, I am back with a quick look at Vue 3.3. Vue's overall direction has settled in version 3, while its developer experience keeps improving—especially for TypeScript users. Here are the highlights."
date: 2023-05-13
lang: en
translationKey: "2023-05-13_818_时间紧迫，我们快速过一下最新的Vue3.3"
categories:
  - "Frontend"
  - "Life"
  - "Deep Dive"
views: 6011
draft: false
---

It has been a while! I recently started a new job, and the past three months have been busy. I plan to update the blog regularly from now on. Vue 3.3 came out a few days ago. Although I have not written any Vue this year, I have still been following its progress. Overall, Vue's direction has largely settled with version 3, while its developer experience (DX) continues to improve. If you do not use TypeScript, many of Vue 3's new features may not be relevant to you. Today, let us take a quick look at Vue 3.3.

## Overview (Summarized by GPT)

- defineOptions: declare component options, such as the component name, inside setup without adding another script tag. This is easier to understand for beginners and developers moving from Vue 2 to Vue 3.
- TypeScript type improvements in setup: import types from other type files rather than having to define them locally for macros such as defineProps. Complex type operations are not yet supported.
- defineModel: simplify the code for two-way communication (v-model) between parent and child components, making two-way binding logic clearer.
- defineSlots: define your own component slot types, useful in complex scenarios where Volar cannot infer them accurately.
- Generic components: infer the types passed into complex components with slots.
- Variable hoisting in setup: hoist variables with primitive values (except Symbol), addressing the previous limitation that only literals could be used in defineProps.

## defineOptions

Previously, when using the setup syntax, declaring component options such as the name required an additional script tag. This could confuse beginners and developers moving from Vue 2 to Vue 3, and it also made things harder for ESLint and Volar. Now, the defineOptions macro lets you specify this information directly. It does not accept props or emits, since other macros already handle those.

```javascript
<script setup lang=\"ts\">
defineOptions({
  name: \'HelloWorld\',
})
</script>
```

## TypeScript Type Improvements in setup

This addresses a long-standing issue: defineProps could not use types imported from elsewhere. See the [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0040-script-setup.md#type-only-propsemit-declarations) for details. This release supports importing types from other files, like this:

```javascript
<script setup lang=\"ts\">
import type { Props } from \'./foo\'

defineProps<Props & { extraProp?: string }>()
</script>
```

Complex type operations are still not supported. Previously, when we supplied a type to defineProps, the compiler converted it into runtime code. Supporting external types means either invoking TypeScript's painfully slow compiler or implementing a basic type resolver to identify what has been imported. Vue currently takes the second approach and supports some more involved types, such as the intersection in the example above.

## defineModel

This simplifies two-way communication (v-model) between parent and child components. Previously, implementing v-model required this much code:

```javascript
<script setup lang=\"ts\">
const props = defineProps<{
  modelValue: number
}>()

const emit = defineEmits<{
  (evt: \'update:modelValue\', value: number): void
}>()

emit(\'update:modelValue\', props.modelValue + 1)
</script>
```

Now, with defineModel:

```javascript
<script setup>
const modelValue = defineModel<number>()
modelValue.value++
</script>
```

## defineSlots

In complex scenarios, Volar sometimes cannot infer component types accurately. Or perhaps you simply want to specify your own slot types. In either case, you can use defineSlots:

```javascript
defineSlots<{
  default(props: { item: T }): any
}>()
```

```javascript
<HelloWorld :data=\"[\'foo\', \'bar\']\">
  <template #default=\"{ item }\">{{ item }}</template>
</HelloWorld>
```

## Generic Components

This may not matter much for simple components, but it is useful for complex components with slots. Types can be inferred from the values passed in and then used inside the component, as in this example:

```javascript
<script setup lang=\"ts\" generic=\"T extends string | number, U extends Item\">
import type { Item } from \'./types\'
defineProps<{
  id: T
  list: U[]
}>()
</script>
```

Both T and U can be used in emits declarations and TypeScript logic. This works particularly well together with defineSlots.

## Variable Hoisting in Scripts

Vue 3 already hoisted static content when compiling SFC templates, improving efficiency for repeated static content in large projects. See my [earlier Vue post](https://www.yinzhuoei.com/index.php/archives/794/) for more. Now, setup supports this optimization too: variables holding primitive values (except Symbol) can be hoisted to the top. This mainly addresses limitations such as only being able to use literals with defineProps:

```javascript
<script setup>
const hello = \'world\'
defineOptions({
  hello,
})
</script>
```

Code like this previously caused a compilation error, but no longer does. The reason is that the defineProps macro compiles into code along these lines:

```javascript
const __sfc__ = {
  props: [propName],
  setup(__props) {

  },
}
```

This is clearly a problem, since propName is not accessible. Hoisting resolves it, conceptually like this:

```javascript
const __sfc__ = {
  propName: \"hello\",
  props: [this.propName],
  setup(__props) {

  },
}
```

(Pseudocode)

## A More Ergonomic defineEmits

Once again, this improvement is mainly about writing less code. Previously:

```javascript
const emit = defineEmits<{
  (e: \'foo\', id: number): void
  (e: \'bar\', name: string, ...rest: any[]): void
}>()
```

Now you can write:

```javascript
const emit = defineEmits<{
  foo: [id: number]
  bar: [name: string, ...rest: any[]]
}>()
```

## Destructuring Props Without Losing Reactivity (Experimental)

As the following code shows, this offers a nicer way to provide default prop values:

```javascript
const { msg = \'hello\' } = defineProps([\'msg\'])
```

Here, msg remains reactive, and code like the following may no longer be necessary:

```javascript
export interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: \'hello\',
  labels: () => [\'one\', \'two\']
})
```

Previously, we often used the withDefaults macro to supply prop defaults. Now there is a nicer syntax closer to ES6. I suggest trying it in future work, but the feature is experimental, so weigh that up before adopting it.
