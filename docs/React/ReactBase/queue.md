# 生命周期方法

首先，我们来介绍一个重要的生命周期方法 `render` 

```js
class LifeCycle extends React.Component {
  render() {
    console.log("render方法执行");
    return (
      <div className="container">
        this is content
      </div>
    );
  }
}
```

为什么它十分的特殊呢，因为 `组件化`和 `虚拟DOM` 都需要用它来实现，虚拟 DOM 本来就是需要  render 方法来生成，对于组件化概念的 "渲染工作流" ，这里指的是从`组件数据改变`到`组件实际发生更新`的过程，这个过程的实现同样离不开 render。

如果将 render 方法比作组件的“**灵魂**”，render 之外的生命周期方法就完全可以理解为是组件的“**躯干**”。

## React15 的生命周期函数

```js
constructor()
componentWillReceiveProps()
shouldComponentUpdate()
componentWillMount()
componentWillUpdate()
componentDidUpdate()
componentDidMount()
render()
componentWillUnmount()
```

下面给出一张图来显示他们之间的联系：  

<img :src="$withBase('/react/reactqueue01.png')" alt="reactqueue01">

下面我们看看这个样例：

```js
import React from "react";

import ReactDOM from "react-dom";

// 定义子组件

class LifeCycle extends React.Component {
  constructor(props) {
    console.log("进入constructor");
    super(props);
    // state 可以在 constructor 里初始化
    this.state = { text: "子组件的文本" };
  }

  // 初始化渲染时调用
  componentWillMount() {
    console.log("componentWillMount方法执行");
  }

  // 初始化渲染时调用
  componentDidMount() {
    console.log("componentDidMount方法执行");
  }

  // 父组件修改组件的props时会调用
  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps方法执行");
  }

  // 组件更新时调用
  shouldComponentUpdate(nextProps, nextState) {
    console.log("shouldComponentUpdate方法执行");
    return true;
  }

  // 组件更新时调用
  componentWillUpdate(nextProps, nextState) {
    console.log("componentWillUpdate方法执行");
  }

  // 组件更新后调用
  componentDidUpdate(preProps, preState) {
    console.log("componentDidUpdate方法执行");
  }

  // 组件卸载时调用
  componentWillUnmount() {
    console.log("子组件的componentWillUnmount方法执行");
  }

  // 点击按钮，修改子组件文本内容的方法
  changeText = () => {
    this.setState({
      text: "修改后的子组件文本",
    });
  };

  render() {
    console.log("render方法执行");
    return (
      <div className="container">
        <button onClick={this.changeText} className="changeText">
          修改子组件文本内容
        </button>
        <p className="textContent">{this.state.text}</p>
        <p className="fatherContent">{this.props.text}</p>
      </div>
    );
  }
}

// 定义 LifeCycle 组件的父组件

class LifeCycleContainer extends React.Component {
  // state 也可以像这样用属性声明的形式初始化
  state = {
    text: "父组件的文本",
    hideChild: false,
  };

  // 点击按钮，修改父组件文本的方法

  changeText = () => {
    this.setState({
      text: "修改后的父组件文本",
    });
  };

  // 点击按钮，隐藏（卸载）LifeCycle 组件的方法

  hideChild = () => {
    this.setState({
      hideChild: true,
    });
  };

  render() {
    return (
      <div className="fatherContainer">
        <button onClick={this.changeText} className="changeText">
          修改父组件文本内容
        </button>
        <button onClick={this.hideChild} className="hideChild">
          隐藏子组件
        </button>
        {this.state.hideChild ? null : <LifeCycle text={this.state.text} />}
      </div>
    );
  }
}

ReactDOM.render(<LifeCycleContainer />, document.getElementById("root"));
```

我们可以把 React 组件分为挂载、更新、卸载三个阶段。

#### Mounting 阶段

<img :src="$withBase('/react/reactqueue02.png')" alt="reactqueue02">

挂载过程在组件的一生中仅会发生一次，在这个过程中，组件被初始化，然后会被渲染到真实 DOM 里，完成所谓的“首次渲染”。

<img :src="$withBase('/react/reactqueue03.png')" alt="reactqueue03">

首先来看 constructor 方法，该方法仅仅在挂载的时候被调用一次，我们可以在该方法中对 `this.state` 进行初始化：

```js
constructor(props) {
  console.log("进入constructor");
  super(props);
  // state 可以在 constructor 里初始化
  this.state = { text: "子组件的文本" };
}
```

