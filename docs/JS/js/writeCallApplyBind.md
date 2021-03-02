# 手写 call、apply 及 bind 函数

## call

```js
Function.prototype.myCall = function(context, ...args) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  let context = context || window
  const fn = Symbol("fn")
  context[fn] = this
  const result = context[fn](...args)
  delete context[fn]
  return result
}
```

- 首先 `context` 为可选参数，如果不传的话默认上下文为 `window`
- 接下来给 `context` 创建一个 `fn` 属性，并将值设置为需要调用的函数
- 因为 `call` 可以传入多个参数作为调用函数的参数，所以需要将参数剥离出来
- 然后调用函数并将对象上的函数删除

## apply

```js
Function.prototype.myApply = function(context, argsArr) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  let context = context || window
  const fn = Symbol("fn")
  context[fn] = this
  const result = context[fn](...argsArr)
  delete context[fn]
  return result
}
```

## bind

```js
Function.prototype.myBind = function (context, ...args) {
  if (typeof this !== "function") {
    throw new Error("this must be a function");
  }
  var self = this;
  var fbound = function () {
    self.apply(this instanceof self ? this : context, 					 			                      args.concat(Array.prototype.slice.call(arguments)));
  }
  if(this.prototype) {
    fbound.prototype = Object.create(this.prototype);
  }
  return fbound;
}
```

实现 bind 的核心在于返回的时候需要返回一个函数，故这里的 fbound 需要返回，但是在返回的过程中原型链对象上的属性不能丢失。因此这里需要用Object.create 方法，将 this.prototype 上面的属性挂到 fbound 的原型上面，最后再返回 fbound。这样调用 bind 方法接收到函数的对象，再通过执行接收的函数，即可得到想要的结果。

`this instanceof self`是为了避免一种情况，因为bind函数返回的是一个函数，当我们把这个函数实例化（就是new fun()）的时候，this指向会锁定指向该实例，不管我们传入的参数指定this指向。

