# 有限状态机

有限状态机是一种用来进行对象行为建模的工具，其作用主要是描述对象在它的生命周期内所经历的状态序列，以及如何响应来自外界的各种事件。在计算机科学中，有限状态机被广泛用于建模应用行为、硬件电路系统设计、软件工程，编译器、网络协议、和计算与语言的研究。比如下图非常有名的TCP协议状态机。

一个完整的有限状态机包含五个部分：

- 有限数量的**状态**（state）
- 有限数量的**事件**（event）
- 一个**初始状态**（initial state）
- 一个**转换函数**（transition function），传入当前状态和事件返回下一个状态
- 具有零个或多个**最终状态**（final state）

其实我们日常使用的 `promise` 就是典型的有限状态机。

- 有限数量的**状态**（`pending`，`fulfilled`，`rejected`）
- 有限数量的**事件**（`resolve`，`reject`）
- 一个**初始状态**（`pending`）
- 一个**转换函数**（`executor`）
- 具有零个或多个**最终状态**（`fulfilled`，`rejected`）

日常生活中，也有许多这样的例子，比如红绿灯，在某一时刻只可能是其中的一个状态（红灯，黄灯，绿灯），并且颜色改变的事件是固定的。（**红 -> 黄，黄 -> 绿，绿 -> 红**）

类似下面的代码：

```js
const light = {
  currentState: 'red',

  transition() {
    switch (this.currentState) {
      case 'red':
        return (this.currentState = 'green');
      case 'green':
        return (this.currentState = 'yellow');
      case 'yellow':
        return (this.currentState = 'red');
      default:
        return;
    }
  },
};
```

使用有限状态机对状态进行管理能够实现低耦合的代码，能够有效避免重复点击、重复请求等情况，不仅能够轻松、快速、安全地修改状态流转场景，还非常有利于单元测试，提升开发幸福感。

## XState

下面介绍一款相关的框架：

`XState` 是一个服务于现代前端应用的基于 JavaScript 和 TypeScript 的有限状态机和状态图框架。

