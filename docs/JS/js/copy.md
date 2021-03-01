# 深浅拷贝

## 浅拷贝

可以通过 `Object.assign` 来解决这个问题，`Object.assign` 只会拷贝所有的属性值到新的对象中，如果属性值是对象的话，拷贝的是地址。

```js
let a = {
  age: 1
}
let b = Object.assign({}, a)
a.age = 2
console.log(b.age) // 1
```

还可以通过展开运算符 `...` 来实现浅拷贝

```js
let a = {
  age: 1
}
let b = { ...a }
a.age = 2
console.log(b.age) // 1
```

浅拷贝只解决了第一层的问题，如果接下去的值中还有对象的话，就需要使用深拷贝。

## 深拷贝

这个问题通常可以通过 `JSON.parse(JSON.stringify(object))` 来解决。

 ```js
let a = {
  age: 1,
  jobs: {
    first: 'FE'
  }
}
let b = JSON.parse(JSON.stringify(a))
a.jobs.first = 'native'
console.log(b.jobs.first) // FE
 ```

该方法也是有局限性的：

- 会忽略 `undefined`
- 会忽略 `symbol`
- 不能序列化函数
- 不能解决循环引用的对象

下面是简易版的深拷贝

```js
const obj1 = {
  name : 'xxx', 
  sex: 'man',
  age: 19,
  address: {
    city: "changsha"
  },
  habit: ['l', 'n', 'd']
} 

const deepClone = (obj = {}) => {
  if(typeof obj !== 'object' || obj == null) {
    return obj
  }
  let result
  if(obj instanceof Array) {
    result = []
  } else {
    result = {}
  }
  for(let key in obj) {
    if(obj.hasOwnProperty(key)) {
      result[key] = deepClone(obj[key])
    }
  }
  return result
}

const obj2 = deepClone(obj1)
obj2.address.city = "hengyang"
console.log(obj1.address.city) // changsha
```

