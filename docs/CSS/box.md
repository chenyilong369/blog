# 盒模型

**盒模型**由以下属性组成，由外到内用公式表示就是：**box = margin + border + padding + content**。除了content(不是属性，作为盒模型扩展理解使用)，其余属性都包含left、right、top和bottom等扩展属性。

- **margin**：边距，外部透明区域，负责隔离相邻盒子
- **border**：边框，内部着色区域，负责隔离边距和填充，包含`width`、`style`、`color`三个扩展属性
- **padding**：填充，内部着色区域，负责扩展盒子内部尺寸
- **content**：内容，以`文本`或`节点`存在的占用位置

:::tip 

padding着色随background-color而变，可用background-clip隔离.

:::

## 类型

由于历史原因，盒模型分化成两种类型，分别是**标准盒模型**和**怪异盒模型**。

CSS3里提供一个属性用于声明盒模型的类型，它就是`box-sizing`。

-  **content-box**：标准盒模型(`默认`)
-  **border-box**：怪异盒模型

但是它不具备继承性，若全局统一盒模型，那只能使用`*`声明`box-sizing`了。

### 标准盒模型

**标准盒模型**是W3C规范的标准，由`margin + border + padding + content`组成。与上述提到的公式一模一样，节点的`width/height`只包含`content`，不包含`padding`和`border`。

节点的尺寸计算公式如下。

- **横向**：`margin-[left/right]` + `border-[left/right]`+ `padding-[left/right]` + `width`
- **纵向**：`margin-[top/bottom]` + `border-[top/bottom]`+ `padding-[top/bottom]` + `height`

节点的宽高计算公式如下。

- **横向**：`width = width`
- **纵向**：`height = height`

### 怪异盒模型

**怪异盒模型**又名IE盒子模型，是IExplore制定的标准，由`margin + content`组成。与上述提到的公式一不同，节点的`width/height`包含`border`、`padding`和`content`。

节点的尺寸计算公式如下。

- **横向**：`margin-[left/right]` + `width`(包含`border-[left/right]`和`padding-[left/right]`)
- **纵向**：`margin-[top/bottom]` + `height`(包含`border-[top/bottom]`和`padding-[top/bottom]`)

节点的宽高计算公式如下。

- **横向**：`width = border + padding + width`
- **纵向**：`height = border + padding + height`

下面用代码来展示两者的区别：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" type="text/css" href="test.css">
  </head>
  <body>
    <div class="content-box"></div>
    <div class="border-box"></div>
  </body>
</html>
```

```css
body {
  background-color: pink;
  display: flex;
}

.content-box {
  box-sizing: content-box;
  margin: 100px;
  padding: 50px;
  border: 10px solid #66f;
  width: 80px;
  height: 80px;
  background-color: #f66;
}

