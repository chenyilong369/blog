# ReactDOM.render 串联渲染链路

首先，我们看一段简单的代码

```js
import React from "react";
import ReactDOM from "react-dom";

function App() {
    return (
      <div className="App">
        <div className="container">
          <h1>我是标题</h1>
          <p>我是第一段话</p>
          <p>我是第二段话</p>
        </div>
      </div>
    );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

我们来看看 ReactDOM.render 的调用栈。

`scheduleUpdateOnFiber` 方法的作用是调度更新，在由 ReactDOM.render 发起的首屏渲染这个场景下，它触发的就是 `performSyncWorkOnRoot`。`performSyncWorkOnRoot` 开启的是 render 阶段；而 `commitRoot` 方法开启的则是真实 DOM 的渲染过程（commit 阶段）。

大致把 ReactDOM.render 的调用栈划分为三个阶段：

- 初始化阶段

- render 阶段

- commit 阶段

## 初始化阶段

该阶段主要是为了完成 Fiber 树中基本实体的创建。

首先来看看初始化中最关键的函数：

```js
return legacyRenderSubtreeIntoContainer(null, element, container, false, callback);
```

下面是他的部分源代码：

```js
function legacyRenderSubtreeIntoContainer(parentComponent, children, container, forceHydrate, callback) {
  // container 对应的是我们传入的真实 DOM 对象
  var root = container._reactRootContainer;
  // 初始化 fiberRoot 对象
  var fiberRoot;
  // DOM 对象本身不存在 _reactRootContainer 属性，因此 root 为空
  if (!root) {
    // 若 root 为空，则初始化 _reactRootContainer，并将其值赋值给 root
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(container, forceHydrate);
    // legacyCreateRootFromDOMContainer 创建出的对象会有一个 _internalRoot 属性，将其赋值给 fiberRoot
    fiberRoot = root._internalRoot;

    // 这里处理的是 ReactDOM.render 入参中的回调函数，你了解即可
    if (typeof callback === 'function') {
      var originalCallback = callback;
      callback = function () {
        var instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance);
      };
    } // Initial mount should not be batched.
    // 进入 unbatchedUpdates 方法
    unbatchedUpdates(function () {
      updateContainer(children, fiberRoot, parentComponent, callback);
    });
  } else {
    // else 逻辑处理的是非首次渲染的情况（即更新），其逻辑除了跳过了初始化工作，与楼上基本一致
    fiberRoot = root._internalRoot;
    if (typeof callback === 'function') {
      var _originalCallback = callback;
      callback = function () {
        var instance = getPublicRootInstance(fiberRoot);
        _originalCallback.call(instance);
      };
    } // Update

    updateContainer(children, fiberRoot, parentComponent, callback);
  }
  return getPublicRootInstance(fiberRoot);
}
```

可以看到，上面流程中多次出现 fiberRoot 对象，下面大致就是一个 fiberRoot 对象：

可以看出，root 对象（container._reactRootContainer）上有一个 _internalRoot 属性，这个 _internalRoot 也就是 fiberRoot。fiberRoot 的本质是一个 FiberRootNode 对象，其中包含一个 current 属性。

不难理解，current 对象是一个 FiberNode 实例，同时他还是当前 Fiber 树的头部节点。

current 用的最核心的地方在于 fiber 树：

fiberRoot 的关联对象是真实 DOM 的容器节点；而 rootFiber 则作为虚拟 DOM 的根节点存在。这两个节点，将是后续整棵 Fiber 树构建的起点。

fiberRoot 将和 ReactDOM.render 方法的其他入参一起，被传入 updateContainer 方法，从而形成一个回调。这个回调，正是接下来要调用的 unbatchedUpdates 方法的入参。

```js
function unbatchedUpdates(fn, a) {
  // 这里是对上下文的处理，不必纠结
  var prevExecutionContext = executionContext;
  executionContext &= ~BatchedContext;
  executionContext |= LegacyUnbatchedContext;
  try {
    // 重点在这里，直接调用了传入的回调函数 fn，对应当前链路中的 updateContainer 方法
    return fn(a);
  } finally {
    // finally 逻辑里是对回调队列的处理，此处不用太关注
    executionContext = prevExecutionContext;
    if (executionContext === NoContext) {
      // Flush the immediate callbacks that were scheduled during this batch
      resetRenderTimer();
      flushSyncCallbackQueue();
    }
  }
}
```

可以看到它直接调用了传入的回调 fn。

```js
unbatchedUpdates(function () {
  updateContainer(children, fiberRoot, parentComponent, callback);
});
```

下面以部分源代码来展示 updateContainer 函数：

```js
function updateContainer(element, container, parentComponent, callback) {
  ......

  // 这是一个 event 相关的入参，此处不必关注
  var eventTime = requestEventTime();

  ......

  // 这是一个比较关键的入参，lane 表示优先级
  var lane = requestUpdateLane(current$1);
  // 结合 lane（优先级）信息，创建 update 对象，一个 update 对象意味着一个更新
  var update = createUpdate(eventTime, lane); 

  // update 的 payload 对应的是一个 React 元素
  update.payload = {
    element: element
  };

  // 处理 callback，这个 callback 其实就是我们调用 ReactDOM.render 时传入的 callback
  callback = callback === undefined ? null : callback;
  if (callback !== null) {
    {
      if (typeof callback !== 'function') {
        error('render(...): Expected the last optional `callback` argument to be a ' + 'function. Instead received: %s.', callback);
      }
    }
    update.callback = callback;
  }

  // 将 update 入队
  enqueueUpdate(current$1, update);
  // 调度 fiberRoot 
  scheduleUpdateOnFiber(current$1, lane, eventTime);
  // 返回当前节点（fiberRoot）的优先级
  return lane;
}
```

它做的最关键的事情可以总结为三件：

- 请求当前 Fiber 节点的 lane（优先级）；

- 结合 lane（优先级），创建当前 Fiber 节点的 update 对象，并将其入队；

- 调度当前节点（rootFiber）。

scheduleUpdateOnFiber 函数的任务是调度当前节点的更新。在这个函数中，会处理一系列与优先级、打断操作相关的逻辑。但是在 ReactDOM.render 发起的首次渲染链路中，这些意义都不大，因为这个渲染过程其实是同步的。

在首次渲染中，他会直接调用 performSyncWorkOnRoot，这个函数名称表明了它是一个同步函数。

performSyncWorkOnRoot 是 render 阶段的起点，render 阶段的任务就是完成 Fiber 树的构建，它是整个渲染链路中最核心的一环。在异步渲染的模式下，render 阶段应该是一个可打断的异步过程。那么为什么 ReactDOM.render 首次渲染是一个同步过程呢？

其实在 React 16，包括近期发布的 React 17 小版本中，React 都有以下 3 种启动方式：

- legacy 模式：

ReactDOM.render(<App /\>, rootNode)。这是当前 React App 使用的方式，当前没有计划删除本模式，但是这个模式可能不支持这些新功能。
- blocking 模式：

ReactDOM.createBlockingRoot(rootNode).render(<App /\>)。目前正在实验中，作为迁移到 concurrent 模式的第一个步骤。

- concurrent 模式：

ReactDOM.createRoot(rootNode).render(<App /\>)。目前在实验中，未来稳定之后，打算作为 React 的默认开发模式，这个模式开启了所有的新功能。（异步渲染）

我们常用的 ReactDOM.render 对应的是 legacy 模式，它实际触发的仍然是同步的渲染链路。blocking 模式可以理解为 legacy 和 concurrent 之间的一个过渡形态，之所以会有这个模式，是因为 React 官方希望能够提供渐进的迁移策略，帮助我们更加顺滑地过渡到 Concurrent 模式。

### 关于异步模式下的首次渲染链路

如果想要开启异步渲染，我们需要调用 ReactDOM.createRoot方法来启动应用。

 在React 17.0.0 版本中，createRoot 仍然是一个 unstable 的方法。因此实际调用的 API 应该是“unstable_createRoot”：

```js
ReactDOM.unstable_createRoot(rootElement).render(<App />);
```

由于在异步渲染模式下，由于请求到的 Lane 不再是 SyncLane（同步优先级），故不会走到 performSyncWorkOnRoot 这个调用，而是会执行 else 中调度相关的逻辑。

React 是如何知道当前处于哪个模式的呢？我们可以以 requestUpdateLane 函数为例，下面是它局部的代码：

```js
function requestUpdateLane(fiber) {
  // 获取 mode 属性
  var mode = fiber.mode;
  // 结合 mode 属性判断当前的
  if ((mode & BlockingMode) === NoMode) {
    return SyncLane;
  } else if ((mode & ConcurrentMode) === NoMode) {
    return getCurrentPriorityLevel() === ImmediatePriority$1 ? SyncLane : SyncBatchedLane;
  }
  ......
  return lane;
}
```

注意 fiber节点上的 mode 属性：React 将会通过修改 mode 属性为不同的值，来标识当前处于哪个渲染模式；在执行过程中，也是通过判断这个属性，来区分不同的渲染模式。

mode 属性决定着这个工作流是一气呵成（同步）的，还是分片执行（异步）的。

## render 阶段

performSyncWorkOnRoot 标志着 render 阶段的开始，finishSyncRender 标志着 render 阶段的结束。这中间包含了大量的 beginWork、completeWork 调用栈。

> beginWork、completeWork 这两个方法需要注意，它们串联起的是一个“模拟递归”的过程。

但在 ReactDOM.render 触发的同步模式下，它仍然是一个深度优先搜索的过程。在这个过程中，beginWork 将创建新的 Fiber 节点，而 completeWork 则负责将 Fiber 节点映射为 DOM 节点。

那么我们应该如何便遍历 fiber 树呢？

### workInProgress 节点的创建

