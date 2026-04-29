---
outline: deep
title: "Race Conditions in Frontend Development"
description: "Analysis and solutions for race conditions in frontend development, including data splitting, validating flags, and abort actions"
---

# Race Conditions in Frontend Development

[Race Condition](https://en.wikipedia.org/wiki/Race_condition) generally refers to a situation where the output of a system or process depends on the completion order of uncontrolled events.

This problem is frequently discussed in multi-process or multi-threaded programming.

For example, if two processes in a computer simultaneously try to modify the content of shared memory, without concurrency control, the final result depends on the execution order and timing of the two processes. If a concurrent access conflict occurs, the final result is likely to be incorrect.

In multi-process/multi-threaded scenarios, the problem becomes much more complex and may even lead to deadlocks. Frontend engineers may rarely discuss this because JavaScript is single-threaded, and JS **execution itself** is always synchronous.

However, it's important to note that while JS is single-threaded, the browser is multi-process. In fact, once the concept of **asynchrony** was introduced to JS, race conditions theoretically became pervasive in everyday frontend work.

## Common Race Conditions

First, it's important to clarify that race conditions should not be confused with throttling. Race conditions are based on the premise that **operations must occur**.

For example, when a user makes a request and then performs an action requiring another request, we cannot refuse the user's operation just because the previous request is still in progress.

Suppose a business requirement is to refresh and fetch the latest data when a user clicks a tab. In this case, we cannot use the typical `requestLock` approach for avoiding duplicate requests:

```javascript
// Not applicable
let data = '';
let requestLock = false;
const someReq = async () => {
  if (requestLock) return;
  requestLock = true;
  const res = await fetch('api');
  data = res;
  requestLock = false;
};
```

Simplified, this is essentially the following operation:

```javascript
let data = '';
const someReq = async () => {
  const res = await fetch('api');
  data = res;
};
someReq();
someReq();
```

In the code above, `someReq` is executed twice consecutively, each time assigning the latest API response to `data`. This code looks fine at first glance, but if we rewrite it as follows, we can easily spot a serious bug:

```javascript
let data = '';
const requestA = async () => {
  const res = await fetch('api/a');
  data = res;
};
const requestB = async () => {
  const res = await fetch('api/b');
  data = res;
};
requestA();
requestB();
```

In the code above, will `data` ultimately hold the value returned by API A or API B?

The frequency and order of our click events are beyond our control, and the execution order after entering the two `fetch` methods is also beyond our control.

In other words, although we expect to always display the content corresponding to the current click, the actual result is indeterminate.

```
Click A ----> Send Request A (A takes 100ms)
Click B ----> Send Request B (B only takes 50ms)
Assign B to data <---- Request B returns
Assign A to data <---- Request A returns
```

This problem doesn't only occur with network requests — it can happen in any situation that requires delegation to the browser, which then schedules it into the task queue. In fact, I simulated the simple tab-click demo using setTimeout.

Through this simple analysis, we can derive two necessary conditions for race conditions:

- There is a shared domain, including memory, data, hardware, etc.
- Different subjects perform operations on the data, or the same subject performs asynchronous operations

For frontend development, the second point can essentially be simplified to all asynchronous operations.

In other words, wherever there is asynchrony, there will be race conditions.

## Solutions for Race Conditions

Knowing the prerequisites for race conditions, the solution approach becomes straightforward. We just need to address the "shared domain" and "different subjects" aspects.

First, we should rule out solutions targeting "different subjects." In frontend development, this approach is essentially equivalent to canceling asynchronous operations — making all operations synchronous, blocking requests, not giving the browser the opportunity to "cut in line" when operating on data, and proactively queuing to the end. This ensures subject consistency, and first-in-first-out execution will never produce race conditions.

For example, locking — prohibiting interaction with the same data during asynchronous operations:

```js
let data = '';
let requestLock = false;
const request = async () => {
  if (requestLock) return;
  requestLock = true;
  data = await axiosGet('some api');
  requestLock = false;
};
```

This locking approach is generally used to prevent multiple requests. If multiple tabs share this request, a similar principle can be used to avoid race conditions — when clicking a tab, if a certain API is still requesting, navigation is not allowed.

But this clearly violates basic frontend development principles, and user experience would suffer greatly. Therefore, the best practice is to solve the problem from the "shared domain" perspective.

### Data Splitting

The first solution is data splitting. This is the easiest to think of and fundamentally eliminates the shared domain, solving the race condition problem entirely.

Data splitting is often applied in component-based development and is a commonly used concept — or rather, a natural advantage of componentization. Data and interactions are encapsulated within components, and the external component switching logic won't be confused by internal data changes.

```vue
<script setup>
import { ref, computed } from 'vue';
import compA from 'xxx';
import compB from 'xxx';

const flag = ref(true);
const triggerRace = () => {
  flag = !flag;
};
const comp = computed(() => (flag ? compA : compB));
</script>
<template>
  <component :is="comp" />
</template>
```

### Validating Flag

The second solution, and the most common and widely used, is adding a "validating flag." Steps are only executed when validation passes. Although this approach still operates on the same data domain, the validating flag ensures the data domain receives the latest data, thus avoiding race conditions.

Vue 3 actually implements this principle. In Vue, the `watch` function accepts a third parameter `onInvalidate`, which is called before the `effect` side-effect function executes, used for data validation. The following code demonstrates how to solve race conditions in Vue 3 development:

```javascript
const data = ref('');
watch(anyObj, async (newV, oldV, onInvalidate) => {
  let expired = false;
  onInvalidate(() => {
    expired = true;
  });
  const res = await fetch('request');
  if (!expired) {
    data.value = res;
  }
});
```

As shown above, before sending the request we define an `expired` variable to indicate whether the current `watch` side-effect function has expired. Then we call `onInvalidate` to register an expiration callback. If a new `watch` side-effect function is triggered after the current request is sent, the current `expired` will be set to true, and the current side-effect's assignment operation won't execute.

Inside `watch`, the following essentially happens:

```javascript
function watch(source, cb, options = []) {
  // do something effect
  // ...
  let oldV, newV;

  // save last customized invalid callback
  let cleanup = null;
  const onInvalidate = (fn) => {
    cleanup = fn;
  };
  const job = () => {
    // assign newV
    // ...
    if (cleanup) {
      cleanup();
    }
    cb(newV, oldV, onInvalidate);
    oldV = newV;
  };
  // other effect operations
  // ...
  if (options.immediate) {
    job();
  } else {
    // ...
  }
}
```

If the `watch` side-effect triggers twice, the actual effect would be:

```
Click A ----> Send Request A
=> expiredA = false;
=> cleanup = ()=>{expiredA = true}

Click B ----> Send Request B
=> expiredB = false;
=> cleanup(); => expiredA = true;
=> cleanup = ()=>{expiredB = false}

Request B returns ----> Assign B to data
Request A returns ----> expiredA=true ----> No operation
```

Through proper use of closures, we successfully modify the previous identifier when the side-effect function executes, effectively avoiding race conditions.

This approach can actually be applied anywhere. For example, in the tabs demo. // Test with validating flag

### Abort Action

The third solution is to directly cancel the previous operation to prevent side effects.

Let's use the [AbortController](https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController/abort) API, which was introduced alongside the `fetch` API, as an example:

> When a fetch request is initialized, we pass an AbortSignal as an option into the request's options object (the {signal} below). This associates the signal and controller with the fetch request and allows us to abort it by calling AbortController.abort()

The validating flag approach became somewhat clumsy after AbortController appeared. The abort approach has two more intuitive advantages:

1. When encountering problems like tab clicking, the more natural thought is: if there's a new request for a similar operation, discard the previous request. Rather than the validating flag approach of "if there's a new request, use flags to only use the latest result."
2. Even though the correct result is used through flags, there's still wasted system resources from network requests and data processing. When request data is large, discarding useless network requests can provide noticeable performance improvements.

```javascript
var controller = new AbortController();
var signal = controller.signal;

var downloadBtn = document.querySelector('.download');
var abortBtn = document.querySelector('.abort');

downloadBtn.addEventListener('click', fetchVideo);

abortBtn.addEventListener('click', function () {
  controller.abort();
  console.log('Download aborted');
});

function fetchVideo() {
  // …
  fetch(url, { signal })
    .then(function (response) {
      // …
    })
    .catch(function (e) {
      reports.textContent = `Download error: ${e.message}`;
    });
}
```

One limitation of this method is that it only supports handling network requests and cannot be analogously used in *any* scenario like `setTimeout`, unlike the validating flag approach. Some third-party libraries also implement APIs similar to `AbortController`, such as `axios`'s `cancelToken`.

## Simple Example

Consider the following demo. Under normal circumstances, we want the effect where clicking a button displays the text corresponding to the current tab.

In practice, when we **frequently** switch buttons rapidly under unstable request conditions, the displayed content may become disordered.

<script setup>import RaceConditionDemo from './demo/RaceConditionDemo.vue'</script>
<RaceConditionDemo />

The example also demonstrates the corresponding solutions. The `signal` solution requires features from `fetch` or `axios`. For detailed examples, refer to the [complete demo](https://github.com/X-sky/X-press/blob/main/examples/race-condition/README.md).

::: info

Reference: Huo Chunyang, ["Vue.js Design and Implementation"](https://book.douban.com/subject/35768338/)

:::
