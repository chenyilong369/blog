# React-Hooks

## 核心 API

### useState()：为函数组件引入状态

早期的函数组件相比于类组件，其一大劣势是缺乏定义和维护 state 的能力，而 state（状态）作为 React 组件的灵魂，必然是不可省略的。

下面有个 Demo 来帮助理解：

```js
import React, { useState } from "react";
export default function Button() {
  const [text, setText] = useState("初始文本");
  function changeText() {
    return setText("修改后的文本");
  }
  return (
    <div className="textButton">
      <p>{text}</p>
      <button onClick={changeText}>点击修改文本</button>
    </div>
  );
}
```

从用法上看，`useState` 返回的是一个数组，数组的第一个元素对应的是我们想要的那个 state 变量，第二个元素对应的是能够修改这个变量的 API。

当我们在函数组件中调用 `React.useState` 的时候，实际上是给这个组件关联了一个状态，它就像类组件中 state 对象的某一个属性一样，对应着一个单独的状态，允许你存储任意类型的值。

### useEffect()：允许函数组件执行副作用操作

`useEffect` 能够为函数组件引入副作用。过去我们习惯放在 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount` 三个生命周期里来做的事，现在可以放在 `useEffect` 里来做，比如操作 DOM、订阅事件、调用外部 API 获取数据等。

```js
// 注意 hook 在使用之前需要引入
import React, { useState, useEffect } from 'react';
// 定义函数组件
function IncreasingTodoList() {
  // 创建 count 状态及其对应的状态修改函数
  const [count, setCount] = useState(0);
  // 此处的定位与 componentDidMount 和 componentDidUpdate 相似
  useEffect(() => {
    // 每次 count 增加时，都增加对应的待办项
    const todoList = document.getElementById("todoList");
    const newItem = document.createElement("li");
    newItem.innerHTML = `我是第${count}个待办项`;
    todoList.append(newItem);
  });
  // 编写 UI 逻辑
  return (
    <div>
      <p>当前共计 {count} 个todo Item</p>
      <ul id="todoList"></ul>
      <button onClick={() => setCount(count + 1)}>点我增加一个待办项</button>
    </div>
  );
}
```

`useEffect` 可以接收两个参数，分别是回调函数与依赖数组。

下面介绍一下 `useEffect` 的调用规则。

-  每一次渲染后都执行的副作用：传入回调函数，不传依赖数组。

```js
useEffect(callBack)
```

- 仅在挂载阶段执行一次的副作用：传入回调函数，**且这个函数的返回值不是一个函**数，同时传入一个空数组。

```js
useEffect(()=>{
  // 这里是业务逻辑 
}, [])
```

- 仅在挂载阶段和卸载阶段执行的副作用：传入回调函数，**且这个函数的返回值是一个函数**，同时传入一个空数组。假如回调函数本身记为 A， 返回的函数记为 B，那么将在挂载阶段执行 A，卸载阶段执行 B。

```js
useEffect(()=>{
  // 这里是 A 的业务逻辑

  // 返回一个函数记为 B
  return ()=>{
  }
}, [])
```

**useEffect 回调中返回的函数被称为“清除函数”**，当 React 识别到清除函数时，会在卸载时执行清除函数内部的逻辑。**这个规律不会受第二个参数或者其他因素的影响，只要你在 useEffect 回调中返回了一个函数，它就会被作为清除函数来处理**。

- 每一次渲染都触发，且卸载阶段也会被触发的副作用：传入回调函数，且这个函数的返回值是一个函数，同时不传第二个参数。

```js
useEffect(()=>{
  // 这里是 A 的业务逻辑

  // 返回一个函数记为 B
  return ()=>{
  }
})
```

- 根据一定的依赖条件来触发的副作用：传入回调函数（若返回值是一个函数，仍然仅影响卸载阶段对副作用的处理，此处不再赘述），同时传入一个非空的数组.

```js
useEffect(()=>{
  // 这是回调函数的业务逻辑 

  // 若 xxx 是一个函数，则 xxx 会在组件卸载时被触发
  return xxx
}, [num1, num2, num3])
```

## 为什么需要 React-Hooks

- 告别难以理解的 Class；
- 解决业务逻辑难以拆分的问题；
- 使状态逻辑复用变得简单可行；
- 函数组件从设计思想上来看，更加契合 React 的理念。

React 团队面向开发者给出了两条 React-Hooks 的使用原则，原则的内容如下：

1. 只在 React 函数中调用 Hook；
2. 不要在循环、条件或嵌套函数中调用 Hook。

## Hooks 底层实现

React-Hooks 的调用链路在首次渲染和更新阶段是不同的。

我们首先看一下首次渲染阶段。

<img :src="$withBase('/react/hooks01.png')" alt="hooks01"/>

`useState` 触发的一系列操作最后会落到 `mountState` 里面去，所以我们重点需要关注的就是 mountState 做了什么事情。

```js
// 进入 mounState 逻辑
function mountState(initialState) {

  // 将新的 hook 对象追加进链表尾部
  var hook = mountWorkInProgressHook();

  // initialState 可以是一个回调，若是回调，则取回调执行后的值
  if (typeof initialState === 'function') {
    // $FlowFixMe: Flow doesn't like mixed types
    initialState = initialState();
  }

  // 创建当前 hook 对象的更新队列，这一步主要是为了能够依序保留 dispatch
  const queue = hook.queue = {
    last: null,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: (initialState: any),
  };

  // 将 initialState 作为一个“记忆值”存下来
  hook.memoizedState = hook.baseState = initialState;

  // dispatch 是由上下文中一个叫 dispatchAction 的方法创建的，这里不必纠结这个方法具体做了什么
  var dispatch = queue.dispatch = dispatchAction.bind(null, currentlyRenderingFiber$1, queue);
  // 返回目标数组，dispatch 其实就是示例中常常见到的 setXXX 这个函数，想不到吧？哈哈
  return [hook.memoizedState, dispatch];
}
```

可以看出**mounState 的主要工作是初始化 Hooks**。

下面我们看看 mountWorkInProgressHook 方法

```js
function mountWorkInProgressHook() {
  // 注意，单个 hook 是以对象的形式存在的
  var hook = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null
  };
  if (workInProgressHook === null) {
    // 这行代码每个 React 版本不太一样，但做的都是同一件事：将 hook 作为链表的头节点处理
    firstWorkInProgressHook = workInProgressHook = hook;
  } else {
    // 若链表不为空，则将 hook 追加到链表尾部
    workInProgressHook = workInProgressHook.next = hook;
  }
  // 返回当前的 hook
  return workInProgressHook;
}
```

**hook 相关的所有信息收敛在一个 hook 对象里，而 hook 对象之间以单向链表的形式相互串联**。

接着再看更新阶段大致的流程图：

<img :src="$withBase('/react/hooks02.png')" alt="hooks02"/>

 `updateState` 之后的操作链路，虽然涉及的代码有很多，但其实做的事情很容易理解：**按顺序去遍历之前构建好的链表，取出对应的数据信息进行渲染**。

**hooks 的渲染是通过“依次遍历”来定位每个 hooks 内容的。如果前后两次读到的链表在顺序上出现差异，那么渲染的结果自然是不可控的**。也会是说**Hooks 的本质其实是链表**。