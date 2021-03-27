# 利用react实现路由（简单）

在浏览器中有两种路由：

1. hash 路由：监听 url 中 hash 的变化，然后渲染不同的内容，这种路由不向服务器发送请求，不需要服务端的支持；
2. history 路由：监听 url 中的路径变化，需要客户端和服务端共同的支持；

我们一步步实现这两种路由，来深入理解下底层的实现原理。我们主要实现以下几个简单的功能：

1. 监听路由的变化，当路由发生变化时，可以作出动作；
2. 可以前进或者后退；
3. 可以配置路由；

## hash 路由

在 react 中使用。

```js
// hash.js
class HashRouter {
  currentUrl = ''
  handlers = {}

  constructor() {
    this.refresh = this.refresh.bind(this)
    window.addEventListener('load', this.refresh, false)
    window.addEventListener('hashchange', this.refresh, false)
  }

  getHashPath(url) {
    const index = url.indexOf('#')
    if(index >= 0) {
      return url.slice(index + 1)
    }
    return '/'
  }

  refresh(event) {
    let curURL = '', oldURL = null;
    if(event.newURL) {
      oldURL = this.getHashPath(event.oldURL || '')
      curURL = this.getHashPath(event.newURL || '')
    } else {
      curURL = this.getHashPath(window.location.hash)
    }
    this.currentUrl = curURL
    this.emit('change', curURL, oldURL)
  }

  on(eventName, listener) {
    this.handlers[eventName] = listener
  }

  emit(eventName, ...args) {
    const handler = this.handlers[eventName]
    if(handler) {
      handler(...args)
    } 
  }
}

export default HashRouter
```

```js
// index.js
import React from 'react'
import ReactDOM from 'react-dom'
import HashRouter from './hash'

function App() {
  return (
    <div className='App'>
      <div className='container'>
        <h1>我是标题</h1>
        <p>我是第一段话</p>
        <p>我是第二段话</p>
      </div>
    </div>
  )
}

const Home = () => {
  return <div>111</div>
}

const NotFound = () => {
  return <div>NotFound</div>
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: <Home />,
  },
  {
    path: '/app',
    name: 'App',
    component: <App />,
  },
  {
    path: '*',
    name: '404',
    component: <NotFound />,
  },
]

const router = new HashRouter()

router.on('change', (currentUrl, lastUrl) => {
  let route = null
  for (let i = 0, len = routes.length; i < len; i++) {
    const item = routes[i]
    if(currentUrl === item.path) {
      route = item
      break
    }
  }
  if(!route) {
    route = routes[routes.length - 1]
  }
  ReactDOM.render(route.component, document.getElementById('root'))
})

```

事件`hashchange`只会在 hash 发生变化时才能触发，而第一次进入到页面时并不会触发这个事件，因此我们还需要监听`load`事件。这里要注意的是，两个事件的 event 是不一样的：hashchange 事件中的 event 对象有 oldURL 和 newURL 两个属性，但 load 事件中的 event 没有这两个属性，不过我们可以通过 location.hash 来获取到当前的 hash 路由。

## history

在 history 路由中，我们会使用`window.history`中的方法，常见的操作有：

- back()：后退到上一个路由；
- forward()：前进到下一个路由，如果有的话；
- go(number)：进入到任意一个路由，正数为前进，负数为后退；
- pushState(obj, title, url)：前进到指定的 URL，不刷新页面；
- replaceState(obj, title, url)：用 url 替换当前的路由，不刷新页面；

调用这几种方式时，都会只是修改了当前页面的 URL，页面的内容没有任何的变化。

前 3 个方法只是路由历史记录的前进或者后退，无法跳转到指定的 URL；而`pushState`和`replaceState`可以跳转到指定的 URL。

如果服务端没有新更新的 url 时，一刷新浏览器就会报错，因为刷新浏览器后，是真实地向服务器发送了一个 http 的网页请求。因此若要使用 history 路由，需要服务端的支持。

pushState 和 replaceState 两个方法跟 location.href 和 location.replace 两个方法有什么区别呢？应用的场景有哪些呢？

1. location.href 和 location.replace 切换时要向服务器发送请求，而 pushState 和 replace 仅修改 url，除非主动发起请求；
2. 仅切换 url 而不发送请求的特性，可以在前端渲染中使用，例如首页是服务端渲染，二级页面采用前端渲染；
3. 可以添加路由切换的动画；
4. 在浏览器中使用类似抖音的这种场景时，用户滑动切换视频时，可以静默修改对应的 URL，当用户刷新页面时，还能停留在当前视频。

当我们用 history 的路由时，必然要能监听到路由的变化才行。全局有个`popstate`事件，但`pushState`和`replaceState`被调用时，是不会触发触发 popstate 事件的，只有上面列举的前 3 个方法会触发。

针对这种情况，我们可以使用`window.dispatchEvent`添加事件：

```js
class HistoryRouter {
  currentUrl = '';
  handlers = {};

  constructor() {
      this.refresh = this.refresh.bind(this);
      this.addStateListener();
      window.addEventListener('load', this.refresh, false);
      window.addEventListener('popstate', this.refresh, false);
      window.addEventListener('pushState', this.refresh, false);
      window.addEventListener('replaceState', this.refresh, false);
  }
  addStateListener() {
      const listener = function (type) {
          var orig = history[type];
          return function () {
              var rv = orig.apply(this, arguments);
              var e = new Event(type);
              e.arguments = arguments;
              window.dispatchEvent(e);
              return rv;
          };
      };
      window.history.pushState = listener('pushState');
      window.history.replaceState = listener('replaceState');
  }
  refresh(event) {
      this.currentUrl = location.pathname;
      this.emit('change', location.pathname);
      document.querySelector('#app span').innerHTML = location.pathname;
  }
  on(evName, listener) {
      this.handlers[evName] = listener;
  }
  emit(evName, ...args) {
      const handler = this.handlers[evName];
      if (handler) {
          handler(...args);
      }
  }
}
const router = new HistoryRouter();
router.on('change', function (curUrl) {
  console.log(curUrl);
});
```