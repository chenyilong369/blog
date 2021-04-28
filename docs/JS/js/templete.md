# 模块化

模块化可以带来以下好处

- 解决命名冲突
- 提供复用性
- 提高代码可维护性

## 立即执行函数

使用立即执行函数实现模块化是常见的手段，通过函数作用域解决了命名冲突、污染全局作用域的问题

```js
(function(globalVariable){
   globalVariable.test = function() {}
   // ... 声明各种变量、函数都不会污染全局作用域
})(globalVariable)
```

## CommonJS

```js
// a.js
module.exports = {
    a: 1
}
// or 
exports.a = 1

// b.js
var module = require('./a.js')
module.a // -> log 1
```

虽然 exports 和 module.exports 用法相似，但是不能对 exports 直接赋值。因为 var exports = module.exports 这句代码表明了 exports 和 module.exports 享有相同地址，通过改变对象的属性值会对两者都起效，但是如果直接对 exports 赋值就会导致两者不再指向同一个内存地址，修改并不会对 module.exports 起效。

### exports 和 module.exports 的区别

- module.exports 默认值为{}
- exports 是 module.exports 的引用
- exports 默认指向 module.exports 的内存空间
- require() 返回的是 module.exports 而不是 exports
- 若对 exports 重新赋值，则断开了 exports 对 module.exports 的指向

## ES Module

ES Module 是原生实现的模块化方案，与 CommonJS 有以下几个区别

- CommonJS 支持动态导入，也就是 require(${path}/xx.js)，后者目前不支持，但是已有提案
- CommonJS 是同步导入，因为用于服务端，文件都在本地，同步导入即使卡住主线程影响也不大。而后者是异步导入，因为用于浏览器，需要下载文件，如果也采用同步导入会对渲染有很大影响
- CommonJS 在导出时都是值拷贝，就算导出的值变了，导入的值也不会改变，所以如果想更新值，必须重新导入一次。但是 ES Module 采用实时绑定的方式，导入导出的值都指向同一个内存地址，所以导入值会跟随导出值变化
- CommonJS 属于运行时加载，都只有在代码运行时才能确定这些东西。ESModule 属于编译时加载，即静态加载，在编译时就能够确定模块的依赖关系，以及输入和输出的变量。
- ESM形式的好处是可以做到tree shaking。

```js
// 引入模块 API
import XXX from './a.js'
import { XXX } from './a.js'
// 导出模块 API
export function a() {}
export default function() {}
```
