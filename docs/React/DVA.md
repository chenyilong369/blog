# DVA

在日常开发中，数据的改变发生通常是通过用户交互行为或者浏览器行为（如路由跳转等）触发的，当此类行为会改变数据的时候可以通过 `dispatch` 发起一个 action，如果是同步行为会直接通过 `Reducers` 改变 `State` ，如果是异步行为（副作用）会先触发 `Effects` 然后流向 `Reducers` 最终改变 `State`。

<img :src="$withBase('/DVA01.png')" alt="DVA01">

## Models

### State

State 表示 Model 的状态数据，通常表现为一个 JS 对象（当然它可以是任何值）；操作的时候每次都要当作不可变数据（immutable data）来对待，保证每次都是全新对象，没有引用关系，这样才能保证 State 的独立性，便于测试和追踪变化。

```js
const app = dva();
console.log(app._store); // 顶部的 state 数据
```

### Action

Action 是一个普通 JS 对象，它是改变 State 的唯一途径。无论是从 UI 事件、网络回调，还是 WebSocket 等数据源所获得的数据，最终都会通过 dispatch 函数调用一个 action，从而改变对应的数据。

action 必须带有 `type` 属性指明具体的行为，其它字段可以自定义，如果要发起一个 action 需要使用 `dispatch` 函数；需要注意的是 `dispatch` 是在组件 connect Models以后，通过 props 传入的。

```js
dispatch({
  type: 'add',
});
```

### dispatch 函数

dispatching function 是一个用于触发 action 的函数，action 是改变 State 的唯一途径，但是它只描述了一个行为，而 dipatch 可以看作是触发这个行为的方式，而 Reducer 则是描述如何改变数据的。

在 dva 中，connect Model 的组件通过 props 可以访问到 dispatch，可以调用 Model 中的 Reducer 或者 Effects。

```js
dispatch({
  type: 'user/add', // 如果在 model 外调用，需要添加 namespace
  payload: {}, // 需要传递的信息
});
```

### Reducer

Reducer（也称为 reducing function）函数接受两个参数：之前已经累积运算的结果和当前要被累积的值，返回的是一个新的累积结果。该函数把一个集合归并成一个单值。

在 dva 中，reducers 聚合积累的结果是当前 model 的 state 对象。通过 actions 中传入的值，与当前 reducers 中的值进行运算获得新的值（也就是新的 state）。（貌似就是 redux 中的reducers）。注意，Reducer 必须是纯函数，他不应该产生任何副作用。

```js
// count +1
function add(state) { return state + 1; }

// 往 [] 里添加一个新 todo
function addTodo(state, action) { return [...state, action.payload]; }

// 往 { todos: [], loading: true } 里添加一个新 todo，并标记 loading 为 false
function addTodo(state, action) {
  return {
    ...state,
    todos: state.todos.concat(action.payload),
    loading: false
  };
}
```

### Effect

Effect 被称为副作用，在我们的应用中，最常见的就是异步操作。它来自于函数编程的概念，之所以叫副作用是因为它使得我们的函数变得不纯，同样的输入不一定获得同样的输出。

dva 为了控制副作用的操作，底层引入了[redux-sagas](http://superraytin.github.io/redux-saga-in-chinese)做异步流程控制，由于采用了[generator的相关概念](http://www.ruanyifeng.com/blog/2015/04/generator.html)，所以将异步转成同步写法，从而将effects转为纯函数。

```js
function *addAfter1Second(action, { put, call }) {
  yield call(delay, 1000);
  yield put({ type: 'add' });
}
```

###  Subscription

Subscription 语义是订阅，用于订阅一个数据源，然后根据条件 dispatch 需要的 action。数据源可以是当前的时间、服务器的 websocket 连接、keyboard 输入、geolocation 变化、history 路由变化等等。

```js
import key from 'keymaster';
...
app.model({
  namespace: 'count',
  subscriptions: {
    keyEvent({dispatch}) {
      key('⌘+up, ctrl+up', () => { dispatch({type:'add'}) });
    },
  }
});
```

## Router

这里的路由通常指的是前端路由，由于我们的应用现在通常是单页应用，所以需要前端代码来控制路由逻辑，通过浏览器提供的 `History API`可以监听浏览器url的变化，从而控制路由相关操作。使用的是 react-router。

```js
import { Router, Route } from 'dva/router';
app.router(({history}) =>
  <Router history={history}>
    <Route path="/" component={HomePage} />
  </Router>
);
```

## 结构

```js
import dva from 'dva';
const App = () => <div>Hello dva</div>;

// 创建应用
const app = dva();

app.model({
  namespace: 'count',
  state: {
    record: 0,
    current: 0,
  },
  reducers: {
    add(state) {
      const newCurrent = state.current + 1;
      return { ...state,
        record: newCurrent > state.record ? newCurrent : state.record,
        current: newCurrent,
      };
    },
    minus(state) {
      return { ...state, current: state.current - 1};
    },
  },
  effects: {
    *add(action, { call, put }) {
      yield call(delay, 1000);
      yield put({ type: 'minus' });
    },
  },
  subscriptions: {
    keyboardWatcher({ dispatch }) {
      key('⌘+up, ctrl+up', () => { dispatch({type:'add'}) });
    },
  },
});

// 注册视图
app.router(() => <App />);
// 启动应用
app.start('#root');
```

## 图解

### React 表示法

按照 React 官方指导意见, 如果多个 Component 之间要发生交互, 那么状态(即: 数据)就维护在这些 Component 的最小公约父节点上, 也即是 `<App/>`

<img :src="$withBase('/DVA02.png')" alt="DVA02">

### Redux 表示法

React 只负责页面渲染, 而不负责页面逻辑, 页面逻辑可以从中单独抽取出来, 变成 store

1. 状态及页面逻辑从 `<App/>`里面抽取出来, 成为独立的 store, 页面逻辑就是 reducer
2. `<TodoList/>` 及`<AddTodoBtn/>`都是 Pure Component, 通过 connect 方法可以很方便地给它俩加一层 wrapper 从而建立起与 store 的联系: 可以通过 dispatch 向 store 注入 action, 促使 store 的状态进行变化, 同时又订阅了 store 的状态变化, 一旦状态有变, 被 connect 的组件也随之刷新
3. 使用 dispatch 往 store 发送 action 的这个过程是可以被拦截的, 自然而然地就可以在这里增加各种 Middleware, 实现各种自定义功能, eg: logging

<img :src="$withBase('/DVA03.png')" alt="DVA03">

### 加入 Saga

上面说了, 可以使用 Middleware 拦截 action, 这样一来异步的网络操作也就很方便了, 做成一个 Middleware 就行了, 这里使用 redux-saga 这个类库,

1. 点击创建 Todo 的按钮, 发起一个 type == addTodo 的 action。
2. saga 拦截这个 action, 发起 http 请求, 如果请求成功, 则继续向 reducer 发一个 type == addTodoSucc 的 action, 提示创建成功, 反之则发送 type == addTodoFail 的 action 即可。

<img :src="$withBase('/DVA04.png')" alt="DVA04">

### DVA表示

1. 把 store 及 saga 统一为一个 `model` 的概念, 写在一个 js 文件里面。
2. 增加了一个 Subscriptions, 用于收集其他来源的 action, eg: 键盘操作。
3. model 写法很简约, 类似于 DSL 或者 RoR, coding 快得飞起✈️。

<img :src="$withBase('/DVA05.png')" alt="DVA05">