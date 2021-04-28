# 事件简介

**事件**是某事发生的信号。

**鼠标事件：**

- `click` —— 当鼠标点击一个元素时（触摸屏设备会在点击时生成）。
- `contextmenu` —— 当鼠标右键点击一个元素时。
- `mouseover` / `mouseout` —— 当鼠标指针移入/离开一个元素时。
- `mousedown` / `mouseup` —— 当在元素上按下/释放鼠标按钮时。
- `mousemove` —— 当鼠标移动时。

**键盘事件**：

- `keydown` 和 `keyup` —— 当按下和松开一个按键时。

**表单（form）元素事件**：

- `submit` —— 当访问者提交了一个 `<form>` 时。
- `focus` —— 当访问者聚焦于一个元素时，例如聚焦于一个 `<input>`。

**Document 事件**：

- `DOMContentLoaded` —— 当 HTML 的加载和处理均完成，DOM 被完全构建完成时。

**CSS 事件**：

- `transitionend` —— 当一个 CSS 动画完成时。

## 事件处理程序

为了对事件作出响应，我们可以分配一个 **处理程序（handler）**—— 一个在事件发生时运行的函数。

处理程序是在发生用户行为（action）时运行 JavaScript 代码的一种方式。

### HTML

处理程序可以设置在 HTML 中名为 `on<event>` 的特性（attribute）中。

以这种方式指定的事件处理程序有一些特殊的地方。首先，会创建一个函数来封装属性的值。这个函数有一个特殊的局部变量 event，其中保存的就是 event 对象。

```html
<input value="Click me" onclick="alert('Click!')" type="button">
```

但是这种定义事件的方式会有些许问题。



### DOM

我们可以使用 DOM 属性（property）`on<event>` 来分配处理程序。

```html
<input id="elem" type="button" value="Click me">
<script>
  elem.onclick = function() {
    alert('Thank you');
  };
</script>
```

## addEventListener

来看看它的语法结构：

```
element.addEventListener(event, handler[, options]);
```

- `event`

  事件名，例如：`"click"`。

- `handler`

  处理程序。

- `options`

  具有以下属性的附加可选对象：

  - `once`：如果为 `true`，那么会在被触发后自动删除监听器。
  - `capture`：事件处理的阶段。由于历史原因，`options` 也可以是 `false/true`，它与 `{capture: false/true}` 相同。
  - `passive`：如果为 `true`，那么处理程序将不会调用 `preventDefault()`。

要移除处理程序，可以使用 `removeEventListener`：

```javascript
element.removeEventListener(event, handler[, options]);
```

## 事件对象

当事件发生时，浏览器会创建一个 **`event` 对象**，将详细信息放入其中，并将其作为参数传递给处理程序。

```html
<input type="button" value="Click me" id="elem">

<script>
  elem.onclick = function(event) {
    // 显示事件类型、元素和点击的坐标
    alert(event.type + " at " + event.currentTarget);
    alert("Coordinates: " + event.clientX + ":" + event.clientY);
  };
</script>
```

`event` 对象的一些属性：

- `event.type`

  事件类型，这里是 `"click"`。

- `event.currentTarget`

  处理事件的元素。这与 `this` 相同，除非处理程序是一个箭头函数，或者它的 `this` 被绑定到了其他东西上，之后我们就可以从 `event.currentTarget` 获取元素了。

- `event.clientX / event.clientY`

  指针事件（pointer event）的指针的窗口相对坐标。

## 对象处理程序

我们不仅可以分配函数，还可以使用 `addEventListener` 将一个对象分配为事件处理程序。当事件发生时，就会调用该对象的 `handleEvent` 方法。

```html
<button id="elem">Click me</button>

<script>
  let obj = {
    handleEvent(event) {
      alert(event.type + " at " + event.currentTarget);
    }
  };

  elem.addEventListener('click', obj);
</script>
```

## 冒泡和捕获

先看个例子。

```html
<div onclick="alert('The handler!')">
  <em>If you click on <code>EM</code>, the handler on <code>DIV</code> runs.</em>
</div>
```

可以发现，当我们点击 <em\> 时也会触发点击事件。

### 冒泡

**当一个事件发生在一个元素上，它会首先运行在该元素上的处理程序，然后运行其父元素上的处理程序，然后一直向上到其他祖先上的处理程序。** 

比如下面这个例子：

```html
<form onclick="alert('form')">FORM
  <div onclick="alert('div')">DIV
    <p onclick="alert('p')">P</p>
  </div>
</form>
```

点击内部的 `<p>` 会首先运行 `onclick`：

1. 在该 `<p>` 上的。
2. 然后是外部 `<div>` 上的。
3. 然后是外部 `<form>` 上的。
4. 以此类推，直到最后的 `document` 对象。

类似从内部向外递归。

这个过程被称为“冒泡（bubbling）”，因为事件从内部元素“冒泡”到所有父级，就像在水里的气泡一样。

### event.target

父元素上的处理程序始终可以获取事件实际发生位置的详细信息。

**引发事件的那个嵌套层级最深的元素被称为目标元素,可以通过 `event.target` 访问。**

```html
<form id="form">FORM
  <div>DIV
    <p>P</p>
  </div>
</form>

<script src="script.js"></script>
```

```js
form.onclick = function(event) {
  setTimeout(() => {
    alert("target = " + event.target.tagName + ", this=" + this.tagName);
    event.target.style.backgroundColor = ''
  }, 0);
};
```

可以看到，点击 P 时，输出 `target=P，this=FROM`，点击 DIV 时，输出`target=DIV，this=FROM`， 点击 FROM 时，输出`target=FROM，this=FROM`

注意与 `this`（=`event.currentTarget`）之间的区别：

