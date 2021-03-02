
# this

**this的指向在函数定义的时候是确定不了的，只有函数执行的时候才能确定this到底指向谁**，**实际上this的最终指向的是那个调用它的对象**

- 如果一个函数中有this，但是它没有被上一级的对象所调用，那么this指向的就是window，js的严格版中this指向的不是window而是 undefined.

- 如果一个函数中有this，这个函数有被上一级的对象所调用，那么this指向的就是上一级的对象。

- 如果一个函数中有this，**这个函数中包含多个对象，尽管这个函数是被最外层的对象所调用，this指向的也只是它上一级的对象，**

## 构造函数 this

```js
function Fn(){
    this.user = "jschen";
}
var a = new Fn();
console.log(a.user); //jschen
```

new关键字可以改变this的指向，将这个this指向对象a

## this 与 return

```js
function fn() {  
    this.user = 'jschen';  
    return {};  
}
var a = new fn;  
console.log(a.user); //undefined
```

```js
function fn() {  
    this.user = 'jschen';  
    return 1;
}
var a = new fn;  
console.log(a.user); //jschen
```

**如果返回值是一个对象，那么this指向的就是那个返回的对象，如果返回值不是一个对象那么this还是指向函数的实例。**

## this 优先级

1. 函数是否在 new 中调用（new 绑定）？如果是的话 this 绑定的是新创建的对象。 

```js
var bar = new foo() 
```

2. 函数是否通过 call、apply（显式绑定）或者 bind 调用？如果是的话，this 绑定的是指定的对象。 

```js
var bar = foo.call(obj2) 
```

3. 函数是否在某个上下文对象中调用（隐式绑定）？如果是的话，this 绑定的是那个上下文对象。 

```js
var bar = obj1.foo() 
```

4. 如果都不是的话，使用默认绑定。如果在严格模式下，就绑定到 undefined，否则绑定到全局对象。 

```js
var bar = foo() 
```

## 总结

- 当函数作为对象的方法调用时，函数中的 this 就是该对象；
- 当函数被正常调用时，在严格模式下，this 值是 undefined，非严格模式下 this 指向的是全局对象 window；
- 嵌套函数中的 this 不会继承外层函数的 this 值。