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

衡量 Web 性能有以下六个重要指标

1. Largest Contentful Paint (LCP)
2. Cumulative Layout Shift (CLS)
3. Interaction to Next Paint (INP)
4. Time to First Byte (TTFB)
5. First Contentful Paint (FCP)
6. Total Blocking Time (TBT)

而目前已经成为业界事实标准的是2020版本，主要从用户体验层面的三个方面衡量，即 `Core Web Vitals`：

1. 加载 loading - LCP
2. 交互性 interactivity - INP
3. 视觉稳定 visual stability - CLS

### 加载 Loading

#### LCP

> Largest Contentful Paint

### 交互性 interactivity

#### INP

> Interaction to Next Paint

### 视觉稳定 visual stability

#### CLS

> Cumulative Layout Shift

## 测量方式

### Navigation Timing - 2012

为了帮助开发者更好地衡量页面性能，`W3C` 在 2012 年提出了 [Navigation Timing](https://www.w3.org/TR/navigation-timing)

该标准提供了 `PerformanceTiming` `PerformanceNavigation` 接口，通过只读属性的方式，提供了完整的客户端延迟度量 （complete client-side latency measurements），具体内容可以查看 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceTiming) 或者 [W3C Recommendation](https://www.w3.org/TR/navigation-timing/#sec-navigation-timing-interface)

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

1. 页面卸载提示
2. 页面重定向 / 页面卸载
3. 读缓存
4. DNS寻址 -- 解析url
5. 建立TCP链接 -- 获取document
6. 发送请求
7. 收到回应
8. 处理document
9. onLoad事件

在不同的阶段中，用户代理 (User agents 多数情况下为 browsers)会将对应的时间点写入 `window.performance.timing` 和 `window.performance.navigation` 对象中，方便后续使用

![Navigation Timing 标准处理模型](./assets/process-model-navigation-timing.png)

*图片来源 <https://www.w3.org/TR/navigation-timing/#processing-model>*

::: warning

1. 当 `window` 对象创建后，`window.performance.timing` 和 `window.performance.navigation` 才能被写入
2. `window.performance.timing` 和 `window.performance.navigation` 可能被浏览器禁用，此时两者的值返回 `null`

:::

#### 内容

可以通过 `window.performance` 访问对应内容 `timing` 和 `navigation`。需要注意的是 `Navigation Timing` 特性已被标注为[废弃](https://w3c.github.io/navigation-timing/#obsolete)，并不推荐使用。但由于其良好的兼容性（Chrome 6），仍有了解的必要

::: details

```typescript
interface PerformanceTiming {
  navigationStart: number;
  unloadEventStart: number;
  unloadEventEnd: number;
  redirectStart: number;
  redirectEnd: number;
  fetchStart: number;
  domainLookupStart: number;
  domainLookupEnd: number;
  connectStart: number;
  connectEnd: number;
  secureConnectionStart: number;
  requestStart: number;
  responseStart: number;
  responseEnd: number;
  domLoading: number;
  domInteractive: number;
  domContentLoadedEventStart: number;
  domContentLoadedEventEnd: number;
  domComplete: number;
  loadEventStart: number;
  loadEventEnd: number;
}

interface Performance {
  timing: PerformanceTiming;
  navigation: PerformanceNavigation
}
interface Window {
  performance: Performance
}
```

:::

### Navigation Timing Level 2

<https://web.dev/learn/performance>

<https://web.dev/articles/vitals-tools>

<https://juejin.cn/post/7095180453090426894>

<https://juejin.cn/post/7097157902862909471#heading-9>
