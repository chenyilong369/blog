# React-router

这里声明一下，不会怎么介绍 React-router 的 API，可以从[官方文档](https://reactrouter.com/web/guides/quick-start)中进行学习。

下面主要是介绍它的原理以及一个简单的应用场景。

## 前端路由鉴权

一般的系统都会有用户访问权限的限制，某些页面可能需要用户具有一定的权限才能访问。那么我们可以根据 React-router 来实现一个前端路由鉴权。

首先我们通过 `create-react-app` 创建一个新项目。然后在 src 目录下创建 pages 目录，在其中创建 4 个文件。

::: tip

`/index`: 网站首页

`/login`: 登录页

`/backend`：后台页面

`/admin`：管理页面

:::

以及定义三种角色：

::: tip

1. `未登录用户`：只能访问网站首页`/index`和登录页`/login`
2. `普通用户`：可以访问网站首页`/index`，登录页`/login`和后台页面`/backend`
3. `管理员`：可以访问管理页面`/admin`和其他所有页面

:::

首先在项目里面引入`react-router-dom`。

```js
// App.js
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Backend from './pages/Backend';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login}/>
        <Route path="/backend" component={Backend}/>
        <Route path="/admin" component={Admin}/>
        <Route path="/" component={Home}/>
      </Switch>
    </Router>
  );
}

export default App;
```

然后可以在`Home`页面用`Link`加上跳转到其他页面的链接，这样就可以跳转了:

```js
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      <h1>首页</h1>
      <ul>
        <li><Link to="/login">登录</Link></li>
        <li><Link to="/backend">后台</Link></li>
        <li><Link to="/admin">管理员</Link></li>
      </ul>
    </>
  );
}

export default Home;
```

<img :src='$withBase('./react/ReactRouter01.png')' alt='ReactRouter01'/>

### 模块划分

前面我们实现了跳转链接，但是目前所有人都可以访问任意一个页面，我们的需求是要根据登录的角色限制访问的页面，在写代码前，我们先来思考下应该怎么做这个。

当然最直观最简单的方法就是每个页面都检测下当前用户的角色，匹配不上就报错或者跳回首页。我们现在只有几个页面，这样做好像也还好，但是如果我们的应用变大了，页面变多了，每个页面都来一次检测就显得很重复了。

这里总共就三种角色，对应三种不同的权限，这三个权限还有层级关系，高级别的权限包含了低级别的权限，所以页面也可以按照这些权限分为三种：

- `公共页面`：所有人都可以访问，没登录也可以访问，包括网站首页和登录页
- `普通页面`：普通登录用户可以访问的页面
- `管理员页面`：只有管理员才能访问的页面

于是为了管理这三个权限，放在一个独立的文件夹 `routes` 里面。将这三个文件分别命名为`publicRoutes.js`，`privateRoutes.js`，`adminRoutes.js`。

对于每个路由文件，我们可以将这类路由组织成数组，然后`export`出去给外面调用，比如`publicRoutes.js`：

```js
import Login from '../pages/Login';
import Home from '../pages/Home';

const publicRoutes = [
  {
    path: '/login',
    component: Login,
    exact: true,
  },
  {
    path: '/',
    component: Home,
    exact: true,
  },
];

export default publicRoutes;
```

然后我们外面使用的地方直接改为：

```js
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Backend from './pages/Backend';
import Admin from './pages/Admin';
import publicRoutes from './routes/publicRoutes'

function App() {
  return (
    <Router>
      <Switch>
      {publicRoutes.map(
          ({path, component, ...routes}) => 
            <Route key={path} path={path} component={component} {...routes}/>
        )}
        <Route path="/backend" component={Backend}/>
        <Route path="/admin" component={Admin}/>
      </Switch>
    </Router>
  );
}

export default App;
```

这样`App.js`里面就不会有冗长的路由路由列表了，而是只需要循环一个数组就行了。但是对于需要登录才能访问的页面和管理员页面我们不能直接渲染`Route`组件，最好再封装一个高级组件，将鉴权的工作放到这个组件里面去，这样普通的页面在实现时就不需要关心怎么鉴权了。

### 高级组件

实现的思路基本是，在渲染真正的`Route`组件前先检查一下当前用户是否有对应的权限，如果有就直接渲染`Route`组件，如果没有就返回某个页面。

```js
// privateRoutes.js
import Backend from '../pages/Backend';

const privateRoutes = [
  {
    path: '/backend',
    component: Backend,
    exact: true,
    role: 'user',       // 当前路由需要的角色权限
    backUrl: '/login'   // 不满足权限跳转的路由
  },
];

export default privateRoutes;
```

```js
// adminRoutes.js
import Admin from '../pages/Admin';

const adminRoutes = [
  {
    path: '/admin',
    component: Admin,
    exact: true,
    role: 'admin',       // 需要的权限是admin
    backUrl: '/backend'  // 不满足权限跳回后台页面
  },
];

export default adminRoutes;
```

然后就可以动手写高级组件了。假设用户登录时后端API会返回给我们当前用户的角色，一个用户可能有多个角色，比如普通用户的角色是`['user']`，管理员的角色是`['user', 'admin']`。例如下面的例子。

```js
import React from 'react'
import {Route, Redirect} from 'react-router-dom'

const AuthRoute = (props) => {
  const {
    user: {
      role: userRole
    },
    role: routeRole,
    backUrl,
    ...otherProps
  } = props

  // 如果用户有权限，就渲染对应的路由
  if (userRole && userRole.indexOf(routeRole) > -1) {
    return <Route {...otherProps} />
  } else {
    // 如果没有权限，返回配置的默认路由
    return <Redirect to={backUrl} />
  }
}

export default AuthRoute
```

然后用 `AuthRoute`的渲染`adminRoutes`和`privateRoutes`。

```js
// ... 省略其他代码 ...

{privateRoutes.map(
  (route) => <AuthRoute key={route.path} {...route}/>
)}
{adminRoutes.map(
  (route) => <AuthRoute key={route.path} {...route}/>
)}
```

### 登录设置权限

在我们的`AuthRoute`里面用到了`user: { role }`这个变量，但是我们还没设置它。真实项目中一般是登录的时候后端API会返回当前用户的角色，然后前端将这个权限信息保存在一些状态管理工具里面，比如`Redux`。

我们这里直接在`Login`页面写死两个按钮来模拟这个权限了，用户的配置就用根组件的`state`来管理了，`Login`页面的两个按钮会改变对应的`state`:

```js
// Login.js
import React from 'react'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'

const Login = (props) => {
  const {loginAsUser, loginAsAdmin, history} = props

  const userLoginHandler = () => {
    loginAsUser();  // 调用父级方法设置用户权限
    history.replace('/backend')  // 登录后跳转后台页面
  }

  const adminLoginHandler = () => {
    loginAsAdmin();  // 调用父级方法设置管理员权限
    history.replace('/admin')  // 登录后跳转管理员页面
  }

  return (
    <>
      <h1>登录页</h1>
      <button>普通用户登录</button>
      <br/>
      <button>管理员登录</button>
      <br/>
      <Link to="/">回首页</Link>
    </>
  )
}

export default Login
```

这个简单的路由鉴权就完成了。

下面简单总结一下：

- `React-Router`可以用来管理前端的路由跳转，是`React`生态里面很重要的一个库。

- `React-Router`为了同时支持浏览器和`React-Native`，他分拆成了三个包`react-router`核心包，`react-router-dom`浏览器包，`react-router-native`支持`React-Native`。使用时不需要引入`react-router`，只需要引入需要的平台包就行。

- 对于需要不同权限的路由，我们可以将他们拎出来分好类，单独建成一个文件，如果路由不多，放在一个文件导出多个数组也行。

- 对于需要鉴权的路由，我们可以用一个高级组件将权限校验的逻辑封装在里面，其他页面只需要加好配置，完全不用关心鉴权的问题。

## 手写 React-router

`React-Router`的结构是一个典型的`monorepo`，`monorepo`这两年开始流行了，是一种比较新的多项目管理方式，与之相对的是传统的`multi-repo`。

`packages`文件夹下面有四个文件夹，这四个文件夹每个都可以作为一个单独的项目发布。之所以把他们放在一起，是因为他们之前有很强的依赖关系：

- **react-router**：是`React-Router`的核心库，处理一些共用的逻辑 
- **react-router-config**：是`React-Router`的配置处理，我们一般不需要使用 
- **react-router-dom**：浏览器上使用的库，会引用`react-router`核心库
- **react-router-native**：支持`React-Native`的路由库，也会引用`react-router`核心库

<img :src='$withBase('./react/ReactRouter02.png')' alt='ReactRouter02'/>

### 架构思路

- 监听 url 变化
- 改变 current 变量
- 监视 current 变量
- 获取对应的组件
- render 新组件

### BrowserRouter

上代码：

```js
import React from 'react'
import {Router} from '../react_router'
import {createBrowserHistory as createHistory} from '../history'

class BrowserRouter extends React.Component {
  history = createHistory(this.props)

  render() {
    return <Router history={this.history} children={this.props.children}/>
  }
}

export default BrowserRouter
```

`BrowserRouter`仅仅是调用`history`的`createHistory`得到一个`history`对象，然后用这个对象渲染了`react-router`的`Router`组件。

### Router

```js
import React from 'react'

import HistoryContext from './HistoryContext.js'
import RouterContext from './RouterContext.js'

class Router extends React.Component {
  // 检测当前路由是否匹配
  static computedRootMatch(pathname) {
    return {
      path:'/',
      url: '/',
      params: {},
      isExact: pathname === "/"
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      location: props.history.location // 将history的location挂载到state上
    }
    
    this._isMounted = false
    this._pendingLocation = null
    
    this.unListen = props.history.listen(location => {
      if(this._isMounted) {
        this.setState({
          location
        })
      } else {
        this._pendingLocation = location
      }
    })
  }

  componentDidMount() {
    this._isMounted = true
    if(this._pendingLocation) {
      this.setState({
        location: this._pendingLocation
      })
    }
  }

  componentWillUnmount() {
    if(this.unListen) {
      this.unListen()
      this._isMounted = false
      this._pendingLocation = null
    }
  }

  render() {
    return (
      <RouterContext.Provider
        value={{
          history: this.props.history,
          location: this.state.location,
          match:Router.computedRootMatch(this.state.location.pathname)
        }}
      >
        <HistoryContext.Provider
          children={this.props.children || null}
          value={this.props.history}
        />
      </RouterContext.Provider>
    )
  }
}

export default Router
```

Router 组件所做的主要是将 history 信息和路由信息放到了两个 context 上。

### history

```js
function createEvent() {
  let handlers = []
  return {
    push(fn) {
      handlers.push(fn)
      return () => {
        handlers = handlers.filter((handler) => handler !== fn)
      }
    },
    call(args) {
      handlers.forEach((handler) => handler & handler(args))
    },
  }
}

// 监听popstate事件
// 注意pushState和replaceState并不会触发popstate
// 但是浏览器的前进后退会触发popstate
// 我们这里监听这个事件是为了处理浏览器的前进后退
function createBrowserHistory() {
  const listeners = new createEvent()
  let location = {
    pathname: '/',
  }

  const handlePop = function () {
    const currentLocation = {
      pathname: window.location.pathname,
    }
    listeners.call(currentLocation)
  }

  window.addEventListener('popstate', handlePop)

  const history = {
    listen(history) {
      return listeners.push(history)
    },
    push(url) {
      const history = window.history
      // pushState 不会触发 popstate
      // 这么做是为了保证 state 的一致性
      history.pushState(null, '', url)
      location = {
        pathname: url,
      }
      listeners.call(location)
    },
    location
  }

  return history
}

export default createBrowserHistory
```

createBrowserHistory：这个是用在 BrowserRouter 里面的，用来创建一个 history对象，后面的 listen 和 unlisten 都是挂载在这个 api 上的。

history.listen：这个是在 Router 里面使用，用来监听路由变化。

history.unlisten：这个也是在 Router 组件里面使用，用来在清理时取消监听。

 ### Route

Route 组件主要用来匹配路由和具体的组件。该组件的作用就是将参数上的 path 和当前路由 `location` 进行对比，若匹配上了就渲染参数`component`对应的组件就行。

我们用下面这个函数来匹配路由：

```js
import pathToRegexp from "path-to-regexp";

const cache = {};
const cacheLimit = 10000;
let cacheCount = 0;

function compilePath(path, options) {
  const cacheKey = `${options.end}${options.strict}${options.sensitive}`;
  const pathCache = cache[cacheKey] || (cache[cacheKey] = {});

  if (pathCache[path]) return pathCache[path];

  const keys = [];
  const regexp = pathToRegexp(path, keys, options);
  const result = { regexp, keys };

  if (cacheCount < cacheLimit) {
    pathCache[path] = result;
    cacheCount++;
  }

  return result;
}

/**
 * Public API for matching a URL pathname to a path.
 */
function matchPath(pathname, options = {}) {
  if (typeof options === "string" || Array.isArray(options)) {
    options = { path: options };
  }

  const { path, exact = false, strict = false, sensitive = false } = options;

  const paths = [].concat(path);

  return paths.reduce((matched, path) => {
    if (!path && path !== "") return null;
    if (matched) return matched;

    const { regexp, keys } = compilePath(path, {
      end: exact,
      strict,
      sensitive
    });
    const match = regexp.exec(pathname);

    if (!match) return null;

    const [url, ...values] = match;
    const isExact = pathname === url;

    if (exact && !isExact) return null;

    return {
      path, // the path used to match
      url: path === "/" && url === "" ? "/" : url, // the matched portion of the URL
      isExact, // whether or not we matched exactly
      params: keys.reduce((memo, key, index) => {
        memo[key.name] = values[index];
        return memo;
      }, {})
    };
  }, null);
}

export default matchPath;
```

调用下`matchPath`来看下当前路由是否匹配就行了，当前路由记得从`RouterContext`里面拿：

```js
import React, { Component } from 'react'
import RouterContext from './RouterContext'
import matchPath from './matchPath'

class Route extends Component {
  render() {
    return (
      <RouterContext.Consumer>
        {(context) => {
          const location = context.location
          const match = this.props.computedMatch
            ? this.props.computedMatch
            : matchPath(location.pathname, this.props) // 调用matchPath检测当前路由是否匹配
          const props = { ...context, location, match }
          let { component } = this.props

          // render对应的component之前先用最新的参数match更新下RouterContext
          // 这样下层嵌套的Route可以拿到对的值
          return (
            <RouterContext.Provider value={props}>
              {props.match ? React.createElement(component, props) : null}
            </RouterContext.Provider>
          )
        }}
      </RouterContext.Consumer>
    )
  }
}

export default Route
```

### Switch

上面的`Route`组件的功能是只要`path`匹配上当前路由就渲染组件，也就意味着如果多个`Route`的`path`都匹配上了当前路由，这几个组件都会渲染。所以`Switch`组件的功能只有一个，就是即使多个`Route`的`path`都匹配上了当前路由，也只渲染第一个匹配上的组件。

把`Switch`的`children`拿出来循环，找出第一个匹配的`child`，给它添加一个标记属性`computedMatch`，顺便把其他的`child`全部干掉，然后修改下`Route`的渲染逻辑，先检测`computedMatch`，如果没有这个再使用`matchPath`自己去匹配。

```js
import React from "react";

import RouterContext from "./RouterContext.js";
import matchPath from "./matchPath.js";

class Switch extends React.Component {
  render() {
    return (
      <RouterContext.Consumer>
        {context => {
          const location = context.location;     // 从RouterContext获取location

          let element, match;     // 两个变量记录第一次匹配上的子元素和match属性

          // 使用React.Children.forEach来遍历子元素，而不能使用React.Children.toArray().find()
          // 因为toArray会给每个子元素添加一个key，这会导致两个有同样component，但是不同URL的<Route>重复渲染
          React.Children.forEach(this.props.children, child => {
            // 先检测下match是否已经匹配到了
            // 如果已经匹配过了，直接跳过
            if (!match && React.isValidElement(child)) {
              element = child;

              const path = child.props.path;

              match = matchPath(location.pathname, { ...child.props, path });
            }
          });

          // 最终<Switch>组件的返回值只是匹配上子元素的一个拷贝，其他子元素被忽略了
          // match属性会被塞给拷贝元素的computedMatch
          // 如果一个都没匹配上，返回null
          return match
            ? React.cloneElement(element, { location, computedMatch: match })
            : null;
        }}
      </RouterContext.Consumer>
    );
  }
}

export default Switch;
```

然后修改下`Route`组件，让他先检查`computedMatch`:

```js
const match = this.props.computedMatch
              ? this.props.computedMatch
              : matchPath(location.pathname, this.props); // 调用matchPath检测当前路由是否匹配
```

### Link

`Link`组件功能也很简单，就是一个跳转，浏览器上要实现一个跳转，可以用`a`标签，但是如果直接使用`a`标签可能会导致页面刷新，所以不能直接使用它，而应该使用[history API](https://developer.mozilla.org/zh-CN/docs/Web/API/History)。要跳转URL可以直接使用`history.pushState`，但有几点需要注意。

1. `history.pushState`只会改变`history`状态，不会刷新页面。换句话说就是你用了这个API，你会看到浏览器地址栏的地址变化了，但是页面并没有变化。
2. 当你使用`history.pushState`或者`history.replaceState`改变`history`状态的时候，`popstate`事件并不会触发，所以`history`里面的回调不会自动调用，当用户使用`history.push`的时候我们需要手动调用回调函数。
3. `history.pushState(state, title[, url])`接收三个参数，第一个参数`state`是往新路由传递的信息，可以为空，官方`React-Router`会往里面加一个随机的`key`和其他信息，我们这里直接为空吧，第二个参数`title`目前大多数浏览器都不支持，可以直接给个空字符串，第三个参数`url`是可选的，是我们这里的关键，这个参数是要跳往的目标地址。
4. 由于`history`已经成为了一个独立的库，所以我们应该将`history.pushState`相关处理加到`history`库里面。

先在`history`里面新加一个API`push`，这个API会调用`history.pushState`并手动执行回调：

```js
push(url) {
  const history = window.history;
  // 这里pushState并不会触发popstate
  // 但是我们仍然要这样做，是为了保持state栈的一致性
  history.pushState(null, '', url);

  // 由于push并不触发popstate，我们需要手动调用回调函数
  location = { pathname: url };
  listeners.call(location);
}
```

那么`Link`组件应该渲染个什么标签在页面上呢？官方还是选择渲染一个`a`标签在这里，只是使用`event.preventDefault`禁止了默认行为，然后用`history api`自己实现了跳转。可以自己传`component`参数进去改变默认的`a`标签。

因为是`a`标签，不能兼容`native`，所以`Link`组件其实是在`react-router-dom`这个包里面。

```js
import React from "react";
import RouterContext from "../react-router/RouterContext";

// LinkAnchor只是渲染了一个没有默认行为的a标签
// 跳转行为由传进来的navigate实现
function LinkAnchor({navigate, ...rest}) {
  let props = {
    ...rest,
    onClick: event => {
      event.preventDefault();
      navigate();
    }
  }

  return <a {...props} />;
}

function Link({
  component = LinkAnchor,
  to,
  ...rest
}) {
  return (
    <RouterContext.Consumer>
      {context => {
        const { history } = context;     // 从RouterContext获取history对象

        const props = {
          ...rest,
          href: to,
          navigate() {
            history.push(to);
          }
        };

        return React.createElement(component, props);
      }}
    </RouterContext.Consumer>
  );
}

export default Link;
```

以上基本实现了 React-router 的核心功能，这里只是首先了 H5 history，并未实现 hash（hash其实差不多）。

下面做个小小的总结。

`React-Router`实现时核心逻辑如下： 

1. 使用不刷新的路由API，比如`history`或者`hash`
2. 提供一个事件处理机制，让`React`组件可以监听路由变化。
3. 提供操作路由的接口，当路由变化时，通过事件回调通知`React`。
4. 当路由事件触发时，将变化的路由写入到`React`的响应式数据上，也就是将这个值写到根`router`的`state`上，然后通过`context`传给子组件。
5. 具体渲染时将路由配置的`path`和当前浏览器地址做一个对比，匹配上就渲染对应的组件。



















