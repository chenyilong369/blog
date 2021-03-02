# 函数柯里化

柯里化就是一个部分配置**多参数函数**的过程，每一步都返回一个接受**单个参数**的部分配置好的函数。

```js
function curry(fn) {
  function _c(restNum, argsList) {
    return restNum === 0 ?
      fn.apply(null, argsList) :
      function(x) {
        return _c(restNum - 1, argsList.concat(x));
      };
  }
  return _c(fn.length, []);
}
```

