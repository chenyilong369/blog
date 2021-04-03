# 手写 promise

注意对照 PromiseA+ 规范。

## 主体

首先写出简单的轮廓：

```js
//定义三种状态
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function MyPromise(executor) {
  let self = this; // 缓存当前promise实例
  self.value = null;
  self.error = null; 
  self.status = PENDING;
  self.onFulfilled = null; //成功的回调函数
  self.onRejected = null; //失败的回调函数

  const resolve = (value) => {
    if(self.status !== PENDING) return;
    setTimeout(() => {
      self.status = FULFILLED;
      self.value = value;
      self.onFulfilled(self.value);//resolve时执行成功回调
    });
  };

  const reject = (error) => {
    if(self.status !== PENDING) return;
    setTimeout(() => {
      self.status = REJECTED;
      self.error = error;
      self.onRejected(self.error);//resolve时执行成功回调
    });
  };
  executor(resolve, reject);
}
MyPromise.prototype.then = function(onFulfilled, onRejected) {
  if (this.status === PENDING) {
    this.onFulfilled = onFulfilled;
    this.onRejected = onRejected;
  } else if (this.status === FULFILLED) {
    //如果状态是fulfilled，直接执行成功回调，并将成功值传入
    onFulfilled(this.value)
  } else {
    //如果状态是rejected，直接执行失败回调，并将失败原因传入
    onRejected(this.error)
  }
  return this;
}
```

可以看到，Promise 的本质是一个`有限状态机`，存在三种状态:

- PENDING(等待)
- FULFILLED(成功)
- REJECTED(失败)

对于 Promise 而言，状态的改变`不可逆`，即由等待态变为其他的状态后，就无法再改变了。

然后设置回调数组。将 `onFulfilled `和 `onRejected` 改为数组，调用 resolve 时将其中的方法拿出来执行。

```js
self.onFulfilledCallbacks = [];
self.onRejectedCallbacks = [];
```

```js
MyPromise.prototype.then = function(onFulfilled, onRejected) {
  if (this.status === PENDING) {
    this.onFulfilledCallbacks.push(onFulfilled);
    this.onRejectedCallbacks.push(onRejected);
  } else if (this.status === FULFILLED) {
    onFulfilled(this.value);
  } else {
    onRejected(this.error);
  }
  return this;
}
```

接下来将 resolve 和 reject 方法中执行回调的部分进行修改:

```js
// resolve 中
self.onFulfilledCallbacks.forEach((callback) => callback(self.value));
//reject 中
self.onRejectedCallbacks.forEach((callback) => callback(self.error));
```

完成链式调用

```js
MyPromise.prototype.then = function (onFulfilled, onRejected) {
  let bridgePromise;
  let self = this;
  if (self.status === PENDING) {
    return bridgePromise = new MyPromise((resolve, reject) => {
      self.onFulfilledCallbacks.push((value) => {
        try {
          // 看到了吗？要拿到 then 中回调返回的结果。
          let x = onFulfilled(value);
          resolve(x);
        } catch (e) {
          reject(e);
        }
      });
      self.onRejectedCallbacks.push((error) => {
        try {
          let x = onRejected(error);
          resolve(x);
        } catch (e) {
          reject(e);
        }
      });
    });
  }
  //...
}
```

假若当前状态为 PENDING，将回调数组中添加如上的函数，当 Promise 状态变化后，会遍历相应回调数组并执行回调。

但是这段程度还是存在一些问题:

1. 首先 then 中的两个参数不传的情况并没有处理，
2. 假如 then 中的回调执行后返回的结果(也就是上面的`x`)是一个 Promise, 直接给 resolve 了。

先对参数不传的情况做判断:

```js
// 成功回调不传给它一个默认函数
onFulfilled = typeof onFulfilled === "function" ? onFulfilled : value => value;
// 对于失败回调直接抛错
onRejected = typeof onRejected === "function" ? onRejected : error => { throw error };
```

然后对`返回Promise`的情况进行处理:

```js
function resolvePromise(bridgePromise, x, resolve, reject) {
  //如果x是一个promise
  if (x instanceof MyPromise) {
    // 拆解这个 promise ，直到返回值不为 promise 为止
    if (x.status === PENDING) {
      x.then(y => {
        resolvePromise(bridgePromise, y, resolve, reject);
      }, error => {
        reject(error);
      });
    } else {
      x.then(resolve, reject);
    }
  } else {
    // 非 Promise 的话直接 resolve 即可
    resolve(x);
  }
}
```

然后在 then 的方法实现中作如下修改:

```js
resolve(x)  ->  resolvePromise(bridgePromise, x, resolve, reject);
```

实现一下当 Promise 状态不为 PENDING 时的逻辑。

成功状态下调用then：

