# 布局方式

## 布局

我们首先对布局方式分个类：

- 普通布局：`display:block/inline`
-  浮动布局：`float:left/right`
-  定位布局：`position:relative/absolute/fixed`、`left/right/top/bottom/z-index`
-  表格布局：`table系列属性`
-  弹性布局：`display:flex/inline-flex`、`flex系列属性`
-  多列布局：`column系列属性`
-  格栅布局：`display:grid/inline-grid`、`grid系列属性`
-  响应式布局：`em/rem/vw/vh/vmin/vmax`、`媒体查询`

网络中大部分都是采用的**浮动布局**、**定位布局**和**弹性布局**。（后面会专门介绍弹性布局）

### 清除浮动

在各种经典布局方式中，可能会结合`浮动布局`相关属性。使用`float`会使节点脱流导致父节点高度坍塌，若不对父节点显式声明高度则很有必要给父节点清除浮动。定义以下`clearfix`用于清除浮动，给父节点添加即可。值得注意，`clearfix`已占用`::after`，所以使用`clearfix`的父节点就不能再声明`::after`了，可改用`::before`。

```css
.clearfix::after {
    display: block;
    visibility: hidden;
    clear: both;
    height: 0;
    font-size: 0;
    content: "";
}
```

详情可见[Clearfix](https://stackoverflow.com/questions/211383/what-methods-of-clearfix-can-i-use)。之后再填这个坑。

## 全屏布局

经典的`全屏布局`由顶部、底部、主体三部分组成，其特点为`三部分左右满屏拉伸`、`顶部底部高度固定`和`主体高度自适应`，主要应用在主体布局。该布局很常见，也是大部分Web应用主体的主流布局。通常使用`<header>`、`<footer>`和`<main>`三个标签语义化排版，`<main>`内还可插入`<aside>`作为侧栏。

<img :src="$withBase('/layout01.png')" alt="layout01"/>

例如：

```html
<div class="layout">
  <header></header>
  <main></main>
  <footer></footer>
</div>
```

### **position + left/right/top/bottom**

顶部、底部和主体声明`left:0`和`right:0`将其左右部分满屏拉伸；顶部和底部声明`top:0`和`bottom:0`分别将其吸顶和吸底，并声明俩高度为固定值；将主体的`top`和`bottom`分别声明为顶部高度和底部高度。

移动端基本都是以该布局为主。

```css
.layout {
  position: relative;
  width: 400px;
  height: 400px;
}

.layout header {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 50px;
  background-color: red;
}

.layout footer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 50px;
  background-color: greenyellow;
}

.layout main {
  position: absolute;
  left: 0;
  right: 0;
  top: 50px;
  bottom: 50px;
  background-color: pink;
}
```

### flex

使用flex实现更简洁。`display:flex`默认会令子节点横向排列，需声明`flex-direction:column`改变子节点排列方向为纵向排列；顶部和底部高度固定，所以主体声明`flex:1`让高度自适应即可。

```css
.layout {
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 400px;
}

.layout header {
  height: 50px;
  background-color: red;
}

.layout footer {
  height: 50px;
  background-color: greenyellow;
}

.layout main {
  flex: 1;
  background-color: pink;
}
```

## 多列布局

### 两列布局

经典的`两列布局`由左右两列组成，其特点为`一列宽度固定`、`另一列宽度自适应`和`两列高度固定且相等`。以下以左列宽度固定和右列宽度自适应为例。

<img :src="$withBase('/layout02.png')" alt="layout02"/>

```html
<div class="two-column-layout">
    <div class="left"></div>
    <div class="right"></div>
</div>
```

#### **float + margin-left/right**

左列声明`float:left`和固定宽度，由于`float`使节点脱流，右列需声明`margin-left`为左列宽度，以保证两列不会重叠。

```css
.layout {
  width: 400px;
  height: 400px;
}

.layout .left {
  float: left;
  width: 100px;
  height: 100%;
  background-color: red;
}

.layout .right {
  margin-left: 100px;
  height: 100%;
  background-color: greenyellow;
}
```

#### **overflow + float**

左列声明同上，右列声明`overflow:hidden`使其形成BFC区域与外界隔离。

```css
.layout {
  width: 400px;
  height: 400px;
}

.layout .left {
  float: left;
  width: 100px;
  height: 100%;
  background-color: red;
}

.layout .right {
  overflow: hidden;
  height: 100%;
  background-color: greenyellow;
}
```

#### **flex**

还是 flex 实现更简洁。左列声明固定宽度，右列声明`flex:1`自适应宽度。

```css
.layout {
  display: flex;
  width: 400px;
  height: 400px;
}

.layout .left {
  width: 100px;
  background-color: red;
}

.layout .right {
  flex: 1;
  background-color: greenyellow;
}
```

### 三列布局

经典的`三列布局`由左中右三列组成，其特点为`连续两列宽度固定`、`剩余一列宽度自适应`和`三列高度固定且相等`。以下以左中列宽度固定和右列宽度自适应为例。整体同二列布局。

<img :src="$withBase('/layout03.png')" alt="layout03"/>

```css
<div class="three-column-layout">
    <div class="left"></div>
    <div class="center"></div>
    <div class="right"></div>
</div>
```

#### **overflow + float**

```scss
.layout {
  width: 400px;
  height: 400px;
}

.layout .left {
  float: left;
  width: 50px;
  height: 100%;
  background-color: red;
}

.layout .center {
  float: left;
  width: 100px;
  height: 100%;
  background-color: pink;
}

.layout .right {
  overflow: hidden;
  height: 100%;
  background-color: greenyellow;
}
```

#### **flex**

使用flex实现会更简洁，还是flex大法好。

```scss
.layout {
  display: flex;
  width: 400px;
  height: 400px;
}

.layout .left {
  width: 50px;
  background-color: red;
}

.layout .center {
  width: 100px;
  background-color: pink;
}

.layout .right {
  flex: 1;
  background-color: greenyellow;
}
```

## 圣杯布局与双飞翼布局

经典的`圣杯布局`和`双飞翼布局`都是由左中右三列组成，其特点为`左右两列宽度固定`、`中间一列宽度自适应`和`三列高度固定且相等`。

`圣杯布局`和`双飞翼布局`在大体相同下也存在一点不同，区别在于`双飞翼布局`中间列需插入一个子节点。在常规的实现方式中也是在这个中间列里做文章，`如何使中间列内容不被左右列遮挡`。

- 相同
  - 中间列放首位且声明其宽高占满父节点
  - 被挤出的左右列使用`float`和`margin负值`将其拉回与中间列处在同一水平线上
- 不同
  - 圣杯布局：父节点声明`padding`为左右列留出空位，将左右列固定在空位上
  - 双飞翼布局：中间列插入子节点并声明`margin`为左右列让出空位，将左右列固定在空位上