---
outline: deep
---

# 前端数据分析设计实战

前端业务中经常会遇到一些依赖用户侧的数据统计需求：

1. 统计页面停留时间，浏览次数等指标，对页面重要性进行分析
2. 统计用户点击热区、浏览路径等习惯，形成用户画像
3. 进行页面的 `Performance Monitor` `Crash Report` 等

这些指标基本只能通过前端处理上报后端。在成本有限，且数据业务耦合度不高的情况下，我们通常可以集成 [Google GA](https://developers.google.com/analytics) 等 `Data Analytics Services`，对相关的数据进行统计。但当出现业务耦合度高，场景复杂，且数据请求受限的时候，自建一个数据分析平台就显得尤为重要

## 数据统计通用设计

既然是数据统计，那么我们可以宽泛的认为，一切可以数据化的，都可以作为内容进行上报

> 内容上报和统计在端侧的行为，也就是我们常说的 “埋点”

对于任何数据来说，重中之重都是数据格式设计

这里我们参考 [google GA](https://support.google.com/analytics/answer/9322688?hl=zh-Hans&ref_topic=12156336,12153943,2986333,&sjid=326724495408096462-AP&visit_id=638549648638940913-1084391665&rd=1#zippy=%2C实时报告%2Cdebugview-报告)，google分析将行为区分为不同的事件，通过事件驱动，转化为数据统计

例如 `page_view` 事件，[官方描述](https://support.google.com/analytics/answer/9216061?sjid=326724495408096462-AP) 为：

> 该事件会填充[查看次数](https://support.google.com/analytics/table/13948007?sjid=326724495408096462-AP&visit_id=638549648638940913-1084391665&rd=2#page-screen-metrics)指标。相关参数会填充以下维度：
>
> - 网页位置（page_location）
> - 网页引荐来源网址（ page_referrer）

根据这些信息我们可以总结出事件驱动的数据统计的三要素：

- 事件唯一标识符 id - 标识数据来源
- 指标 dimensions - 描述数据的属性，它们通常是文本或字符串。维度提供了对数据的分类和分组
- 维度 metrics - 对数据的数量或度量，它们通常是数字。指标表示了某些维度的量化值

在实际的报告使用中，通常会将 维度 和 指标 两者结合起来。下图就展示了两个城市（维度）所对应的绘画数量（指标）

| 城市     | 会话数量 |
| -------- | -------- |
| New York | 50       |
| 北京     | 1000     |

因此，前端侧的数据统计也大致参考google GA的做法，根据事件驱动，不同的事件填充不同的指标，统计不同的维度

事件和指标、事件和维度之间可能是多对多的关系，需要根据业务及事件类型具体确定

### 事件类型

根据事件触发类型可以简单的将事件划分为 **自动收集的事件** 以及 **自定义事件** 两种。事件类型及统计目标共同决定了数据的统计方式

以 `页面浏览量 page_view` 为例，这是典型的 `自动收集型事件`。`自动收集型事件` 理论上不需要额外编写代码就可以自动收集。当产生页面访问的时候，事件自动触发，填充对应的指标以及维度。

需要注意的是，不同的事件无关类型，都会有一套自己的实现逻辑。对于 `自动收集型事件` 来说，不同的实现逻辑同时也会决定事件的上报时机。

- `page_view` 事件可以通过通过拦截 `popState`, `pushState`, `replaceState` 事件以及注册 `load` `hashchange`事件实现监听
- `form_submit` 事件可以通过拦截 `onsubmit` 事件进行监听
- `file_download` 事件可以通过拦截 `XMLHttpRequest` 方法进行监听

还是以 `page_view`  事件为例，我们可以通过如下方法实现一个简易版本的页面浏览事件

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

对于 `page_view` 事件来说，之所以需要额外拦截 `pushState` `replaceState` `popState` 主要是为了兼顾现代浏览器应用的导航方式

远古时代网页通常是通过修改 `location.href` 直接进行页面的切换，这种方式仅会触发 `load` 事件，当直接使用 `window.hash = '#/xxx'` 的时候，又仅会触发 `hashchange` 事件

到了现代业务开发的时候，通常是建立在 `vue` `react` 等框架之上的，那么难免会引入 `vue-router` `react-router`。即便是自己开发，当需要全局维护路由信息的时候，一般的选择也都是使用 `pushState` 等API实现数据管理

以 `vue-router` 为例，在 `2.8` 或 `3.0` 之后，无论是 `history mode` 还是 `hash mode`，当进行 `router.push`或 `router.replace`时都使用了 `pushState` `replaceState`  实现路由跳转（参考 `router.push` 没有触发 `hashchange` 事件 `issue` 中[尤雨溪的回答](https://github.com/vuejs/vue-router/issues/1807#issuecomment-336494269) 以及 `vue-router` [源码](https://github.com/vuejs/router/blob/0cb5797/packages/router/src/router.ts)），而 `pushState` 和 `replaceState` 将不会触发 `hashchange` 事件

在实际的业务中，情况会更加复杂。例如在添加了路由守卫/重定向后，`replaceState` 和 `load` 可能会同时触发，或者 `popState` 和 `pushState` 重复发送请求等问题，因此示例代码仅作为展示模式，具体的代码设计需要考虑多种情况

### 维度及指标设计

一般而言，基础的统计 `维度 dimensions` 和 `指标 metrics` 在设计之初就会固定。例如 [Google GA](https://support.google.com/analytics/table/13948007) 就设计了大量的基础指标和维度以供分析

进行业务向的数据统计时，由于平台（大部分为网页端）以及关注点（大部分为业务行为）的倾向性，指标通常有限，也不需要这么通用的维度，但有一些基础的维度是网页活动中一定会关心的

#### 指标设计

指标通常与业务息息相关，例如 `page_view` 事件通常会自动填充 `页面浏览量` 指标，而 `form_submit` 事件，则可以根据 `form_id` 的不同，填充 `列表查询 list_query` 或是 `信息补充 info_complete`等指标；`file_download` 也可以通过方法自定义的方式，填充诸如 `附件下载 attachment_download` `表格导出 table_export` 等指标

指标设计具有很强的灵活性，需要根据业务统计内容进行具体的设计

#### 维度表

| 维度     | 描述                                                         | 示例                                                         | 限制长度 |
| -------- | ------------------------------------------------------------ | ------------------------------------------------------------ | -------- |
| url      | 页面路径，去除查询参数的 location.href                       | <https://www.baidu.com>                                        | 420      |
| title    | 页面标题                                                     | 百度                                                         | 300      |
| referrer | 页面来源 （根据事件自定义或document.referrer)                | <https://www.baidu.com>                                        | 420      |
| trigger  | 统计触发方式                                                 | auto \| click \| hover                                       | 10       |
| platform | 浏览器类型browser;手机品牌brand;浏览器渲染引擎engine;系统类型os;是否为移动端口isMobile | \{browser: \"chrome\",engine:\"blink\",brand:\"other\",os:\"windows\",isMobile:false\} | 100      |
| viewport | 页面分辨率                                                   | 1920*1080                                                    | 20       |

*通用维度表 general dimensions*

针对具体的业务，还需要设计出对应的维度表

| 维度           | 描述       | 示例                              | 限制长度 |
| -------------- | ---------- | --------------------------------- | -------- |
| file_name      | 文件名     | 附件一                            | 300      |
| file_extension | 文件扩展名 | pdf \| excel \| word \| mp4  etc. | 10       |
| link_url       | 下载链接   | <https://file-download.server.com>  | 420      |

*文件下载业务维度表  file_download dimensions*

| 维度       | 描述     | 示例                           | 限制长度 |
| ---------- | -------- | ------------------------------ | -------- |
| form_id    | 表格名称 | user_investigation             | 100      |
| form_name  | 表格名称 | 用户问卷                       | 100      |
| form_url   | 提交链接 | <https://form-submit.server.com> | 420      |
| form_query | 提交参数 | string \| stringiified object  | **1000** |

*表单提交业务维度表  form_submit dimensions*

#### 维度限制

通常来说，维度和指标都会有对应的限制，尽管服务端不同，限制也会有所不同

比如 google GA 中关于[自动收集的事件](https://support.google.com/analytics/answer/9234069)就有所规定

> 默认情况下，系统会收集每个事件（包括[自定义事件](https://support.google.com/analytics/answer/12229021)）的以下参数：
>
> - *language*
> - *page_location*
> - *page_referrer*
> - *page_title*
> - *screen_resolution*
>
> 事件参数的赋值不得超过 100 个字符。page_title 参数的赋值不得超过 300 个字符。page_referrer 参数的赋值不得超过 420 个字符。page_location 参数的赋值不得超过 1,000 个字符。

因此最好在内部实现的公共方法 `sendAnalytics` 中，对相关维度做好限制和相关容错，具体的统计事件在发送之前也应在内部做好长度限制

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

这样的 **具体问题具体分析** 将贯穿整个数据统计的设计过程中，从 `唯一标识符 event_id` 的命名，到 `维度dimensions`  和 `指标 metrics` 统计，对每一个事件都需要做出细节的分析和设计

类似的，前端性能监控平台，其实也是一种数据统计。因此我们也可以用类似的方式进行前端性能监控设计

### 关于请求

以往埋点通常使用 `xhr` 的方式，以通用的发送请求的方式进行埋点。但 `xhr` 是异步发起的，因此用户可能在埋点请求发起前就关闭页面。这时未完成的请求将不再发送

更合理的方式，是通过  [sendBeacon API]([Navigator: sendBeacon() method - Web APIs | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon)) 发送请求，该API就是设计用以发送统计信息的。但 `sendBeacon` 对服务器有一定要求：

1. `method` 必须为 `POST`
2. 当传递 `application/json` 数据时，前端需要额外的处理，并且要求服务端能够配合处理

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

当 `sendBeacon` 不可用时，也可以用 `fetch` 的 [keepalive属性]([fetch() global function - Web APIs | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/API/fetch#keepalive)) 进行模拟

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

## 设计融合

有了通用事件，下面根据数据分析的三要素，就可以通过具体的后端服务，保存对应的要素

假设有如下接口，请求为 `post` ，接收参数格式如下，并且有相应限制

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

通过分析，我们发现接口是满足通用数据分析的三要素的，我们可以一一对应将其与我们之前提到的三要素进行融合

- id -> 事件标识符 event_id
- fields -> 指标 metrics
- tags -> 维度 dimensions

对应类型如下

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

需要注意的是，由于 `tags` 在服务端的限制，前端在设计具体事件的 `tags` 的时候，需要施加更多的限制避免服务端报错

比如 `form_submit` 事件的 `query` 维度，我们在统计的时候，就可能需要将 `query` 分割为多个字段传递
