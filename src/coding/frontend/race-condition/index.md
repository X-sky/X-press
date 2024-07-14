---
outline: deep
---

# 前端开发中的竞态问题

[竞态问题 Race Condition](https://en.wikipedia.org/wiki/Race_condition) 通常用来指代一个系统或进程的输出依赖于不受控制的事件完成顺序。

这个问题在多进程或者多线程编程中经常被提及。

举例来说，如果计算机中的两个进程同时试图修改一个共享内存的内容，在没有并发控制的情况下，最后的结果依赖于两个进程的执行顺序与时机。而且如果发生了并发访问冲突，则最后的结果很可能是不正确的。

多进程/多线程的情况下，问题会复杂很多，甚至可能会出现由此引发的死锁等问题，相对而言这个问题前端工程师可能很少讨论，因为 js 是单线程的，js 的**执行本身**也总是同步的。

但是需要注意的是，js 虽然是单线程的，可是浏览器是多进程的。实际上，当**异步**这个概念引入 js 之后，竞态问题理论上就已经遍布前端工作的日常中了。

## 常见的竞态问题

首先需要明确的是，竞态问题不能与节流混为一谈。竞态是建立在 **操作必然需要发生** 的基础上的。

比如用户发生了某个请求，当他通过操作要求再次请求的时候，不能因为上次请求仍在发生，就拒绝用户的操作。

假设某业务要求在用户点击 tab 页后进行刷新，获取最新的数据，那就不能使用我们平时避免重复请求所用的 `requestLock` 操作

```javascript
// 不适用
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

简化该示例，实际上就是进行了如下的操作

```javascript
let data = '';
const someReq = async () => {
  const res = await fetch('api');
  data = res;
};
someReq();
someReq();
```

以上代码中，`someReq` 连续执行了两次，每次都对 `data` 赋予当前接口返回的最新字段。这段代码乍一看没什么问题，但是如果将代码改成如下这样，我们很容易就会发现这段代码实际上是有个严重的 bug 的。

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

如上代码，`data` 最终的值是接口 A 返回的，还是接口 B 返回的呢？

我们触发点击事件的频率和先后是不由我们控制的，而在进入两个 `fetch` 方法之后的执行顺序也是不受我们控制的。

也就是说，尽管我们预期的结果是每次都能够展示当前点击后的内容，但实际上的结果是不确定的。

```
点击a ----> 发送请求A（A需要花费100ms）
点击b ----> 发送请求B（B只需要50ms）
将B赋值给data <---- 请求B返回
将A赋值给data <---- 请求A返回
```

这种问题不仅仅出现在网络请求中，会出现在任何需要委托浏览器进行，随后由浏览器安排进入任务队列的情况中。事实上简单的 tab 点击 demo 我就是用 setTimeout 模拟的交互。

通过对以上问题的简单分析，我们不难得出竞态问题出现的两个必要条件：

- 有共享域，包括内存，数据，硬件等等
- 不同主体对数据进行了某一操作，或者相同主体进行了异步的操作

对于前端开发来讲，第二点基本上可以简化为所有异步操作。

换言之，有异步的地方，就会有竞态问题。

## 竞态问题的解决方案

知道了竞态问题出现的前提，那么解决思路也就很简单。针对“共享域”和“不同主体”提出解决思路即可。

首先我们需要排除的是对“不同主体”的解决方案。在前端开发中，这个解决方案显然可以与取消异步划等号。将所有操作变为同步的，阻塞请求，不给浏览器“插队”操作数据的机会，主动排到最后，这样就保证了主体的一致性，先进先出的执行操作是绝对不会出现竞态问题的。

举例来讲，就是上锁，禁止在异步操作的时候进行同一数据的交互。

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

这种上锁的方式一般是用来防止多次请求的。假设有多个 tab 页共享这个请求，其实也可以利用类似的道理做到避免竞态问题。也就是说当点击 tab 的时候，如果某接口还在请求中，那么不允许跳转。

但这样显然与前端开发的基本原则相违背，用户体验也会大打折扣。因此最佳实践是从“共享域”这个角度出发解决问题。

### 数据分离 data splitting

第一个解决方案，就是数据分离。这个方案是最容易想到的，也从根本上直接消灭了共享域。竞态问题也就迎刃而解了

数据分离往往应用在组件化开发上，是组件化经常用到的一个思想。或者说是组件化的一个天然优势。数据和交互被内聚在组件内部，组件外部在负责组件切换的时候，并不会因为组件内部数据的变化而产生混乱。

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

### 验证标识 validating flag

第二个解决方案，也是最常见最广泛使用的，就是加一个“验证标识”，只有在通过验证的时候，步骤才会被执行。这个方案虽然依然操作了同一数据域，但是因为加上了验证标识，保证数据域获取到的是最新的数据，因而也可以避免竞态问题。

实际上 vue3 也是通过这个原理实现的。在 Vue 中，`watch` 函数接收第三个参数 `onInvalidate` ，这个回调会在 `effect` 副作用函数执行之前进行调用，用于对数据进行验证操作下面这段代码演示了使用 vue3 开发是如何解决竞态问题的。

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

如上代码所示，在发送请求之前我们定义了一个 `expired` 变量，用来标示当前的 `watch` 的副作用函数是否过期，接着调用 `onInvalidate` 注册了一个过期回调，如果在当前请求发出后，又有同一个 `watch` 副作用函数被触发，则会将当前的 `expired` 置为 true，当前副作用的赋值操作就不会再触发。

此时在 `watch` 内部相当于发生了如下的操作

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

那么假设 `watch` 副作用触发了两次，其实际产生的效果应该如下：

```
点击a ----> 发送请求A
=> expiredA = false;
=> cleanup = ()=>{expiredA = true}

点击b ----> 发送请求B
=> expiredB = false;
=> cleanup(); => expiredA = true;
=> cleanup = ()=>{expiredB = false}

请求B返回 ----> 将B赋值给data
请求A返回 ----> expiredA=true ----> 无操作
```

通过对闭包的合理运用，我们成功的使得在副作用函数执行时修改前一次的标识符，因而有效的避免了竞态问题。

这种思路其实可以应用到任何地方。例如在 tabs 的 demo 中。 // 测试加验证标识

### 取消操作 abort action

第三个解决方案，就是直接取消原先的操作，避免其产生副作用。

我们以跟随 `fetch` api 一起引入的 [AbortController](https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController/abort) api 为例

> 当 fetch 请求 初始化时，我们将 AbortSignal 作为一个选项传递进入请求的选项对象中（下面的 {signal}）。这将 signal 和 controller 与 fetch 请求相关联，并且允许我们通过调用 AbortController.abort() 去中止它，如下面的第二个事件监听器

验证标识的思想在出现 AbortController 之后就显得有些笨拙了。这种 abort 操作有两个更符合直觉的优势：

1. 当我们遇到类似点击 tab 这种问题的时候，更通常的思路肯定是：如果类似操作有新的请求，那我就抛弃前一个请求。而非 验证标识 方式中的“如果有新的请求，那我就通过加标识符的方式只用最新的结果”。
2. 尽管通过标识使用了正确的结果，还是会有一段网络请求+数据处理的系统资源被浪费掉了。当请求数据很大的时候，抛弃掉无用的网络请求就能够有不错的性能提升。

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

这个方法有一点不足是，这个方法只支持处理网络请求，无法像【验证标识】那样在如`setTimeout`之类的*任何*场景下都可以类比使用。有一些三方库也实现了类似`AbortController`的 api，例如`axios`的`cancelToken`。

## 简单案例

考虑如下 demo。通常情况下，我们想要的效果是，点击哪个按钮，下方文字即显示当前 tab 对应的文字。

实际上，当我们在不稳定请求的情况下，**频繁**连续切换按钮，很可能会造成展示内容的错乱。

<script setup>import RaceConditionDemo from './demo/RaceConditionDemo.vue'</script>
<RaceConditionDemo />

示例中也展示了对应的解决方案。其中`signal`解决法需要借助`fetch`或者`axios`的相关特性，详细的示例可以参考[完整 demo](https://github.com/X-sky/X-press/blob/main/examples/race-condition/README.md)

::: info

参考书目：霍春阳[《Vue.js 设计与实现》](https://book.douban.com/subject/35768338/)

:::
