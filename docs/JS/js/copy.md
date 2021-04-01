#  深浅拷贝与赋值

## 浅拷贝

**浅拷贝**只复制指向某个对象的指针而不复制对象本身，新旧对象还是共享同一块内存。

### Object.assign()

可以通过 `Object.assign` 来解决这个问题，`Object.assign` 只会拷贝所有的属性值到新的对象中，如果属性值是对象的话，拷贝的是地址。

```js
let a = {
  age: 1
}
let b = Object.assign({}, a)
a.age = 2
console.log(b.age) // 1
```

### 扩展运算符

还可以通过展开运算符 `...` 来实现浅拷贝

```js
let a = {
  age: 1
}
let b = { ...a }
a.age = 2
console.log(b.age) // 1
```

### Array.prototype.concat()

```js
let arr = [1, 3, {
  username: 'kobe'
}];
let arr2=arr.concat();    
arr2[2].username = 'wade';
console.log(arr);
```



浅拷贝只解决了第一层的问题，如果接下去的值中还有对象的话，就需要使用深拷贝。

## 深拷贝

**深拷贝**会另外创造一个一模一样的对象，新对象跟原对象不共享内存，修改新对象不会改到原对象。

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

## **赋值和浅拷贝的区别**

- 直接赋值的话，不论对象的属性是基本类型的值还是引用类型的值，都会被修改。

```js
let obj = {
  name: 'jsChen',
  age: 20,
  address: {
	city: '长沙',
    school: '中南林'
  }
}

let obj1 = obj
obj1.age = 22
obj1.address.city = "武汉"
console.log(obj)
console.log(obj1) // 你会发现两个输出是一样的
```

- 浅拷贝的话，被拷贝的对象的基本类型数据不会被修改，引用类型数据会被修改。

```js
let obj = {
  name: 'jsChen',
  age: 20,
  address: {
	city: '长沙',
    school: '中南林'
  }
}

let obj1 = {...obj}
obj1.age = 22
obj1.address.city = "武汉"
console.log(obj)
console.log(obj1) // obj.age 不会改变
```

