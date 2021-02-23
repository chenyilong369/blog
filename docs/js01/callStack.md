# 执行上下文

我们先来看看变量提升这个概念：

## 变量提升

首先明确一下 JS 中的声明和赋值

```js
var myname //声明部分，
myname = 'jschen' //赋值部分
```

上面是变量的声明和赋值，下面是函数的声明和赋值

```js
function foo(){
  console.log('foo')
}

var bar = function(){
  console.log('bar')
}
```

第一个函数 foo 是一个完整的函数声明，没有涉及到赋值操作。

**所谓的变量提升，是指在 JavaScript 代码执行过程中，JavaScript 引擎把变量的声明部分和函数的声明部分提升到代码开头的“行为”。变量被提升后，会给变量设置默认值，这个默认值就是 undefined。**

```js
/*
* 变量提升部分
*/
// 把变量 myname提升到开头，
// 同时给myname赋值为undefined
var myname = undefined
// 把函数showName提升到开头
function showName() {
    console.log('showName被调用');
}

/*
* 可执行代码部分
*/
showName()
console.log(myname)
// 去掉var声明部分，保留赋值语句
myname = 'jschen'
```

## 执行上下文

一段 JavaScript 代码在执行之前需要被 JavaScript 引擎编译，编译完成之后，才会进入执行阶段。

<img :src="$withBase('/callStack01.png')" alt="callStack01"/>

执行上下文有且只有三类，全局执行上下文，函数上下文，与eval上下文；由于eval一般不会使用，这里不做讨论。

<img :src="$withBase('/callStack03.png')" alt="callStack03"/>

### 全局执行上下文

全局执行上下文只有一个，在客户端中一般由浏览器创建，也就是我们熟知的window对象，我们能通过this直接访问到它。

<img :src="$withBase('/callStack02.png')" alt="callStack02"/>

全局对象window上预定义了大量的方法和属性，我们在全局环境的任意处都能直接访问这些属性方法，同时window对象还是var声明的全局变量的载体。我们通过var创建的全局对象，都可以通过window直接访问。

### 函数执行上下文

每当一个函数被调用时都会创建一个函数上下文，需要注意的是，同一个函数被多次调用，都会创建一个新的上下文。

## 执行上下文栈（调用栈）

执行上下文栈(下文简称执行栈)也叫调用栈，调用栈用于存储代码执行期间创建的所有上下文，具有LIFO（Last In First Out后进先出，也就是先进后出）的特性。

当 JS 代码首次运行时，都会创建一个全局执行上下文并压入到调用栈中，之后每有函数调用，都会创建一个新的函数执行上下文并且将其压入栈中。当执行完后，会弹出调用栈。

::: tip 也就是说
JS 代码执行完毕前在执行栈底部永远有个全局执行上下文。
:::

下面用一段代码来分析一下

```js
function add(x, y) {
    return x + y
}

function dec(x, y) {
    x = add(x, 5)
    return x - y
}

function count(x, y) {
    x = dec(x, 7)
    console.log(x + y)
}

count(1, 5) // 4
```

我们分析上述代码

```js
Stack = [globalContext] // 代码执行前创建全局执行上下文
Stack.push('count functionContext') // count 函数调用
Stack.push('dec functionContext') // dec 函数调用
Stack.push('add functionContext') // add 函数调用
Stack.pop() // add 函数执行完毕，将其弹出
Stack.pop() // dec 函数执行完毕，将其弹出
Stack.pop() // count 函数执行完毕，将其弹出
// 此时调用栈中只剩下一个全局执行上下文
```

当然，调用栈是有大小的，当入栈的执行上下文超过一定数目，JavaScript 引擎就会报错，我们把这种错误叫做栈溢出。

## 执行上下文的创建阶段

他主要负责三件事，`确定this---创建词法环境组件（LexicalEnvironment）---创建变量环境组件（VariableEnvironment）`

```js
ExecutionContext = {  
    // 确定this的值
    ThisBinding = <this value>,
    // 创建词法环境组件
    LexicalEnvironment = {},
    // 创建变量环境组件
    VariableEnvironment = {},
};
```

### 确定 this

方的称呼为This Binding，在全局执行上下文中，this总是指向全局对象，例如浏览器环境下this指向window对象。

在函数执行上下文中，this 的取值取决于函数的调用方式。

### **词法环境组件**

词法环境是一个包含标识符变量映射的结构，这里的标识符表示变量/函数的名称，变量是对实际对象【包括函数类型对象】或原始值的引用。

