# Redux

## Flux 架构

Flux 并不是一个具体的框架，它是一套由 Facebook 技术团队提出的应用架构，这套架构约束的是应用处理数据的模式。在 Flux 架构中，一个应用将被拆分为以下 4 个部分。

- **View**（视图层）：用户界面。该用户界面可以是以任何形式实现出来的，React 组件是一种形式，Vue、Angular 也完全 OK。Flux 架构与 React 之间并不存在耦合关系。

- **Action**（动作）：也可以理解为视图层发出的“消息”，它会触发应用状态的改变。

- **Dispatcher**（派发器）：它负责对 action 进行分发。

- **Store**（数据层）：它是存储应用状态的“仓库”，此外还会定义修改状态的逻辑。store 的变化最终会映射到 view 层上去。

<img :src="$withBase('/react/redux01.png')" alt="redux01">

一个典型的 Flux 工作流是这样的：用户与 View 之间产生交互，通过 View 发起一个 Action；Dispatcher 会把这个 Action 派发给 Store，通知 Store 进行相应的状态更新。Store 状态更新完成后，会进一步通知 View 去更新界面。

> 值得注意的是，图中所有的箭头都是单向的，这也正是 Flux 架构最核心的一个特点——单向数据流。

## Flux 解决的问题

要知道 Flux 解决了什么问题，首先来看看前端场景下的 MVC 架构，他可以有两种形式。

允许用户通过 View 层交互来触发流程：

<img :src="$withBase('/react/redux02.png')" alt="redux02">

允许用户通过直接触发 Controller 逻辑来触发流程：

<img :src="$withBase('/react/redux03.png')" alt="redux03">

在 MVC 应用中，会涉及这 3 个部分：

- Model（模型），程序需要操作的数据或信息；

- View（视图），用户界面；

- Controller（控制器），用于连接 View 和 Model，管理 Model 与 View 之间的逻辑。

用户操作 View 后，由 Controller 来处理逻辑（或者直接触发 Controller 的逻辑），经过 Controller 将改变应用到 Model 中，最终再反馈到 View 上。在这个过程中，数据流应该是单向的。

事实上，在许多服务端的 MVC 应用中，数据流确实能够保持单向。但是在前端场景下，实际的 MVC 应用要复杂不少，前端应用/框架往往出于交互的需要，允许 View 和 Model 直接通信。

<img :src="$withBase('/react/redux04.png')" alt="redux04">

这就允许了双向数据流的存在。当业务复杂度较高时，数据流会变得非常混乱。

或许一个小小的改动，就会对整个项目造成“蝴蝶效应”般的巨大影响。如此混乱的修改来源，将会使得我们连 Bug 排查都无从下手，因为你很难区分出一个数据的变化到底是由哪个 Controller 或者哪个 View 引发的。

Flux 最核心的地方在于**严格的单向数据流**，在单向数据流下，状态的变化是可预测的。如果 store 中的数据发生了变化，那么有且仅有一个原因，那就是由 Dispatcher 派发 Action 来触发的。

不妨结合 Flux 架构的特性，再去品味一遍 Redux 官方给出的这个定义：

> Redux 是 JavaScript 状态容器，它提供可预测的状态管理。

## Redux

Redux 主要由 3 部分组成：Store、Reducer 和 Action。

- Store：它是一个单一的数据源，而且是只读的。

- Action 人如其名，是“动作”的意思，它是对变化的描述。

- Reducer 是一个函数，它负责对变化进行分发和处理，最终将新的数据返回给 Store。

<img :src="$withBase('/react/redux05.png')" alt="redux05">

在 Redux 的整个工作过程中，数据流是严格单向的。如果你想对数据进行修改，只有一种途径：派发 Action。Action 会被 Reducer 读取，Reducer 将根据 Action 内容的不同执行不同的计算逻辑，最终生成新的 state（状态），这个新的 state 会更新到 Store 对象里，进而驱动视图层面作出对应的改变。

对于组件来说，任何组件都可以以约定的方式从 Store 读取到全局的状态，任何组件也都可以通过合理地派发 Action 来修改全局的状态。Redux 通过提供一个统一的状态容器，使得数据能够自由而有序地在任意组件之间穿梭。

接下来我们从源码的角度来看看 Redux 的工作原理。

先来看看它的目录架构：

<img :src="$withBase('/react/redux06.png')" alt="redux06">

