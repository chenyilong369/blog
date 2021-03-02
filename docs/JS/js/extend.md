# JS 类的创建和继承

在面向对象编程中，类（class）是对象（object）的模板，定义了同一组对象（又称"实例"）共有的属性和方法。JavaScript语言里是没有类的概念的，但是我们通过以下方法也可以模拟出类。

## 利用 function 

```js
function Animal(name,age){
    this.name=name;
    this.age = age;
    this.getName = function(){
        return this.name;
    }
    this.setName = function(name){
        this.name = name
    }
}
```

## 利用Object.create()方法构造：

```js
var Animal ={
    name: '大毛',
    getName: function(){
        return this.name;
    }
}

var ani = Object.create(Animal);
ani.getName();//大毛
```

继承可以使得子类别具有父类的各种方法和属性，可以通过重写或覆盖父类某些属性和方法，使其获得与父类不同的属性和方法。

## 原型链继承

原型链继承是比较常见的继承方式之一，其中涉及的构造函数、原型和实例，三者之间存在着一定的关系，即每一个构造函数都有一个原型对象，原型对象又包含一个指向构造函数的指针，而实例则包含一个原型对象的指针。

但是这种继承会有个问题，因为它们使用的是同一个原型对象。它们的内存空间是共享的，当一个发生变化的时候，另外一个也随之进行了变化。

```js
function Parent() {
  this.name = 'jsChen'
  this.play = [1, 2, 3]
}
function Child() {
  this.type = 'chenyilong369'
}
Child.prototype = new Parent()
console.log(new Child())

let s1 = new Child()
let s2 = new Child()
s1.play.push(4)
console.log(s1.play, s2.play)
```

执行后发现两个都输出 [1, 2, 3, 4]。

## 构造函数继承

在子类构造函数中调用父类构造函数。

```js
function Parent(){
  this.name = 'jsChen'
  this.count = [1]
}

Parent.prototype.getName = function () {
  return this.name
}

function Child(){
  Parent.call(this)
  this.type = 'chenyilong369'
}

let child1 = new Child()
let child2 = new Child()
child1.count.push(2)
console.log(child1, child2);  // 没问题
console.log(child1.getName());  // 会报错
```

上面倒数第二行输出 `Child { name: 'jsChen', count: [ 1, 2 ], type: 'chenyilong369' } Child { name: 'jsChen', count: [ 1 ], type: 'chenyilong369' }`，但最后一行报错，代表它拿不到父类的原型对象。

该继承方法使父类的引用属性不会被共享，优化了第一种继承方式的弊端；但是随之而来的缺点也比较明显——只能继承父类的实例属性和方法，不能继承原型属性或者方法。

## 组合继承（前两种组合）

罗翔老师说过，法律采取折中说最为客观。于是我们在这也折中一下，使用原型链继承原型上的属性和方法,而通过盗用构造函数继承实例属性。

```js
function Parent () {
  this.name = 'jsChen';
  this.play = [1, 2, 3];
}

Parent.prototype.getName = function () {
  return this.name;
}

function Child() {
  // 第二次调用 Parent()
  Parent.call(this);
  this.type = 'chenyilong369';
}

// 第一次调用 Parent()
Child.prototype = new Parent();
// 手动挂上构造器，指向自己的构造函数
Child.prototype.constructor = Child;
var s3 = new Child();
var s4 = new Child();
s3.play.push(4);
console.log(s3.play, s4.play);  // 不互相影响
console.log(s3.getName()); // 正常输出'jsChen'
console.log(s4.getName()); // 正常输出'jsChen'
```

这里又增加了一个新问题，这种方式调用了两次 Parent 方法。

## 原型式继承

首先了解一下 Object.create 方法，这个方法接收两个参数：一是用作新对象原型的对象、二是为新对象定义额外属性的对象（可选参数）。

