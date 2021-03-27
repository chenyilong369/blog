# 类

下面看一个使用类的例子：

```ts
class Person {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    greet() {
        return "Hello, " + this.name;
    }
}

let person = new Person("chenyilong369");
```

这个类有3个成员：一个叫做 `name`的属性，一个构造函数和一个 `greet`方法。

最后一行，我们使用 `new`构造了 `Person`类的一个实例。 它会调用之前定义的构造函数，创建一个 `Person`类型的新对象，并执行构造函数初始化它。

## 继承

 基于类的程序设计中一种最基本的模式是允许使用继承来扩展现有的类。

```ts
class Animal {
    name: string
    constructor(theName: string) { this.name = theName; }
    move(distanceInMeters: number = 0) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}

class Dog extends Animal {
    constructor(name: string) { super(name); }
    bark() {
        console.log('Woof! Woof!');
    }
    move(distanceInMeters = 44) {
        console.log('......')
        super.move(distanceInMeters)
    }
}

const dog = new Dog('jsChen');
dog.bark();
dog.move(10);
dog.bark();
```

类从基类中继承了属性和方法。 这里， `Dog`是一个 *派生类*，它派生自 `Animal` *基类*，通过 `extends`关键字。 派生类通常被称作 **子类**，基类通常被称作 **超类**。

生类包含了一个构造函数，它 必须调用 `super()`，它会执行基类的构造函数。 而且，在构造函数里访问 `this`的属性之前，一定要调用 `super()`。 这个是TypeScript强制执行的一条重要规则。

同时`Dog`重写了从 `Animal`继承来的 `move`方法。

## 公共，私有与受保护的修饰符

### 默认为 `public`

```ts
class Animal {
    public name: string
    public constructor(theName: string) { this.name = theName; }
    public move(distanceInMeters: number = 0) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}
```

### 理解 `private`

当成员被标记成 `private`时，它就不能在声明它的类的外部访问。

```ts
class Animal {
    private name: string
    constructor(theName: string) {this.name = theName;}
}

new Animal("sheep").name // 错误: 'name' 是私有的.
```

当我们比较两种不同的类型时，并不在乎它们从何处而来，如果所有成员的类型都是兼容的，我们就认为它们的类型是兼容的。

当我们比较带有 `private`或 `protected`成员的类型的时候，情况就不同了。 如果其中一个类型里包含一个 `private`成员，那么只有当另外一个类型中也存在这样一个 `private`成员， 并且它们都是来自同一处声明时，我们才认为这两个类型是兼容的。 对于 `protected`成员也使用这个规则。

```ts
class Animal {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

class Rhino extends Animal {
    constructor() { super("Rhino"); }
}

class Employee {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

let animal = new Animal("Goat");
let rhino = new Rhino();
let employee = new Employee("Bob");

animal = rhino;
animal = employee; // 错误: Animal 与 Employee 不兼容.
```

因为 `Animal`和 `Rhino`共享了来自 `Animal`里的私有成员定义 `private name: string`，因此它们是兼容的。 然而 `Employee`却不是这样。当把 `Employee`赋值给 `Animal`的时候，得到一个错误，说它们的类型不兼容。 尽管 `Employee`里也有一个私有成员 `name`，但它明显不是 `Animal`里面定义的那个。

### 理解 `protected`

跟其他面向对象语言类似， `protected`成员在派生类中仍然可以访问。

```ts
class Person {
    protected name: string;
    constructor(name: string) {this.name = name}
}

class Student extends Person {
    private school: string
    
    constructor(name: string, school: string) {
        super(name)
        this.school = school
    }
    
    public getSchool() {
        return `Hello, my name is ${this.name} and I study in ${this.school}.`;
    }
}

let jsChen = new Student("chenyilong369", "中南林业科技大学")
console.log(jsChen.getSchool())
console.log(jsChen.name) // error
```

我们不能在 `Person`类外使用 `name`，但是我们仍然可以通过 `Student`类的实例方法访问，因为 `Student`是由 `Person`派生而来的。

构造函数也可以被标记成 `protected`。 这意味着这个类不能在包含它的类外被实例化，但是能被继承。