其中，utils 是工具方法库；index.js 作为入口文件，用于对功能模块进行收敛和导出。真正“干活”的是功能模块本身，也就是下面这几个文件：

- applyMiddleware.js

- bindActionCreators.js

- combineReducers.js

- compose.js

- createStore.js

applyMiddleware 是中间件模块，它的独立性较强。

而 bindActionCreators（用于将传入的 actionCreator 与 dispatch 方法相结合，揉成一个新的方法）、combineReducers（用于将多个  reducer 合并起来）、compose（用于把接收到的函数从右向左进行组合）这三个方法均为工具性质的方法。

**createStore 方法是我们在使用 Redux 时最先调用的方法，它是整个流程的入口，也是 Redux 中最核心的 API**。

## createStore

使用 Redux 的第一步，我们就需要调用 createStore 方法。单纯从使用感上来说，这个方法做的事情似乎就是创建一个 store 对象出来。

```js
// 引入 redux
import { createStore } from 'redux'
// 创建 store
const store = createStore(
    reducer,
    initial_state,
    applyMiddleware(middleware1, middleware2, ...)
);
```

createStore 方法可以接收以下 3 个入参：

- reducer

- 初始状态内容

- 指定中间件

下面来看一下部分 createStore 源码：

```js
function createStore(reducer, preloadedState, enhancer) {
    // 这里处理的是没有设定初始状态的情况，也就是第一个参数和第二个参数都传 function 的情况
    if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
        // 此时第二个参数会被认为是 enhancer（中间件）
        enhancer = preloadedState;
        preloadedState = undefined;
    }
    // 当 enhancer 不为空时，便会将原来的 createStore 作为参数传入到 enhancer 中
    if (typeof enhancer !== 'undefined') {
        return enhancer(createStore)(reducer, preloadedState);
    }
    // 记录当前的 reducer，因为 replaceReducer 会修改 reducer 的内容
    let currentReducer = reducer;
    // 记录当前的 state
    let currentState = preloadedState;
    // 声明 listeners 数组，这个数组用于记录在 subscribe 中订阅的事件
    let currentListeners = [];
    // nextListeners 是 currentListeners 的快照
    let nextListeners = currentListeners;
    // 该变量用于记录当前是否正在进行 dispatch
    let isDispatching = false

    // 该方法用于确认快照是 currentListeners 的副本，而不是 currentListeners 本身
    function ensureCanMutateNextListeners() {
        if (nextListeners === currentListeners) {
            nextListeners = currentListeners.slice();
        }
    }

    // 我们通过调用 getState 来获取当前的状态
    function getState() {
        return currentState;
    }

    // subscribe 订阅方法，它将会定义 dispatch 最后执行的 listeners 数组的内容
    function subscribe(listener) {
        // 校验 listener 的类型
        if (typeof listener !== 'function') {
          throw new Error('Expected the listener to be a function.')
        }
        // 禁止在 reducer 中调用 subscribe
        if (isDispatching) {
          throw new Error(
            'You may not call store.subscribe() while the reducer is executing. ' +
              'If you would like to be notified after the store has been updated, subscribe from a ' +
              'component and invoke store.getState() in the callback to access the latest state. ' +
              'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.'
          )
        }
        // 该变量用于防止调用多次 unsubscribe 函数
        let isSubscribed = true;
        // 确保 nextListeners 与 currentListeners 不指向同一个引用
        ensureCanMutateNextListeners(); 
        // 注册监听函数
        nextListeners.push(listener); 

        // 返回取消订阅当前 listener 的方法
        return function unsubscribe() {
            if (!isSubscribed) {
                return;
            }
            isSubscribed = false;
            ensureCanMutateNextListeners();
            const index = nextListeners.indexOf(listener);
            // 将当前的 listener 从 nextListeners 数组中删除 
            nextListeners.splice(index, 1);
        };
    }

    // 定义 dispatch 方法，用于派发 action 
    function dispatch(action) {
        // 校验 action 的数据格式是否合法
        if (!isPlainObject(action)) {
          throw new Error(
            'Actions must be plain objects. ' +
              'Use custom middleware for async actions.'
          )
        }

        // 约束 action 中必须有 type 属性作为 action 的唯一标识 
        if (typeof action.type === 'undefined') {
          throw new Error(
            'Actions may not have an undefined "type" property. ' +
              'Have you misspelled a constant?'
          )
        }

        // 若当前已经位于 dispatch 的流程中，则不允许再度发起 dispatch（禁止套娃）
        if (isDispatching) {
          throw new Error('Reducers may not dispatch actions.')
        }
        try {
          // 执行 reducer 前，先"上锁"，标记当前已经存在 dispatch 执行流程
          isDispatching = true
          // 调用 reducer，计算新的 state 
          currentState = currentReducer(currentState, action)
        } finally {
          // 执行结束后，把"锁"打开，允许再次进行 dispatch 
          isDispatching = false
        }

        // 触发订阅
        const listeners = (currentListeners = nextListeners);
        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i];
            listener();
        }
        return action;
    }

    // replaceReducer 可以更改当前的 reducer
    function replaceReducer(nextReducer) {
        currentReducer = nextReducer;
        dispatch({ type: ActionTypes.REPLACE });
        return store;
    }

    // 初始化 state，当派发一个 type 为 ActionTypes.INIT 的 action，每个 reducer 都会返回
    // 它的初始值
    dispatch({ type: ActionTypes.INIT });

    // observable 方法可以忽略，它在 redux 内部使用，开发者一般不会直接接触
    function observable() {
      // observable 方法的实现
    }

    // 将定义的方法包裹在 store 对象里返回
    return {
      dispatch,
      subscribe,
      getState,
      replaceReducer,
      [$$observable]: observable
    }
}
```