`componentWillMount`、`componentDidMount` 方法同样只会在挂载阶段被调用一次。其中 `componentWillMount` 会在执行 render 方法前被触发。

接下来 `render` 方法被触发。注意 `render` 在执行过程中并不会去操作真实 DOM（也就是说不会渲染），它的职能是**把需要渲染的内容返回出来**。真实 DOM 的渲染工作，在挂载阶段是由 `ReactDOM.render` 来承接的。

`componentDidMount` 方法在渲染结束后被触发，此时因为真实 DOM 已经挂载到了页面上，我们可以在这个生命周期里执行真实 DOM 相关的操作。此外，类似于异步请求、数据初始化这样的操作也大可以放在这个生命周期来做。

这一整个流程对应的其实就是 Demo 页面刚刚打开时，组件完成初始化渲染的过程。

### Updating 阶段

<img :src="$withBase('/react/reactqueue04.png')" alt="reactqueue04">

组件的更新分为两种：一种是由父组件更新触发的更新；另一种是组件自身调用自己的 `setState` 触发的更新。

#### **componentWillReceiProps** 

父组件触发的更新和组件自身的更新相比，多出了这样一个生命周期方法：

```js
componentWillReceiveProps(nextProps)
```

`nextProps` 表示的是接收到新 props 内容，而现有的 props （相对于 `nextProps` 的“旧 props”）可以通过 `this.props` 拿到，由此便能够感知到 props 的变化。

现在对父组件的结构进行一个小小的修改，给它一个和子组件完全无关的 `state（this.state.ownText）`，同时相应地给到一个修改这个 state 的方法`（this.changeOwnText）`，并用一个新的 button 按钮来承接这个触发的动作。

可以看到，当我们点击`修改父组件自有文本内容`时，会发现依旧触发了该生命周期函数。

<img :src="$withBase('/react/reactqueue05.png')" alt="reactqueue05">

由此得出结论**`componentReceiveProps` 是由父组件的更新触发的**

`componentWillUpdate` 会在 render 前被触发，它和 `componentWillMount` 类似，允许你在里面做一些不涉及真实 DOM 操作的准备工作；而 `componentDidUpdate` 则在组件更新完毕后被触发，和 `componentDidMount` 类似，这个生命周期也经常被用来处理 DOM 操作。

#### **shouldComponentUpdate**

```js
shouldComponentUpdate(nextProps, nextState)
```

render 方法由于伴随着对虚拟 DOM 的构建和对比，过程可以说相当耗时。而在 React 当中，很多时候我们会不经意间就频繁地调用了 render。为了避免不必要的 render 操作带来的性能开销，React 为我们提供了 `shouldComponentUpdate` 这个函数。

React 组件会根据 `shouldComponentUpdate` 的返回值，来决定是否执行该方法之后的生命周期，进而决定是否对组件进行**re-render**（重渲染）。`shouldComponentUpdate` 的默认值为 true。

#### Unmounting 阶段



<img :src="$withBase('/react/reactqueue06.png')" alt="reactqueue06">

组件的销毁阶段只涉及一个生命周期。

组件销毁的几个常见原因：

- 组件在父组件中被移除了。
- 组件中设置了 key 属性，父组件在 render 的过程中，发现 key 值和上一次不一致，那么这个组件就会被消除。

## React 16 生命周期函数

我们先看看 React 16.3 的生命周期函数：

<img :src="$withBase('/react/reactqueue07.png')" alt="reactqueue07">

我们将上面的 Demo 重写一下：

