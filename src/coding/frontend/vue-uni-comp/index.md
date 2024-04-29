---
outline: deep
---

# vue 通用组件库开发

## 开发背景

## 组件库开发

### vue 组件库原理

在开发组件库之前，我们需要先搞清楚两个问题：

1. 什么是组件
2. 什么是组件库

只有搞清楚这两个问题，我们才能知道自己要开发什么，自己在开发什么

#### 什么是组件

我们日常开发中最常接触的就是组件开发。但这里首先需要澄清一个概念：组件 ≠ SFC。根据 `vue` 官网的[定义](https://vuejs.org/guide/scaling-up/sfc.html)

> SFC 是一种特殊的文件格式，允许我们 Vue 组件的把模板、逻辑和样式聚合在一个文件中。Vue SFC 是一种框架特定(framework-specific)类型文件，因此必须被 `@vue/compiler-sfc` 预编译成标准的 javascript 和 css。

因此，SFC 只是 vue 组件的一种表现形式，jsx，h 函数无不如是。但 SFC 是一个帮助我们理解组件的很好的切口————它最终会被编译为标准的 javascript。一个编译后的 SFC 是标准的 ES 模块，`vue`官网也提供了 [SFC-playfround](https://play.vuejs.org/)，可以更直观的看到它们是如何被编译的。

于是我们的第一个问题【什么是组件？】就得到了很好的回答：

"Nothing magic, just javascript."

#### app.use 的时候发生了什么

当我们使用各种基于 `vue` 的插件/组件的时候，我们熟悉了这样的用法：

```typescript
// 摘自element-plus官网 https://element-plus.org/zh-CN/guide/quickstart.html
// main.ts
import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';

const app = createApp(App);

app.use(ElementPlus);
app.mount('#app');
```

或者是 `vue2` 版本的

```javascript
// 摘自element-ui官网 https://element.eleme.cn/2.0/#/zh-CN/component/installation
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';

Vue.use(ElementUI);

new Vue({
  el: '#app',
  render: (h) => h(App)
});
```

那么 `.use()` 到底做了哪些事情？查阅 [vue2 版本的`.use`api](https://v2.vuejs.org/v2/api/#Vue-use) 以及 [vue3 版本的`.use`api](https://vuejs.org/api/application.html#app-use)，我们不难理解，神奇的 `.use` 归根到底只做了一件事：安装插件(Plugins)

`.use` 接收一个为 带有 `install` 方法的 `Object`，或者是作为 `install` 方法本身的 `Function`。而 `install` 方法接收两个参数：应用实例`App` 和 插件选项`Options`。在 `vue2`中，第一个参数是全局 `Vue` 对象

以 `vue3` 为例，我们可以在 [runtime-core 源码](https://github.com/vuejs/core/blob/638a79f64a7e184f2a2c65e21d764703f4bda561/packages/runtime-core/src/apiCreateApp.ts#L158) 中找到对应的类型定义

```ts
type PluginInstallFunction<Options = any[]> = Options extends unknown[]
  ? (app: App, ...options: Options) => any
  : (app: App, options: Options) => any;
```

所以当我们在说“`vue` 组件库开发”的时候，这种说法或许太过特化。更通用的说法应该是：vue 插件开发。

至此，最开始提出的第一个问题我们已经得到了解答：**组件库是一种 `vue` 插件**

#### 常用打包工具

- webpack
- rollup
- esbuild

选择：

-- 关于模块化

```javascript
// exportLib.js 导出
const foo = () => {};
export { foo };
// 使用
import { foo } from 'exportLib.js';
foo();
// 使用2
import * as exportLib from 'exportLib.js';
exportLib.foo();
```

```javascript
// 导出
const foo = () => {};
export { foo };
export default {
  foo
};
// 使用
import exportLib, { foo } from 'exportLib.js';
exportLib.foo === foo; // true
```

tree-shaking 机制?

如果是第一种方式，在 import 引入的时候会显得有些啰嗦；但如果是第二种导出方式，在进行 cdn 或者 umd 方式导出的时候，如果我们要使用整体对象，就必须使用 `.default` 的方式获取默认导出

```html
<script src="./exportLib.iife.js"></script>
<script>
  __GLOBAL_EXPORT_LIB__.default.foo();
  __GLOBAL_EXPORT_LIB__.foo();
</script>
```

因此我们在第一种导出方式的基础上进行优化

```javascript
// exportLib.js 导出
const foo = () => {};
const defaultExport = {
  foo
};
export { defaultExport as default, foo };
// 使用
import exportLib, { foo } from 'exportLib.js';
foo();
```

当然这样在 `import * as exportLib from ‘exportLib.js’` 的时候就会出现 default 了。没有全部兼顾的方法，只能根据使用场景具体优化

#### 关于 vue-demi

### 方案决策

[Adapter or Container？](https://juejin.cn/post/7243413934765916219#heading-6)

#### 关于创建服务式组件

vue2 和 vue3 的 render 模式不同。`vue3` 每一个组件都有对应的 appContext，可以通过 [customRender](https://vuejs.org/api/custom-renderer.html#createrenderer) 创建自定义渲染。`element-plus` 中的 [MessageBox](https://github.com/element-plus/element-plus/blob/dev/packages/components/message-box/src/messageBox.ts) 就是使用了对应的方式，利用 `render` 函数实现 api 调用时，挂载组件。(`render` 就是 `vue` 内部利用 `createRenderer`创建的函数)。

但是 `vue2` 单实例的模式决定了 `vue2` 不会有所谓的 `appContext`，也不会有 `render` 这样的 api。因此只能通过 `Vue.extend(comp)` 的方式创建新的实例。因此我们的 `util` 中的 `useComponentService` 函数就不得不使用 `vue-demi` 的 `isVue2` 字段进行判断，造成输出代码的冗余。

### 仓库结构

> 关于`monorepo`

#### 多版本模板编译支持

由于 `vue-demi` 只是对 `vue` 版本做了转发，因此如果是纯 js 库开发(例如 `@vueuse/core`)之类的库，不必关心模板解析器冲突的问题。而开发组件库则必须关注这个问题。因为不同版本的 `vue` 使用了不同版本的模板编译：

- vue3.x: @vue/compiler-sfc
- vue2.7.x: vue/compiler-sfc
- vue2.x: vue-template-compiler

可以预见的是，即使使用`render`函数，我们也无法绕开版本问题。因此不如将这个问题提前到编译阶段解决。借助 `pnpm` 的 `monorepo` 模式，我们可以分别创建三个不同的 `vue` 仓库，利用各自不同的 `package.json` `vite.config.ts` 配置，编译多个版本的 `vue` 组件产物。

- containers/v2 -> @vue-uni-ui/v2
- containers/v2.7 -> @vue-uni-ui/v2.7
- containers/v3 -> @vue-uni-ui/v3

通过在 `vite.config.ts` 中配置 `resolve.alias` ，手动将 `vue` 以及 `vue-demi` 版本映射到对应的仓库内，例如`containers/v3`中的`vite.config.ts`需要配置的 alias 如下：

```js
export default {
  resolve: {
    alias: {
      vue: resolve(
        __dirname,
        'node_modules/vue3/dist/vue.runtime.esm-browser.js'
      ),
      'vue-demi': resolve(ROOT_DIR, 'node_modules/vue-demi/lib/v3/index.mjs')
    }
  }
};
```

理论上这样我们就暂时实现了不同的容器隔离。

但是实际上这里有一个潜在的问题，那就是 `vue-template-compiler` 的 `vue` 依赖是没有显性的规定在 `peerDependencies` 中的。因为 `vue` 的版本需要与 `vue-template-compiler` 的版本 **完全一致**，因此 `vue-template-compiler` 只是在其 `index.js` 的头部做了一次检测:

```js
try {
  var vueVersion = require('vue').version;
} catch (e) {}

var packageName = require('./package.json').name;
var packageVersion = require('./package.json').version;
if (vueVersion && vueVersion !== packageVersion) {
  var vuePath = require.resolve('vue');
  var packagePath = require.resolve('./package.json');
  throw new Error(
    '\n\nVue packages version mismatch:\n\n' +
      '- vue@' +
      vueVersion +
      ' (' +
      vuePath +
      ')\n' +
      '- ' +
      packageName +
      '@' +
      packageVersion +
      ' (' +
      packagePath +
      ')\n\n' +
      'This may cause things to work incorrectly. Make sure to use the same version for both.\n' +
      'If you are using vue-loader@>=10.0, simply update vue-template-compiler.\n' +
      'If you are using vue-loader@<10.0 or vueify, re-installing vue-loader/vueify should bump ' +
      packageName +
      ' to the latest.\n'
  );
}
```

这就导致我们如果在安装了多个 `vue` 仓库，那么 `vue-template-compiler` 实际引用的 `vue` 包将是不可控的。以 `pnpm` 为例，由于 `vue-template-compiler` 内部没有相关依赖声明，因此 `pnpm-lock.yaml` 也就没有相关的依赖绑定，则 `require('vue')` 完全依赖于 `.pnpm` 仓库内的 vue 版本。我的测试结果是 windows 下基本会报错，而 mac 下则不会报错。但开发环境不能依靠运气，这时候可以用 `pnpm` 提供的一个设置项 [pnpm.packageExtensions](https://pnpm.io/package_json#pnpmpackageextensions) 强制设置依赖。在根目录的 `package.json` 下添加如图所示的代码，给 `vue-template-compiler` 添加依赖项

```json
"pnpm": {
  "packageExtensions": {
    "vue-template-compiler": {
      "peerDependencies": {
        "vue": "~2.6.14"
      }
    }
  }
}
```

注：这里的 `~2.6.14` 需要与 `containers/v2` 中的`vue-template-compiler` 版本一致

同时，我们修改 `path.ts` 中的相关 `VUE_LIB` 代码，将 `alias` 映射为 `containers` 内部的 `vue`，将 `vue-demi` 直接映射为对应 `vue-demi/lib` 内部的 `index.mjs`。这样我们就实现了依赖的完全解耦。根目录的 `vue` 仅负责 `@vue-uni-components` 相关仓库的开发，而 `dev` 以及 `build` 则由 `containers` 的内部依赖负责。

#### style 支持

通过在不同容器内部编译对应的模板，我们已经可以实现通过对应的 compiler 编译 `style` 文件。通常设计组件库样式时需要的问题有两个：

1. 如何设计统一的样式，以：
1. 方便组件间的样式共享
1. 保证组件的样式不受外部环境 css-reset 的影响
1. 如何设计结构，使得用户可以自定义样式

目前市面上主流的组件库样式设计都会影响到全局。比如:

- `Vuetify` 中的 [\_reset.scss](https://github.com/vuetifyjs/vuetify/blob/master/packages/vuetify/src/styles/generic/_reset.scss)
- `element-plus` 中的 [reset.scss](https://github.com/element-plus/element-plus/blob/dev/packages/theme-chalk/src/reset.scss)
- `arco-design` 中的 [normalize.less](https://github.com/arco-design/arco-design-vue/blob/main/packages/web-vue/components/style/normalize.less) 而且这些组件库都全局使用，且可能与其他组件库互斥。而 `vuetify` 通过提供对应的 scss 变量以供手动关闭 reset。

但按照当前所要实现的 `vue`通用组件库的使用场景，很可能是无法使用全局`reset-css`的，因此同样需要考虑提供配置项，在使用阶段判断是否需要重置。

另外，上述几个库都使用了 css 变量进行组件样式的统一，在使用阶段也使用 css 变量进行自定义主题设置。

- `Vuetify`
- [arco-design](https://arco.design/react/docs/theme)

但是有几个缺点：

1. 无法与 js 结合。如果 UI 涉及 `echarts` 等图标库的使用，则无法避免在 js 额外维护主题色变量
2. 覆写与重设涉及多个配置，较为复杂，其中 `Vuetify` 还有 `config` 和 `scss` 两套主题色需要维护
3. 如果不需要使用组件库，但是想要使用组件库的样式设计规范时（如调色板 palette, 文本规范 font 等），我们必须深入到 `node_modules` 或者**源码**内部了解各个 css 变量名

因此我们考虑一套流程

1. 开发时通过 js 定义 css 变量，组件内部使用变量名开发
2. 使用时，在 hook 初始化的时候进行 css 变量注册，同时暴露变量提供给诸如 `echarts` 等库使用。如果项目有 ts 支持，甚至可以提供变量名提示

#### typescript 类型提示

#### 注意

在进行代码结构划分的时候，理论上除了 `ui-component` 组件单独生成`package.json`以外，其余 repo 的`package.json`都应该与其 `repo` 内部的 `package.json` 保持一致。那么我们的 `package.json` 内部结构应该如这里所示

### 调试

#### 源码调试

`pnpm dev:3` `pnpm dev:27` `pnpm dev:2` 三个脚本可以同时执行。在各自的 `container` 内部，`resolve` 会将依赖解析为正确的地址。

注意：在编写测试用例以及开发的时候，部分语法由于 `vue2` 与 `vue3` 的解析不同，因此需要使用更为通用的写法。例如 **属性的双向绑定** 操作，在 `vue2` 中，模板语法糖为 `:visible.sync` ； 而在 `vue3` 中，语法糖则为 `v-model:visible`，因此需要使用通用写法：

```vue
<script>
import { ref } from 'vue-demi';
const visible = ref('false');
const updateVisible = (v) => {
  visible.value = v;
};
</script>
<template>
  <uni-dialog :visible="visible" @update:visible="updateVisible"> </uni-dialog>
</template>
```

如果每次都需要在 `container` 容器内部手写一个测试组件，那么加上 `cdn` 调试，我们会需要编写四次近似的组件。因此通过上述*通用写法*，我们可以考虑新增一个测试组件仓库 `@vue-uni-ui/components-test`。在仓库内编写测试组件，然后取消 `containers` 中每个容器对 `@vue-uni-ui/components` 的依赖，修改为对测试仓库的依赖，然后引用对应的测试组件即可。因此我们也需要补充脚本，在 `ui:create` 的时候，补充自动新增对应的测试组件模板，避免免手动创建的心智负担。

#### 产物调试

##### mjs

`link:local` 脚本。先在产物内部 link 对应的依赖，再全局 link 对应依赖。例如： `@vue-uni-ui/vue-2` 依赖于 `@vue-uni-ui/utils` 包，那么本地 `npm link` 调试的时候，

##### cdn

cdn 形式的产物调试则相对来说简单很多。在 `pnpm build` 之后执行 `pnpm dev:cdn` 即可。`pnpm dev:cdn` 命令会自动执行复制 `iife.js` `style.css` 等文件至对应文件夹的命令，并执行 `vite` 调试。通过注释 `cdn-playground/index.html` 文件中不同版本的 `vue` 及其对应的内容。进行多版本产物的调试。

⚠Attention 注意：cdn 模式调试下，自定义组件有两点注意事项，这两点同时也是 [html 标准的限制](https://v2.vuejs.org/v2/style-guide/#Self-closing-components-strongly-recommended)：

- 不能使用自闭合标签

```html
<!-- 可以，但只会渲染第一个自定义组件 -->
<uni-template />
<!-- 会无效 -->
<uni-dialog />
```

- 不能使用大驼峰形式组件

```html
<!-- html会默认转化组件名，等效于 unitemplate。由于我们的注册名为 UniTemplate，因此 UniTemplate 或 uni-template 都是可行的。而unitemplate无法匹配到 -->
<UniTemplate />
```

### 打包

本来是参考 `vue-demi` 进行打包。将三个版本的代码输出至同一个仓库进行发布，随后使用 `postinstall` 脚本进行切换。但是后来...

增加 `publish.ts` 脚本手动控制

### 自动版本更新

release 统一版本

bumpp

---- 关于版本管理

### 发布

## 组件库使用