下面给出大致流程：

<img :src="$withBase('/react/redux07.png')" alt="redux07">

在 createStore 导出的方法中，与 Redux 主流程强相关的，同时也是我们平时使用中最常打交道的几个方法，分别是：

- getState

- subscribe

- dispatch

其中 getState 的源码内容比较简单，我们在逐行分析的过程中已经对它有了充分的认识。而 subscribe 和 dispatch 则分别代表了 Redux 独有的“发布-订阅”模式以及主流程中最为关键的分发动作，。

## dispatch 动作

dispatch 这个动作刚好能把 action、reducer 和 store 串联起来。先上源码：

```js
function dispatch(action) {
  // 校验 action 的数据格式是否合法
  if (!isPlainObject(action)) {
    throw new Error(
      'Actions must be plain objects. ' +
      'Use custom middleware for async actions.'
    )
  }
  // 约束 action 中必须有 type 属性作为 action 的唯一标识 
  if (typeof action.type === 'undefined') {
    throw new Error(
      'Actions may not have an undefined "type" property. ' +
      'Have you misspelled a constant?'
    )
  }
  // 若当前已经位于 dispatch 的流程中，则不允许再度发起 dispatch（禁止套娃）
  if (isDispatching) {
    throw new Error('Reducers may not dispatch actions.')
  }
  try {
    // 执行 reducer 前，先"上锁"，标记当前已经存在 dispatch 执行流程
    isDispatching = true
    // 调用 reducer，计算新的 state
    currentState = currentReducer(currentState, action)
  } finally {
    // 执行结束后，把"锁"打开，允许再次进行 dispatch
    isDispatching = false
  }
  // 触发订阅
  const listeners = (currentListeners = nextListeners);
  for (let i = 0; i < listeners.length; i++) {
    const listener = listeners[i];
    listener();
  }
  return action;
}
```

大致流程如下：

<img :src="$withBase('/react/redux08.png')" alt="redux08">

###  通过“上锁”避免“套娃式”的 dispatch

dispatch 工作流中最关键的就是执行 reducer 这一步，

```js
try {
  // 执行 reducer 前，先“上锁”，标记当前已经存在 dispatch 执行流程
  isDispatching = true
  // 调用 reducer，计算新的 state 
  currentState = currentReducer(currentState, action)
} finally {
  // 执行结束后，把"锁"打开，允许再次进行 dispatch 
  isDispatching = false
}
```

reducer 的本质是 store 的更新规则，它指定了应用状态的变化如何响应 action 并发送到 store。这段代码中调用 reducer，传入 currentState 和 action，对应的正是 action → reducer → store 这个过程，

在调用 reducer 之前，Redux 首先会将 isDispatching 变量置为 true，待 reducer 执行完毕后，再将 isDispatching 变量置为 false。