```js
import React from "react";
import ReactDOM from "react-dom";
// 定义子组件
class LifeCycle extends React.Component {
  constructor(props) {
    console.log("进入constructor");
    super(props);
    // state 可以在 constructor 里初始化
    this.state = { text: "子组件的文本" };
  }
  // 初始化/更新时调用
  static getDerivedStateFromProps(props, state) {
    console.log("getDerivedStateFromProps方法执行");
    return {
      fatherText: props.text
    }
  }
  // 初始化渲染时调用
  componentDidMount() {
    console.log("componentDidMount方法执行");
  }
  // 组件更新时调用
  shouldComponentUpdate(prevProps, nextState) {
    console.log("shouldComponentUpdate方法执行");
    return true;
  }

  // 组件更新时调用
  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log("getSnapshotBeforeUpdate方法执行");
    return "haha";
  }
  // 组件更新后调用
  componentDidUpdate(preProps, preState, valueFromSnapshot) {
    console.log("componentDidUpdate方法执行");
    console.log("从 getSnapshotBeforeUpdate 获取到的值是", valueFromSnapshot);
  }
  // 组件卸载时调用
  componentWillUnmount() {
    console.log("子组件的componentWillUnmount方法执行");
  }
  // 点击按钮，修改子组件文本内容的方法
  changeText = () => {
    this.setState({
      text: "修改后的子组件文本"
    });
  };
  render() {
    console.log("render方法执行");
    return (
      <div className="container">
        <button onClick={this.changeText} className="changeText">
          修改子组件文本内容
        </button>
        <p className="textContent">{this.state.text}</p>
        <p className="fatherContent">{this.props.text}</p>
      </div>
    );
  }
}
// 定义 LifeCycle 组件的父组件
class LifeCycleContainer extends React.Component {

  // state 也可以像这样用属性声明的形式初始化
  state = {
    text: "父组件的文本",
    hideChild: false
  };
  // 点击按钮，修改父组件文本的方法
  changeText = () => {
    this.setState({
      text: "修改后的父组件文本"
    });
  };
  // 点击按钮，隐藏（卸载）LifeCycle 组件的方法
  hideChild = () => {
    this.setState({
      hideChild: true
    });
  };
  render() {
    return (
      <div className="fatherContainer">
        <button onClick={this.changeText} className="changeText">
          修改父组件文本内容
        </button>
        <button onClick={this.hideChild} className="hideChild">
          隐藏子组件
        </button>
        {this.state.hideChild ? null : <LifeCycle text={this.state.text} />}
      </div>
    );
  }
}
ReactDOM.render(<LifeCycleContainer />, document.getElementById("root"));
```

React 16 以来的生命周期也可以按照“挂载”“更新”和“卸载”三个阶段来看。

### Mounting 阶段

这里我们对比一下相较于 React 15，React 16 的变化。

<img :src="$withBase('/react/reactqueue08.png')" alt="reactqueue08">

可以发现 `componentWillMount` 消失了，新增了 `getDerivedStateFromProps`

#### getDerivedStateFromProps

它有且仅有一个用途：**使用 props 来派生/更新 state**。

`getDerivedStateFromProps` 在更新和挂载两个阶段都会出现（这点不同于仅在更新阶段出现的 `componentWillReceiveProps`）。这是因为“派生 state”这种诉求不仅在 props 更新时存在，**在 props 初始化的时候也是存在的**。

<img :src="$withBase('/react/reactqueue09.png')" alt="reactqueue09">

```js
static getDerivedStateFromProps(props, state)
```

- **`getDerivedStateFromProps `是一个静态方法**。静态方法不依赖组件实例而存在，因此在这个方法内部是**访问不到 this** 的。
- 该方法可以接收两个参数：props 和 state，它们分别代表当前组件接收到的来自父组件的 props 和当前组件自身的 state。

- `getDerivedStateFromProps` 需要一个对象格式的返回值。如果没有指定这个返回值，那么会被 React 警告。**因为 React 需要用这个返回值来更新（派生）组件的 state**。

- **`getDerivedStateFromProps` 方法对 state 的更新动作并非“覆盖”式的更新**，**而是针对某个属性的定向更新**。

### Updating 阶段



<img :src="$withBase('/react/reactqueue10.png')" alt="reactqueue10">

React 16.4 对生命周期流程进行了“微调”，其实就调在了更新过程的	`getDerivedStateFromProps` 这个生命周期上。

<img :src="$withBase('/react/reactqueue11.png')" alt="reactqueue11">

React 16.4 的挂载和卸载流程都是与 React 16.3 保持一致的，差异在于更新流程上：

- 在 React 16.4 中，**任何因素触发的组件更新流程**（包括由 `this.setState` 和 `forceUpdate` 触发的更新流程）都会触发 `getDerivedStateFromProps`；
- 而在 v 16.3 版本时，**只有父组件的更新**会触发该生命周期。

#### componentWillReceiveProps 为何被取代了

对于 `getDerivedStateFromProps` 这个 API，React 官方曾经给出过这样的描述：

:::tip

与 `componentDidUpdate` 一起，这个新的生命周期涵盖过时`componentWillReceiveProps` 的所有用例。

:::