词法环境是由`环境记录`与`对外部环境引入记录`两个部分组成。

其中环境记录用于存储当前环境中的变量和函数声明的实际位置；外部环境引入记录很好理解，它用于保存自身环境可以访问的其它外部环境。

词法环境分为全局词法环境与函数词法环境两种。

**全局词法环境组件：**

对外部环境的引入记录为null，因为它本身就是最外层环境，除此之外它还记录了当前环境下的所有属性、方法位置。

**函数词法环境组件：**

包含了用户在函数中定义的所有属性方法外，还包含了一个arguments对象。函数词法环境的外部环境引入可以是全局环境，也可以是其它函数环境，这个根据实际代码而来。

```js
// 全局环境
GlobalExectionContext = {
    // 全局词法环境
    LexicalEnvironment: {
        // 环境记录
        EnvironmentRecord: {
            Type: "Object", //类型为对象环境记录
            // 标识符绑定在这里 
        },
        outer: < null >
    }
};
// 函数环境
FunctionExectionContext = {
    // 函数词法环境
    LexicalEnvironment: {
        // 环境纪录
        EnvironmentRecord: {
            Type: "Declarative", //类型为声明性环境记录
            // 标识符绑定在这里 
        },
        outer: < Global or outerfunction environment reference >
    }
};
```

### **变量环境组件**

变量环境可以说也是词法环境，它具备词法环境所有属性，一样有环境记录与外部环境引入。在ES6中唯一的区别在于词法环境用于存储函数声明与`let const`声明的变量，而变量环境仅仅存储`var`声明的变量。

```js
let a = 20;  
const b = 30;  
var c;

function add(e, f) {  
 var g = 20;  
 return e * f * g;  
}

c = add(20, 30);
```

```js
//全局执行上下文
GlobalExectionContext = {
    // this绑定为全局对象
    ThisBinding: <Global Object>,
    // 词法环境
    LexicalEnvironment: {  
      //环境记录
      EnvironmentRecord: {  
        Type: "Object",  // 对象环境记录
        // 标识符绑定在这里 let const创建的变量a b在这
        a: < uninitialized >,  
        b: < uninitialized >,  
        multiply: < func >  
      }
      // 全局环境外部环境引入为null
      outer: <null>  
    },
  	// 变量环境
    VariableEnvironment: {  
      EnvironmentRecord: {  
        Type: "Object",  // 对象环境记录
        // 标识符绑定在这里  var创建的c在这
        c: undefined,  
      }
      // 全局环境外部环境引入为null
      outer: <null>  
    }  
  }

  // 函数执行上下文
  FunctionExectionContext = {
     //由于函数是默认调用 this绑定同样是全局对象
    ThisBinding: <Global Object>,
    // 词法环境
    LexicalEnvironment: {  
      EnvironmentRecord: {  
        Type: "Declarative",  // 声明性环境记录
        // 标识符绑定在这里  arguments对象在这
        Arguments: {0: 20, 1: 30, length: 2},  
      },  
      // 外部环境引入记录为</Global>
      outer: <GlobalEnvironment>  
    },
  	// 变量环境
    VariableEnvironment: {  
      EnvironmentRecord: {  
        Type: "Declarative",  // 声明性环境记录
        // 标识符绑定在这里  var创建的g在这
        g: undefined  
      },  
      // 外部环境引入记录为</Global>
      outer: <GlobalEnvironment>  
    }  
  }
```

在执行上下文创建阶段，函数声明与var声明的变量在创建阶段已经被赋予了一个值，var声明被设置为了undefined，函数被设置为了自身函数，而let const被设置为未初始化。

上下文的执行阶段就是根据之前的环境记录对应赋值。

## 总结

1. 全局执行上下文一般由浏览器创建，代码执行时就会创建；函数执行上下文只有函数被调用时才会创建，调用多少次函数就会创建多少上下文。

2. 调用栈用于存放所有执行上下文，满足FILO规则。
3. 调用栈是有大小限制的，一旦超过，会导致栈溢出。
4. 执行上下文创建阶段分为绑定this，创建词法环境，变量环境三步，两者区别在于词法环境存放函数声明与const let声明的变量，而变量环境只存储var声明的变量。
5. 词法环境主要由环境记录与外部环境引入记录两个部分组成，全局上下文与函数上下文的外部环境引入记录不一样，全局为null，函数为全局环境或者其它函数环境。环境记录也不一样，全局叫对象环境记录，函数叫声明性环境记录。
6. 明白了为什么会存在变量提升，函数提升，而let const没有。