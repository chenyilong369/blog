# 原型

```js
function Person() {

}
var person = new Person();
person.name = 'Kevin';
console.log(person.name) // Kevin
```

Person 就是一个构造函数，我们使用 new 创建了一个实例对象 person

## prototype

每个函数都有一个 prototype 属性，prototype是函数才会有的属性。
每一个JavaScript对象(null除外)在创建的时候就会与之关联另一个对象，这个对象就是我们所说的原型，每一个对象都会从原型"继承"属性。

```js
function Person() {

}
Person.prototype.name = 'Kevin';
var person1 = new Person();
var person2 = new Person();
console.log(person1.name) // Kevin
console.log(person2.name) // Kevin
```

<img :src="$withBase('/prototype01.png')" alt="prototype01">

## **proto**

每一个JavaScript对象(除了 null )都具有的一个属性，叫**proto**，这个属性会指向该对象的原型。

```js
function Person() {

}
var person = new Person();
console.log(person.__proto__ === Person.prototype); // true
```

<img :src="$withBase('/prototype02.png')" alt="prototype02">

## constructor

每个原型都有一个 constructor 属性指向关联的构造函数 (实例原型指向构造函数)。

<img :src="$withBase('/prototype03.png')" alt="prototype03">

```js
function Person() {

}

var person = new Person();

console.log(person.__proto__ == Person.prototype) // true
console.log(Person.prototype.constructor == Person) // true
// 顺便学习一个ES5的方法,可以获得对象的原型
console.log(Object.getPrototypeOf(person) === Person.prototype) // true
```

## 原型链

<img :src="$withBase('/prototype04.png')" alt="prototype04">

JavaScript 默认并不会**复制**对象的属性，相反，JavaScript 只是在两个对象之间创建一个**关联**，这样，一个对象就可以通过委托访问另一个对象的属性和函数，所以与其叫继承，**委托**的说法反而更准确些。
