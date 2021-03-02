# 手写 new

new 关键词的主要作用就是执行一个构造函数、返回一个实例对象，在 new 的过程中，根据构造函数的情况，来确定是否可以接受参数的传递。

在调用 `new` 的过程中会发生以上四件事情：

1. 创建一个新对象；并将构造函数的作用域赋给新对象（this 指向新对象）；
3. 执行构造函数中的代码（为这个新对象添加属性）；
4. 返回新对象。

```js
function _new(fn, ...args) {
  let obj = Object.create(fn.prototype)
  let result = fn.apply(obj, args)
  return result instanceof Object ? result : obj
}
```

new 关键词执行之后总是会返回一个对象，要么是实例对象，要么是 return 语句指定的对象。

