---
outline: deep
---


# Web 性能优化

Web 性能是 Web 开发的一个重要议题，主要聚焦于一个关键词 **速度 Speed** 两个方面：

1. 网页加载速度 at which pages load
2. 用户输入响应速度 how responsive they are to *user input*

优化网站的性能可以为用户带来更好的体验。而更好的用户体验，可以提升用户的留存率和转换率，进而提升产品质量

## 性能指标

`Web Vitals` 是 Google 提出的一项举措，旨在为质量提供统一指导，以形成一个良好的用户体验。但这些衡量性能的工具往往复杂且多样，因此 Google 提出了一个子集 `Core Web Vitals`，每个 `Core Web Vitals` 都代表了用户体验的一个独特方面，可以运行时进行衡量，并反映以 **用户为中心 user-centric** 的关键结果的现实体验

总的来说，Google 规定了包含 [Core Web Vitals](https://web.dev/articles/vitals#core_web_vitals) 在内的若干重要 [指标](https://web.dev/articles/user-centric-performance-metrics#important-metrics)，用于衡量用户为中心的网页性能

- Largest Contentful Paint ([LCP](https://web.dev/articles/lcp)): 测量从页面开始加载到最大 *文本块* / *图片元素* 渲染到屏幕上的时间

- Interaction to Next Paint ([INP](https://web.dev/articles/inp)): 测量页面上每次点击、轻触或者键盘交互的页面延迟，并且基于交互的数量，选择其中 **最差的** 的一次延迟作为唯一描述页面整体响应的代表性数值

- Cumulative Layout Shift ([CLS](https://web.dev/articles/cls)): 测量发生在页面开始加载到页面周期变为 `hidden` 之间中最大的一次 [session window](https://web.dev/articles/evolving-cls#why_a_session_window) 中所有意料外的布局偏移 (layout shifts) 的累计得分

- First Contentful Paint ([FCP](https://web.dev/articles/fcp)): 测量从页面开始加载到首次任意内容渲染到屏幕上的时间

- Time to Interactive ([TTI](https://web.dev/articles/tti)): 测量从页面开始加载到它的子资源加载完成，并且已经可以快速对用户输入进行可靠的响应的时间

- Total Blocking Time ([TBT](https://web.dev/articles/tbt)): 测量 `FCP` 和 `TTI` 之间的主线程被阻塞，无法响应用户输入的时间长度 (the total amount of time)

- Time to First Byte ([TTFB](https://web.dev/articles/ttfb)): 测量用户发出请求到网络响应资源的首个字符之间的时间。简而言之，TTFB 是 重定向时间、`Service Worker` 启动时间、 `DNS` 查询时间、`TCP / TLS` 协议时间以及请求时间的总和。详情可以查看 [Navigation Timing Level 2 规定的网络请求处理模型](#level-2-处理模型)

::: details 如何利用 `performance` 工具快速定位 TTI

一言以蔽之：从 `FCP` 到 持续 5 秒以上的 **静止窗口 quiet window** 之间的 **最后一个长任务** 的结束时间。如果没有找到长任务，那么 `TTI` 与 `FCP` 的值相同

![find-tti](./assets/locate-tti.svg)

两个关键概念：

- 长任务指的是持续 50 ms 以上的任务
- 静止窗口 quiet window 指的是：无长任务且进行中的 GET 请求少于两个的情况

:::

### Core Web Vitals

目前已经成为业界事实标准的是2020版本，主要从用户体验层面的三个方面衡量，即 [Core Web Vitals](https://web.dev/articles/vitals#core_web_vitals)：

1. 加载 loading - LCP
2. 交互性 interactivity - INP
3. 视觉稳定 visual stability - CLS

一个用户体验良好的页面应该至少保证核心指标达到良好

#### LCP

`LCP` 标记了页面加载时间线中页面的主要内容可能已经加载完成的时间点。一个快速的 `LCP` 帮助用户保障页面的 **实用性 (useful)**

> 页面的实用性：有足够用户使用的内容 has enough content rendered that users can engage with it

::: details 为什么不使用 [Speed Index(SI)](https://developer.chrome.com/docs/lighthouse/performance/speed-index/) 或者 [First meaningful Patint (FMP)](https://developer.chrome.com/docs/lighthouse/performance/first-meaningful-paint/)

`SI` 和 `FMP` 都是 Google Lighthouse 中会追踪的指标项（`FMP` 在 Lighthouse 6.0+ 后被移除），但他们的问题在于他们过于复杂且难以解释，并且往往无法 *正确* 解释什么时候页面的 **主要内容 main content** 完成加载

:::

![vitals-threshold-lcp](./assets/vitals-threshold-lcp.svg)

`LCP` 主要衡量以下内容

- `<img>`
- `<svg>` 中的 `<image>`
- `<video>`
- 含有 `url()` 的元素
- 含有文字节点的块级元素 (Block-level element)

为了良好的用户体验，网站应该尽量在至少75%以上的页面保持少于 2.5s 的 LCP

很少有通过某个简单操作即可快速提升 `LCP` 的情况，提升 `LCP` 往往需要查看整个网页 loading 过程并且确保过程中的每一步都得到了优化。因此我们需要将 `LCP` 的过程划分为更细的子步骤

一个网页加载过程中往往伴随着一定数量的请求，其中与 `LCP` 高度相关的有两个

- 初始的 HTML docuemnt
- `LCP` 资源本身

因此 `LCP` 在加载过程中又有四个子步骤可以优化

- TTFB
- 资源加载延时: TTFB 之后浏览器开始加载 LCP 资源之前的耗时（如果是使用系统字体渲染的大段文本，本项耗时为0）
- 资源加载耗时: 加载 LCP 资源本身的耗时（如果不需要任何资源渲染，如系统字体，本项耗时为0）
- 元素渲染延时：LCP 资源完成后到完整渲染 LCP 元素的耗时

##### 消除资源加载延时

关于优化这一点有一个很好的切入口，理想情况下，`LCP` 资源应该在首个资源解析后立即开始

![优化lcp资源加载延时](./assets/optimize-lcp-resouce-load-delay.png)

图中 `Stylesheet` 开始解析后，到 `LCP` 资源开始加载前的中间空余时间段，就是可优化的空间

对此，可以通过 `preload` 图片资源或者提高资源的优先级来优化加载延时

```html
<!-- Preload the LCP image with a high fetchpriority so it starts loading with the stylesheet. -->
<link rel="preload" fetchpriority="high" as="image" href="/path/to/hero-image.webp" type="image/webp">

<img fetchpriority="high" src="/path/to/hero-image.webp">
```

##### 消除元素渲染延时

当 `LCP` 资源请求后，可能由于某些原因阻塞渲染

- `head` 中的 `script` 或者 `stylesheet` 仍处于加载中
- `LCP` 元素仍未被挂载至 `dom` 上
- 主线程被长任务阻塞

对应的优化策略如下

1. 通过 `minify` 或者 `compress` 以及删除无用的 css 优化 css 的加载；通过 defer 或者 `inline script` 优化 head 中 `script` 的加载
2. 尝试使用 `ssr`
3. 分割长任务。这一点尤为重要。现代浏览器基本都会在主线程渲染图片，因此任何阻塞主线程的长任务都会增加不必要的元素渲染延时

##### 减少资源加载时长

1. 降低资源大小
2. 降低资源周转距离
3. 减少带宽争夺
4. 优化 cache-control-policy，使用本地缓存

##### 降低 TTFB

良好的 `TTFB` 应该保持在 800ms 以内

![vitals-threshold-ttfb](./assets/vitals-threshold-ttfb.svg)，优化 `TTFB` 通常有以下 [几种方式](https://web.dev/articles/optimize-ttfb#ways_to_optimize_ttfb)

1. 使用 CDN
2. 减少页面重定向次数
3. 尽可能使用缓存内容，合理设置 Cache-Policy
4. 使用 Service Worker

#### CLS

`CLS` 可以协助量化用户经历意料外的布局便宜的频率。较低的 `CLS` 可以一定程度上确保页面的 **舒适性 (delightful)**

> 页面的舒适性：交互是否流畅、自然、无滞后 Are the interactions smooth and natural, free of lag

![vitals-threshold-cls](./assets/vitals-threshold-cls.svg)

意料外的页面变更通常发生在资源异步加载或者DOM元素动态添加的情况下

:::warning

CLS 只会在一个在视窗内可见的元素 **改变其初始位置** 时被计算。这样的元素被称作不稳定元素 unstable elements

如果一个新元素被添加到 DOM 内，或者一个已经存在的元素改变大小，这种变化不会被计入 CLS

CLS 关注的是 **shift** 而不是 **change**

:::

影响 CLS 的主要因素有

1. 缺少尺寸(dimensions)限制的图片
2. 没有尺寸(dimensions)限制的广告、`embeds` 或者 `iframes`
3. 动态嵌入的上述元素
4. 网络字体 web fonts

因此优化 CLS 指标也可以从以上几点入手

1. 对于 `image` `embeds` `iframes` 尽量增加尺寸限制
2. 尽量避免动态插入这些内容，如果必须动态插入，考虑增加预留空间 reserved space
3. 避免使用会导致 `re-layout` 的属性 如 `box-sizing` `box-shadow` `position`
4. 关于字体优化，又是另一个复杂的问题，可以参考 [这里](https://web.dev/articles/font-best-practices) ，通过 `font-display: optional` 或使用 `<link rel="preload">` 等方式进行优化

::: details `re-layout`, 而非 `reflow`

会影响 CLS 的严格来讲不是 `reflow`，而是 `re-layout`。两者概念有细微区别。

`re-layout` 更宽泛，而 `reflow` 一般情况下专指 [浏览器渲染](../engine/engine.md) 中的 **回流**

回流不一定会影响 CLS。例如改变某个已有元素的子元素的 `width` 属性，会触发浏览器的 `reflow`，但不会影响到 CLS 评分，因为该元素有对应的 reserved space，因而没有发生 layout shift

:::

#### INP

INP 观察用户与页面进行的所有交互的延迟，并报告所有（或几乎所有）交互都低于的一个值。较低的 INP 意味着页面总体来说能够持续快速响应所有——或大多数——用户的交互

![vitals-threshold-inp](./assets/vitals-threshold-inp.svg)

与 CLS 和 LCP 不同，通常情况下 INP 不是一个一次性测量行为，而是贯穿整个页面生命周期 page lifecycle 的测量行为。INP 无法通过 [PerformanceObserver](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver) 监听指标，也可以说无需。大多数测量 INP 都是页面出现显著延迟的时候

出于 INP 的目的考虑，目前主要需要监听的用户交互有三种

1. 鼠标点击 click
2. 触摸屏轻触 tap
3. 键盘或者虚拟键盘的敲击事件 press

其他用户交互如 `hover` `zoom` `scroll` 并不会作为 INP 的监听事件，尽管这些事件的部分变体在某些情况下可能会触发类似 `click` 的行为，从而被 INP 监听

一旦定位到了 slow interaction 并且可以手动复现，就可以将交互行为 interaction 细分为三个部分进行分析：

1. 输入延迟 input delay
2. 处理用时 processing duration
3. 展示延迟 presentation delay

影响上述三个部分的主要因素有两个：

1. 主线程占用情况会影响输入延迟和处理用时
2. 布局优化情况会影响展示延迟

因此在所有优化中最重要的，首先是避免长任务 long task。不仅有利于用户输入的快速响应，而且有利于响应脚本的执行

```typescript
// 通过合理的任务调度，让出主线程
function splitTasks(){
  task1();
  setTimeout(()=>{
    task2();
  }, 0)
}
function yieldToMainThread(){
  return new Promise(resolve=>{
    setTimeout(resolve, 0);
  })
}
// 通过合理的 code-splitting 将大脚本解析为小模块，减少解析时间 Evaluating Time
// 使用Web Worker再主线程之外运行脚本
```

其次，尽管使用 `setTimeout` 让出主线程是一种合理的任务调度策略，仍然应该尽量避免在主线程上启动过多的计时器，因为只有主线程及时响应，才能优化**输入延迟**

最后，展示层面的优化也往往占据大头。在实际的应用场景中，许多 INP 的表现不佳，往往是由于页面展示耗费了大量时间

```typescript
// 避免大型、复杂的布局和布局抖动
function largeLayoutThrashing(){
  const testEl = document.getElementById('test-el');
  const style = testEl.style; // should be {width: 20px; height: 20px}
  testEl.style.width = '200px';
  testEl.style.height = '350px';
}
// 避免强制reflow
function logBoxHeight () {
  box.classList.add('super-big');
  // 为了正确返回元素的offsetHeight，页面必须先进行一次reflow
  console.log(box.offsetHeight);
}
// 避免连续快速地进行布局
function loopResize(){
  // 把浏览器置于读写循环中
  for (let i = 0; i < paragraphs.length; i++) {
    paragraphs[i].style.width = `${box.offsetWidth}px`;
  }
}
```

另外，`Blink` 计算元素样式的总时间大约有一半用于匹配选择器，因此降低选择器的复杂性和减少要设置样式的元素数量。因此 CSS 的优化也有利于提高 INP

```css
.title {
  /* styles */
}
.box:nth-last-child(-n+1) .title {
  /* styles */
}
```

### 如何衡量性能指标

#### Performance

#### Lighthouse

#### PageSpeed

[官方网址](pagespeed.web.dev)

## 测量标准

### Navigation Timing - 2012

为了帮助开发者更好地衡量页面性能，`W3C` 在 2012 年提出了 [Navigation Timing](https://www.w3.org/TR/navigation-timing)

该标准提供了 `PerformanceTiming` `PerformanceNavigation` 接口，通过只读属性的方式，提供了完整的客户端延迟度量 （complete client-side latency measurements），具体内容可以查看 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceTiming) 或者 [W3C Recommendation](https://www.w3.org/TR/navigation-timing/#sec-navigation-timing-interface)

标准细化的指标都存储在全局的 `performance` 上，可以直接通过 `const {navigation, timing} = window.performance` 的方式读取

#### 为什么需要 `Navigation Timing`

假设有如下代码，旨在衡量页面的加载时间

```html
<html>
  <head>
    <script type="text/javascript">

    var start = new Date().getTime();
    function onLoad() {
      var now = new Date().getTime();
      var latency = now - start;
      alert("page loading time: " + latency);
    }

    </script>
  </head>
  <body onload="onLoad()">
  <!-- Main page body goes from here. -->
  </body>
</html>
```

实际上该脚本有一个明显的问题：它只会在 `script` 执行时才开始计算，而没有累计任何 *从服务端获取页面* 的时间

基于以上原因，`W3C` 基于页面的生命周期，在`PerformanceTiming` 和 `NavigationTiming` 中定义了包含了 `navigationStart` 在内的属性，方便衡量从前一个页面卸载开始的整个页面周期内页面加载耗时的各项指标

#### `Navigation Timing` 的处理模型

`Performance Timing` 以及 `Navigation Timing` 准确来讲并不是直接的衡量指标，而是基于页面周期的 **时间点**

如下图所示，整个生命周期经历了以下阶段

1. 导航开始：记录 `navigationStart` 时间点
2. 重定向处理：如果存在重定向，记录 `redirectStart` 和 `redirectEnd` 时间点
3. `DNS` 查找：记录 `domainLookupStart` 和 `domainLookupEnd` 时间点
4. `TCP` 连接：记录 `connectStart` 和 `connectEnd` 时间点
5. 请求发送：记录 `requestStart` 时间点
6. 响应接收：记录 `responseStart` 和 `responseEnd` 时间点
7. `DOM` 处理：记录 `domLoading` `domInteractive` `domContentLoadedEventStart` `domContentLoadedEventEnd` 和 `domComplete` 时间点
8. 页面加载：记录 `loadEventStart` 和 `loadEventEnd` 时间点

在不同的阶段中，用户代理 (User agents 多数情况下为 browsers)会将对应的时间点写入 `window.performance.timing` 和 `window.performance.navigation` 对象中，方便后续使用

![Navigation Timing 标准处理模型](./assets/process-model-navigation-timing.png)

*图片来源 <https://www.w3.org/TR/navigation-timing/#processing-model>*

::: warning

1. 当 `window` 对象创建后，`window.performance.timing` 和 `window.performance.navigation` 才能被写入
2. `window.performance.timing` 和 `window.performance.navigation` 可能被浏览器禁用，此时两者的值返回 `null`

:::

#### 属性

可以通过 `window.performance` 访问对应内容 `timing` 和 `navigation`

```typescript
interface PerformanceTiming {
  readonly navigationStart: number;
  readonly unloadEventStart: number;
  readonly unloadEventEnd: number;
  readonly redirectStart: number;
  readonly redirectEnd: number;
  readonly fetchStart: number;
  readonly domainLookupStart: number;
  readonly domainLookupEnd: number;
  readonly connectStart: number;
  readonly connectEnd: number;
  readonly secureConnectionStart: number;
  readonly requestStart: number;
  readonly responseStart: number;
  readonly responseEnd: number;
  readonly domLoading: number;
  readonly domInteractive: number;
  readonly domContentLoadedEventStart: number;
  readonly domContentLoadedEventEnd: number;
  readonly domComplete: number;
  readonly loadEventStart: number;
  readonly loadEventEnd: number;
}
enum NavigationType {
  TYPE_NAVIGATE = 0;
  TYPE_RELOAD = 1;
  TYPE_BACK_FORWARD = 2;
  TYPE_RESERVED = 255;
}
interface PerformanceNavigation {
  readonly type: NavigationType;
  readonly redirectCount: number;
};
interface Performance {
  readonly timing: PerformanceTiming;
  readonly navigation: PerformanceNavigation
}
interface Window {
  readonly performance: Performance
}
```

::: warning

需要注意的是 `Navigation Timing` 特性已被标注为[废弃](https://w3c.github.io/navigation-timing/#obsolete)，并不推荐使用。但由于其良好的兼容性（Chrome 6），仍有了解的必要

:::

### Navigation Timing Level 2

目前在 `W3C` 议程上的是最新的 [Navigation Timing Level2 标准](https://www.w3.org/TR/navigation-timing-2/#abstract)。简而言之，该标准相对于 `Navigation Timing - 2012` 主要有以下改变：

1. 提供了更多的时间点和属性
2. 提供协议支持

使用方式与 `Navigation Timing - 2012` 也有所不同，可以通过 [performance.getEntriesByType](https://developer.mozilla.org/en-US/docs/Web/API/Performance/getEntriesByType) 或者 [PerformanceObserver](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver) 获取到对应的属性

`performance.getEntriesByType` 支持[多种类型的资源](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEntry/entryType)，通过指定 `type` 可以指定获取对应的 `performance` 数据

``` typescript
const [navigationTl] = performance.getEntriesByType("navigation");
const srcTimelines = performance.getEntriesByType("resource");
```

需要注意的是，`performance.getEntriesByType` 不会通知到对应 `performanceNavigationTiming` 属性的变化，返回的是 `FrozenArray` 格式的 **调用时的** `performance timeline`。如果需要动态监听变化，应该使用 `PerformanceObserver`

```typescript
function perfObserver(list, observer) {
  list.getEntries().forEach((entry) => {
    if (entry.entryType === "mark") {
      console.log(`${entry.name}'s startTime: ${entry.startTime}`);
    }
    if (entry.entryType === "measure") {
      console.log(`${entry.name}'s duration: ${entry.duration}`);
    }
  });
}
const observer = new PerformanceObserver(perfObserver);
observer.observe({ entryTypes: ["measure", "mark"] });

```

::: details 变更详情，摘自 [w3c Editor's Draft](https://w3c.github.io/navigation-timing/#introduction)

1. `Performance interface` 移动到单独的 [PERFORMANCE-TIMELINE-2](https://www.w3.org/TR/performance-timeline/) 标准中，支持该标准
2. 建立在的 [RESOURCE-TIMING-2](https://www.w3.org/TR/resource-timing/) 基础上
3. 支持 [HR-TIME-2](https://www.w3.org/TR/hr-time-2/)
4. 支持 [RESOURCE-HINTS] 的预渲染技术
5. 暴露自上次非重定向导航以来的重定向次数
6. 暴露 [next hop network protocol](https://www.w3.org/TR/resource-timing/#dom-performanceresourcetiming-nexthopprotocol)
7. 暴露 `transfer` 以及编解码的请求体大小
8. 强制 `secureConnectionStart` 属性

:::

#### Level 2 处理模型

![Navigation Timing Level2 处理模型](./assets/process-model-navigation-timing-2.svg)

1. 导航开始：记录 `startTime` 和 `navigationStart` 时间点
2. `Service Worker` ：如果存在 `Service Worker`，记录 `workerStart` 时间点
3. 重定向处理：如果存在重定向，记录 `redirectStart` 和 `redirectEnd` 时间点，并更新 `redirectCount` 属性
4. `DNS` 查找：记录 `domainLookupStart` 和 `domainLookupEnd` 时间点
5. `TCP` 连接：记录 `connectStart` `secureConnectionStart`（如果适用）和 `connectEnd` 时间点
6. 请求发送：记录 `requestStart` 时间点
7. 响应接收：记录 `responseStart` `responseEnd` `transferSize` `encodedBodySize` 和 `decodedBodySize` 时间点
8. 底层协议：记录 `nextHopProtocol` 属性
9. `DOM` 处理：记录 `domInteractive` `domContentLoadedEventStart` `domContentLoadedEventEnd` `domComplete`时间点
10. 页面加载：记录 `loadEventStart` 和 `loadEventEnd` 时间点
11. 预渲染：如果存在预渲染，记录 `prerenderStart` 和 `prerenderEnd` 时间点

对比 [Navigation Timing 2012](#navigation-timing---2012) 可以发现，`Navigation Timing Level2` 的记录颗粒度明显更细致，并且多了诸如 `Service Worker` 等

#### 属性

```typescript
/** 导航类型 */
enum NavigationTimingType {
    "navigate",
    "reload",
    "back_forward",
    "prerender"
};
/** 未存储原因 */
interface NotRestoredReasons {
  readonly src?: string;
  readonly id?: string;
  readonly name?: string;
  readonly url?: string;
  readonly reasons?: {reason: string}[];
  readonly children?: {reason: string}[];
}
interface PerformanceNavigationTiming {
    readonly unloadEventStart: number;
    readonly unloadEventEnd: number;
    readonly domInteractive: number;
    readonly domContentLoadedEventStart: number;
    readonly domContentLoadedEventEnd: number;
    readonly domComplete: number;
    readonly loadEventStart: number;
    readonly loadEventEnd: number;
    readonly type: NavigationTimingType;
    readonly redirectCount: number;
    readonly criticalCHRestart: number;
    readonly NotRestoredReasons?  notRestoredReasons?: ;
}
```
