# 可视化基础

可视化是将数据组织成易于为⼈所理解和认知的结构，然后⽤图形的⽅式形象地呈现出来的理论、⽅法和技术。实现可视化有两个关键要素，⼀个是数据，另⼀个是图形。如果要考虑在计算机上呈现，那还要加上交互。

## 实现的四种方法

### HTML+CSS

这种⽅式通常⽤来呈现普通的 Web ⽹⻚。理解 css 绘图也有一定的好处

- ⼀些简单的可视化图表，⽤ CSS 来实现很有好处，既能简化开发，⼜不需要引⼊额外的库，可以节省资源，提⾼⽹⻚打开的速度。
- 理解 CSS 的绘图思想对于可视化也是很有帮助的，⽐如，CSS 的很多理论就和视觉相关，可视化中都可以 拿来借鉴。

⽤ CSS 实现柱状图其实很简单，原理就是使⽤⽹格布局（Grid Layout）加上线性渐变（Lineargradient），

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="./index.css" rel="stylesheet" type="text/css" />
    <title>Document</title>
  </head>
  <body>
    <div class="bargraph">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </body>
</html>
```

```css
.bargraph {
  display: grid;
  width: 150px;
  height: 100px;
  padding: 10px;
  transform: scaleY(3);
  grid-template-columns: repeat(5, 20%);
}
.bargraph div {
  margin: 0 2px;
}
.bargraph div:nth-child(1) {
  background: linear-gradient(
    to bottom,
    transparent 75%,
    #37c 0,
    #37c 85%,
    #3c7 0
  );
}
.bargraph div:nth-child(2) {
  background: linear-gradient(
    to bottom,
    transparent 74%,
    #37c 0,
    #37c 89%,
    #3c7 0
  );
}
.bargraph div:nth-child(3) {
  background: linear-gradient(
    to bottom,
    transparent 60%,
    #37c 0,
    #37c 83%,
    #3c7 0
  );
}
.bargraph div:nth-child(4) {
  background: linear-gradient(
    to bottom,
    transparent 55%,
    #37c 0,
    #37c 75%,
    #3c7 0
  );
}
.bargraph div:nth-child(5) {
  background: linear-gradient(
    to bottom,
    transparent 32%,
    #37c 0,
    #37c 63%,
    #3c7 0
  );
}
```

可以看到绘制出了一个图表。

而对于饼状图来说，我们也可以改写一下上面的 css 来画出。

```css
.piegraph {
  display: inline-block;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background-image: conic-gradient(
    #37c 30deg,
    #3c7 30deg,
    #3c7 65deg,
    orange 65deg,
    orange 110deg,
    #f73 110deg,
    #f73 200deg,
    #ccc 200deg
  );
}
```

但是⽤ HTML+CSS 实现可视化有几个缺点：

### SVG

SVG 和传统的 HTML+CSS 的绘图⽅式差别不⼤。只不过，HTML 元素在绘制⽮量图形⽅⾯的能⼒有些不⾜，⽽ SVG 恰好弥补了这⽅⾯的缺陷。

### Canvas2D

这是浏览器提供的 Canvas API 中的其中⼀种上下⽂，使⽤它可以⾮常⽅便地绘制出基础的⼏何图形。在可视化中，Canvas ⽐较常⽤。

### Webgl

这是浏览器提供的 Canvas API 中的另⼀种上下⽂，它是 OpenGL ES 规范在 Web 端的实现。我们可以通过它，⽤ GPU 渲染各种复杂的 2D 和 3D 图形。值得⼀提的是，WebGL 利⽤了 GPU 并⾏处理的特性，这让它在处理⼤量数据展现的时候，性能⼤⼤优于前 3 种绘图⽅式。因此，在可视化的应⽤中，⼀些数据量⼤、视觉效果要求⾼的特殊场景，使⽤ WebGL 渲染是⼀种⽐较合适的选择。
