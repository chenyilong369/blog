# drag

HTML5 添加了对拖放的支持。把拖放内置到浏览器的好处是它可以正确地集成到操作系统中。

## draggable

我们可以通过 draggable 属性告诉浏览器文档里的哪些元素可以被拖动。这个属性有三个允许的值。

| 值    | 说明                       |
| ----- | -------------------------- |
| true  | 此元素能被拖动             |
| false | 此元素不能被拖动           |
| auto  | 浏览器自己决定是否可以拖动 |

它的默认值是 auto，默认交给浏览器进行处理。

```html
<!DOCTYPE HTML>
<html>
  <head>
    <title>DRAG</title>
    <style>
      #src > * {float: left;}
      #target, #src > img {
        border: thin solid black;
        padding: 20px;
        margin: 4px;
      }
      #target {
        height: 80px;
        width: 80px;
        text-align: center;
        display: table;
      }
      #target > p {
        display: table-cell;
        vertical-align: middle;
      }

      #target > div {
        margin: 1px;
      }
    </style>
  </head>
  <body>
    <div id="src">
      <div draggable="true" id="text">我可以被拖动</div>
      <div id="target">
        <p>Drop Here</p>
      </div>
    </div>
    <script>
      let src = document.getElementById("src")
      let target = document.getElementById("target")
    </script>
  </body>
</html>
```

这时候文本是可以被拖动的。

## 处理拖动事件

我们通过一系列事件来利用拖放功能。

| 名称      | 说明                   |
| --------- | ---------------------- |
| dragstart | 在元素开始被拖放时触发 |
| drag      | 在元素被拖动时反复触发 |
|           | 在拖动操作完成时触发   |

我们可以通过这些事件在视觉上强调拖动操作。

```html
<!DOCTYPE HTML>
<html>
  <head>
    <title>DRAG</title>
    <style>
      #src > * {float: left;}
      #target, #src > img {
        border: thin solid black;
        padding: 20px;
        margin: 4px;
      }
      #target {
        height: 80px;
        width: 80px;
        text-align: center;
        display: table;
      }
      #target > p {
        display: table-cell;
        vertical-align: middle;
      }

      #target > div {
        margin: 1px;
      }
      #text.draged {
        color: red;
      }
    </style>
  </head>
  <body>
    <div id="src">
      <div draggable="true" id="text">我可以被拖动</div>
      <div id="target">
        <p id="msg">Drop Here</p>
      </div>
    </div>
    <script>
      let src = document.getElementById("src")
      let target = document.getElementById("target")
      let msg = document.getElementById("msg")

      src.ondragstart = function (e) {
        e.target.classList.add('draged')
      }

      src.ondragend = function (e) {
        e.target.classList.remove('draged')
        msg.innerHTML = "Drop Here"
      }

      src.ondrag = function (e) {
        msg.innerHTML = e.target.id
      }
    </script>
  </body>
</html>
```

你会发现文本被拖动的时候，文本变成了红色，文本框中的内容变成了 text 了。

## 创建释放区

要让某个元素成为释放区，需要处理 dragenter， dragover事件。

| 名称      | 说明                                         |
| --------- | -------------------------------------------- |
| dragenter | 当被拖动元素进入释放区所占据的屏幕空间时触发 |
| dragover  | 当被拖动元素在释放区内移动时触发             |
| dragleave | 当被拖动元素没有放下就离开释放区时触发       |
| drop      | 当被拖动元素在释放区里放下时触发             |

dragenter 和 dragover 事件的默认行为是拒绝接受任务被拖放的项目，因此我们必须要做的最重要的事就是防止这种默认行为被触发。

```html
<!DOCTYPE HTML>
<html>
  <head>
    <title>DRAG</title>
    <style>
      #src > * {float: left;}
      #target, #src > img {
        border: thin solid black;
        padding: 20px;
        margin: 4px;
      }
      #target {
        height: 80px;
        width: 80px;
        text-align: center;
        display: table;
      }
      #target > p {
        display: table-cell;
        vertical-align: middle;
      }

      #target > div {
        margin: 1px;
      }
      #text.draged {
        color: red;
      }
    </style>
  </head>
  <body>
    <div id="src">
      <div draggable="true" id="text">我可以被拖动</div>
      <div id="target">
        <p id="msg">Drop Here</p>
      </div>
    </div>
    <script>
      let src = document.getElementById("src")
      let target = document.getElementById("target")
      let msg = document.getElementById("msg")

      target.ondragenter = handleDrag
      target.ondragover = handleDrag

      function handleDrag(e) {
        e.preventDefault() // 阻止默认行为
      }

      src.ondragstart = function (e) {
        e.target.classList.add('draged')
      }

      src.ondragend = function (e) {
        e.target.classList.remove('draged')
        msg.innerHTML = "Drop Here"
      }

      src.ondrag = function (e) {
        msg.innerHTML = e.target.id
      }

    </script>
  </body>
</html>
```



## 接受释放

我们通过处理 drop 事件来接收释放的元素，它会在某个项目被放到释放区元素上时触发。

我们可以在全局设置一个变量用来充当被拖动元素和释放区之间的桥梁。

```html
<!DOCTYPE HTML>
<html>
  <head>
    <title>DRAG</title>
    <style>
      #src > * {float: left;}
      #target, #src > img {
        border: thin solid black;
        padding: 20px;
        margin: 4px;
      }
      #target {
        height: 80px;
        width: 80px;
        text-align: center;
        display: table;
      }
      #target > p {
        display: table-cell;
        vertical-align: middle;
      }

      #target > div {
        margin: 1px;
      }
      #text.draged {
        color: red;
      }
    </style>
  </head>
  <body>
    <div id="src">
      <div draggable="true" id="text">我可以被拖动</div>
      <div id="target">
        <p id="msg">Drop Here</p>
      </div>
    </div>
    <script>
      let src = document.getElementById("src")
      let target = document.getElementById("target")
      let msg = document.getElementById("msg")

      
      let dragedID

      target.ondragenter = handleDrag
      target.ondragover = handleDrag

      function handleDrag(e) {
        e.preventDefault()
      }

      src.ondragstart = function (e) {
        dragedID = e.target.id
        e.target.classList.add('draged')
      }

      src.ondragend = function (e) {
        let elems = document.querySelectorAll('.draged')
        for(let i = 0; i < elems.length ; i++) {
          elems[i].classList.remove('draged')
        }
      }

      src.ondrag = function (e) {
        let newElem = document.getElementById(dragedID).cloneNode(true)
        target.innerHTML = ""
        target.appendChild(newElem)
        console.log(newElem)
        e.preventDefault()
      }

    </script>
  </body>
</html>
```



