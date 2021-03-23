# 虚拟 DOM

虚拟 DOM（Virtual DOM）本质上是**JS 和 DOM 之间的一个映射缓存**，它在形态上表现为一个能够描述 DOM 结构及其属性信息的 **JS 对象**。

<img :src="$withBase('/react/VirtualDOM01.png')" alt="VirtualDOM01"/>

1. 虚拟 DOM 是 JS 对象
2. 虚拟 DOM 是对真实 DOM 的描述

虚拟 DOM 会在 React 组件的挂载阶段和更新阶段出现

- **挂载阶段**，React 将结合 JSX 的描述，构建出虚拟 DOM 树，然后通过 ReactDOM.render 实现虚拟 DOM 到真实 DOM 的映射（触发渲染流水线）；
- **更新阶段**，页面的变化在作用于真实 DOM 之前，会先作用于虚拟 DOM，虚拟 DOM 将在 JS 层借助算法先对比出具体有哪些真实 DOM 需要被改变，然后再将这些改变作用于真实 DOM。

<img :src="$withBase('/react/VirtualDOM02.png')" alt="VirtualDOM02"/>

虚拟 DOM 作为缓冲层所带来的利好是：当 DOM 操作（渲染更新）比较频繁时，它会先将前后两次的虚拟 DOM 树进行对比，定位出具体需要更新的部分，生成一个“补丁集”，最后只把“补丁”打在需要更新的那部分真实 DOM 上，实现精准的“**差量更新**”。

<img :src="$withBase('/react/VirtualDOM03.png')" alt="VirtualDOM03"/>

## 虚拟 DOM 的好处

**虚拟 DOM 的优越之处在于，它能够在提供更好、更高效的研发模式（也就是函数式的 UI 编程方式）的同时，仍然保持一个还不错的性能**。

虚拟 DOM 解决了两个关键问题：

- 研发体验/研发效率的问题
- 跨平台的问题