```js
let Parent = {
  name: "jsChen",
  friends: ["p1", "p2", "p3"],
  getName: function() {
    return this.name;
  }
};

let person1 = Object.create(Parent);
person1.name = "tom";
person1.friends.push("jerry");

let person2 = Object.create(parent);
person2.friends.push("lucy");

console.log(person1.name); // tom
console.log(person1.name === person1.getName()); // true
console.log(person2.name); // jsChen
console.log(person1.friends); // ["p1", "p2", "p3", "jerry", "lucy"]
console.log(person2.friends); // ["p1", "p2", "p3", "jerry", "lucy"]
```

可以看到多个实例的引用类型属性指向相同的内存，存在篡改的可能。原因在于 Object.create 方法对对象是实现浅拷贝的。

## 寄生式继承

使用原型式继承可以获得一份目标对象的浅拷贝，然后利用这个浅拷贝的能力再进行增强，添加一些方法。

```js
let parent = {
  name: "parent",
  friends: ["p1", "p2", "p3"],
  getName: function() {
    return this.name;
  }
};

function clone(original) {
  let clone = Object.create(original);
  clone.getFriends = function() {
    return this.friends;
  };
  return clone;
}

let person5 = clone(parent5);

console.log(person.getName());
console.log(person.getFriends());
```

person 通过 clone 的方法，增加了 getFriends 的方法，从而使 person 这个普通对象在继承过程中又增加了一个方法，这样的继承方式就是寄生式继承。

## 寄生组合式继承

```js
function clone (parent, child) {
  // 这里改用 Object.create 就可以减少组合继承中多进行一次构造的过程
  child.prototype = Object.create(parent.prototype);
  child.prototype.constructor = child;
}

function Parent() {
  this.name = 'jsChen';
  this.play = [1, 2, 3];
}
Parent.prototype.getName = function () {
  return this.name;
}

function Child() {
  Parent.call(this);
  this.friends = 'chenyilong369';
}

clone(Parent, Child);

Child.prototype.getFriends = function () {
  return this.friends;
}

let person = new Child();
console.log(person);
console.log(person.getName());
console.log(person.getFriends());
```

寄生组合式继承方式，基本可以解决前几种继承方式的缺点，较好地实现了继承想要的结果，同时也减少了构造次数，减少了性能的开销。

整体看下来，这六种继承方式中，寄生组合式继承是这六种里面最优的继承方式。

## ES6 extends

在了解底层代码前，先学学怎么使用。

```js
class Person {
  constructor(name) {
    this.name = name
  }
  // 原型方法
  // 即 Person.prototype.getName = function() { }
  // 下面可以简写为 getName() {...}
  getName = function () {
    console.log('Person:', this.name)
  }
}
class Gamer extends Person {
  constructor(name, age) {
    // 子类中存在构造函数，则需要在使用“this”之前首先调用 super()。
    super(name)
    this.age = age
  }
}
const asuna = new Gamer('Asuna', 20)
asuna.getName() // 成功访问到父类的方法
```

我们用 Babel 来将其转化为 ES5

```js
function _possibleConstructorReturn (self, call) { 
		// ...
		return call && (typeof call === 'object' || typeof call === 'function') ? call : self; 
}
function _inherits (subClass, superClass) { 
    // 这里可以看到
	subClass.prototype = Object.create(superClass && superClass.prototype, { 
		constructor: { 
			value: subClass, 
			enumerable: false, 
			writable: true, 
			configurable: true 
		} 
	}); 
	if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; 
}

var Parent = function Parent () {
	// 验证是否是 Parent 构造出来的 this
	_classCallCheck(this, Parent);
};
var Child = (function (_Parent) {
	_inherits(Child, _Parent);
	function Child () {
		_classCallCheck(this, Child);
		return _possibleConstructorReturn(this, (Child.__proto__ || Object.getPrototypeOf(Child)).apply(this, arguments));
}
	return Child;
}(Parent));
```

从上面编译完成的源码中可以看到，它采用的也是寄生组合继承方式，因此也证明了这种方式是较优的解决继承的方式。

## 总结

通过 Object.create 来划分不同的继承方式，最后的寄生式组合继承方式是通过组合继承改造之后的最优继承方式，而 extends 的语法糖和寄生组合继承的方式基本类似。

<img :src="$withBase('/extend01.png')" alt="extend01"/>



