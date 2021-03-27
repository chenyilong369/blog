# 接口

它是对行为的抽象，而具体如何行动需要由类（classes）去实现（implement）。

在TypeScript中，我们使用接口（Interfaces）来定义对象的类型。除了可用于对类的一部分行为进行抽象以外，也常用于对「对象的形状（Shape）」进行描述。

TypeScript的核心原则之一是对值所具有的结构进行类型检查， 在TypeScript里，接口的作用就是为这些类型命名和为你的代码或第三方代码定义契约。

下面我们看个简单的例子：

```ts
function add(obj: {num: number}) {
	console.log(3 + obj.num)
}

let myObj = {
    num: 10,
    name: 'chenyilong369'
}

add(myObj)
```

[p类型检查器会查看`add`的调用。 `add`有一个参数，并要求这个对象参数有一个名为`num`类型为`number`的属性。

需要注意的是，传入的对象参数实际上会包含很多属性，但是编译器只会检查那些必需的属性是否存在，并且其类型是否匹配。

```ts
interface NumValaue {
  num: number;
}

function add(obj: NumValue) {
	console.log(3 + obj.num)
}

let myObj = {
    num: 10,
    name: 'chenyilong369'
}

add(myObj)
```

`NumValaue`接口就好比一个名字，用来描述上面例子里的要求。 它代表了有一个 `num`属性且类型为`number`的对象。 需要注意的是，我们在这里并不能像在其它语言里一样，说传给 `add`的对象实现了这个接口。我们只会去关注值的外形。 只要传入的对象满足上面提到的必要条件，那么它就是被允许的。

还有一点值得提的是，类型检查器不会去检查属性的顺序，只要相应的属性存在并且类型也是对的就可以。

## 可选属性

接口里的属性不全都是必需的。 有些是只在某些条件下存在，或者根本不存在。 

```ts
interface Square {
    width?: number
    height?: number
}

function areaSquare(config: Square): (area: number) {
    let newSquare = {width: 100, height: 100}
    
    if(config.width) {
        newSquare.width = config.width
    }
    
    if(config.height) {
        newSquare.height = config.height
    }
    
    return newSquare.width * newSquare.height
}

let area = areaSquare({width: 101})
```

带有可选属性的接口与普通的接口定义差不多，只是在可选属性名字定义的后面加一个`?`符号。

可选属性的好处之一是可以对可能存在的属性进行预定义，好处之二是可以捕获引用了不存在的属性时的错误。

## 只读属性

些对象属性只能在对象刚刚创建的时候修改其值。 可以在属性名前用 `readonly`来指定只读属性

```ts
interface Square {
    readonly width: number;
    readonly height: number;
}
```

你可以通过赋值一个对象字面量来构造一个`Square`。 赋值后， `width`和`height`再也不能被改变了。

TypeScript具有`ReadonlyArray<T>`类型，它与`Array<T>`相似，只是把所有可变方法去掉了，因此可以确保数组创建后再也不能被修改：

```ts
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
ro[0] = 12; // error!
ro.push(5); // error!
ro.length = 100; // error!
a = ro; // error!
```

上面代码的最后一行，可以看到就算把整个`ReadonlyArray`赋值到一个普通数组也是不可以的。 但是你可以用类型断言重写：

```ts
a = ro as number[];
```

## 额外的属性检查

首先我们先看个示例：

```ts
interface Square {
    width?: number
    height?: number
}

function areaSquare(config: Square): (area: number) {
    let newSquare = {width: 100, height: 100}
    
    if(config.width) {
        newSquare.width = config.width
    }
    
    if(config.height) {
        newSquare.height = config.height
    }
    
    return newSquare.width * newSquare.height
}

let area = areaSquare({width: 101, heights: 101})
```

将刚才的代码中`areaSquare`中的属性`height`改为了`heights`，TypeScript会认为这段代码可能存在bug。 对象字面量会被特殊对待而且会经过 **额外属性检查** ，当将它们赋值给变量或作为参数传递的时候。 如果一个对象字面量存在任何“目标类型”不包含的属性时，你会得到一个错误。

```ts
// error: 'heights' not expected in type 'Square'
let area = areaSquare({width: 101, heights: 101})
```

绕开这些检查非常简单。 最简便的方法是使用类型断言：

```ts
let area = areaSquare({width: 101, heights: 101}) as Square);
```

最佳的方式是能够添加一个字符串索引签名，前提是你能够确定这个对象可能具有某些做为特殊用途使用的额外属性。

```ts
interface Square {
    width?: number
    height?: number
    [propName: string]: any;
}
```

还有一个可以跳过检查的方法，就是直接将这个对象赋值给另一个变量。`squareBase`会跳过额外属性检查。

```ts
let squareBase = {width: 101, height: 101}
let area = areaSquare(squareBase)
```

## 函数类型

为了使用接口表示函数类型，我们需要给接口定义一个调用签名。 它就像是一个只有参数列表和返回值类型的函数定义。参数列表里的每个参数都需要名字和类型。

```ts
interface addFunc {
    (num: number): number
}

let add: addFunc 

add = function(num: number) {
    return 5 + num
}

add(5)
```

函数的参数名称可以与接口中的参数名称不同，

```ts
add = function(nums: number) {
    return 5 + nums
}
```

函数的参数会逐个进行检查，要求对应位置上的参数类型是兼容的。 如果你不想指定类型，TypeScript的类型系统会推断出参数类型，因为函数直接赋值给了 `addFunc`类型变量。

## 可索引的类型

与使用接口描述函数类型差不多，我们也可以描述那些能够“通过索引得到”的类型，比如`a[10]`或`ageMap["daniel"]`。 可索引类型具有一个 *索引签名*，它描述了对象索引的类型，还有相应的索引返回值类型。 让我们看一个例子：

```ts
interface StringArray {
  [index: number]: string;
}

let myArray: StringArray;
myArray = ["chenyilong369", "jsChen"];

let myStr: string = myArray[0];
```

首先定义了`StringArray`接口，它具有索引签名。这个索引签名表示了当用 `number`去索引`StringArray`时会得到`string`类型的返回值。

TypeScript支持两种索引签名：字符串和数字。 可以同时使用两种类型的索引，但是数字索引的返回值必须是字符串索引返回值类型的子类型。 这是因为当使用 `number`来索引时，JavaScript会将它转换成`string`然后再去索引对象。 也就是说用 `100`（一个`number`）去索引等同于使用`"100"`（一个`string`）去索引，因此两者需要保持一致。

```ts
class Animal {
    name: string;
}
class Dog extends Animal {
    breed: string;
}

// 错误：使用数值型的字符串索引，有时会得到完全不同的Animal!
interface NotOkay {
    [x: number]: Animal;
    [x: string]: Dog;
}
```

字符串索引签名能够很好的描述`dictionary`模式，并且它们也会确保所有属性与其返回值类型相匹配。 因为字符串索引声明了 `obj.property`和`obj["property"]`两种形式都可以。 下面的例子里， `name`的类型与字符串索引类型不匹配，所以类型检查器给出一个错误提示：

```ts
interface NumberDictionary {
  [index: string]: number;
  length: number;    // 可以，length是number类型
  name: string       // 错误，`name`的类型与索引类型返回值的类型不匹配
}
```

最后，你可以将索引签名设置为只读，这样就防止了给索引赋值：

```ts
interface ReadonlyStringArray {
    readonly [index: number]: string;
}
let myArray: ReadonlyStringArray = ["chenyilong369", "jsChen"];
myArray[2] = "Mallory"; // error!
```

不能设置标签 2 ，因为标签是只读的。

## 类类型

TypeScript 可以强制一个类符合某种规则：

```ts
interface ClockInterface {
    currentTime: Date;
    setTime(d: Date); // 方法的声明
}

class Clock implements ClockInterface {
    currentTime: Date;
    setTime(d: Date) {
        this.currentTime = d;
    }
    constructor(h: number, m: number) { }
}
```

接口只描述类的公共部分，它不会检查类的私有部分。

### 类静态部分与实例部分

类是具有两个类型的：静态部分的类型和实例的类型。 当你用构造器签名去定义一个接口并试图定义一个类去实现这个接口时会得到一个错误：

```ts
interface ClockConstructor {
    new (hour: number, minute: number);
}

class Clock implements ClockConstructor {
    currentTime: Date;
    constructor(h: number, m: number) { }
}
```

当一个类实现了一个接口时，只会对其实例部分进行检查，不会对静态部分进行检查，而 `constructor`存在于类的静态部分，不会被检查到。

因此，我们应该直接操作类的静态部分。 看下面的例子，我们定义了两个接口， `ClockConstructor`为构造函数所用和`ClockInterface`为实例方法所用。 为了方便我们定义一个构造函数 `createClock`，它用传入的类型创建实例。

```ts
interface ClockConstructor {
    new (hour: number, minute: number): ClockInterface;
}
interface ClockInterface {
    tick();
}

function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface
{
    return new ctor(hour, minute);
}

class DigitalClock implements ClockInterface {
    constructor(h: number, m: number) { }
    tick() {
        console.log("beep beep");
    }
}
class AnalogClock implements ClockInterface {
    constructor(h: number, m: number) { }
    tick() {
        console.log("tick tock");
    }
}

let digital = createClock(DigitalClock, 12, 17);
let analog = createClock(AnalogClock, 7, 32);
```

因为`createClock`的第一个参数是`ClockConstructor`类型，在`createClock(AnalogClock, 7, 32)`里，会检查`AnalogClock`是否符合构造函数签名。

## 继承接口

与类类似，接口间也可以进行继承。

```ts
interface Address {
    city: string;
}

interface Person extends Address {
    personID: number;
}

let person = <Person>{};
person.city = "changsha";
person.personID = 10;
```

一个接口可以继承多个接口，创建出多个接口的合成接口。

```ts
interface Address {
    city: string;
}

interface Age {
    age: number;
}

interface Person extends Address,Age {
    personID: number;
}

let person = <Person>{};
person.city = "changsha";
person.personID = 10;
person.age = 18
```

## 混合类型

假设我们需要一个对象可以同时作为函数和对象来使用，并带有额外属性。

```ts
interface Person {
    (age: number) string;
	city: string;
	reset: void()
}

function getPerson(): Person {
    let person = <Person>(age: number) {return 'chenyilong369'}
    person.city = 'changsha'
    person.reset = function() {}
    return person
}

let person = getPerson()
person(10) // 调用 person 中的函数
person.reset()
console.log(person.city) // 'changsha'
```

## 接口继承类

当接口继承了一个类类型时，它会继承类的成员但不包括其实现。 就好像接口声明了所有类中存在的成员，但并没有提供具体实现一样。 接口同样会继承到类的private和protected成员。 这意味着当你创建了一个接口继承了一个拥有私有或受保护的成员的类时，这个接口类型只能被这个类或其子类所实现（implement）。

```ts
class Student {
    private studentID: number
}

interface Person extends Student {
    getName(): void;
}

class Man1 extends Student implements Person {
    getName() {}
}

class Man2 extends Student {
    getName() {}
}

// 错误：“Man3”类型缺少“studentID”属性。
class Man3 implements Person {
    getName() {}
}
```

在上面的例子里，`SelectableControl`包含了`Control`的所有成员，包括私有成员`state`。 因为 `state`是私有成员，所以只能够是`Control`的子类们才能实现`SelectableControl`接口。 因为只有 `Control`的子类才能够拥有一个声明于`Control`的私有成员`state`。

