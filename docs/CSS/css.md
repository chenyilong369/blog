# css复习

## 一. 布局属性

**display常用属性**：（依赖于相对定位）

> * block: 元素显示在下一行，作为一个新段落
> * list-item: 元素显示在下一行，前面有列表元素标记
> * inline: 元素显示在当前段落内
> * none: 元素隐藏不显示

## 二. 格式化属性

**border常用属性**： 

> * border-width: 边框的宽度
> * border-color: 边框的颜色
> * border-style: 边框的样式（当在<a>标签时默认为单实线）
> * border-left | right | top | bottom: 边框的左右上下
> * border: 边框的所有边

**其他属性**：

> * text-align: 控制网页内容对齐
> * text-indent: 控制网页内容缩进
> * line-height: 设置文本行的高度
> * text-decoration: 可用于删除链接下面的下划线（设置为none）

## 三. 背景

**css背景属性：**

| Property                                                     | 描述                                         |
| :----------------------------------------------------------- | :------------------------------------------- |
| [background](https://www.runoob.com/cssref/css3-pr-background.html) | 简写属性，作用是将背景属性设置在一个声明中。 |
| [background-attachment](https://www.runoob.com/cssref/pr-background-attachment.html) | 背景图像是否固定或者随着页面的其余部分滚动。 |
| [background-color](https://www.runoob.com/cssref/pr-background-color.html) | 设置元素的背景颜色。                         |
| [background-image](https://www.runoob.com/cssref/pr-background-image.html) | 把图像设置为背景。                           |
| [background-position](https://www.runoob.com/cssref/pr-background-position.html) | 设置背景图像的起始位置。                     |
| [background-repeat](https://www.runoob.com/cssref/pr-background-repeat.html) | 设置背景图像是否及如何重复。                 |

## 四. 文本

**css文本属性**

| 属性                                                         | 描述                     |
| :----------------------------------------------------------- | :----------------------- |
| [color](https://www.runoob.com/cssref/pr-text-color.html)    | 设置文本颜色             |
| [direction](https://www.runoob.com/cssref/pr-text-direction.html) | 设置文本方向。           |
| [letter-spacing](https://www.runoob.com/cssref/pr-text-letter-spacing.html) | 设置字符间距             |
| [line-height](https://www.runoob.com/cssref/pr-dim-line-height.html) | 设置行高                 |
| [text-align](https://www.runoob.com/cssref/pr-text-text-align.html) | 对齐元素中的文本         |
| [text-decoration](https://www.runoob.com/cssref/pr-text-text-decoration.html) | 向文本添加修饰           |
| [text-indent](https://www.runoob.com/cssref/pr-text-text-indent.html) | 缩进元素中文本的首行     |
| [text-shadow](https://www.runoob.com/cssref/css3-pr-text-shadow.html) | 设置文本阴影             |
| [text-transform](https://www.runoob.com/cssref/pr-text-text-transform.html) | 控制元素中的字母         |
| [unicode-bidi](https://www.runoob.com/cssref/pr-text-unicode-bidi.html) | 设置或返回文本是否被重写 |
| [vertical-align](https://www.runoob.com/cssref/pr-pos-vertical-align.html) | 设置元素的垂直对齐       |
| [white-space](https://www.runoob.com/cssref/pr-text-white-space.html) | 设置元素中空白的处理方式 |
| [word-spacing](https://www.runoob.com/cssref/pr-text-word-spacing.html) | 设置字间距               |

## 五. 字体

**css字体属性**

| Property                                                     | 描述                                 |
| :----------------------------------------------------------- | :----------------------------------- |
| [font](https://www.runoob.com/cssref/pr-font-font.html)      | 在一个声明中设置所有的字体属性       |
| [font-family](https://www.runoob.com/cssref/pr-font-font-family.html) | 指定文本的字体系列                   |
| [font-size](https://www.runoob.com/cssref/pr-font-font-size.html) | 指定文本的字体大小                   |
| [font-style](https://www.runoob.com/cssref/pr-font-font-style.html) | 指定文本的字体样式                   |
| [font-variant](https://www.runoob.com/cssref/pr-font-font-variant.html) | 以小型大写字体或者正常字体显示文本。 |
| [font-weight](https://www.runoob.com/cssref/pr-font-weight.html) | 指定字体的粗细。                     |

## 六. 链接

**链接的样式**

> * a:link - 正常，未访问过的链接
> * a:visited - 用户已访问过的链接
> * a:hover - 当用户鼠标放在链接上时
> * a:active - 链接被点击的那一刻

## 七. 列表

**css列表属性**

| 属性                                                         | 描述                                               |
| :----------------------------------------------------------- | :------------------------------------------------- |
| [list-style](https://www.runoob.com/cssref/pr-list-style.html) | 简写属性。用于把所有用于列表的属性设置于一个声明中 |
| [list-style-image](https://www.runoob.com/cssref/pr-list-style-image.html) | 将图像设置为列表项标志。                           |
| [list-style-position](https://www.runoob.com/cssref/pr-list-style-position.html) | 设置列表中列表项标志的位置。                       |
| [list-style-type](https://www.runoob.com/cssref/pr-list-style-type.html) | 设置列表项标志的类型。                             |

## 八. 盒子模型

![CSS box-model](https://www.runoob.com/images/box-model.gif)

> - **Margin(外边距)** - 清除边框外的区域，外边距是透明的。
> - **Border(边框)** - 围绕在内边距和内容外的边框。
> - **Padding(内边距)** - 清除内容周围的区域，内边距是透明的。
> - **Content(内容)** - 盒子的内容，显示文本和图像。

## 九. 边框

**css边框属性**

| [border](https://www.runoob.com/cssref/pr-border.html)       | 简写属性，用于把针对四个边的属性设置在一个声明。             |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [border-style](https://www.runoob.com/cssref/pr-border-style.html) | 用于设置元素所有边框的样式，或者单独地为各边设置边框样式。   |
| [border-width](https://www.runoob.com/cssref/pr-border-width.html) | 简写属性，用于为元素的所有边框设置宽度，或者单独地为各边边框设置宽度。 |
| [border-color](https://www.runoob.com/cssref/pr-border-color.html) | 简写属性，设置元素的所有边框中可见部分的颜色，或为 4 个边分别设置颜色。 |
| [border-bottom](https://www.runoob.com/cssref/pr-border-bottom.html) | 简写属性，用于把下边框的所有属性设置到一个声明中。           |
| [border-bottom-color](https://www.runoob.com/cssref/pr-border-bottom-color.html) | 设置元素的下边框的颜色。                                     |
| [border-bottom-style](https://www.runoob.com/cssref/pr-border-bottom-style.html) | 设置元素的下边框的样式。                                     |
| [border-bottom-width](https://www.runoob.com/cssref/pr-border-bottom-width.html) | 设置元素的下边框的宽度。                                     |
| [border-left](https://www.runoob.com/cssref/pr-border-left.html) | 简写属性，用于把左边框的所有属性设置到一个声明中。           |
| [border-left-color](https://www.runoob.com/cssref/pr-border-left-color.html) | 设置元素的左边框的颜色。                                     |
| [border-left-style](https://www.runoob.com/cssref/pr-border-left-style.html) | 设置元素的左边框的样式。                                     |
| [border-left-width](https://www.runoob.com/cssref/pr-border-left-width.html) | 设置元素的左边框的宽度。                                     |
| [border-right](https://www.runoob.com/cssref/pr-border-right.html) | 简写属性，用于把右边框的所有属性设置到一个声明中。           |
| [border-right-color](https://www.runoob.com/cssref/pr-border-right-color.html) | 设置元素的右边框的颜色。                                     |
| [border-right-style](https://www.runoob.com/cssref/pr-border-right-style.html) | 设置元素的右边框的样式。                                     |
| [border-right-width](https://www.runoob.com/cssref/pr-border-right-width.html) | 设置元素的右边框的宽度。                                     |
| [border-top](https://www.runoob.com/cssref/pr-border-top.html) | 简写属性，用于把上边框的所有属性设置到一个声明中。           |
| [border-top-color](https://www.runoob.com/cssref/pr-border-top-color.html) | 设置元素的上边框的颜色。                                     |
| [border-top-style](https://www.runoob.com/cssref/pr-border-top-style.html) | 设置元素的上边框的样式。                                     |
| [border-top-width](https://www.runoob.com/cssref/pr-border-top-width.html) | 设置元素的上边框的宽度。                                     |

border-style:

| 值      | 描述                                                         |
| :------ | :----------------------------------------------------------- |
| none    | 定义无边框。                                                 |
| hidden  | 与 "none" 相同。不过应用于表时除外，对于表，hidden 用于解决边框冲突。 |
| dotted  | 定义点状边框。在大多数浏览器中呈现为实线。                   |
| dashed  | 定义虚线。在大多数浏览器中呈现为实线。                       |
| solid   | 定义实线。                                                   |
| double  | 定义双线。双线的宽度等于 border-width 的值。                 |
| groove  | 定义 3D 凹槽边框。其效果取决于 border-color 的值。           |
| ridge   | 定义 3D 垄状边框。其效果取决于 border-color 的值。           |
| inset   | 定义 3D inset 边框。其效果取决于 border-color 的值。         |
| outset  | 定义 3D outset 边框。其效果取决于 border-color 的值。        |
| inherit | 规定应该从父元素继承边框样式。                               |

## 十. 轮廓(outline)

![Outline](https://www.runoob.com/images/box_outline.gif)

| 属性                                                         | 说明                           | 值                                                           | CSS  |
| :----------------------------------------------------------- | :----------------------------- | :----------------------------------------------------------- | :--- |
| [outline](https://www.runoob.com/cssref/pr-outline.html)     | 在一个声明中设置所有的轮廓属性 | outline-color       outline-style                outline-width      inherit | 2    |
| [outline-color](https://www.runoob.com/cssref/pr-outline-color.html) | 设置轮廓的颜色                 | color-name  hex-number  rgb-number       invert  inherit     | 2    |
| [outline-style](https://www.runoob.com/cssref/pr-outline-style.html) | 设置轮廓的样式                 | none       dotted       dashed       solid       double       groove       ridge       inset       outset  inherit | 2    |
| [outline-width](https://www.runoob.com/cssref/pr-outline-width.html) | 设置轮廓的宽度                 | thin       medium       thick       length   inherit         | 2    |



## 十一. margin

![img](https://www.runoob.com/wp-content/uploads/2013/08/VlwVi.png)

| 属性                                                         | 描述                                       |
| :----------------------------------------------------------- | :----------------------------------------- |
| [margin](https://www.runoob.com/cssref/pr-margin.html)       | 简写属性。在一个声明中设置所有外边距属性。 |
| [margin-bottom](https://www.runoob.com/cssref/pr-margin-bottom.html) | 设置元素的下外边距。                       |
| [margin-left](https://www.runoob.com/cssref/pr-margin-left.html) | 设置元素的左外边距。                       |
| [margin-right](https://www.runoob.com/cssref/pr-margin-right.html) | 设置元素的右外边距。                       |
| [margin-top](https://www.runoob.com/cssref/pr-margin-top.html) | 设置元素的上外边距。                       |

**可能的值**

| 值       | 说明                                        |
| :------- | :------------------------------------------ |
| auto     | 设置浏览器边距。 这样做的结果会依赖于浏览器 |
| *length* | 定义一个固定的margin（使用像素，pt，em等）  |
| *%*      | 定义一个使用百分比的边距                    |

## 十二. padding

| 属性                                                         | 说明                                       |
| :----------------------------------------------------------- | :----------------------------------------- |
| [padding](https://www.runoob.com/cssref/pr-padding.html)     | 使用简写属性设置在一个声明中的所有填充属性 |
| [padding-bottom](https://www.runoob.com/cssref/pr-padding-bottom.html) | 设置元素的底部填充                         |
| [padding-left](https://www.runoob.com/cssref/pr-padding-left.html) | 设置元素的左部填充                         |
| [padding-right](https://www.runoob.com/cssref/pr-padding-right.html) | 设置元素的右部填充                         |
| [padding-top](https://www.runoob.com/cssref/pr-padding-top.html) | 设置元素的顶部填充                         |

**可能的值**

| 值       | 说明                                |
| :------- | :---------------------------------- |
| *length* | 定义一个固定的填充(像素, pt, em,等) |
| *%*      | 使用百分比值定义一个填充            |

## 十三. 尺寸

| 属性                                                         | 描述                 |
| :----------------------------------------------------------- | :------------------- |
| [height](https://www.runoob.com/cssref/pr-dim-height.html)   | 设置元素的高度。     |
| [line-height](https://www.runoob.com/cssref/pr-dim-line-height.html) | 设置行高。           |
| [max-height](https://www.runoob.com/cssref/pr-dim-max-height.html) | 设置元素的最大高度。 |
| [max-width](https://www.runoob.com/cssref/pr-dim-max-width.html) | 设置元素的最大宽度。 |
| [min-height](https://www.runoob.com/cssref/pr-dim-min-height.html) | 设置元素的最小高度。 |
| [min-width](https://www.runoob.com/cssref/pr-dim-min-width.html) | 设置元素的最小宽度。 |
| [width](https://www.runoob.com/cssref/pr-dim-width.html)     | 设置元素的宽度。     |

## 十四. 一些笔记

**块级元素(block)特性：**

- 总是独占一行，表现为另起一行开始，而且其后的元素也必须另起一行显示;
- 宽度(width)、高度(height)、内边距(padding)和外边距(margin)都可控制;

**内联元素(inline)特性：**

- 和相邻的内联元素在同一行;
- 宽度(width)、高度(height)、内边距的top/bottom(padding-top/padding-bottom)和外边距的top/bottom(margin-top/margin-bottom)都不可改变，就是里面文字或图片的大小;

**块级元素主要有：**

-  address , blockquote , center , dir , div , dl , fieldset , form , h1 , h2 , h3 , h4 , h5 , h6 , hr , isindex , menu , noframes , noscript , ol , p , pre , table , ul , li

**内联元素主要有：**

- a , abbr , acronym , b , bdo , big , br , cite , code , dfn , em , font , i , img , input , kbd , label , q , s , samp , select , small , span , strike , strong , sub , sup ,textarea , tt , u , var

**可变元素(根据上下文关系确定该元素是块元素还是内联元素)：**

- applet ,button ,del ,iframe , ins ,map ,object , script

**CSS中块级、内联元素的应用：**

利用CSS我们可以摆脱上面表格里HTML标签归类的限制，自由地在不同标签/元素上应用我们需要的属性。

主要用的CSS样式有以下三个：

- display:block -- 显示为块级元素
- display:inline -- 显示为内联元素
- display:inline-block -- 显示为内联块元素，表现为同行显示并可修改宽高内外边距等属性

**我们常将<ul>元素加上display:inline-block样式，原本垂直的列表就可以水平显示了**

## 十五. 定位(position)

**position 属性的五个值：**

| absolute | 生成绝对定位的元素，相对于 static 定位以外的第一个父元素进行定位。元素的位置通过 "left", "top", "right" 以及 "bottom" 属性进行规定。 |
| -------- | ------------------------------------------------------------ |
| fixed    | 生成绝对定位的元素，相对于浏览器窗口进行定位。元素的位置通过 "left", "top", "right" 以及 "bottom" 属性进行规定。 |
| relative | 生成相对定位的元素，相对于其正常位置进行定位。因此，"left:20" 会向元素的 LEFT 位置添加 20 像素。 |
| static   | 默认值。没有定位，元素出现在正常的流中（忽略 top, bottom, left, right 或者 z-index 声明）。 |
| inherit  | 规定应该从父元素继承 position 属性的值。                     |

> * [static](https://www.runoob.com/css/css-positioning.html#position-static)(HTML 元素的默认值，即没有定位，遵循正常的文档流对象。)
>
> * [relative](https://www.runoob.com/css/css-positioning.html#position-relative)(相对定位元素的定位是相对其正常位置。移动相对定位元素，但它原本所占的空间不会改变。相对定位元素经常被用来作为绝对定位元素的容器块。)
>
> * [fixed](https://www.runoob.com/css/css-positioning.html#position-fixed)(元素的位置相对于浏览器窗口是固定位置。即使窗口是滚动的它也不会移动.
>
>   Fixed定位使元素的位置与文档流无关，因此不占据空间。
>
>   Fixed定位的元素和其他元素重叠。)
>
> * absolute 生成绝对定位的元素，相对于 static 定位以外的第一个父元素进行定位。
>
>   元素的位置通过 "left", "top", "right" 以及 "bottom" 属性进行规定。
>
> * [sticky](https://www.runoob.com/css/css-positioning.html#position-sticky)(sticky 英文字面意思是粘，粘贴，所以可以把它称之为粘性定位。
>
>    **position: sticky;** 基于用户的滚动位置来定位。
>
>   粘性定位的元素是依赖于用户的滚动，在 **position:relative** 与 **position:fixed** 定位之间切换。
>
>   它的行为就像 **position:relative;** 而当页面滚动超出目标区域时，它的表现就像 **position:fixed;**，它会固定在目标位置。
>
>   元素定位表现为在跨越特定阈值前为相对定位，之后为固定定位。
>
>   这个特定阈值指的是 top, right, bottom 或 left 之一，换言之，指定 top, right, bottom 或 left 四个阈值其中之一，才可使粘性定位生效。否则其行为与相对定位相同。)

**CSS定位属性**

| 属性                                                         | 说明                                                         | 值                                                           | CSS  |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- | :--- |
| [bottom](https://www.runoob.com/cssref/pr-pos-bottom.html)   | 定义了定位元素下外边距边界与其包含块下边界之间的偏移。       | auto       *length  %* inherit                               | 2    |
| [clip](https://www.runoob.com/cssref/pr-pos-clip.html)       | 剪辑一个绝对定位的元素                                       | *shape*      auto  inherit                                   | 2    |
| [cursor](https://www.runoob.com/cssref/pr-class-cursor.html) | 显示光标移动到指定的类型                                     | *url*       auto       crosshair       default       pointer       move       e-resize       ne-resize       nw-resize       n-resize       se-resize       sw-resize       s-resize       w-resize       text       wait       help | 2    |
| [left](https://www.runoob.com/cssref/pr-pos-left.html)       | 定义了定位元素左外边距边界与其包含块左边界之间的偏移。       | auto       *length  %* inherit                               | 2    |
| [overflow](https://www.runoob.com/cssref/pr-pos-overflow.html) | 设置当元素的内容溢出其区域时发生的事情。                     | auto       hidden       scroll  visible       inherit        | 2    |
| [overflow-y](https://www.runoob.com/css/cssref/css3-pr-overflow-y.html) | 指定如何处理顶部/底部边缘的内容溢出元素的内容区域            | auto       hidden       scroll  visible       no-display       no-content | 2    |
| [overflow-x](https://www.runoob.com/css/cssref//cssref/css3-pr-overflow-x.html) | 指定如何处理右边/左边边缘的内容溢出元素的内容区域            | auto       hidden       scroll  visible       no-display       no-content | 2    |
| [position](https://www.runoob.com/cssref/pr-class-position.html) | 指定元素的定位类型                                           | absolute       fixed       relative       static       inherit | 2    |
| [right](https://www.runoob.com/cssref/pr-pos-right.html)     | 定义了定位元素右外边距边界与其包含块右边界之间的偏移。       | auto       *length  %* inherit                               | 2    |
| [top](https://www.runoob.com/cssref/pr-pos-top.html)         | 定义了一个定位元素的上外边距边界与其包含块上边界之间的偏移。 | auto       *length  %* inherit                               | 2    |
| [z-index](https://www.runoob.com/cssref/pr-pos-z-index.html) | 设置元素的堆叠顺序                                           | *number* auto  inherit                                       | 2    |

## 十六. 布局（Overflow）

**CSS overflow  属性用于控制内容溢出元素框时显示的方式。**

**overflow属性有以下值：**

| 值      | 描述                                                     |
| :------ | :------------------------------------------------------- |
| visible | 默认值。内容不会被修剪，会呈现在元素框之外。             |
| hidden  | 内容会被修剪，并且其余内容是不可见的。                   |
| scroll  | 内容会被修剪，但是浏览器会显示滚动条以便查看其余的内容。 |
| auto    | 如果内容被修剪，则浏览器会显示滚动条以便查看其余的内容。 |
| inherit | 规定应该从父元素继承 overflow 属性的值。                 |

## 十七. 浮动（Float）

> * 元素的水平方向浮动，意味着元素只能左右移动而不能上下移动。
> * 一个浮动元素会尽量向左或向右移动，直到它的外边缘碰到包含框或另一个浮动框的边框为止。
> * 浮动元素之后的元素将围绕它。
> * 浮动元素之前的元素将不会受到影响。
> * 如果图像是右浮动，下面的文本流将环绕在它左边：

| 属性                                                       | 描述                               | 值                               | CSS  |
| :--------------------------------------------------------- | :--------------------------------- | :------------------------------- | :--- |
| [clear](https://www.runoob.com/cssref/pr-class-clear.html) | 指定不允许元素周围有浮动元素。     | left  right  both  none  inherit | 1    |
| [float](https://www.runoob.com/cssref/pr-class-float.html) | 指定一个盒子（元素）是否可以浮动。 | left  right  none  inherit       | 1    |

## 十八. 居中

1.**元素居中对齐**

使用**margin: auto**

> 如果没有设置  **width** 属性(或者设置 100%)，居中对齐将不起作用。

2.**文本居中对齐**

使用 **text-align: center;**

3.**图片居中对齐**

要让图片居中对齐, 可以使用 **margin: auto;** 并将它放到 **块** 元素中:

4.**左右对齐 - 使用定位方式**

可以使用 **position: absolute;** 属性来对齐元素:(绝对定位元素会被从正常流中删除，并且能够交叠元素。)

5.**左右对齐 - 使用 float 方式**

6.**垂直居中对齐 - 使用 padding**

7.**垂直居中 - 使用 line-height**

``` css
.center {
    line-height: 200px;
    height: 200px;
    border: 3px solid green;
    text-align: center;
}

/* 如果文本有多行，添加以下代码: */
.center p {
    line-height: 1.5;
    display: inline-block;
    vertical-align: middle;
}
```

8.**垂直居中 - 使用 position 和 transform**

```css
.center { 
    height: 200px;
    position: relative;
    border: 3px solid green; 
}
 
.center p {
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
```

## 十九. 伪类

CSS伪类是用来添加一些选择器的特殊效果。

**所有CSS伪类/元素**

| 选择器                                                       | 示例                  | 示例说明                                        |
| :----------------------------------------------------------- | :-------------------- | :---------------------------------------------- |
| [:checked](https://www.runoob.com/cssref/sel-checked.html)   | input:checked         | 选择所有选中的表单元素                          |
| [:disabled](https://www.runoob.com/css/cssref/sel-disabled.html) | input:disabled        | 选择所有禁用的表单元素                          |
| [:empty](https://www.runoob.com/cssref/sel-empty.html)       | p:empty               | 选择所有没有子元素的p元素                       |
| [:enabled](https://www.runoob.com/cssref/sel-enable.html)    | input:enabled         | 选择所有启用的表单元素                          |
| [:first-of-type](https://www.runoob.com/cssref/sel-first-of-type.html) | p:first-of-type       | 选择的每个 p 元素是其父元素的第一个 p 元素      |
| [:in-range](https://www.runoob.com/cssref/sel-in-range.html) | input:in-range        | 选择元素指定范围内的值                          |
| [:invalid](https://www.runoob.com/cssref/sel-invalid.html)   | input:invalid         | 选择所有无效的元素                              |
| [:last-child](https://www.runoob.com/cssref/sel-last-child.html) | p:last-child          | 选择所有p元素的最后一个子元素                   |
| [:last-of-type](https://www.runoob.com/cssref/sel-last-of-type.html) | p:last-of-type        | 选择每个p元素是其母元素的最后一个p元素          |
| [:not(selector)](https://www.runoob.com/cssref/sel-not.html) | :not(p)               | 选择所有p以外的元素                             |
| [:nth-child(n)](https://www.runoob.com/cssref/sel-nth-child.html) | p:nth-child(2)        | 选择所有 p 元素的父元素的第二个子元素           |
| [:nth-last-child(n)](https://www.runoob.com/cssref/sel-nth-last-child.html) | p:nth-last-child(2)   | 选择所有p元素倒数的第二个子元素                 |
| [:nth-last-of-type(n)](https://www.runoob.com/cssref/sel-nth-last-of-type.html) | p:nth-last-of-type(2) | 选择所有p元素倒数的第二个为p的子元素            |
| [:nth-of-type(n)](https://www.runoob.com/cssref/sel-nth-of-type.html) | p:nth-of-type(2)      | 选择所有p元素第二个为p的子元素                  |
| [:only-of-type](https://www.runoob.com/cssref/sel-only-of-type.html) | p:only-of-type        | 选择所有仅有一个子元素为p的元素                 |
| [:only-child](https://www.runoob.com/cssref/sel-only-child.html) | p:only-child          | 选择所有仅有一个子元素的p元素                   |
| [:optional](https://www.runoob.com/cssref/sel-optional.html) | input:optional        | 选择没有"required"的元素属性                    |
| [:out-of-range](https://www.runoob.com/cssref/sel-out-of-range.html) | input:out-of-range    | 选择指定范围以外的值的元素属性                  |
| [:read-only](https://www.runoob.com/cssref/sel-read-only.html) | input:read-only       | 选择只读属性的元素属性                          |
| [:read-write](https://www.runoob.com/cssref/sel-read-write.html) | input:read-write      | 选择没有只读属性的元素属性                      |
| [:required](https://www.runoob.com/cssref/sel-required.html) | input:required        | 选择有"required"属性指定的元素属性              |
| [:root](https://www.runoob.com/cssref/sel-root.html)         | root                  | 选择文档的根元素                                |
| [:target](https://www.runoob.com/cssref/sel-target.html)     | #news:target          | 选择当前活动#news元素(点击URL包含锚的名字)      |
| [:valid](https://www.runoob.com/cssref/sel-valid.html)       | input:valid           | 选择所有有效值的属性                            |
| [:link](https://www.runoob.com/cssref/sel-link.html)         | a:link                | 选择所有未访问链接                              |
| [:visited](https://www.runoob.com/cssref/sel-visited.html)   | a:visited             | 选择所有访问过的链接                            |
| [:active](https://www.runoob.com/cssref/sel-active.html)     | a:active              | 选择正在活动链接                                |
| [:hover](https://www.runoob.com/cssref/sel-hover.html)       | a:hover               | 把鼠标放在链接上的状态                          |
| [:focus](https://www.runoob.com/cssref/sel-focus.html)       | input:focus           | 选择元素输入后具有焦点                          |
| [:first-letter](https://www.runoob.com/cssref/sel-firstletter.html) | p:first-letter        | 选择每个<p> 元素的第一个字母                    |
| [:first-line](https://www.runoob.com/cssref/sel-firstline.html) | p:first-line          | 选择每个<p> 元素的第一行                        |
| [:first-child](https://www.runoob.com/cssref/sel-firstchild.html) | p:first-child         | 选择器匹配属于任意元素的第一个子元素的 <p> 元素 |
| [:before](https://www.runoob.com/cssref/sel-before.html)     | p:before              | 在每个<p>元素之前插入内容                       |
| [:after](https://www.runoob.com/cssref/sel-after.html)       | p:after               | 在每个<p>元素之后插入内容                       |
| [:lang(*language*)](https://www.runoob.com/cssref/sel-lang.html) | p:lang(it)            | 为<p>元素的lang属性选择一个开始值               |

## 二十. 组合选择符

**在 CSS3 中包含了四种组合方式:**

> * 后代选择器(以空格分隔)(后代选择器用于选取某元素的后代元素。)
> * 子元素选择器(以大于号分隔）(与后代选择器相比，子元素选择器（Child selectors）只能选择作为某元素子元素的元素。)
> * 相邻兄弟选择器（以加号分隔）(相邻兄弟选择器（Adjacent sibling selector）可选择紧接在另一元素后的元素，且二者有相同父元素。)
> * 普通兄弟选择器（以破折号分隔）(后续兄弟选择器选取所有指定元素之后的相邻兄弟元素。)

## 二十一. 伪元素

**CSS伪元素是用来添加一些选择器的特殊效果。**

**所有CSS伪类/元素**

| 选择器                                                       | 示例           | 示例说明                                        |
| :----------------------------------------------------------- | :------------- | :---------------------------------------------- |
| [:link](https://www.runoob.com/cssref/sel-link.html)         | a:link         | 选择所有未访问链接                              |
| [:visited](https://www.runoob.com/cssref/sel-visited.html)   | a:visited      | 选择所有访问过的链接                            |
| [:active](https://www.runoob.com/cssref/sel-active.html)     | a:active       | 选择正在活动链接                                |
| [:hover](https://www.runoob.com/cssref/sel-hover.html)       | a:hover        | 把鼠标放在链接上的状态                          |
| [:focus](https://www.runoob.com/cssref/sel-focus.html)       | input:focus    | 选择元素输入后具有焦点                          |
| [:first-letter](https://www.runoob.com/cssref/sel-firstletter.html) | p:first-letter | 选择每个<p> 元素的第一个字母                    |
| [:first-line](https://www.runoob.com/cssref/sel-firstline.html) | p:first-line   | 选择每个<p> 元素的第一行                        |
| [:first-child](https://www.runoob.com/cssref/sel-firstchild.html) | p:first-child  | 选择器匹配属于任意元素的第一个子元素的 <p> 元素 |
| [:before](https://www.runoob.com/cssref/sel-before.html)     | p:before       | 在每个<p>元素之前插入内容                       |
| [:after](https://www.runoob.com/cssref/sel-after.html)       | p:after        | 在每个<p>元素之后插入内容                       |
| [:lang(*language*)](https://www.runoob.com/cssref/sel-lang.html) | p:lang(it)     | 为<p>元素的lang属性选择一个开始值               |

## 二十二. 导航栏

**全屏高度的固定导航条**

```css
ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    width: 25%;
    background-color: #f1f1f1;
    height: 100%; /* 全屏高度 */
    position: fixed; 
    overflow: auto; /* 如果导航栏选项多，允许滚动 */
}
```

**水平导航条实例**

```css
ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: #333;
}
 
li {
    float: left;
}
 
li a {
    display: block;
    color: white;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
}
 
/*鼠标移动到选项上修改背景颜色 */
li a:hover {
    background-color: #111;
}
```

## 二十三. 下拉菜单

**基本下拉菜单**

```html
<style>
.dropdown {
    position: relative;
    display: inline-block;
}

.dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    padding: 12px 16px;
    z-index: 1;
}

.dropdown:hover .dropdown-content {
    display: block;
}
</style>

<div class="dropdown">
  <span>Mouse over me</span>
  <div class="dropdown-content">
    <p>Hello World!</p>
  </div>
</div>
```

**下拉菜单**

```html
<style>
/* 下拉按钮样式 */
.dropbtn {
    background-color: #4CAF50;
    color: white;
    padding: 16px;
    font-size: 16px;
    border: none;
    cursor: pointer;
}

/* 容器 <div> - 需要定位下拉内容 */
.dropdown {
    position: relative;
    display: inline-block;
}

/* 下拉内容 (默认隐藏) */
.dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
}

/* 下拉菜单的链接 */
.dropdown-content a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
}

/* 鼠标移上去后修改下拉菜单链接颜色 */
.dropdown-content a:hover {background-color: #f1f1f1}

/* 在鼠标移上去后显示下拉菜单 */
.dropdown:hover .dropdown-content {
    display: block;
}

/* 当下拉内容显示后修改下拉按钮的背景颜色 */
.dropdown:hover .dropbtn {
    background-color: #3e8e41;
}
</style>

<div class="dropdown">
  <button class="dropbtn">下拉菜单</button>
  <div class="dropdown-content">
    <a href="#">菜鸟 1</a>
    <a href="#">菜鸟 2</a>
    <a href="#">菜鸟 3</a>
  </div>
</div>
```

## 二十四. CSS 提示工具(Tooltip)

**基础提示框(Tooltip)**

```html

<style>
/* Tooltip 容器 */
.tooltip {
    position: relative;
    display: inline-block;
    border-bottom: 1px dotted black; /* 悬停元素上显示点线 */
}
 
/* Tooltip 文本 */
.tooltip .tooltiptext {
    visibility: hidden;
    width: 120px;
    background-color: black;
    color: #fff;
    text-align: center;
    padding: 5px 0;
    border-radius: 6px;
 
    /* 定位 */
    position: absolute;
    z-index: 1;
}
 
/* 鼠标移动上去后显示提示框 */
.tooltip:hover .tooltiptext {
    visibility: visible;
}
</style>
 
<div class="tooltip">鼠标移动到这
  <span class="tooltiptext">提示文本</span>
</div>

```

**添加箭头**

```css

.tooltip .tooltiptext::after {
    content: " ";
    position: absolute;
    top: 100%; /* 提示工具底部 */
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: black transparent transparent transparent;
}

```

## 二十五. CSS 图像

1. CSS3中属性的透明度是 **opacity**。

## 二十六. 媒体类型

| 媒体类型   | 描述                                                   |
| ---------- | ------------------------------------------------------ |
| all        | 用于所有的媒体设备。                                   |
| aural      | 用于语音和音频合成器。                                 |
| braille    | 用于盲人用点字法触觉回馈设备。                         |
| embossed   | 用于分页的盲人用点字法打印机。                         |
| handheld   | 用于小的手持的设备。                                   |
| print      | 用于打印机。                                           |
| projection | 用于方案展示，比如幻灯片。                             |
| screen     | 用于电脑显示器。                                       |
| tty        | 用于使用固定密度字母栅格的媒体，比如电传打字机和终端。 |
| tv         | 用于电视机类型的设备。                                 |

**@media 规则**

@media 规则允许在相同样式表为不同媒体设置不同的样式。

```css

@media screen
{
    p.test {font-family:verdana,sans-serif;font-size:14px;}
}
@media print
{
    p.test {font-family:times,serif;font-size:10px;}
}
@media screen,print
{
    p.test {font-weight:bold;}
}

```

## 二十七. 表单

```css

* {
  box-sizing: border-box;
}
 
input[type=text], select, textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
}
 
label {
  padding: 12px 12px 12px 0;
  display: inline-block;
}
 
input[type=submit] {
  background-color: #4CAF50;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  float: right;
}
 
input[type=submit]:hover {
  background-color: #45a049;
}
 
.container {
  border-radius: 5px;
  background-color: #f2f2f2;
  padding: 20px;
}
 
.col-25 {
  float: left;
  width: 25%;
  margin-top: 6px;
}
 
.col-75 {
  float: left;
  width: 75%;
  margin-top: 6px;
}
 
/* 清除浮动 */
.row:after {
  content: "";
  display: table;
  clear: both;
}
 
/* 响应式布局 layout - 在屏幕宽度小于 600px 时， 设置为上下堆叠元素 */
@media screen and (max-width: 600px) {
  .col-25, .col-75, input[type=submit] {
    width: 100%;
    margin-top: 0;
  }
}

```

## 二十八. 计数器

| 属性                                                         | 描述                                                |
| ------------------------------------------------------------ | --------------------------------------------------- |
| [content](https://www.runoob.com/cssref/pr-gen-content.html) | 使用 ::before 和 ::after 伪元素来插入自动生成的内容 |
| [counter-increment](https://www.runoob.com/cssref/pr-gen-counter-increment.html) | 递增一个或多个值                                    |
| [counter-reset](https://www.runoob.com/cssref/pr-gen-counter-reset.html) | 创建或重置一个或多个计数器                          |

`counter()` 或 `counters()` 函数 - 将计数器的值添加到元素

## 二十九. 网页布局

```css

* {
  box-sizing: border-box;
}
 
body {
  font-family: Arial;
  padding: 10px;
  background: #f1f1f1;
}
 
/* 头部标题 */
.header {
  padding: 30px;
  text-align: center;
  background: white;
}
 
.header h1 {
  font-size: 50px;
}
 
/* 导航条 */
.topnav {
  overflow: hidden;
  background-color: #333;
}
 
/* 导航条链接 */
.topnav a {
  float: left;
  display: block;
  color: #f2f2f2;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}
 
/* 链接颜色修改 */
.topnav a:hover {
  background-color: #ddd;
  color: black;
}
 
/* 创建两列 */
/* Left column */
.leftcolumn {   
  float: left;
  width: 75%;
}
 
/* 右侧栏 */
.rightcolumn {
  float: left;
  width: 25%;
  background-color: #f1f1f1;
  padding-left: 20px;
}
 
/* 图像部分 */
.fakeimg {
  background-color: #aaa;
  width: 100%;
  padding: 20px;
}
 
/* 文章卡片效果 */
.card {
  background-color: white;
  padding: 20px;
  margin-top: 20px;
}
 
/* 列后面清除浮动 */
.row:after {
  content: "";
  display: table;
  clear: both;
}
 
/* 底部 */
.footer {
  padding: 20px;
  text-align: center;
  background: #ddd;
  margin-top: 20px;
}
 
/* 响应式布局 - 屏幕尺寸小于 800px 时，两列布局改为上下布局 */
@media screen and (max-width: 800px) {
  .leftcolumn, .rightcolumn {   
    width: 100%;
    padding: 0;
  }
}
 
/* 响应式布局 -屏幕尺寸小于 400px 时，导航等布局改为上下布局 */
@media screen and (max-width: 400px) {
  .topnav a {
    float: none;
    width: 100%;
  }
}

```

## 三十. css中的继承

1. 当你为某个元素应用 CSS 属性时，这些属性不仅会影响该元素，还会影响其下的分支元素。也就是说，这些下层的元素继承了其祖先元素的属性。

2. 哪些属性会被继承

   以下是会被继承的 CSS 属性，我们按照类型对其进行了分组。

   - 文本
  - color（颜色，a 元素除外）
     - direction（方向）
     - font（字体）
     - font-family（字体系列）
     - font-size（字体大小）
     - font-style（用于设置斜体）
     - font-variant（用于设置小型大写字母）
     - font-weight（用于设置粗体）
     - letter-spacing（字母间距）
     - line-height（行高）
     - text-align（用于设置对齐方式）
     - text-indent（用于设置首行缩进）
     - text-transform（用于修改大小写）
     - visibility（可见性）
     - white-space（用于指定如何处理空格）
     - word-spacing（字间距）
   
   - 列表
  - list-style（列表样式）
     - list-style-image（用于为列表指定定制的标记）
     - list-style-position（用于确定列表标记的位置）
     - list-style-type（用于设置列表的标记）
   
   - 表格
  - border-collapse（用于控制表格相邻单元格的边框是否合并为单一边框）
     - border-spacing（用于指定表格边框之间的空隙大小）
     - caption-side（用于设置表格标题的位置）
     - empty-cells（用于设置是否显示表格中的空单元格）
   
   - 页面设置（对于印刷物）
  - orphans（用于设置当元素内部发生分页时在页面底部需要保留的最少行数）
     - page-break-inside（用于设置元素内部的分页方式）
     - widows（用于设置当元素内部发生分页时在页面顶部需要保留的最少行数）
   
   - 其他
  - cursor（鼠标指针）
     - quotes（用于指定引号样式）
   
3. 可以声明一条特殊的规则覆盖整个系统中的规则，这条规则的重要程度要比其他所有规则高。也可以在某条声明的末尾加上 <mark>!important</mark>，

4. 对于任何属性，如果希望显式地指出该属性的值与对应元素的父元素对该属性设定的值相同，就可以使用 inherit 值。

## 三十一. css sprite

CSSSprites在国内很多人叫css精灵，是一种[网页](https://baike.baidu.com/item/网页/99347)图片应用处理方式。它允许你将一个[页面](https://baike.baidu.com/item/页面/5544813)涉及到的所有零星图片都包含到一张大图中去，这样一来，当访问该页面时，载入的图片就不会像以前那样一幅一幅地慢慢显示出来了。对于当前网络流行的速度而言，不高于200[KB](https://baike.baidu.com/item/KB/331)的单张图片的所需载入时间基本是差不多的，所以无需顾忌这个问题。

### 简介

加速的关键，不是降低质量，而是减少个数。传统切图讲究精细，图片规格越小越好，重量越小越好，其实规格大小无所谓，计算机统一都按[byte](https://baike.baidu.com/item/byte)计算。客户端每显示一张图片都会向服务器发送请求。所以，图片越多请求次数越多，造成延迟的可能性也就越大。

### 原理

CSS Sprites其实就是把网页中一些背景图片整合到一张图片文件中，再利用CSS的“background-image”，“background- repeat”，“background-position”的组合进行背景定位，background-position可以用数字精确的定位出背景图片的位置。

### 优点

1. 利用CSS Sprites能很好地减少网页的http请求，从而大大的提高页面的性能，这也是CSS Sprites最大的优点，也是其被广泛传播和应用的主要原因；

2. CSS Sprites能减少图片的字节，曾经比较过多次3张图片合并成1张图片的字节总是小于这3张图片的字节总和。

3. 解决了网页设计师在图片命名上的困扰，只需对一张集合的图片上命名就可以了，不需要对每一个小元素进行命名，从而提高了网页的制作效率。

4. 更换风格方便，只需要在一张或少张图片上修改图片的颜色或样式，整个网页的风格就可以改变。维护起来更加方便。

### 缺点

诚然CSS Sprites是如此的强大，但是也存在一些不可忽视的缺点，如下：

1. 在图片合并的时候，你要把多张图片有序的合理的合并成一张图片，还要留好足够的空间，防止板块内出现不必要的背景；这些还好，最痛苦的是在宽屏，高分辨率的屏幕下的自适应页面，你的图片如果不够宽，很容易出现背景断裂；

2. CSS Sprites在开发的时候比较麻烦，你要通过[photoshop](https://baike.baidu.com/item/photoshop)或其他工具测量计算每一个背景单元的精确位置，这是针线活，没什么难度，但是很繁琐；

3. CSS Sprites在维护的时候比较麻烦，如果[页面背景](https://baike.baidu.com/item/页面背景)有少许改动，一般就要改这张合并的图片，无需改的地方最好不要动，这样避免改动更多的css，如果在原来的地方放不下，又只能（最好）往下加图片，这样图片的字节就增加了，还要改动css。

4. CSS Sprites非常值得学习和应用，特别是页面有一堆icon（图标）。总之很多时候大家要权衡一下利弊，再决定是不是应用CSS Sprites。