.border-box {
  box-sizing: border-box;
  margin: 100px;
  padding: 50px;
  border: 10px solid #66f;
  width: 80px;
  height: 80px;
  background-color: #f66;
}
```

<img :src="$withBase('/box01.png')" alt="box01"/>

## 视觉格式化模型

上述**盒模型**都是平时了解到的概念，若使用`display`对这个简单盒模型稍微加工则会进化到**视觉格式化模型**。

**视觉格式化模型**指在视觉媒体上处理和显示文档而使用的计算规则。它是一种CSS机制，由大量CSS规范组成，规定了节点在页面中的排版。

### 块级元素

当节点的`display`声明为`block`、`list-item`、`table`、`flex`或`grid`时，该节点被标记为**块级元素**。块级元素默认宽度为`100%`，在垂直方向上按顺序放置，同时参与**块格式化上下文**。

每个`块级元素`都至少生成一个块级盒，或一个块容器盒，`块级盒`描述它与兄弟节点间的表现方式，`块容器盒`描述它与子节点间的表现方式。

一个块容器盒只包含其他块级盒，或生成一个`行内格式化上下文`只包含行内盒。

### 行内元素

当节点的`display`声明为`inline`、`inline-block`、`inline-table`、`inline-flex`或`inline-grid`时，该节点被标记为**行内元素**。行内元素默认宽度为`auto`，在水平方向上按顺序放置，同时参与**行内格式化上下文**。

- 互相转换
  - 块级元素转换行内元素：`display:inline`
  - 行内元素转换块级元素：`display:block`
- 占位表现
  - 块级元素默认独占一行，默认宽度为父节点的`100%`，可声明边距、填充和宽高
  - 行内元素默认不独占一行(`一行可多个`)，默认宽度随内容自动撑开，可声明水平边距和填充，不可声明垂直边距和宽高
- 包含关系
  - 块级元素可包含块级元素和行内元素
  - 行内元素可包含行内元素，不能包含块级元素

## 格式化上下文

**格式化上下文**指决定渲染区域里节点的排版、关系和相互作用的渲染规则。

例如页面中有一个`<ul>`及其多个子节点`<li>`，`格式上下文`决定这些`<li>`如何排版，`<li>`与`<li>`间处于什么关系，以及`<li>`与`<li>`间如何互相影响。

格式上下文主要由以下几部分组成。其中最重要的是**块格式化上下文**和**行内格式化上下文**。

| 上下文               | 缩写  | 版本 | 声明         |
| -------------------- | ----- | ---- | ------------ |
| **块格式化上下文**   | `BFC` | 2    | 块级盒子容器 |
| **行内格式化上下文** | `IFC` | 2    | 行内盒子容器 |
| **弹性格式化上下文** | `FFC` | 3    | 弹性盒子容器 |
| **格栅格式化上下文** | `GFC` | 3    | 格栅盒子容器 |

### BFC

BFC 是页面上一个独立且隔离的渲染区域，容器里的子节点不会在布局上影响到外面的节点。

#### 规则

- 节点在垂直方向上按顺序排列
- 节点垂直方向距离由`margin`决定，相邻节点的`margin`会发生重叠，以最大`margin`为合并值
- 节点的`margin-left/right`与父节点的`左边/右边`相接触，即使处于浮动也如此，除非自行形成BFC
- BFC是一个隔离且不受外界影响的独立容器
- BFC不会与同级浮动区域重叠
- 计算BFC高度时其浮动子节点也参与计算

#### 如何形成

- 根节点：`html`
- 非溢出可见节点：`overflow:!visible`
- 浮动节点：`float:left/right`
- 绝对定位节点：`position:absolute/fixed`
- 被定义成块级的非块级节点：`display:inline-block/table-cell/table-caption/flex/inline-flex/grid/inline-grid`
- 父节点与正常文档流的子节点(非浮动)自动形成BFC

#### 应用场景

- 清除浮动
- 已知宽度水平居中
- 防止浮动节点被覆盖
- 防止垂直margin合并

::: tip margin 塌陷

所谓的塌陷其实是 BFC 中两个的相邻盒或父子盒相互作用时产生的效果，两个盒子会取相邻边最大`margin`作为相邻边的共用`margin`。

:::

补充一些`margin折叠`的计算问题。

- 两个盒子相邻边的`margin`都为正值，取最大值
- 两个盒子相邻边的`margin`都为负值，取最小值，两者会互相重合
- 两个盒子相邻边的`margin`一正一负，取两者相加值，若结果为负，两者会互相重合

### IFC

IFC的宽高由行内子元素中最大的实际高度确定，不受垂直方向的`margin`和`padding`影响。

IFC中不能存在块元素，若插入块元素则会产生对应个数的匿名块并互相隔离，即产生对应个数的IFC，每个IFC对外表现为块级元素，并垂直排列。

#### 规则

- 节点在水平方向上按顺序排列
- 节点无法声明宽高，其`margin`和`padding`在水平方向有效在垂直方向无效
- 节点在垂直方向上以不同形式对齐
- 节点宽度由包含块与浮动决定，节点高度由行高决定

#### 形成原因

- 声明`display:inline[-x]`形成行内元素
- 声明`line-height`
- 声明`vertical-align`
- 声明`font-size`

### FFC

声明`display`为`flex`或`inline-flex`时，节点会生成一个`FFC`的独立容器，主要用于`响应式布局`。

### GFC

声明`display`为`grid`或`inline-grid`时，节点会生成一个`GFC`的独立容器，主要用于`响应式布局`。

### 文档流

**档流**指节点在排版布局过程中默认使用从左往右从上往下的流式排列方式。窗体从上往下分成一行行且每行按照从左往右的顺序排列节点，其显著特点就是`从左往右从上往下`。

标准的文档流也有几个小缺陷：

- **空白折叠**：HTML中换行编写行内元素，排版会出现`5px空隙`
- **高矮不齐**：行内元素统一以底边垂直对齐
- **自动换行**：排版若一行无法完成则换行接着排版

我们先来看一下空白折叠：

```html
<ul>
    <li></li>
    <li></li>
    <li></li>
</ul>
```

```css
ul {
    text-align: center;
}
li {
    display: inline-block;
}
```

很多浏览器就会出现 5px 空隙。也有几种解决办法。

1. 紧密连接节点。

```html
<ul>
    <li></li><li></li><li></li>