- `event.target` —— 是引发事件的“目标”元素，它在冒泡过程中不会发生变化。
- `this` —— 是“当前”元素，其中有一个当前正在运行的处理程序。

### 停止冒泡

用于停止冒泡的方法是 `event.stopPropagation()`。

```html
<body onclick="alert(`the bubbling doesn't reach here`)">
  <button onclick="event.stopPropagation()">Click me</button>
</body>
```

发现 body.onclick 不会触发。

### 捕获

[DOM 事件](http://www.w3.org/TR/DOM-Level-3-Events/)标准描述了事件传播的 3 个阶段：

1. 捕获阶段（Capturing phase）—— 事件（从 Window）向下走近元素。
2. 目标阶段（Target phase）—— 事件到达目标元素。
3. 冒泡阶段（Bubbling phase）—— 事件从元素上开始冒泡。

<img :src="$withBase('/eventType01.png')" alt="eventType01"/>

为了在捕获阶段捕获事件，我们需要将处理程序的 `capture` 选项设置为 `true`：

```js
elem.addEventListener(..., {capture: true})
// 或者，用 {capture: true} 的别名 "true"
elem.addEventListener(..., true)
```

`capture` 选项有两个可能的值：

- 如果为 `false`（默认值），则在冒泡阶段设置处理程序。
- 如果为 `true`，则在捕获阶段设置处理程序。

虽然形式上有 3 个阶段，但第 2 阶段（“目标阶段”：事件到达元素）没有被单独处理：捕获阶段和冒泡阶段的处理程序都在该阶段被触发。

```html
<form>FORM
  <div>DIV
    <p>P</p>
  </div>
</form>

<script>
  for(let elem of document.querySelectorAll('*')) {
    elem.addEventListener("click", e => alert(`Capturing: ${elem.tagName}`), true);
    elem.addEventListener("click", e => alert(`Bubbling: ${elem.tagName}`));
  }
</script>
```

上面这段代码为文档中的 **每个** 元素都设置了点击处理程序，以查看哪些元素上的点击事件处理程序生效了。

如果你点击了 `<p>`，那么顺序是：

1. `HTML` → `BODY` → `FORM` → `DIV`（捕获阶段第一个监听器）：
2. `P`（目标阶段，触发两次，因为我们设置了两个监听器：捕获和冒泡）
3. `DIV` → `FORM` → `BODY` → `HTML`（冒泡阶段，第二个监听器）。

有一个属性 `event.eventPhase`，它告诉我们捕获事件的阶段数。但它很少被使用，因为我们通常是从处理程序中了解到它。

### 总结

当一个事件发生时 —— 发生该事件的嵌套最深的元素被标记为“目标元素”（`event.target`）。

- 然后，事件从文档根节点向下移动到 `event.target`，并在途中调用分配了 `addEventListener(..., true)` 的处理程序（`true` 是 `{capture: true}` 的一个简写形式）。
- 然后，在目标元素自身上调用处理程序。
- 然后，事件从 `event.target` 冒泡到根，调用使用 `on<event>`、HTML 特性（attribute）和没有第三个参数的，或者第三个参数为 `false/{capture:false}` 的 `addEventListener` 分配的处理程序。

每个处理程序都可以访问 `event` 对象的属性：

- `event.target` —— 引发事件的层级最深的元素。
- `event.currentTarget`（=`this`）—— 处理事件的当前元素（具有处理程序的元素）
- `event.eventPhase` —— 当前阶段（capturing=1，target=2，bubbling=3）。

## 发布-订阅模式

```js
class myEventEmitter {
  constructor() {
    this.eventMap = {}
  }

  on(type, handler) {
    if (!(handler instanceof Function)) {
      throw new Error('please call Function')
    }
    if (!this.eventMap[type]) {
      this.eventMap[type] = []
    }
    this.eventMap[type].push(handler)
  }

  emit(type, params) {
    if (this.eventMap[type]) {
      this.eventMap[type].forEach((handler, index) => {
        handler(params)
      })
    }
  }

  off(type, handler) {
    if (this.eventMap[type]) {
      this.eventMap[type].splice(this.eventMap[type].indexOf(handler) >>> 0, 1)
    }
  }
}

const myEvent = new myEventEmitter()
const testHandler = function (params) {
  console.log(`test事件被触发了，testHandler 接收到的入参是${params}`)
}
const test2 = 1
myEvent.on('test', testHandler)
myEvent.emit('test', 'pig')
// myEvent.on('test2', test2)

```

## 事件委托

不在事件的发生地(直接 dom)上设置监听函数，而是在其父元素上设置监听函数，通过事件冒泡，父元素可以监听到子元素上事件的触发，通过判断事件发生元素 DOM 的类型，来做出不同的响应。

最经典的就是 ul 和 li 标签的事件监听，比如我们在添加事件时候，采用事件委托机制，不会在 li 标签上直接添加，而是在 ul 父元素上添加。

## 一些问题

### 事件是如何实现的？

基于发布订阅模式，就是在浏览器加载的时候会读取事件相关的代码，但是只有实际等到具体的事件触发的时候才会执行。

在 Web 端，我们常见的就是 DOM 事件：

- DOM0 级事件，直接在 html 元素上绑定 on-event，比如 onclick，取消的话，dom.onclick = null，同一个事件只能有一个处理程序，后面的会覆盖前面的。
- DOM2 级事件，通过 addEventListener 注册事件，通过 removeEventListener 来删除事件，一个事件可以有多个事件处理程序，按顺序执行，捕获事件和冒泡事件
- DOM3级事件，增加了事件类型，比如 UI 事件，焦点事件，鼠标事件

### 外部js文件先加载还是onload先执行？

同在body里面*加载*的文件,*onload*函数会优先于 *js文件*的*加载*