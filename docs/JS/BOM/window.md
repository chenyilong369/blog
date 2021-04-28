# **window** 对象

BOM 的核心是 window 对象，表示浏览器的实例。window 对象在浏览器中有两重身份，一个是 ECMAScript 中的 Global 对象，另一个就是浏览器窗口的 JavaScript 接口。这意味着网页中定义的所有对象、变量和函数都以 window 作为其 Global 对象，都可以访问其上定义的 parseInt()等全局方法。

## **Global** 作用域

window 对象被复用为 ECMAScript 的 Global 对象，所以通过 var 声明的所有全局变量和函数都会变成 window 对象的属性和方法。

```js
var age = 29
var sayAge = () => console.log(this.age)
sayAge() // 29
window.sayAge() // 29
```

## 窗口关系

top 对象始终指向最上层（最外层）窗口，即浏览器窗口本身。而 parent 对象则始终指向当前窗口的父窗口。如果当前窗口是最上层窗口，则 parent 等于 top（都等于 window）。最上层的 window 如果不是通过 window.open() 打开的，那么其 name 属性就不会包含值。

还有一个 self 对象，它是终极 window 属性，始终会指向 window。实际上，self 和 window 就是同一个对象。

## 窗口位置与像素比

可以使用 moveTo()和 moveBy()方法移动窗口。这两个方法都接收两个参数，其中 moveTo() 接收要移动到的新位置的绝对坐标 x 和 y；而 moveBy()则接收相对当前位置在两个方向上移动的像素数。

```js
// 把窗口移动到左上角
window.moveTo(0, 0)

// 把窗口向下移动 100 像素
window.moveBy(0, 100)

// 把窗口移动到坐标位置（200， 300）
window.moveTo(200, 300)

// 把窗口左移 50 像素
window.moveBy(-50, 0)
```

## 窗口大小

在不同浏览器中确定浏览器窗口大小没有想象中那么容易。所有现代浏览器都支持 4 个属性：innerWidth、innerHeight、outerWidth 和 outerHeight。

outerWidth 和 outerHeight 返回浏览器窗口自身的大小（不管是在最外层 window 上使用，还是在窗格<frame\>中使用）。innerWidth 和 innerHeight 返回浏览器窗口中页面视口的大小（不包含浏览器边框和工具栏）。

```js
let pageWidth = window.innerWidth,
  pageHeight = window.innerHeight
if (typeof pageWidth != 'number') {
  if (document.compatMode == 'CSS1Compat') {
    pageWidth = document.documentElement.clientWidth
    pageHeight = document.documentElement.clientHeight
  } else {
    pageWidth = document.body.clientWidth
    pageHeight = document.body.clientHeight
  }
}
```

可以使用resizeTo()和resizeBy()方法调整窗口大小。这两个方法都接收两个参数，resizeTo() 接收新的宽度和高度值，而 resizeBy() 接收宽度和高度各要缩放多少。

```js
// 缩放到 100×100 
window.resizeTo(100, 100); 
// 缩放到 200×150 
window.resizeBy(100, 50); 
// 缩放到 300×300 
window.resizeTo(300, 300);
```

## 视口位置

浏览器窗口尺寸通常无法满足完整显示整个页面，为此用户可以通过滚动在有限的视口中查看文档。度量文档相对于视口滚动距离的属性有两对，返回相等的值：window.pageXoffset/window.scrollX 和 window.pageYoffset/window.scrollY。

可以使用 scroll()、scrollTo()和 scrollBy()方法滚动页面。这 3 个方法都接收表示相对视口距离的 x 和 y 坐标，这两个参数在前两个方法中表示要滚动到的坐标，在最后一个方法中表示滚动的距离。

```js
// 相对于当前视口向下滚动 100 像素
window.scrollBy(0, 100); 
// 相对于当前视口向右滚动 40 像素
window.scrollBy(40, 0); 
// 滚动到页面左上角
window.scrollTo(0, 0);
// 滚动到距离屏幕左边及顶边各 100 像素的位置
window.scrollTo(100, 100); 
```

这几个方法也都接收一个 ScrollToOptions 字典，除了提供偏移值，还可以通过 behavior 属性告诉浏览器是否平滑滚动。

```js
// 正常滚动
window.scrollTo({
  left: 100,
  top: 100,
  behavior: 'auto',
})
// 平滑滚动
window.scrollTo({
  left: 100,
  top: 100,
  behavior: 'smooth',
})
```

## 导航与打开新窗口

window.open()方法可以用于导航到指定 URL，也可以用于打开新浏览器窗口。这个方法接收 4 个参数：要加载的 URL、目标窗口、特性字符串和表示新窗口在浏览器历史记录中是否替代当前加载页面的布尔值。