```ts
class Person {
    protected name: string;
    protected constructor(name: string) {this.name = name}
}

class Student extends Person {
    private school: string
    
    constructor(name: string, school: string) {
        super(name)
        this.school = school
    }
    
    public getSchool() {
        return `Hello, my name is ${this.name} and I study in ${this.school}.`;
    }
}

let jsChen = new Student("chenyilong369", "中南林业科技大学")
let jsCchenError = new Person("chenyilong369") // error: 'Person' 的构造函数是被保护的.
```

## readonly修饰符

可以使用 `readonly`关键字将属性设置为只读的。 只读属性必须在声明时或构造函数里被初始化。

```ts
class Person {
    readonly name: string;
    readonly age: number = 20;
    constructor (theName: string) {
        this.name = theName;
    }
}
let dad = new Person('chenyilong369');
dad.name = 'jsChen'; // error! name 是只读的.
```

### 参数属性

**参数属性**可以方便地让我们在一个地方定义并初始化一个成员。 

```ts
class Person {
    readonly age: number = 20;
    constructor (readonly name: string;) {
    }
}
```

此处我们将声明和赋值放到了一块。

参数属性通过给构造函数参数前面添加一个访问限定符来声明。 使用 `private`限定一个参数属性会声明并初始化一个私有成员；对于 `public`和 `protected`来说也是一样。

## 存取器

TypeScript支持通过getters/setters来截取对对象成员的访问。

首先我们先看一个没有存取器的例子：

```ts
class Person {
    fullName: string
}

let person = new Person()
person.fullName = 'chenyilong369'
if(person.fullName) {
    console.log(person.fullName)
}
```

下面将其改为存取器写法：

```ts
let password = "123456"

class Person {
    private _fullName: string
    
    get fullName(): string {
        return this._fullName
    }
    
    set fullName(newName: string) {
        if(password && password == '123456') {
            this._fullName = newName
        } else {
			console.log('Error')
        }
    }
}

let person = new Person();
person.fullName = "chenyilong369"
if(person.fullName) {
    alert(person.fullName)
}
```

注意只带有 `get`不带有 `set`的存取器自动被推断为 `readonly`。

## 静态属性

静态属性存在于类本身上面而不是类的实例上。

```ts
class Person {
    static age = 20
    constructor(public fullName: string) {}
    public getAgeAndName() {
        return `${this.fullName} - ${Person.age}`
    }
}

let person = new Person('chenyilong369')
console.log(person.getAgeAndName())
```

可以看到，静态方法需要通过类名来调用。

## 抽象类

抽象类做为其它派生类的基类使用。 它们一般不会直接被实例化。 不同于接口，抽象类可以包含成员的实现细节。 `abstract`关键字是用于定义抽象类和在抽象类内部定义抽象方法。

```ts
abstract class Person {
    abstract getFullName(): string;
    age(): void {
        console.log(28)
    }
}
```

象类中的抽象方法不包含具体实现并且必须在派生类中实现。 抽象方法的语法与接口方法相似。 两者都是定义方法签名但不包含方法体。 然而，抽象方法必须包含 `abstract`关键字并且可以包含访问修饰符。

```ts
abstract class Person {
    constructor(public name: string) {}
    abstract getFullName(): string;
    age(): void {
        console.log(28)
    }
}

class Struent extends Person {
    constructor() {
        super('chenyilong369')
    }
    getFullName(): string {
        return this.name
    }
}

let person: Person // 允许创建一个对抽象类型的引用
person = new Person(); // 错误: 不能创建一个抽象类的实例
person = new Struent() // 允许对一个抽象子类进行实例化和赋值
person.getFullName()
person.age()
person.generateReports(); // 错误: 方法在声明的抽象类中不存在
```

## 好玩的东西

### 构造函数

```ts
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

let greeter: Greeter;
greeter = new Greeter("world");
console.log(greeter.greet());
```

那么上面的代码编译成 javascript会是怎样的呢？

```ts
let Greeter = (function () {
    function Greeter(message) {
        this.greeting = message;
    }
    Greeter.prototype.greet = function () {
        return "Hello, " + this.greeting;
    };
    return Greeter;
})();

let greeter;
greeter = new Greeter("world");
console.log(greeter.greet());
```

 `let Greeter`将被赋值为构造函数。 当我们调用 `new`并执行了这个函数后，便会得到一个类的实例。 这个构造函数也包含了类的所有静态属性。

