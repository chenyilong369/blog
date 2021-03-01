# 手写JSON的两个方法

JSON 对象包含两个方法：一是用于解析成 JSON 对象的 parse()；二是用于将对象转换为 JSON 字符串方法的 stringify()。

那么，在正菜开始前我们先介绍上面 2 个方法。

## JSON.parse

JSON.parse 方法用来解析 JSON 字符串，构造由字符串描述的 JavaScript 值或对象。该方法有两个参数：

- 第一个参数是需要解析处理的 JSON 字符串，
- 第二个参数是可选参数提供可选的 reviver 函数，用在返回之前对所得到的对象执行变换操作。

::: tip 语法格式

JSON.parse(text[, reviver])

:::

```js
const json = '{"result":true, "count":2}'
const obj = JSON.parse(json)
console.log(obj.count)
// 2
console.log(obj.result)
// true
/* 带第二个参数的情况 */
JSON.parse('{"p": 5}', function (k, v) {
  if (k === '') return v // 如果k不是空，
  return v * 2 // 就将属性值变为原来的2倍返回
}) // { p: 10 }
```

## JSON.stringify

JSON.stringify 方法是将一个 JavaScript 对象或值转换为 JSON 字符串，默认该方法其实有三个参数：

- 第一个参数是必选，后面两个是可选参数非必选。第一个参数传入的是要转换的对象；
- 第二个是一个 replacer 函数，比如指定的 replacer 是数组，则可选择性地仅处理包含数组指定的属性；
- 第三个参数用来控制结果字符串里面的间距，后面两个参数整体用得比较少。

::: tip 语法格式

JSON.stringify(value[, replacer [, space]])

:::

```js
JSON.stringify({ x: 1, y: 2 })
// "{"x":1,"y":2}"
JSON.stringify({ x: [10, undefined, function () {}, Symbol('')] })
// "{"x":[10,null,null,null]}"
/* 第二个参数的例子 */
function replacer(key, value) {
  if (typeof value === 'string') {
    return undefined
  }
  return value
}
var foo = { foundation: 'Mozilla', model: 'box', week: 4, transport: 'car', month: 7 }
var jsonString = JSON.stringify(foo, replacer)
console.log(jsonString)
// "{"week":4,"month":7}"
/* 第三个参数的例子 */
JSON.stringify({ a: 2 }, null, ' ')
/* "{
 "a": 2
}"*/
JSON.stringify({ a: 2 }, null, '')
// "{"a":2}"a
```

上面这个表中，基本整理出了各种数据类型通过 JSON.stringify 这个方法之后返回对应的值，但是还有一个特殊情况需要注意：对于包含循环引用的对象（深拷贝那讲中也有提到）执行此方法，会抛出错误。

## 手写 JSON.stringify

<img :src="$withBase('/writeStringify01.png')" alt="writeStringify01"/>

其实很简单，按照上面的标准来即可：

```js
function jsonStringify(data) {
  let type = typeof data

  if (type !== 'object') {
    let result = data
    // data 可能是基础数据类型
    // NaN 和 Infinity 序列化返回 "null"
    // function 序列化返回 undefined，因此和 undefined、symbol 一起处理
    if (Number.isNaN(data) || data === Infinity) {
      result = 'null'
    } else if (type === 'function' || type === 'undefined' || type === 'symbol') {
      return undefined
    } else if (type === 'string') {
      return '"' + data + '"'
    }
    return String(result)
  } else if (type === 'object') { // 开始判断引用类型
    if (data === null) {
      return 'null'
    } else if (data.toJSON && typeof data.toJSON === 'function') {
      return jsonStringify(data.toJSON())
    } else if (data instanceof Array) { // 数组
      let result = []
      data.forEach((item, index) => {
        if (typeof item === 'undefined' || typeof item === 'function' || typeof item === 'symbol') {
          item[index] = null
        } else {
          result[index] = jsonStringify(item)
        }
      })
      result = '[' + result + ']'
      return result.replace(/'/g, '"') // 注意将单引号转化为双引号
    } else { // 普通对象
      let result = []
      Object.keys(data).forEach((item, index) => {
        if (typeof item !== 'symbol') {
          if (
            typeof data[item] !== 'function' &&
            typeof data[item] !== 'symbol' &&
            typeof data[item] !== 'undefined'
          ) {
            result.push('"' + item + '"' + ':' + jsonStringify(data[item]))
          }
        }
      })
      return ('{' + result + '}').replace(/'/g, '"')
    }
  }
}
```

我们来验证一下和真的 JSON.stringify 是否结果大致相同：

```js
let nl = null
console.log(jsonStringify(nl) === JSON.stringify(nl))
// true
let und = undefined
console.log(jsonStringify(undefined) === JSON.stringify(undefined))
// true
let boo = false
console.log(jsonStringify(boo) === JSON.stringify(boo))
// true
let nan = NaN
console.log(jsonStringify(nan) === JSON.stringify(nan))
// true
let inf = Infinity
console.log(jsonStringify(Infinity) === JSON.stringify(Infinity))
// true
let str = 'jack'
console.log(jsonStringify(str) === JSON.stringify(str))
// true
let reg = new RegExp('w')
console.log(jsonStringify(reg) === JSON.stringify(reg))
// true
let date = new Date()
console.log(jsonStringify(date) === JSON.stringify(date))
// true
let sym = Symbol(1)
console.log(jsonStringify(sym) === JSON.stringify(sym))
// true
let array = [1, 2, 3]
console.log(jsonStringify(array) === JSON.stringify(array))
// true
let obj = {
  name: 'jack',
  age: 18,
  attr: ['coding', 123],
  date: new Date(),
  uni: Symbol(2),
  sayHi: function () {
    console.log('hi')
  },
  info: {
    sister: 'lily',
    age: 16,
    intro: {
      money: undefined,
      job: null,
    },
  },
}
console.log(jsonStringify(obj) === JSON.stringify(obj))
// true
```

当然这只是简单的写法，循环引用等错误未添加，还有第 2, 3个参数未实现。

留个坑在这，有时间再补充。