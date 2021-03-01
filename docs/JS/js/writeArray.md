# 手写 Array 的一些方法

参考[官方](https://tc39.es/ecma262/)

## push

下面给出官方的描述。

When the push method is called with zero or more arguments, the following steps are taken:
1. Let O be ? ToObject(this value).
2. Let len be ? LengthOfArrayLike(O).
3. Let argCount be the number of elements in items.
4. If len + argCount > 2^53 - 1, throw a TypeError exception.
5. For each element E of items, do
    a. Perform ? Set(O, ! ToString(F(len)), E, true).
  b. Set len to len + 1.
6. Perform ? Set(O, "length", F(len), true).
7. Return F(len).

```js
Array.prototype.push = function(...items) {
  let O = Object(this)
  let len = this.length >>> 0
  let argsLen = items.length >>> 0

  if(len + argsLen > 2 ** 53 - 1) {
    throw new TypeError("The number of array is over the max value")
  }
  for (let i = 0 ; i < argsLen ; i++) {
    O[len + i] = items[i]
  }
  let newLength = len + argsLen
  O.length = newLength
  return newLength
}
```

这里就讲讲无符号位移吧。

移位操作符在移位前做了两种转换，第一将不是**number**类型的数据转换为number，第二将**number**转换为无符号的**32bit**数据，也就是**Uint32**类型。代码中移位 0 位主要就是用了js的内部特性做了前两种转换。

我们看一下转换为Uint32类型具体的规则：

1. 如果不能转换为`Number`，那就为`0`。
2. 如果为非整数，先转换为整数，参考公式`sign(n) ⋅ floor(abs(n))`

3. 如果是正数，返回正数，如果是负数，返回负数 + 2的32次方

`x >>> 0`本质上就是保证x有意义（为数字类型），且为正整数，在有效的数组范围内（0 ～ 0xFFFFFFFF），且在无意义的情况下缺省值为0。

## pop

下面给出官方的解释：

When the pop method is called, the following steps are taken:
1. Let O be ? ToObject(this value).
2. Let len be ? LengthOfArrayLike(O).
3. If len = 0, then
    Perform ? Set(O, "length", +0F, true).
    Return undefined.
4. Else,
    Assert: len > 0.
  Let newLen be F(len - 1).
  Let index be ! ToString(newLen).
  Let element be ? Get(O, index).
  Perform ? DeletePropertyOrThrow(O, index).
  Perform ? Set(O, "length", newLen, true).
  Return element.

```js
Array.prototype.pop = function() {
  let O = Object(this)
  let len = this.length >>> 0
  if(len == 0) {
    O.length = 0
    return undefined
  }
  len--
  let value = O[len]
  delete O[len]
  O.length = len
  return value
}
```

## map

When the map method is called with one or two arguments, the following steps are taken:
1. Let O be ? ToObject(this value).
2. Let len be ? LengthOfArrayLike(O).
3. If IsCallable(callbackfn) is false, throw a TypeError exception.
4. Let A be ? ArraySpeciesCreate(O, len).
5. Let k be 0.
6. Repeat, while k < len,
    a. Let Pk be ! ToString(F(k)).
    b. Let kPresent be ? HasProperty(O, Pk).
    c. If kPresent is true, then
        Let kValue be ? Get(O, Pk).
        Let mappedValue be ? Call(callbackfn, thisArg, « kValue, F(k), O »).
        Perform ? CreateDataPropertyOrThrow(A, Pk, mappedValue).
    d. Set k to k + 1.
7. Return A.

```js
// thisArg 传递给函数，用作 "this" 的值。
Array.prototype.map = function(callbackfn, thisArg) {
  if(this === null || this === undefined) {
    throw new TypeError("Cannot read property 'map' of null");
  }
  if(Object.prototype.toString.call(callbackfn) != "[object Function]") {
    throw new TypeError(callbackfn + ' is not a function')
  }
  let O = Object(this)
  let T = thisArg
  let len = O.length >>> 0
  let A = new Array(len)
  for(let k = 0 ; k < len ; k++) {
    if(k in O) {
      let kValue = O[k]
      // 依次传入this, 当前项，当前索引，整个数组
      let mappedValue = callbackfn.call(T, kValue, k, O)
      A[k] = mappedValue
    }
  }
  return A
}
```

## reduce

When the reduce method is called with one or two arguments, the following steps are taken:
1. Let O be ? ToObject(this value).
2. Let len be ? LengthOfArrayLike(O).
3. If IsCallable(callbackfn) is false, throw a TypeError exception.
4. If len = 0 and initialValue is not present, throw a TypeError exception.
5. Let k be 0.
6. Let accumulator be undefined.
7. If initialValue is present, then
    Set accumulator to initialValue.
8. Else,
    Let kPresent be false.
    Repeat, while kPresent is false and k < len,
        Let Pk be ! ToString(F(k)).
        Set kPresent to ? HasProperty(O, Pk).
        If kPresent is true, then
        Set accumulator to ? Get(O, Pk).
        Set k to k + 1.
    If kPresent is false, throw a TypeError exception.
9. Repeat, while k < len,
    Let Pk be ! ToString(F(k)).
    Let kPresent be ? HasProperty(O, Pk).
    If kPresent is true, then
        Let kValue be ? Get(O, Pk).
        Set accumulator to ? Call(callbackfn, undefined, « accumulator, kValue, F(k), O »).
    Set k to k + 1.
10. Return accumulator.

```js
Array.prototype.reduce = function (callbackfn, initialValue) {
  if (this === null || this === undefined) {
    throw new TypeError("Cannot read property 'reduce' of null")
  }
  if (Object.prototype.toString.call(callbackfn) != '[object Function]') {
    throw new TypeError(callbackfn + ' is not a function')
  }
  let O = Object(this)
  let len = O.length >>> 0
  let k = 0
  let accumulator = initialValue
  if (accumulator === undefined) { // 初始值不传的处理(取数组第一个元素)
    for (; k < len; k++) {
      if (k in O) {
        accumulator = O[k]
        k++
        break
      }
    }
    if (accumulator === undefined) 
      throw new Error('Each element of the array is empty')
  }
  for(; k < len ; k++) {
    if(k in O) {
      accumulator = callbackfn.call(undefined, accumulator, O[k], O)
    }
  }
  return accumulator
}

```

