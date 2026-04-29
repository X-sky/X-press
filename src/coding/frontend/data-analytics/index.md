---
outline: deep
title: "Frontend Data Analytics Design in Practice"
description: "General design for frontend data analytics, including event-driven architecture, dimensions and metrics design, and request strategies"
---

# Frontend Data Analytics Design in Practice

Frontend business often involves data collection requirements that depend on the user side:

1. Tracking page dwell time, visit counts, and other metrics to analyze page importance
2. Tracking user click heatmaps, browsing paths, and other habits to build user profiles
3. Performing `Performance Monitor`, `Crash Report`, etc.

These metrics can essentially only be collected and reported to the backend through the frontend. When costs are limited and data-business coupling is low, we can typically integrate `Data Analytics Services` like [Google GA](https://developers.google.com/analytics) to collect relevant data. However, when business coupling is high, scenarios are complex, and data requests are restricted, building a custom data analytics platform becomes particularly important.

## General Design for Data Analytics

Since we're dealing with data analytics, we can broadly consider that anything that can be quantified can be reported as content.

> Content reporting and analytics behavior on the client side is what we commonly call "event tracking" (or "burying points")

For any data, the most critical aspect is data format design.

Here we reference [Google GA](https://support.google.com/analytics/answer/9322688?hl=zh-Hans&ref_topic=12156336,12153943,2986333,&sjid=326724495408096462-AP&visit_id=638549648638940913-1084391665&rd=1#zippy=%2C实时报告%2Cdebugview-报告). Google Analytics distinguishes behaviors into different events, converting them into data analytics through event-driven approaches.

For example, the `page_view` event, [officially described](https://support.google.com/analytics/answer/9216061?sjid=326724495408096462-AP) as:

> This event populates the [Views](https://support.google.com/analytics/table/13948007?sjid=326724495408096462-AP&visit_id=638549648638940913-1084391665&rd=2#page-screen-metrics) metric. Related parameters populate the following dimensions:
>
> - Page location (page_location)
> - Page referrer (page_referrer)

From this information, we can summarize the three essential elements of event-driven data analytics:

- Event unique identifier (id) - identifies the data source
- Dimensions - describe data attributes, typically text or strings. Dimensions provide categorization and grouping of data
- Metrics - quantitative measurements of data, typically numbers. Metrics represent quantified values of certain dimensions

In actual report usage, dimensions and metrics are typically combined. The table below shows the session counts (metric) for two cities (dimension):

| City     | Session Count |
| -------- | ------------- |
| New York | 50            |
| Beijing  | 1000          |

Therefore, frontend data analytics roughly follows Google GA's approach: driven by events, different events populate different metrics and track different dimensions.

The relationships between events and metrics, and between events and dimensions, can be many-to-many and need to be determined based on specific business and event types.

### Event Types

Events can be simply categorized into **automatically collected events** and **custom events** based on trigger type. The event type and analytics goal together determine the data collection method.

Taking `page_view` as an example, this is a typical `automatically collected event`. Automatically collected events theoretically don't require additional code to collect. When a page visit occurs, the event triggers automatically, populating the corresponding metrics and dimensions.

Note that different events, regardless of type, each have their own implementation logic. For automatically collected events, different implementation logic also determines the reporting timing.

- `page_view` events can be monitored by intercepting `popState`, `pushState`, `replaceState` events and registering `load` and `hashchange` event listeners
- `form_submit` events can be monitored by intercepting the `onsubmit` event
- `file_download` events can be monitored by intercepting `XMLHttpRequest` methods

Still using the `page_view` event as an example, we can implement a simple version of the page view event as follows:

```javascript
function pageViewRegister(){
    const triggerReport = () => {/*send analytics*/};
    // 替换pushState事件
    const { pushState } = window.history;
    window.pushState = (...args) => {
        triggerReport();
        return pushState.apply(window.history, args);
    }
    // 注册hashchange事件
    window.addEventListener("hashchange", (e) => {
        // 可以通过e获取旧的地址，修改referrer
        const { oldURL } = e;
        triggerReport();
    })
    // 注册load事件
    window.addEventListener("load", () => {
        triggerReport();
    })
}

```

For the `page_view` event, the reason we need to additionally intercept `pushState`, `replaceState`, and `popState` is mainly to accommodate modern browser application navigation methods.

In the early days, web pages typically switched pages by modifying `location.href`, which only triggers the `load` event. When using `window.hash = '#/xxx'` directly, only the `hashchange` event is triggered.

In modern business development, applications are typically built on frameworks like `vue` and `react`, which inevitably introduce `vue-router` or `react-router`. Even with custom development, when global route information management is needed, the common choice is to use `pushState` and similar APIs for data management.

Taking `vue-router` as an example, after version `2.8` or `3.0`, both `history mode` and `hash mode` use `pushState` and `replaceState` for route navigation when performing `router.push` or `router.replace` (see [Evan You's response](https://github.com/vuejs/vue-router/issues/1807#issuecomment-336494269) in the `router.push` not triggering `hashchange` event issue, and the `vue-router` [source code](https://github.com/vuejs/router/blob/0cb5797/packages/router/src/router.ts)). `pushState` and `replaceState` will not trigger the `hashchange` event.

In real business scenarios, things get more complex. For example, after adding route guards/redirects, `replaceState` and `load` may trigger simultaneously, or `popState` and `pushState` may send duplicate requests. Therefore, the example code is for demonstration only — actual code design needs to account for multiple scenarios.

### Dimensions and Metrics Design

Generally speaking, basic `dimensions` and `metrics` are fixed at the design stage. For example, [Google GA](https://support.google.com/analytics/table/13948007) has designed a large number of basic metrics and dimensions for analysis.

When conducting business-oriented data analytics, due to platform tendencies (mostly web) and focus areas (mostly business behavior), metrics are usually limited and don't require such universal dimensions. However, some basic dimensions are always relevant in web activities.

#### Metrics Design

Metrics are usually closely tied to business. For example, the `page_view` event typically auto-populates the `page views` metric, while the `form_submit` event can populate metrics like `list_query` or `info_complete` based on different `form_id` values. `file_download` can also populate metrics like `attachment_download` or `table_export` through custom methods.

Metrics design is highly flexible and needs to be specifically designed based on business analytics content.

#### Dimensions Table

| Dimension | Description                                                  | Example                                                      | Max Length |
| --------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ---------- |
| url       | Page path, location.href without query parameters            | <https://www.baidu.com>                                        | 420        |
| title     | Page title                                                   | Baidu                                                        | 300        |
| referrer  | Page source (custom per event or document.referrer)          | <https://www.baidu.com>                                        | 420        |
| trigger   | Analytics trigger method                                     | auto \| click \| hover                                       | 10         |
| platform  | Browser type; phone brand; rendering engine; OS type; isMobile | \{browser: \"chrome\",engine:\"blink\",brand:\"other\",os:\"windows\",isMobile:false\} | 100        |
| viewport  | Page resolution                                              | 1920*1080                                                    | 20         |

*General dimensions table*

For specific business needs, corresponding dimension tables also need to be designed:

| Dimension      | Description    | Example                           | Max Length |
| -------------- | -------------- | --------------------------------- | ---------- |
| file_name      | File name      | Attachment 1                      | 300        |
| file_extension | File extension | pdf \| excel \| word \| mp4  etc. | 10         |
| link_url       | Download link  | <https://file-download.server.com>  | 420        |

*File download business dimensions table (file_download dimensions)*

| Dimension  | Description      | Example                        | Max Length |
| ---------- | ---------------- | ------------------------------ | ---------- |
| form_id    | Form identifier  | user_investigation             | 100        |
| form_name  | Form name        | User Survey                    | 100        |
| form_url   | Submit URL       | <https://form-submit.server.com> | 420        |
| form_query | Submit parameters| string \| stringiified object  | **1000**   |

*Form submit business dimensions table (form_submit dimensions)*

#### Dimension Limits

Generally speaking, both dimensions and metrics have corresponding limits, though limits vary across different server implementations.

For example, Google GA has specific rules for [automatically collected events](https://support.google.com/analytics/answer/9234069):

> By default, the system collects the following parameters for each event (including [custom events](https://support.google.com/analytics/answer/12229021)):
>
> - *language*
> - *page_location*
> - *page_referrer*
> - *page_title*
> - *screen_resolution*
>
> Event parameter values must not exceed 100 characters. The page_title parameter value must not exceed 300 characters. The page_referrer parameter value must not exceed 420 characters. The page_location parameter value must not exceed 1,000 characters.

Therefore, it's best to implement limits and error handling for relevant dimensions in the internal `sendAnalytics` method. Specific analytics events should also enforce length limits internally before sending.

```typescript
// 内部维度限制处理事件
/** 单个事件最多维度限制 */
const MAX_DIMENSIONS_KEY_NUM = 20;
/** 最长维度key限制 */
const MAX_DIMENSIONS_KEY_LEN = 100;
/** 自定义最长维度值限制 */
const MAX_DIMENSIONS_LEN_MAP: Record<string, number> = {
    url: 420,
    title: 300,
    referrer: 420,
    trigger: 10,
    platform: 100,
    viewport: 20
};
/** 默认最长维度值限制 */
const MAX_DEMENSIONS_LEN_DEFAULT = 100;
/** 预处理维度数据 */
function processAnalyticDimensions(dimensions: Record<string, string>): Record<string, string>{
    return Object.getownPropertyNames(dimensions)
    // 筛选key合规的维度
        .filter(k => k.length <= MAX_DIMENSIONS_KEY_LEN)
    // 限制全部维度数量
        .slice(0, MAX_DIMENSIONS_KEY_NUM)
        .reduce((acc, k) => {
        const v = dimensions[k];
         if (v.length <= MAX_DIMENSIONS_LEN_MAP[k] || MAX_DEMENSIONS_LEN_DEFAULT) {
                // 限制值合规
                acc[k] = v;
         }
       return acc;   
     }, {} as Record<string, string>)
}
```

This **case-by-case analysis** approach runs throughout the entire data analytics design process — from naming the `event_id`, to `dimensions` and `metrics` analytics, each event requires detailed analysis and design.

Similarly, a frontend performance monitoring platform is essentially a form of data analytics. Therefore, we can use a similar approach for frontend performance monitoring design.

### About Requests

Traditionally, event tracking used `xhr` to send tracking data through standard request methods. However, `xhr` is asynchronous, so users might close the page before the tracking request is sent. In that case, incomplete requests will no longer be sent.

A more reasonable approach is to use the [sendBeacon API]([Navigator: sendBeacon() method - Web APIs | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon)) to send requests. This API is specifically designed for sending analytics data. However, `sendBeacon` has certain server requirements:

1. The `method` must be `POST`
2. When sending `application/json` data, the frontend needs additional handling, and the server must be able to process it accordingly

```javascript
// 用blob模拟json发送数据对象
const data = {
    event: 'pageUnload',
    userId: '12345',
    details: {
        action: 'click',
        label: 'signOutButton'
    }
};

// 将数据对象转换为 JSON 字符串
const jsonData = JSON.stringify(data);

// 创建一个 Blob 对象并指定 MIME 类型
const blob = new Blob([jsonData], { type: 'application/json' });

// 发送数据到服务器
const url = 'https://your-server-endpoint.com/log';
navigator.sendBeacon(url, blob);

```

When `sendBeacon` is unavailable, you can also use the [keepalive property]([fetch() global function - Web APIs | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/API/fetch#keepalive)) of `fetch` as a fallback:

```javascript
// fetch + keepAlive 发送json数据对象
const data = {
    event: 'pageUnload',
    userId: '12345',
    details: {
        action: 'click',
        label: 'signOutButton'
    }
};

// 将数据对象转换为 JSON 字符串
const jsonData = JSON.stringify(data);

// 发送数据到服务器的 URL
const url = 'https://your-server-endpoint.com/log';

// 定义 fetch 请求的配置
const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: jsonData,
    keepalive: true // 这在页面卸载时很重要
};

// 发送数据
fetch(url, options).catch(err => console.error('Fetch failed: ', err));

```

## Design Integration

With generic events in place, we can now save the corresponding elements through specific backend services based on the three essential elements of data analytics.

Suppose we have the following API endpoint, with `POST` method, accepting parameters in the following format with corresponding constraints:

```typescript
/** 服务端接收数据 */
interface ServerAnalyticsInfo {
    /** 统计id */
    id: string;
    /** 需统计字段 */
    fields: Array<{name: string; value: number}>;
    /** 
     * 统计标签
     * @rules tags值不为空且长度不超过200
     * @rules key长度不超过20
     * @rules tags数量不超过20
     */
    tags: Record<string, string>;
}
```

Through analysis, we find that the API satisfies the three essential elements of general data analytics. We can map them one-to-one with the three elements we mentioned earlier:

- id -> Event identifier (event_id)
- fields -> Metrics
- tags -> Dimensions

The corresponding types are:

```typescript
/** 统计field数据  */
interface AnalyticsFieldInfo {
    /** field名称 */
    name: string;
    /** 对应值 */
    value: number;
}
/** 
 * 通用维度设计
 * @description 与通用维度表 general dimensions字段基本保持一致，将viewport合并入platform以节约一个字段
 */
interface AnalyticsBaseTag extends Record<string, string> {
    url: string;
    title: string;
    referrer: string;
    trigger: "auto" | "hover" | "click" | "keyboard";
    platform: string;
}
interface AnalyticsInfo {
    id: string;
    fields: AnalyticsFieldInfo[];
    tags: AnalyticsBaseTag;
}
```

Note that due to server-side constraints on `tags`, the frontend needs to impose additional limits when designing `tags` for specific events to avoid server errors.

For example, the `query` dimension of the `form_submit` event may need to be split into multiple fields for transmission during analytics collection.