这里之所以要用 isDispatching 将 dispatch 的过程锁起来，目的是规避“套娃式”的 dispatch。更准确地说，是为了避免开发者在 reducer 中手动调用 dispatch。

作为一个“计算 state 专用函数”，Redux 在设计 reducer 时就强调了它必须是“纯净”的，它不应该执行除了计算之外的任何“脏操作”，dispatch 调用显然是一个“脏操作”；若真的在 reducer 中调用 dispatch，那么 dispatch 又会反过来调用 reducer，reducer 又会再次调用 dispatch......这样反复相互调用下去，就会进入死循环，属于非常严重的误操作。

### 触发订阅的过程

在 reducer 执行完毕后，会进入触发订阅的过程：

```js
// 触发订阅
const listeners = (currentListeners = nextListeners);
for (let i = 0; i < listeners.length; i++) {
  const listener = listeners[i];
  listener();
}
```

## subscribe “发布-订阅”模式

dispatch 中执行的 listeners 数组从订阅中来，而执行订阅需要调用 subscribe。在实际的开发中，subscribe 并不是一个严格必要的方法，只有在需要监听状态的变化时，我们才会调用 subscribe。

subscribe 接收一个 Function 类型的 listener 作为入参，它的返回内容恰恰就是这个 listener 对应的解绑函数。

```js
function handleChange() {
  // 函数逻辑
}
const unsubscribe = store.subscribe(handleChange)
unsubscribe()
```

subscribe 在订阅时只需要传入监听函数，而不需要传入事件类型。这是因为 Redux 中已经默认了订阅的对象就是“状态的变化（准确地说是 dispatch 函数的调用）”这个事件。

我们可以在 store 对象创建成功后，通过调用 store.subscribe 来注册监听函数，也可以通过调用 subscribe 的返回函数来解绑监听函数，监听函数是用 listeners 数组来维护的；当dispatch action 发生时，Redux 会在 reducer 执行完毕后，将 listeners 数组中的监听函数逐个执行。这就是 subscribe 与 Redux 主流程之间的关系。

下面看看它的源码：

```js
function subscribe(listener) {
  // 校验 listener 的类型
  if (typeof listener !== 'function') {
    throw new Error('Expected the listener to be a function.')
  }
  // 禁止在 reducer 中调用 subscribe
  if (isDispatching) {
    throw new Error(
      'You may not call store.subscribe() while the reducer is executing. ' +
      'If you would like to be notified after the store has been updated, subscribe from a ' +
      'component and invoke store.getState() in the callback to access the latest state. ' +
      'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.'
    )
  }
  // 该变量用于防止调用多次 unsubscribe 函数
  let isSubscribed = true;
  // 确保 nextListeners 与 currentListeners 不指向同一个引用
  ensureCanMutateNextListeners(); 
  // 注册监听函数
  nextListeners.push(listener); 
  // 返回取消订阅当前 listener 的方法
  return function unsubscribe() {
    if (!isSubscribed) {
      return;
    }
    isSubscribed = false;
    ensureCanMutateNextListeners();
    const index = nextListeners.indexOf(listener);
    // 将当前的 listener 从 nextListeners 数组中删除 
    nextListeners.splice(index, 1);
  };
}
```

大致流程如下：

<img :src="$withBase('/react/redux09.png')" alt="redux09">

ensureCanMutateNextListeners 的作用就是确保 nextListeners 不会和 currentListener 指向同一个引用。下面就介绍一下这两个数组。

### 订阅过程

两个 listeners 之间的第一次“交锋”发生在 createStore 的变量初始化阶段，nextListeners 会被赋值为 currentListeners（见下面代码），这之后两者确实指向同一个引用。

```js
 let nextListeners = currentListeners
```

但在 subscribe 第一次被调用时，ensureCanMutateNextListeners 就会发现这一点，然后将 nextListeners 纠正为一个内容与 currentListeners 一致、但引用不同的新对象。

```js
function ensureCanMutateNextListeners() {
  // 若两个数组指向同一个引用
  if (nextListeners === currentListeners) {
    // 则将 nextListeners 纠正为一个内容与 currentListeners 一致、但引用不同的新对象
    nextListeners = currentListeners.slice()
  }
}
```

在 subscribe 的逻辑中，ensureCanMutateNextListeners 每次都会在 listener 注册前被无条件调用，用以确保两个数组引用不同。跟在 ensureCanMutateNextListeners 之后执行的是 listener 的注册逻辑。

