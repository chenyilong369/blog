# Promise

Promise有三种状态

1. 等待中（pending）
2. 完成了 （resolved）
3. 拒绝了（rejected）

这个承诺一旦从等待状态变成为其他状态就永远不能更改状态了，也就是说一旦状态变为 resolved 后，就不能再次改变。

当我们在构造 Promise 的时候，构造函数内部的代码是立即执行的。

```js
new Promise((resolve, reject) => {
  console.log('new Promise')
  resolve('success')
})
console.log('finifsh')
// new Promise -> finifsh
```

Promise 实现了链式调用，也就是说每次调用 then 之后返回的都是一个 Promise，并且是一个全新的 Promise，原因也是因为状态不可变。如果你在 then 中使用了 return，那么 return 的值会被 Promise.resolve() 包装。

```js
Promise.resolve(1)
  .then(res => {
    console.log(res) // => 1
    return 2 // 包装成 Promise.resolve(2)
  })
  .then(res => {
    console.log(res) // => 2
  })
```

它也是存在一些缺点的，比如无法取消 Promise，错误需要通过回调函数捕获。

## Promise 如何解决回调地狱的

### Promise 实现了回调函数的延时绑定

回调函数的延时绑定在代码上体现就是先创建 Promise 对象 x1，通过 Promise 的构造函数 executor 来执行业务逻辑；创建好 Promise 对象 x1 之后，再使用 x1.then 来设置回调函数。

```js
//创建Promise对象x1，并在executor函数中执行业务逻辑
function executor(resolve, reject){
    resolve(100)
}
let x1 = new Promise(executor)


//x1延迟绑定回调函数onResolve
function onResolve(value){
    console.log(value)
}
x1.then(onResolve)
```

### 需要将回调函数 onResolve 的返回值穿透到最外层

```js
//创建Promise对象x1，并在executor函数中执行业务逻辑
function executor(resolve, reject){
    resolve(100)
}
let x1 = new Promise(executor)


//x1延迟绑定回调函数onResolve
function onResolve(value){
    console.log(value)
}
let x2 = x1.then(onResolve) // 返回值穿透到最外层
```

## Promise 与微任务

```js
function executor(resolve, reject) {
    resolve(100)
}
let demo = new Promise(executor)

function onResolve(value){
    console.log(value)
}
demo.then(onResolve)
```

首先执行 new Promise 时，Promise 的构造函数会被执行。

Promise 的构造函数会调用 Promise 的参数 executor 函数。然后在 executor 中执行了 resolve。执行 resolve 函数，会触发 demo.then 设置的回调函数 onResolve，所以可以推测，resolve 函数内部调用了通过 demo.then 设置的 onResolve 函数。

由于 Promise 采用了回调函数延迟绑定技术，所以在执行 resolve 函数的时候，回调函数还没有绑定，那么只能推迟回调函数的执行。

在我手写的 Promise 中，可以看到采用了定时器来推迟 onResolve 的执行，不过使用定时器的效率并不是太高，好在我们有微任务，所以 Promise 又把这个定时器改造成了微任务了，这样既可以让 onResolve_ 延时被调用，又提升了代码的执行效率。

## 语法

用通俗的话语来理解，Promise 就像是一个定义列表，就像作者写书，读者们订阅，当作者新章节出来后，读者们都可以收到消息。如果发生了事故，读者们也能知道原因。

```js
let promise = new Promise(function(resolve, reject) {
  // executor（生产者代码）
});
```

当 `new Promise` 被创建，executor 会自动运行。它包含最终应产出结果的生产者代码。

- `resolve(value)` — 如果任务成功完成并带有结果 `value`。
- `reject(error)` — 如果出现了 error，`error` 即为 error 对象。

由 `new Promise` 构造器返回的 `promise` 对象具有以下内部属性：

- `state` — 最初是 `"pending"`，然后在 `resolve` 被调用时变为 `"fulfilled"`，或者在 `reject` 被调用时变为 `"rejected"`。
- `result` — 最初是 `undefined`，然后在 `resolve(value)` 被调用时变为 `value`，或者在 `reject(error)` 被调用时变为 `error`。

### then

```js
promise.then(
  function(result) { /* handle a successful result */ },
  function(error) { /* handle an error */ }
);
```

`.then` 的第一个参数是一个函数，该函数将在 promise resolved 后运行并接收结果。

`.then` 的第二个参数也是一个函数，该函数将在 promise rejected 后运行并接收 error。

### catch

如果我们只对 error 感兴趣，那么我们可以使用 `null` 作为第一个参数：`.then(null, errorHandlingFunction)`。或者我们也可以使用 `.catch(errorHandlingFunction)`。

### finally

`.finally(f)` 调用与 `.then(f, f)` 类似，在某种意义上，`f` 总是在 promise 被 settled 时运行：即 promise 被 resolve 或 reject。

## Promise API

### Promise.all

假设我们希望并行执行多个 promise，并等待所有 promise 都准备就绪。

例如，并行下载几个 URL，并等到所有内容都下载完毕后再对它们进行处理。

```js
let promise = Promise.all([...promises...]);
```

`Promise.all` 接受一个 promise 数组作为参数（从技术上讲，它可以是任何可迭代的，但通常是一个数组）并返回一个新的 promise。

当所有给定的 promise 都被 settled 时，新的 promise 才会 resolve，并且其结果数组将成为新的 promise 的结果。

**如果任意一个 promise 被 reject，由 `Promise.all` 返回的 promise 就会立即 reject，并且带有的就是这个 error。**

### Promise.allSettled

`Promise.allSettled` 等待所有的 promise 都被 settle，无论结果如何。结果数组具有：

- `{status:"fulfilled", value:result}` 对于成功的响应，
- `{status:"rejected", reason:error}` 对于 error。

```js
let urls = [
  'https://api.github.com/users/iliakan',
  'https://api.github.com/users/remy',
  'https://no-such-url'
];

Promise.allSettled(urls.map(url => fetch(url)))
  .then(results => { // (*)
    results.forEach((result, num) => {
      if (result.status == "fulfilled") {
        alert(`${urls[num]}: ${result.value.status}`);
      }
      if (result.status == "rejected") {
        alert(`${urls[num]}: ${result.reason}`);
      }
    });
  });
```

上面的 result 会是：

```js
[
  {status: 'fulfilled', value: ...response...},
  {status: 'fulfilled', value: ...response...},
  {status: 'rejected', reason: ...error object...}
]
```

### Promise.race

与 `Promise.all` 类似，但只等待第一个 settled 的 promise 并获取其结果（或 error）。

### Promise.resolve/reject

`Promise.resolve(value)` 用结果 `value` 创建一个 resolved 的 promise。

```js
let promise = new Promise(resolve => resolve(value));
```

当一个函数被期望返回一个 promise 时，这个方法用于兼容性。（这里的兼容性是指，我们直接从缓存中获取了当前操作的结果 `value`，但是期望返回的是一个 promise，所以可以使用 `Promise.resolve(value)` 将 `value` “封装”进 promise，以满足期望返回一个 promise 的这个需求。）

### Promise.reject

`Promise.reject(error)` 用 `error` 创建一个 rejected 的 promise。

```js
let promise = new Promise((resolve, reject) => reject(error));
```

