# Fiber 架构

首先看看 React 哲学中对 React 的定位：

> 我们认为，React 是用 JavaScript 构建快速响应的大型 Web 应用程序的首选方式。它在 Facebook 和 Instagram 上表现优秀。

为了更进一步贯彻“快速响应”的原则，React 在 16.x 版本中将其最为核心的 Diff 算法整个重写，使其以“Fiber Reconciler”的全新面貌示人。

Stack Reconciler 所带来的一个无解的问题，正是JavaScript 对主线程的超时占用问题。

在 React 15 及之前的版本中，虚拟 DOM 树的数据结构载体是计算机科学中的“树”，其 Diff 算法的遍历思路，也是沿袭了传统计算机科学中“对比两棵树”的算法，在此基础上优化得来。因此从本质上来说，栈调和机制下的 Diff 算法，其实是树的深度优先遍历的过程。而树的深度优先遍历，总是和递归脱不了关系。

**这个过程的致命性在于它是同步的**，不可以被打断。当处理结构相对复杂、体量相对庞大的虚拟 DOM 树时，Stack Reconciler 需要的调和时间会很长，这就意味着 JavaScript 线程将长时间地霸占主线程，进而导致我们上文中所描述的渲染卡顿/卡死、交互长时间无响应等问题。

## Fiber

Fiber 就是比线程还要纤细的一个过程，也就是所谓的“**纤程**”。纤程的出现，意在对渲染过程实现更加精细的控制。

Fiber 是一个多义词。从架构角度来看，Fiber 是对 React 核心算法（即调和过程）的重写；从编码角度来看，Fiber 是 React 内部所定义的一种数据结构，它是 Fiber 树结构的节点单位，也就是 React 16 新架构下的“虚拟 DOM”；从工作流的角度来看，Fiber 节点保存了组件需要更新的状态和副作用，一个 Fiber 同时也对应着一个工作单元。

Fiber 架构的应用目的，按照 React 官方的说法，是实现**“增量渲染”**。所谓“增量渲染”，通俗来说就是把一个渲染任务分解为多个渲染任务，而后将其分散到多个帧里面。不过严格来说，增量渲染其实也只是一种手段，实现增量渲染的目的，**是为了实现任务的可中断、可恢复，并给不同的任务赋予不同的优先级，最终达成更加顺滑的用户体验**。

### 架构核心

在 React 16 中，为了实现“可中断”和“优先级”，React 的渲染和更新阶段依赖的是三层架构：

<img :src="$withBase('/react/Fiber01.png')" alt="Fiber01"/>

调度器的作用是调度更新的优先级。下面是工作流程

- 每个更新任务都会被赋予一个优先级。
- 当更新任务抵达调度器时，高优先级的更新任务（记为 A）会更快地被调度进 Reconciler 层；
- 此时若有新的更新任务（记为 B）抵达调度器，调度器会检查它的优先级，若发现 B 的优先级高于当前任务 A，那么当前处于 Reconciler 层的 A 任务就会被中断，调度器会将 B 任务推入 Reconciler 层。
- 当 B 任务完成渲染后，新一轮的调度开始，之前被中断的 A 任务将会被重新推入 Reconciler 层，继续它的渲染之旅，这便是所谓“可恢复”。

以上便是架构层面对“可中断”“可恢复”与“优先级”三个核心概念的处理。

## Fiber 架构对生命周期的影响

首先我们复习一下 React 16.4 以后的生命周期函数：

<img :src="$withBase('/react/reactqueue11.png')" alt="reactqueue11"/>

- render 阶段：纯净且没有副作用，可能会被 React 暂停、终止或重新启动。

- pre-commit 阶段：可以读取 DOM。

- commit 阶段：可以使用 DOM，运行副作用，安排更新。

在 render 阶段，React 主要是在内存中做计算，明确 DOM 树的更新点；而 commit 阶段，则负责把 render 阶段生成的更新真正地执行掉。

React 15 中从 render 到 commit 的过程：

<img :src="$withBase('/react/Fiber02.png')" alt="Fiber02"/>

而在 React 16 中，render 到 commit 的过程变成了这样：

<img :src="$withBase('/react/Fiber03.png')" alt="Fiber03"/>

在 render 阶段，一个庞大的更新任务被分解为了一个个的工作单元，这些工作单元有着不同的优先级，React 可以根据优先级的高低去实现工作单元的打断和恢复。由于 render 阶段的操作对用户来说其实是“不可见”的，所以就算打断再重启，对用户来说也是 0 感知。但是，工作单元（也就是任务）的重启将会伴随着对部分生命周期的重复执行，这些生命周期是：

- componentWillMount

- componentWillUpdate

- shouldComponentUpdate

- componentWillReceiveProps