```js
nextListeners.push(listener);
```

### 发布过程

触发订阅这个动作是由 dispatch 来做的。

```js
// 触发订阅
const listeners = (currentListeners = nextListeners);
for (let i = 0; i < listeners.length; i++) {
  const listener = listeners[i];
  listener();
}
```

在触发订阅的过程中，currentListeners 会被赋值为 nextListeners，而实际被执行的 listeners 数组又会被赋值为 currentListeners。因此，最终被执行的 listeners 数组，实际上和当前的 nextListeners 指向同一个引用。

：注册监听也是操作 nextListeners，触发订阅也是读取 nextListeners，取消监听操作的也是 nextListeners 数组。那么 currentListeners 有什么用呢？

### currentListeners 数组

currentListeners 数组用于确保监听函数执行过程的稳定性。

正因为任何变更都是在 nextListeners 上发生的，我们才需要一个不会被变更的、内容稳定的 currentListeners ，来确保监听函数在执行过程中不会出问题。

可以看个例子：

```js
// 定义监听函数 A
function listenerA() {
}
// 订阅 A，并获取 A 的解绑函数
const unSubscribeA = store.subscribe(listenerA)
// 定义监听函数 B
function listenerB() {
  // 在 B 中解绑 A
  unSubscribeA()
}
// 定义监听函数 C
function listenerC() {
}
// 订阅 B
store.subscribe(listenerB)
// 订阅 C
store.subscribe(listenerC)
```

在这个 Demo 执行完毕后，nextListeners 数组的内容是 A、B、C 3 个 listener：

```js
[listenerA,  listenerB, listenerC]
```

接下来若调用 dispatch，则会执行下面这段触发订阅的逻辑：

```js
// 触发订阅
const listeners = (currentListeners = nextListeners);
for (let i = 0; i < listeners.length; i++) {
  const listener = listeners[i];
  listener();
}
```

当 for 循环执行到索引 i = 1 处，也就是对应的 listener 为 listenerB 时，问题就会出现：listenerB 中执行了 unSubscribeA 这个动作。监听函数注册、解绑、触发这些动作实际影响的都是 nextListeners。

看一下 unsubscribe 源码：

```js
return function unsubscribe() {
  // 避免多次解绑
  if (!isSubscribed) {
    return;
  }
  isSubscribed = false;
  // 熟悉的操作，调用 ensureCanMutateNextListeners 方法
  ensureCanMutateNextListeners();
  // 获取 listener 在 nextListeners 中的索引
  const index = nextListeners.indexOf(listener);
  // 将当前的 listener 从 nextListeners 数组中删除 
  nextListeners.splice(index, 1);
};

```

假如说不存在 currentListeners，那么也就意味着不需要 ensureCanMutateNextListeners 这个动作。若没有 ensureCanMutateNextListeners，unsubscribeA() 执行完之后，listenerA 会同时从 listeners 数组和 nextListeners 数组中消失（因为两者指向的是同一个引用），那么 listeners 数组此时只剩下两个元素 listenerB 和 listenerC。

listeners 数组的长度改变了，但 for 循环却不会感知这一点，它将无情地继续循环下去。之前执行到 i = 1 处，listener = listeners[1] ，也就是说 listener === listenerB；下一步理应执行到 i = 2 处，但此时 listeners[2] 已经是 undefined 了，原本应该出现在这个索引位上的 listenerC，此时因为数组长度的变化，被前置到了 i = 1 处。这样一来，undefined 就会代替 listenerC 被执行，进而引发函数异常。

所以要**将 nextListeners 与当前正在执行中的 listeners 剥离开来**，将两者指向不同的引用。

ensureCanMutateNextListeners 执行前，listeners、currentListeners 和 nextListeners 之间的关系是这样的：

```js
listeners === currentListeners === nextListeners
```

而 ensureCanMutateNextListeners 执行后，nextListeners 就会被剥离出去：

```js
nextListeners = currentListeners.slice()
listeners === currentListeners !== nextListeners
```

这样一来，nextListeners 上的任何改变，都无法再影响正在执行中的 listeners 了。**currentListeners 在此处的作用，就是为了记录下当前正在工作中的 listeners 数组的引用，将它与可能发生改变的 nextListeners 区分开来，以确保监听函数在执行过程中的稳定性**。