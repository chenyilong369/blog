# 响应式原理

```js
let onWatch = (obj, setBind, getLogger) => {
  let handler = {
    get(target, property, receiver) {
      getLogger(target, property)
      return Reflect.get(target, property, receiver)
    },

    set(target, property, value, receiver) {
      setBind(value, property)
      return Reflect.set(target, property, value)
    }
  }
  return new Proxy(obj, handler)
}

let obj = {
  a: 1
}

const setBind = (v, property) => {
  console.log(`监听到${property}修改为${v}`)
}

const getLogger = (target, property) => {
  console.log(`'${property}' = ${target[property]}`)
}

let p = onWatch(obj, setBind, getLogger)

p.a = 2;
console.log(p.a)
setTimeout(() => {
  p.a = 6
}, 1000)
```

