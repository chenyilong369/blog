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

### 圣杯布局(**float + margin-left/right + padding-left/right**)

```html
<div class="grail-layout">
    <div class="left"></div>
    <div class="right"></div>
    <div class="center"></div>
</div>
```

```css
.grail-layout {
    padding: 0 100px;
    width: 400px;
    height: 400px;
}

.grail-layout .left {
    float: left;
    margin-left: -100px;
    width: 100px;
    height: 100%;
    background-color: #f66;
}

.grail-layout .right {
    float: right;
    margin-right: -100px;
    width: 100px;
    height: 100%;
    background-color: #66f;
}

.grail-layout .left {
	height: 100%;
    background-color: #3c9;
}
```

### 双飞翼布局**float + margin-left/right**

```html
<div class="grail-layout">
    <div class="left"></div>
    <div class="right"></div>
    <div class="center">
        <div></div>
    </div>
</div>
```

```css
.grail-layout {
    width: 400px;
    height: 400px;
}

.grail-layout .left {
    float: left;
    width: 100px;
    height: 100%;
    background-color: #f66;
}

.grail-layout .right {
    float: right;
    width: 100px;
    height: 100%;
    background-color: #66f;
}

.grail-layout .left {
    margin: 0 100px;
	height: 100%;
    background-color: #3c9;
}
```

### 圣杯布局/双飞翼布局**flex**

```html
<div class="grail-layout">
    <div class="left"></div>
    <div class="center"></div>
    <div class="right"></div>
</div>
```

```scss
.grail-layout {
    display: flex;
    width: 400px;
    height: 400px;
}

.grail-layout .left {
    width: 100px;
    background-color: #f66;
}

.grail-layout .center {
    flex: 1;
    background-color: #3c9;
}

.grail-layout .right {
    width: 100px;
    background-color: #66f;
}
```

## 均分布局

经典的`均分布局`由多列组成，其特点为`每列宽度相等`和`每列高度固定且相等`。

```html
<div class="average-layout">
    <div class="one"></div>
    <div class="two"></div>
    <div class="three"></div>
    <div class="four"></div>
</div>
```

```css
.one {
    background-color: #f66;
}
.two {
    background-color: #66f;
}
.three {
    background-color: #f90;
}
.four {
    background-color: #09f;
}
```

### **float + width**

每列宽度声明为相等的百分比，若有4列则声明`width:25%`。N列就用公式`100 / n`求出最终百分比宽度，记得保留2位小数，还可用`width:calc(100% / n)`自动计算。

```css
.average-layout {
    width: 400px;
    height: 400px;
}

.average-layout  div {
    float: left;
    width: 25%;
    height: 100%;
}
```

### **column**

```css
.average-layout {
    column-count: 4;
    column-gap: 0;
    width: 400px;
    height: 400px;
}

.average-layout  div {
    height: 100%;
}
```

### **flex**

节点声明`display:flex`后，生成的`FFC容器`里所有子节点的高度都相等，因为容器的`align-items`默认为`stretch`，所有子节点将占满整个容器的高度。每列声明`flex:1`自适应宽度。

```css
.average-layout {
    display: flex;
    width: 400px;
    height: 400px;
}

.average-layout div {
    flex: 1;
}
```

## 居中布局

### 水平居中

- margin:0 auto + width:fit-content：全部元素

- 块级元素 + margin:0 auto + width：块级元素

  - 若节点不是块级元素需声明display:block
  - 若节点宽度已隐式声明则无需显式声明width

- 行内元素 + text-aligin:center：行内元素
  
  - 父节点上声明text-align
  - 若节点不是行内元素需声明display:inline/inline-block

- position + left/right + margin-left/right + width：全部元素

- position + left/right + transform:translateX(-50%)：全部元素

- display:flex + justify-content:center：全部元素
  
  - 父节点上声明display和justify-content
  
### 垂直居中
- 块级元素 + padding-top/bottom：块级元素

  - 父节点高度未声明或自适应
  - 若节点不是块级元素需声明display:block

- 行内元素 + line-height：行内元素

  - 父节点上声明line-height
  - 若节点不是行内元素需声明display:inline/inline-block

- display:table + display:table-cell + vertical-align:middle：全部元素

  - 父节点上声明display:table