- `getDerivedStateFromProps` 是作为一个**试图代替 `componentWillReceiveProps`** 的 API 而出现的；
- `getDerivedStateFromProps`**不能完全和 `componentWillReceiveProps` 画等号**，其特性决定了我们曾经在 `componentWillReceiveProps` 里面做的事情，不能够百分百迁移到 `getDerivedStateFromProps` 里。

 **React 16 在强制推行“只用 getDerivedStateFromProps 来完成 props 到 state 的映射”这一最佳实践**。当然也是在为新的 Fiber 架构铺路。

#### getSnapshotBeforeUpdate



<img :src="$withBase('/react/reactqueue12.png')" alt="reactqueue12">

```js
getSnapshotBeforeUpdate(prevProps, prevState) {
  // ...
}
```

**`getSnapshotBeforeUpdate` 的返回值会作为第三个参数给到 `componentDidUpdate`**。**它的执行时机是在 render 方法之后，真实 DOM 更新之前**。在这个阶段里，我们可以**同时获取到更新前的真实 DOM 和更新前后的 state&props 信息**。

```js
// 组件更新时调用
getSnapshotBeforeUpdate(prevProps, prevState) {
  console.log("getSnapshotBeforeUpdate方法执行");
  return "haha";
}

// 组件更新后调用
componentDidUpdate(prevProps, prevState, valueFromSnapshot) {
  console.log("componentDidUpdate方法执行");
  console.log("从 getSnapshotBeforeUpdate 获取到的值是", valueFromSnapshot);
}
```

**`getSnapshotBeforeUpdate` 要想发挥作用，离不开 `componentDidUpdate` 的配合**。

### Unmounting 阶段

与 React 15 完全一致。

## 为何 React 16 变动了生命周期

关键原因还是需要到 Fiber 架构中来。

**Fiber 会使原本同步的渲染过程变成异步的**。

在 React 16 之前，每当我们触发一次组件的更新，React 都会构建一棵新的虚拟 DOM 树，通过与上一次的虚拟 DOM 树进行 diff，实现对 DOM 的定向更新。这个过程，是一个递归的过程。

**同步渲染的递归调用栈是非常深的**，只有最底层的调用返回了，整个渲染过程才会开始逐层返回。这个漫长且不可打断的更新过程，将会带来用户体验层面的巨大风险：同步渲染一旦开始，便会牢牢抓住主线程不放，直到递归彻底完成。在这个过程中，浏览器没有办法处理任何渲染之外的事情，会进入一种无法处理用户交互的状态。因此若渲染时间稍微长一点，页面就会面临卡顿甚至卡死的风险。

**Fiber 会将一个大的更新任务拆解为许多个小任务**。每当执行完一个小任务时，**渲染线程都会把主线程交回去**，看看有没有优先级更高的工作要处理，确保不会出现其他任务被“饿死”的情况，进而避免同步渲染带来的卡顿。在这个过程中，**渲染线程不再“一去不回头”，而是可以被打断的**，这就是所谓的“异步渲染”。

Fiber 架构的重要特征就是**可以被打断的**异步渲染模式。但这个“打断”是有原则的，根据“**能否被打断**”这一标准，React 16 的生命周期被划分为了 render 和 commit 两个阶段，而 commit 阶段又被细分为了 pre-commit 和 commit。

- render 阶段：纯净且没有副作用，可能会被 React 暂停、终止或重新启动。
- pre-commit 阶段：可以读取 DOM。
- commit 阶段：可以使用 DOM，运行副作用，安排更新。

**render 阶段在执行过程中允许被打断，而 commit 阶段则总是同步执行的。**

由于 render 阶段的操作对用户来说其实是“不可见”的，所以就算打断再重启，对用户来说也是零感知。而 commit 阶段的操作则涉及真实 DOM 的渲染，会导致页面的变动，所以这个过程必须用同步渲染。

### 废弃的生命周期方法

 React 16 打算废弃的是哪些生命周期：

- componentWillMount；
- componentWillUpdate；
- componentWillReceiveProps。

在 Fiber 机制下，**render 阶段是允许暂停、终止和重启的**。当一个任务执行到一半被打断后，下一次渲染线程抢回主动权时，这个任务被重启的形式是“重复执行一遍整个任务”而非“接着上次执行到的那行代码往下走”。**这就导致 render 阶段的生命周期都是有可能被重复执行的**。

**上面那些生命周期方法都处于 render 阶段，都可能重复被执行**。

同时为在一定程度上防止用户对生命周期的错用和滥用，把新增的 `getDerivedStateFromProps` 用 static 修饰，阻止用户在其内部使用 this 。