</ul>
```

2. 子节点声明`margin-left:-5px`

```css
li {
    display: inline-block;
    margin-left: -5px;
}
```

3. 使用`Flex布局`居中显示

```css
ul {
    display: flex;
    justify-content: center;
}
```

#### 脱离文档流

**脱离文档流**指节点脱离正常文档流后，在正常文档流中的其他节点将忽略该节点并填补其原先空间。文档一旦脱流，计算其父节点高度时不会将其高度纳入，脱流节点不占据空间，因此添加浮动或定位后会对周围节点布局产生或多或少的影响。

文档流的脱流有两种方式。

- 浮动布局：float:left/right
- 定位布局：position:absolute/fixed

##### Float

节点使用`float`脱流时，会让其跳出正常文档流，其他节点会忽略该节点并填补其原先空间。但该节点文本可不参与这个脱流效果，却会认同该节点所占据的空间并围绕它布局，这个就是常说的`文字环绕效果`的原理。

`节点参与浮动布局后，自身脱流但其文本不脱流`。

##### Position

节点使用`position`脱流时(只有`absolute`和`fixed`)，会让其及其文本一起跳出正常文档流，其他节点会忽略该节点并填补其原先空间。`absolute`绝对定位是相对往上遍历第一个包含`除了position:static`的祖先节点定位，若无此节点则相对`<body>`定位；`fixed`固定定位是相对浏览器窗口定位。

`节点参与定位布局后，自身及其文本一起脱流`。

####  显隐影响

在正常文档流排版过程中，经常会使用`display:none`和`visibility:hidden`控制节点的隐藏。

- 节点不可见但占据空间，显隐时可过渡：`visibility:hidden`
- 节点不可见但占据空间，不可点击：`visibility:hidden`
- 节点不可见不占据空间，可访问DOM：`display:none`
- 节点不可见但占据空间，可点击：`opacity:0`
- 节点不可见不占据空间，可点击：`position:absolute; opacity:0`
- 节点不可见但占据空间，不可点击：`position:relative; z-index:-1`
- 节点不可见不占据空间，不可点击：`position:absolute; z-index:-1`

## 层叠上下文

**层叠上下文**指盒模型在三维空间 Z 轴上所表现的行为。每个盒模型存在于一个三维空间中，分别是平面画布的`X轴Y轴`和表示层叠的 Z 轴。

当节点发生堆叠，最终表现就是`节点间互相覆盖`。若一个节点包含`层叠上下文`，那么该节点就拥有绝对的制高点。

position 和 z-index 的结合使用可生成层叠上下文。

- `z-index`只在声明定位的节点上起效
- 节点在 Z 轴的层叠顺序依据`z-index`、`层叠上下文`和`层叠等级`共同决定

### 层叠等级

**层叠等级**又名**层叠级别**，指节点在三维空间`Z轴`上的上下顺序。在同一`层叠上下文`中，它描述了层叠上下文节点在`Z轴`上的上下顺序；在普通节点中，它描述普通节点在`Z轴`上的上下顺序。

普通节点的`层叠等级`优先由其所在的层叠上下文决定，`层叠等级`的比较只有在当前层叠上下文中才有意义，脱离当前层叠上下文的比较就变得无意义了。

生成层叠上下文：

- `<html>`根结点
- 声明`position:relative/absolute`和`z-index`不为`auto`的节点
- 声明`position:fixed/sticky`的节点
- Flex布局下声明`z-index`不为`auto`的节点
- Grid布局下声明`z-index`不为`auto`的节点
- 声明`mask/mask-image/mask-border`不为`none`的节点
- 声明`filter`不为`none`的节点
- 声明`mix-blend-mode`不为`normal`的节点
- 声明`opacity`不为`1`的节点
- 声明`clip-path`不为`none`的节点
- 声明`will-change`不为`initial`的节点
- 声明`perspective`不为`none`的节点
- 声明`transform`不为`none`的节点
- 声明`isolation`为`isolate`的节点
- 声明`-webkit-overflow-scrolling`为`touch`的节点

### 层叠顺序

**层叠顺序**指节点发生层叠时按照特定的顺序规则在`Z轴`上垂直显示。

#### 脱流元素

在同一个层叠上下文中，节点会按照`z-index`的大小从上到下层叠，若`z-index`一致则后面的节点层叠等级要大于前面。脱流元素的层叠顺序就是看`z-index`的大小。

#### 标准流元素

层叠顺序从低到高的排列。

- 层叠上下文的`border`和`background`
- `z-index<0`的子节点
- 标准流内块级非定位的子节点
- 浮动非定位的子节点
- 标准流内行内非定位的子节点
- `z-index:auto/0`的子节点
- `z-index>0`的子节点