- display:table-cell + vertical-align:middle：全部元素

  - 父节点上声明display和vertical-align

- position + top/bottom + margin-top/bottom + height：全部元素

- position + top/bottom + transform:translateY(-50%)：全部元素

- display:flex + align-items:center：全部元素
  
  - 父节点上声明display和align-items

- display:flex + margin:auto 0：全部元素
  
  - 父节点上声明display

### 水平垂直居中布局

```html
<div class="center-layout">
    <div></div>
</div>
```

```css
.center-layout {
    width: 400px;
    height: 400px;
    background-color: #f66;
}

.center-layout div {
    width: 100px;
    height: 100px;
    background-color: #66f;
}
```

#### **display:inline-block**

<div\> 声明`display:inline-block`将其变成行内块级元素，那么可用`text-align`和`line-height`声明水平垂直居中了，但是行内块级元素与匿名行内盒的基线对齐存在很大差异，所以需声明`vertical-align:middle`将其调整到垂直居中的位置，不过这也是近似垂直居中，父节点最后还需声明`font-size:0`消除该差异。

```css
.center-layout {
	line-height: 400px;
    text-align: center;
    font-size: 0;
}

.center-layout div {
	display: inline-block;
    vertical-align: middle;
}
```

#### **display:table-cell**

父节点声明`display:table-cell`模拟`表格布局`的垂直居中；子节点声明`margin:0 auto`使其水平居中。

```css
.center-layout {
	display: table-cell;
    vertical-align: middle;
}

.center-layout div {
	margin: 0 auto;
}
```

#### **position**

使用`margin负值`将节点拉回最中间，所以必须已知宽高才能计算`margin负值`，通常是`margin-left`和`margin-top`，可连写成`margin:-(height/2) 0 0 -(width/2)`。（可以用 CSS3 中的 `transform:translate(-50%,-50%)` 代替）

```css
.center-layout {
	position: relative;
}

.center-layout div {
	position: absolute;
    left: 50%;
    top: 50%;
    margin: -50px 0 0 -50px;
    // 也可以写成transform:translate(-50%,-50%)
}
```

#### flex

```css
.center-layout {
	display: flex;
    justify-content: center;
    align-items: center;
}
```

也可以这么写：

```css
.center-layout {
	display: flex;
}
.center-layout div{
    margin: auto;
}
```

## 文字布局

### 文本环绕

利用`float`使节点脱流的原理实现。

```html
<div class="text-wrapping">
    <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1089874897,1268118658&fm=26&gp=0.jpg"> 
    <!--自己可以用自己的-->
    XXXXX......(很多个X)
</div>
```

```css
.text-wrapping {
    overflow: hidden;
    width: 400px;
    height: 300px;
    font-size: 20px;
    color: #f66;
    word-break: break-all; // 允许在单词内换行。
}

.text-wrapping img {
    float:left;
    margin: 10px;
    height: 200x;
}
```

### 文字溢出

#### 单行文字溢出**overflow + text-overflow**

```css
.s-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
```

#### 多行文字溢出**flex + overflow + text-overflow**

使用`旧版弹性布局`模拟`多行文字溢出`，只能在`Webkit内核`中使用，局限性太大了。

- `display:-webkit-box`：将容器作为弹性伸缩盒模型
- `-webkit-box-orient`：弹性伸缩盒模型子节点的排列方式
- `-webkit-line-clamp`：限制容器最多显示多少行文本

```css
.m-ellipsis {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
}
```

于是我们来想想模拟溢出省略号。

使用伪元素`::after`胜任这个工作了。结合`max-height`和`line-height`计算最大显示行数，通过定位布局把`省略号`定位到整段文字的右下角，使用`linear-gradient()`调整渐变背景颜色稍微润色下省略号使其看上去自然一些。

```css
.m-ellipsis {
    overflow: hidden;
    position: relative;
    max-height: 120px;
    line-height: 40px;
}

.m-ellipsis::after {
    position: absolute;
    right: 0;
    bottom: 0;
    padding-left: 20px;
    background: linear-gradient(to right, transparent, #fff 50%);
    content: "...";
}
```

但是单行文字也会出现省略号，只能结合JS额外处理了。（判断是否只有一行）。