`XState` 的功能非常强大，官方还提供了[可视化工具](https://xstate.js.org/viz/)，用于预览状态机以及查看状态流转。

我们首先安装 `XState`

```
npm install xstate
或者
yarn add xstate
```

### 用 XState 写 promise

既然 `Promise` 是一个有限状态机，那么使用 `XState` 也能实现一个相似的效果。

首先我们需要定义 `Promise` 的所有状态（`pending`，`fulfilled`，`rejected`）以及设置初始状态为 `pending`：

```js
import {Machine} from 'xstate';

const promiseMachine = Machine({
  // SCXML id 必须唯一
  id: 'promise',
  // 初试状态
  initial: 'pending',
  states: {
    // 状态定义
    pending: {},
    fulfilled: {},
    rejected: {},
  },
});
```

其中 [`SCXML`](https://www.oschina.net/action/GoToLink?url=https%3A%2F%2Fwww.w3.org%2FTR%2Fscxml) 是状态图可扩展标记语言， `XState` 遵循该标准，所以需要提供 `id`。当前状态机也可以转换为 `JSON` 或 `SCXML`。

然后我们需要定义状态流转的事件（`RESOLVE`，`REJECT`），同时根据 `Promise` 的定义，将 `fulfilled` 和 `rejected` 的两个状态标记为最终状态，让状态流转到这两个状态时终止状态流转：

```js
import {Machine} from 'xstate';

const promiseMachine = Machine({
  // SCXML id 必须唯一
  id: 'promise',
  // 初试状态
  initial: 'pending',
  states: {
    // 状态定义
    pending: {
      on: {
        // resolve 事件
        RESOLVE: 'fulfilled',
        // reject 事件
        REJECT: 'rejected'
      }
    },
    fulfilled: {
      type: 'final'
    },
    rejected: {
      type: 'final'
    }
  }
});
```

现在，我们已经定义好了一个类似 `Promise` 的有限状态机，但是这样我们每次在做状态流转的时候，都需要向 `promiseMachine.transition` 函数传入当前状态和状态流转事件的名称：

```js
const state0 = promiseMachine.initialState;
console.log(state0); // 'pending'
const state1 = promiseMachine.transition(state0, 'RESOLVE');
console.log(state1); // 'fulfilled'
```

至于 `transition` 函数为什么需要传入当前的状态和状态流转事件，是因为 `transition` 需要是一个纯函数，它不能更改 `promiseMachine` 的状态，造成不必要的副作用，方便单元测试。

事实上我们在开发的过程中如果每个状态都要我们自己保存并传入 `transition` 函数来进行状态流转是非常麻烦的，所以 `XState` 提供了 `interpret` 函数，可以将一个状态机的实例解释为一个带有状态的 `Service`：

```js
import {Machine, interpret} from 'xstate';

const promiseMachine = Machine({
  // ...
});

const promiseService = interpret(promiseMachine)
	// transition 钩子 状态流转时触发
	.onTransition((state) => {
 		// 打印状态流转后的状态
  	console.log(state.value)
});

// 启动状态机
promiseService.start();
// 'pending'

promiseService.send('RESOLVE');
// 'fulfilled'
```

### `XState` 实现红绿灯

```js
import {Machine, interpret} from 'xstate';

const lightMachine = Machine({
  id: 'light',
  initial: 'red',
  states: {
    red: {
      on: {
        TRANS: 'green',
      },
    },
    green: {
      on: {
        TRANS: 'yellow',
      },
    },
    yellow: {
      on: {
        TRANS: 'red',
      },
    },
  },
});

const lightService = interpret(lightMachine).onTransition((state) => {
  console.log(state.value);
});

// 启动状态机 初始化
lightService.start();

// 发送事件
lightService.send('TRANS'); // 'green'
lightService.send('TRANS'); // 'yellow'
lightService.send('TRANS'); // 'red'

// 批量发送事件
lightService.send(['TRANS', 'TRANS']);

// 终止状态机
lightService.stop();

```

除此之外，`XState` 还提供了与 `React`、`Vue`、`Svelte` 等现代前端框架结合的一些方法：

```js
import React from 'react';
import {useMachine} from '@xstate/react';
import lightMachine from './lightMachine';

export default function App() {
  const [state, send] = useMachine(lightMachine);

  const onClick = () => {
    send('TRANS');
  };

  return (
    <>
      <div
        style={{
          width: '50px',
          height: '50px',
          background: state.value,
          borderRadius: '100%',
        }}
      />
      <button onClick={onClick}>click</button>
    </>
  );
}

```

```js
<template>
  <div class="light" :style="`background: ${state.value};`"></div>
  <button @click="onClick">click</button>
</template>

<script>
import {defineComponent} from 'vue';
import {useMachine} from '@xstate/vue';
import lightMachine from './lightMachine';

export default defineComponent({
  name: 'App',

  setup() {
    const {state, send} = useMachine(lightMachine);

    const onClick = () => {
      send('TRANS');
    };

    return {
      state,
      onClick,
    };
  },
});
</script>

<style>
.light {
  width: 50px;
  height: 50px;
  border-radius: 100%;
}
</style>

```

```js
<script>
  import { useMachine } from "@xstate/svelte";
  import lightMachine from "./lightMachine";

  const { state, send } = useMachine(lightMachine);

  const onClick = () => {
    send("TRANS");
  };
</script>

<style>
  .light {
    width: 50px;
    height: 50px;
    border-radius: 100%;
  }
</style>

<main>
	<div class="light" style={`background: ${$state.value};`}></div>
  <button on:click={onClick}>click</button>
</main>

```

更加深入的内容就需要到[官方文档](https://xstate.js.org/docs/)中自行探索了！