```js
if (self.status === FULFILLED) {
  return bridgePromise = new MyPromise((resolve, reject) => {
    try {
      // 状态变为成功，会有相应的 self.value
      let x = onFulfilled(self.value);
      // 暂时可以理解为 resolve(x)，后面具体实现中有拆解的过程
      resolvePromise(bridgePromise, x, resolve, reject);
    } catch (e) {
      reject(e);
    }
  })
}
```

失败状态下调用then：

```js
if (self.status === REJECTED) {
  return bridgePromise = new MyPromise((resolve, reject) => {
    try {
      // 状态变为失败，会有相应的 self.error
      let x = onRejected(self.error);
      resolvePromise(bridgePromise, x, resolve, reject);
    } catch (e) {
      reject(e);
    }
  });
}
```

Promise A+中规定成功和失败的回调都是微任务，由于浏览器中 JS 触碰不到底层微任务的分配，可以直接拿 `setTimeout`(属于**宏任务**的范畴) 来模拟，用 `setTimeout`将需要执行的任务包裹 。

```js
if (self.status === FULFILLED) {
  return bridgePromise = new MyPromise((resolve, reject) => {
    setTimeout(() => {
      //...
    })
}
```

```js
if (self.status === REJECTED) {
  return bridgePromise = new MyPromise((resolve, reject) => {
    setTimeout(() => {
      //...
    })
}
```

下面对错误捕获及冒泡机制进行分析

首先实现 `catch` 方法：

```js
Promise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected);
}
```

catch 原本就是 then 方法的语法糖。中途一旦发生错误，可以在最后用 catch 捕获错误。

```js
// then 的实现中
onRejected = typeof onRejected === "function" ? onRejected : error => { throw error };
```

一旦其中有一个`PENDING状态`的 Promise 出现错误后状态必然会变为`失败`, 然后执行 `onRejected`函数，而这个 onRejected 执行又会抛错，把新的 Promise 状态变为`失败`，新的 Promise 状态变为失败后又会执行`onRejected`......就这样一直抛下去，直到用`catch` 捕获到这个错误，才停止往下抛。

这就是 Promise 的`错误冒泡机制`。

## API

### Promise.resolve

实现 resolve 静态方法有三个要点:

- 传参为一个 Promise, 则直接返回它。
- 传参为一个 thenable 对象，返回的 Promise 会跟随这个对象，`采用它的最终状态`作为`自己的状态`。
- 其他情况，直接返回以该值为成功状态的promise对象。

```js
Promise.resolve = (param) => {
  if(param instanceof Promise) return param;
  return new Promise((resolve, reject) => {
    if(param && param.then && typeof param.then === 'function') {
      // param 状态变为成功会调用resolve，将新 Promise 的状态变为成功，反之亦然
      param.then(resolve, reject);
    }else {
      resolve(param);
    }
  })
}
```

### Promise.reject

Promise.reject 中传入的参数会作为一个 reason 原封不动地往下传。

```js
Promise.reject = function (reason) {
    return new Promise((resolve, reject) => {
        reject(reason);
    });
}
```

### Promise.prototype.finally

无论当前 Promise 是成功还是失败，调用`finally`之后都会执行 finally 中传入的函数，并且将值原封不动的往下传。

```js
Promise.prototype.finally = function(callback) {
  this.then(value => {
    return Promise.resolve(callback()).then(() => {
      return value;
    })
  }, error => {
    return Promise.resolve(callback()).then(() => {
      throw error;
    })
  })
}
```

### Promise.all

对于 all 方法而言，需要完成下面的核心功能:

1. 传入参数为一个空的可迭代对象，则`直接进行resolve`。
2. 如果参数中`有一个`promise失败，那么Promise.all返回的promise对象失败。
3. 在任何情况下，Promise.all 返回的 promise 的完成状态的结果都是一个`数组`

具体实现如下:

```js
Promise.all = function(promises) {
  return new Promise((resolve, reject) => {
    let result = [];
    let index = 0;
    let len = promises.length;
    if(len === 0) {
      resolve(result);
      return;
    }
   
    for(let i = 0; i < len; i++) {
      // 为什么不直接 promise[i].then, 因为promise[i]可能不是一个promise
      Promise.resolve(promise[i]).then(data => {
        result[i] = data;
        index++;
        if(index === len) resolve(result);
      }).catch(err => {
        reject(err);
      })
    }
  })
}
```

### Promise.race

race 的实现相比之下就简单一些，只要有一个 promise 执行完，直接 resolve 并停止执行。

```js
Promise.race = function(promises) {
  return new Promise((resolve, reject) => {
    let len = promises.length;
    if(len === 0) return;
    for(let i = 0; i < len; i++) {
      Promise.resolve(promise[i]).then(data => {
        resolve(data);
        return;
      }).catch(err => {
        reject(err);
        return;
      })
    }
  })
}
```



