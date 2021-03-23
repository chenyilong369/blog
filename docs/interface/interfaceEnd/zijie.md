# 字节面试

## 2021-03-10 字节一面

### 盒模型

#### 1. 什么是盒模型

**盒模型**由以下属性组成，由外到内用公式表示就是：**box = margin + border + padding + content**。

- **margin**：边距，外部透明区域，负责隔离相邻盒子
- **border**：边框，内部着色区域，负责隔离边距和填充，包含`width`、`style`、`color`三个扩展属性
- **padding**：填充，内部着色区域，负责扩展盒子内部尺寸
- **content**：内容，以`文本`或`节点`存在的占用位置

#### 2. 有什么盒模型，他们有什么区别

CSS3里提供一个属性用于声明盒模型的类型，它就是`box-sizing`。

-  **content-box**：标准盒模型(`默认`)
-  **border-box**：怪异盒模型

他们的区别在于节点的宽高上：

- 标准盒模型：`width = width`
- 怪异盒模型：`width = padding +border +width`

### 请画出一个顶部高度为 200 px，其余空间自适应布局的两行布局

- 弹性布局(flex)
- margin

### == 与 ===

- `==`就是在比对时允许隐式转换
- `===`就是在比对时不允许隐式转换

### promise

#### 1. 说说你怎么了解 Promise 的

依照 Promise/A+ 的定义，Promise 有四种状态：

pending: 初始状态, 非 fulfilled 或 rejected.

fulfilled: 成功的操作.

rejected: 失败的操作.

settled: Promise已被fulfilled或rejected，且不是pending

另外， fulfilled与 rejected一起合称 settled

Promise 对象用来进行延迟(deferred) 和异步(asynchronous) 计算

Promise 实例拥有 then 方法（具有 then 方法的对象，通常被称为thenable）。它的使用方法如下：
`promise.then(onFulfilled, onRejected)`

接收两个函数作为参数，一个在 fulfilled 的时候被调用，一个在rejected的时候被调用，接收参数就是 future，onFulfilled 对应resolve, onRejected对应 reject

#### 2. Promise.all 与 Promise.race

Promise.all可以将多个Promise实例包装成一个新的Promise实例。同时，成功和失败的返回值是不同的，成功的时候返回的是一个结果数组，而失败的时候则返回最先被reject失败状态的值。

顾名思义，Promse.race就是赛跑的意思，意思就是说，Promise.race([p1, p2, p3])里面哪个结果获得的快，就返回那个结果，不管结果本身是成功状态还是失败状态。

#### 3. 手写 Promise.all 

##### 总结 promise.all 的特点

1、接收一个 `Promise` 实例的数组或具有 `Iterator` 接口的对象，

2、如果元素不是 `Promise` 对象，则使用 `Promise.resolve` 转成 `Promise` 对象

3、如果全部成功，状态变为 `resolved`，返回值将组成一个数组传给回调

4、只要有一个失败，状态就变为 `rejected`，返回值将直接传递给回调

```js
function promiseAll(promises) {
    return new Promise(function (resolve, reject) {
        if (!isArray(promises)) {
            return reject(new TypeError('arguments must be an array'));
        }
        var resolvedCounter = 0;
        var promiseNum = promises.length;
        var resolvedValues = new Array(promiseNum);
        for (var i = 0; i < promiseNum; i++) {
            (function (i) {
                Promise.resolve(promises[i]).then(function (value) {
                    resolvedCounter++
                    resolvedValues[i] = value
                    if (resolvedCounter == promiseNum) {
                        return resolve(resolvedValues)
                    }
                }, function (reason) {
                    return reject(reason)
                })
            })(i)
        }
    })
}
```

### 跨域

#### JSONP

- 动态创建 script 标签，然后通过 src 发送跨域请求，在发送请求之前必须声明一个 callback 函数，与参数中的函数名字一致。

- 后端获取前端声明的执行函数 callback，以调用执行函数的方式传递给前端。

### React 生命周期有哪些，请举出几个例子

1. 挂载卸载过程

- constructor()
- componentWillMount()
- componentDidMount()
- componentWillUnmount ()

2. 更新过程

- componentWillReceiveProps (nextProps)
- shouldComponentUpdate(nextProps,nextState)
- componentWillUpdate (nextProps,nextState)
- componentDidUpdate(prevProps,prevState)
- render()

#### componentDidMount()

当组件渲染完毕后才执行的生命周期方法。经常用于组件数据的加载。

### React-router中 hash 和 history 的区别

使用hashHistory时，因为有 # 的存在，浏览器不会发送request,react-router 自己根据 url 去 render 相应的模块。

使用browserHistory时，从 / 到 /user/liuna, 浏览器会向server发送request，所以server要做特殊请求，比如用的 express 的话，你需要 handle 所有的路由 `app.get('*', (req, res) => { ... })`，使用了 nginx 的话，nginx也要做相应的配置。

