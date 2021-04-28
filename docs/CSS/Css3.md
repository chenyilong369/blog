# Css3

## 1.边框

| 属性                                                         | 说明                                           | CSS  |
| ------------------------------------------------------------ | ---------------------------------------------- | ---- |
| [border-image](https://www.runoob.com/cssref/css3-pr-border-image.html) | 设置所有边框图像的速记属性。                   | 3    |
| [border-radius](https://www.runoob.com/cssref/css3-pr-border-radius.html) | 一个用于设置所有四个边框- *-半径属性的速记属性 | 3    |
| [box-shadow](https://www.runoob.com/cssref/css3-pr-box-shadow.html) | 附加一个或多个下拉框的阴影                     | 3    |

## 2. 圆角

**CSS3 圆角属性**

| 属性                                                         | 描述                                      |
| ------------------------------------------------------------ | ----------------------------------------- |
| [border-radius](https://www.runoob.com/cssref/css3-pr-border-radius.html) | 所有四个边角 border-*-*-radius 属性的缩写 |
| [border-top-left-radius](https://www.runoob.com/cssref/css3-pr-border-top-left-radius.html) | 定义了左上角的弧度                        |
| [border-top-right-radius](https://www.runoob.com/cssref/css3-pr-border-top-right-radius.html) | 定义了右上角的弧度                        |
| [border-bottom-right-radius](https://www.runoob.com/cssref/css3-pr-border-bottom-right-radius.html) | 定义了右下角的弧度                        |
| [border-bottom-left-radius](https://www.runoob.com/cssref/css3-pr-border-bottom-left-radius.html) | 定义了左下角的弧度                        |

## 3. 背景

| 顺序                                                         | 描述                     | CSS  |
| ------------------------------------------------------------ | ------------------------ | ---- |
| [background-clip](https://www.runoob.com/cssref/css3-pr-background-clip.html) | 规定背景的绘制区域。     | 3    |
| [background-origin](https://www.runoob.com/cssref/css3-pr-background-origin.html) | 规定背景图片的定位区域。 | 3    |
| [background-size](https://www.runoob.com/cssref/css3-pr-background-size.html) | 规定背景图片的尺寸。     | 3    |

CSS3 允许你在元素上添加多个背景图像。

## 4. 渐变

1. **线性渐变 - 从上到下（默认情况下）**

   ```css
   
   #grad {
       background-image: linear-gradient(#e66465, #9198e5);
   }
   
   ```

2. **线性渐变 - 从左到右**

   ```css
   
   #grad {
     height: 200px;
     background-image: linear-gradient(to right, red , yellow);
   }
   
   ```

3. **线性渐变 - 对角**

   ```css
   
   #grad {
     height: 200px;
     background-image: linear-gradient(to bottom right, red, yellow);
   }
   
   ```

4. **使用角度**

   ```css
   background-image: linear-gradient(angle, color-stop1, color-stop2);
   ```

5. **使用多个颜色结点**

6. **使用透明度（transparent）**

7. **重复的线性渐变**

   repeating-linear-gradient() 函数用于重复线性渐变：

8. **径向渐变**

   ```css
   background-image: radial-gradient(shape size at position, start-color, ..., last-color);
   ```

9. **设置形状**

   shape 参数定义了形状。它可以是值 circle 或 ellipse。其中，circle 表示圆形，ellipse 表示椭圆形。默认值是 ellipse。

10. repeating-radial-gradient() 函数用于重复径向渐变

## 5. 文本效果

| 属性                                                         | 描述                                                     | CSS  |
| ------------------------------------------------------------ | -------------------------------------------------------- | ---- |
| [hanging-punctuation](https://www.runoob.com/cssref/css3-pr-hanging-punctuation.html) | 规定标点字符是否位于线框之外。                           | 3    |
| [punctuation-trim](https://www.runoob.com/cssref/css3-pr-punctuation-trim.html) | 规定是否对标点字符进行修剪。                             | 3    |
| [text-align-last](https://www.runoob.com/cssref/css3-pr-text-align-last.html) | 设置如何对齐最后一行或紧挨着强制换行符之前的行。         | 3    |
| [text-emphasis](https://www.runoob.com/css3/css3-pr-text-emphasis.html) | 向元素的文本应用重点标记以及重点标记的前景色。           | 3    |
| [text-justify](https://www.runoob.com/cssref/css3-pr-text-justify.html) | 规定当  text-align 设置为 "justify" 时所使用的对齐方法。 | 3    |
| [text-outline](https://www.runoob.com/cssref/css3-pr-text-outline.html) | 规定文本的轮廓。                                         | 3    |
| [text-overflow](https://www.runoob.com/cssref/css3-pr-text-overflow.html) | 规定当文本溢出包含元素时发生的事情。                     | 3    |
| [text-shadow](https://www.runoob.com/cssref/css3-pr-text-shadow.html) | 向文本添加阴影。                                         | 3    |
| [text-wrap](https://www.runoob.com/cssref/css3-pr-text-wrap.html) | 规定文本的换行规则。                                     | 3    |
| [word-break](https://www.runoob.com/cssref/css3-pr-word-break.html) | 规定非中日韩文本的换行规则。                             | 3    |
| [word-wrap](https://www.runoob.com/cssref/css3-pr-word-wrap.html) | 允许对长的不可分割的单词进行分割并换行到下一行。         | 3    |

## 6. 字体

| 描述符        | 值                                                           | 描述                                                         |
| ------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| font-family   | *name*                                                       | 必需。规定字体的名称。                                       |
| src           | *URL*                                                        | 必需。定义字体文件的 URL。                                   |
| font-stretch  | normal condensed ultra-condensed extra-condensed semi-condensed expanded semi-expanded extra-expanded ultra-expanded | 可选。定义如何拉伸字体。默认是 "normal"。                    |
| font-style    | normal italic oblique                                        | 可选。定义字体的样式。默认是 "normal"。                      |
| font-weight   | normal bold 100 200 300 400 500 600 700 800 900              | 可选。定义字体的粗细。默认是 "normal"。                      |
| unicode-range | *unicode-range*                                              | 可选。定义字体支持的 UNICODE 字符范围。默认是 "U+0-10FFFF"。 |



## 7. 2D 转换

| 函数                            | 描述                                     |
| ------------------------------- | ---------------------------------------- |
| matrix(*n*,*n*,*n*,*n*,*n*,*n*) | 定义 2D 转换，使用六个值的矩阵。         |
| translate(*x*,*y*)              | 定义 2D 转换，沿着 X 和 Y 轴移动元素。   |
| translateX(*n*)                 | 定义 2D 转换，沿着 X 轴移动元素。        |
| translateY(*n*)                 | 定义 2D 转换，沿着 Y 轴移动元素。        |
| scale(*x*,*y*)                  | 定义 2D 缩放转换，改变元素的宽度和高度。 |
| scaleX(*n*)                     | 定义 2D 缩放转换，改变元素的宽度。       |
| scaleY(*n*)                     | 定义 2D 缩放转换，改变元素的高度。       |
| rotate(*angle*)                 | 定义 2D 旋转，在参数中规定角度。         |
| skew(*x-angle*,*y-angle*)       | 定义 2D 倾斜转换，沿着 X 和 Y 轴。       |
| skewX(*angle*)                  | 定义 2D 倾斜转换，沿着 X 轴。            |
| skewY(*angle*)                  | 定义 2D 倾斜转换，沿着 Y 轴。            |

| Property                                                     | 描述                   | CSS  |
| ------------------------------------------------------------ | ---------------------- | ---- |
| [transform](https://www.runoob.com/cssref/css3-pr-transform.html) | 适用于2D或3D转换的元素 | 3    |
| [transform-origin](https://www.runoob.com/cssref/css3-pr-transform-origin.html) | 允许您更改转化元素位置 | 3    |

## 8.3d属性

| 属性                                                         | 描述                                 | CSS  |
| ------------------------------------------------------------ | ------------------------------------ | ---- |
| [transform](https://www.runoob.com/cssref/css3-pr-transform.html) | 向元素应用 2D 或 3D 转换。           | 3    |
| [transform-origin](https://www.runoob.com/cssref/css3-pr-transform-origin.html) | 允许你改变被转换元素的位置。         | 3    |
| [transform-style](https://www.runoob.com/cssref/css3-pr-transform-style.html) | 规定被嵌套元素如何在 3D 空间中显示。 | 3    |
| [perspective](https://www.runoob.com/cssref/css3-pr-perspective.html) | 规定 3D 元素的透视效果。             | 3    |
| [perspective-origin](https://www.runoob.com/cssref/css3-pr-perspective-origin.html) | 规定 3D 元素的底部位置。             | 3    |
| [backface-visibility](https://www.runoob.com/cssref/css3-pr-backface-visibility.html) | 定义元素在不面对屏幕时是否可见。     | 3    |

| 函数                                                         | 描述                                      |
| ------------------------------------------------------------ | ----------------------------------------- |
| matrix3d(*n*,*n*,*n*,*n*,*n*,*n*, *n*,*n*,*n*,*n*,*n*,*n*,*n*,*n*,*n*,*n*) | 定义 3D 转换，使用 16 个值的 4x4 矩阵。   |
| translate3d(*x*,*y*,*z*)                                     | 定义 3D 转化。                            |
| translateX(*x*)                                              | 定义 3D 转化，仅使用用于 X 轴的值。       |
| translateY(*y*)                                              | 定义 3D 转化，仅使用用于 Y 轴的值。       |
| translateZ(*z*)                                              | 定义 3D 转化，仅使用用于 Z 轴的值。       |
| scale3d(*x*,*y*,*z*)                                         | 定义 3D 缩放转换。                        |
| scaleX(*x*)                                                  | 定义 3D 缩放转换，通过给定一个 X 轴的值。 |
| scaleY(*y*)                                                  | 定义 3D 缩放转换，通过给定一个 Y 轴的值。 |
| scaleZ(*z*)                                                  | 定义 3D 缩放转换，通过给定一个 Z 轴的值。 |
| rotate3d(*x*,*y*,*z*,*angle*)                                | 定义 3D 旋转。                            |
| rotateX(*angle*)                                             | 定义沿 X 轴的 3D 旋转。                   |
| rotateY(*angle*)                                             | 定义沿 Y 轴的 3D 旋转。                   |
| rotateZ(*angle*)                                             | 定义沿 Z 轴的 3D 旋转。                   |
| perspective(*n*)                                             | 定义 3D 转换元素的透视视图。              |

## 9. 过渡

| 属性                                                         | 描述                                         | CSS  |
| ------------------------------------------------------------ | -------------------------------------------- | ---- |
| [transition](https://www.runoob.com/cssref/css3-pr-transition.html) | 简写属性，用于在一个属性中设置四个过渡属性。 | 3    |
| [transition-property](https://www.runoob.com/cssref/css3-pr-transition-property.html) | 规定应用过渡的 CSS 属性的名称。              | 3    |
| [transition-duration](https://www.runoob.com/cssref/css3-pr-transition-duration.html) | 定义过渡效果花费的时间。默认是 0。           | 3    |
| [transition-timing-function](https://www.runoob.com/cssref/css3-pr-transition-timing-function.html) | 规定过渡效果的时间曲线。默认是 "ease"。      | 3    |
| [transition-delay](https://www.runoob.com/cssref/css3-pr-transition-delay.html) | 规定过渡效果何时开始。默认是 0。             | 3    |

## 10. 动画

@keyframes 规则内指定一个 CSS 样式和动画将逐步从目前的样式更改为新的样式。

> 动画是使元素从一种样式逐渐变化为另一种样式的效果。
>
> 您可以改变任意多的样式任意多的次数。
>
> 请用百分比来规定变化发生的时间，或用关键词 "from" 和 "to"，等同于 0% 和 100%。
>
> 0% 是动画的开始，100% 是动画的完成。
>
> 为了得到最佳的浏览器支持，您应该始终定义 0% 和 100% 选择器。

```css

@keyframes myfirst
{
    from {background: red;}
    to {background: yellow;}
}
 
@-webkit-keyframes myfirst /* Safari 与 Chrome */
{
    from {background: red;}
    to {background: yellow;}
}

```



| 属性                                                         | 描述                                                         | CSS  |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ---- |
| [@keyframes](https://www.runoob.com/cssref/css3-pr-animation-keyframes.html) | 规定动画。（animation: name duration timing-function delay iteration-count direction fill-mode play-state;） | 3    |
| [animation](https://www.runoob.com/cssref/css3-pr-animation.html) | 所有动画属性的简写属性，除了 animation-play-state 属性。     | 3    |
| [animation-name](https://www.runoob.com/cssref/css3-pr-animation-name.html) | 规定 @keyframes 动画的名称。                                 | 3    |
| [animation-duration](https://www.runoob.com/cssref/css3-pr-animation-duration.html) | 规定动画完成一个周期所花费的秒或毫秒。默认是 0。             | 3    |
| [animation-timing-function](https://www.runoob.com/cssref/css3-pr-animation-timing-function.html) | 规定动画的速度曲线。默认是 "ease"。                          | 3    |
| [animation-fill-mode](https://www.runoob.com/cssref/css3-pr-animation-fill-mode.html) | 规定当动画不播放时（当动画完成时，或当动画有一个延迟未开始播放时），要应用到元素的样式。 | 3    |
| [animation-delay](https://www.runoob.com/cssref/css3-pr-animation-delay.html) | 规定动画何时开始。默认是 0。                                 | 3    |
| [animation-iteration-count](https://www.runoob.com/cssref/css3-pr-animation-iteration-count.html) | 规定动画被播放的次数。默认是 1。                             | 3    |
| [animation-direction](https://www.runoob.com/cssref/css3-pr-animation-direction.html) | 规定动画是否在下一周期逆向地播放。默认是 "normal"。          | 3    |
| [animation-play-state](https://www.runoob.com/cssref/css3-pr-animation-play-state.html) | 规定动画是否正在运行或暂停。默认是 "running"。               | 3    |

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"> 
<title>菜鸟教程(runoob.com)</title>
<style> 
div
{
	width:100px;
	height:100px;
	background:red;
	position:relative;
	animation-name:myfirst;
	animation-duration:5s;
	animation-timing-function:linear;
	animation-delay:2s;
	animation-iteration-count:infinite;
	animation-direction:alternate;
	animation-play-state:running;
	/* Safari and Chrome: */
	-webkit-animation-name:myfirst;
	-webkit-animation-duration:5s;
	-webkit-animation-timing-function:linear;
	-webkit-animation-delay:2s;
	-webkit-animation-iteration-count:infinite;
	-webkit-animation-direction:alternate;
	-webkit-animation-play-state:running;
}

@keyframes myfirst
{
	0%   {background:red; left:0px; top:0px;}
	25%  {background:yellow; left:200px; top:0px;}
	50%  {background:blue; left:200px; top:200px;}
	75%  {background:green; left:0px; top:200px;}
	100% {background:red; left:0px; top:0px;}
}

@-webkit-keyframes myfirst /* Safari and Chrome */
{
	0%   {background:red; left:0px; top:0px;}
	25%  {background:yellow; left:200px; top:0px;}
	50%  {background:blue; left:200px; top:200px;}
	75%  {background:green; left:0px; top:200px;}
	100% {background:red; left:0px; top:0px;}
}
</style>
</head>
<body>

<p><b>注意:</b> 该实例在 Internet Explorer 9 及更早 IE 版本是无效的。</p>

<div></div>

</body>
</html>
```

## 11. 多列属性

| 属性                                                         | 描述                                     |
| :----------------------------------------------------------- | :--------------------------------------- |
| [column-count](https://www.runoob.com/cssref/css3-pr-column-count.html) | 指定元素应该被分割的列数。               |
| [column-fill](https://www.runoob.com/cssref/css3-pr-column-fill.html) | 指定如何填充列                           |
| [column-gap](https://www.runoob.com/cssref/css3-pr-column-gap.html) | 指定列与列之间的间隙                     |
| [column-rule](https://www.runoob.com/cssref/css3-pr-column-rule.html) | 所有 column-rule-* 属性的简写            |
| [column-rule-color](https://www.runoob.com/cssref/css3-pr-column-rule-color.html) | 指定两列间边框的颜色                     |
| [column-rule-style](https://www.runoob.com/cssref/css3-pr-column-rule-style.html) | 指定两列间边框的样式                     |
| [column-rule-width](https://www.runoob.com/cssref/css3-pr-column-rule-width.html) | 指定两列间边框的厚度                     |
| [column-span](https://www.runoob.com/cssref/css3-pr-column-span.html) | 指定元素要跨越多少列                     |
| [column-width](https://www.runoob.com/cssref/css3-pr-column-width.html) | 指定列的宽度                             |
| [columns](https://www.runoob.com/cssref/css3-pr-columns.html) | 设置 column-width 和 column-count 的简写 |

> 在所有属性前加‘ -webkit- ’/* Chrome, Safari, Opera */
>
> 加‘ -moz- ’为 /* Firefox */



## 12. 用户界面

| 属性                                                         | 说明                                           | CSS  |
| :----------------------------------------------------------- | :--------------------------------------------- | :--- |
| [appearance](https://www.runoob.com/cssref/css3-pr-appearance.html) | 允许您使一个元素的外观像一个标准的用户界面元素 | 3    |
| [box-sizing](https://www.runoob.com/cssref/css3-pr-box-sizing.html) | 允许你以适应区域而用某种方式定义某些元素       | 3    |
| [icon](https://www.runoob.com/cssref/css3-pr-icon.html)      | 为创作者提供了将元素设置为图标等价物的能力。   | 3    |
| [nav-down](https://www.runoob.com/cssref/css3-pr-nav-down.html) | 指定在何处使用箭头向下导航键时进行导航         | 3    |
| [nav-index](https://www.runoob.com/cssref/css3-pr-nav-index.html) | 指定一个元素的Tab的顺序                        | 3    |
| [nav-left](https://www.runoob.com/cssref/css3-pr-nav-left.html) | 指定在何处使用左侧的箭头导航键进行导航         | 3    |
| [nav-right](https://www.runoob.com/cssref/css3-pr-nav-right.html) | 指定在何处使用右侧的箭头导航键进行导航         | 3    |
| [nav-up](https://www.runoob.com/cssref/css3-pr-nav-up.html)  | 指定在何处使用箭头向上导航键时进行导航         | 3    |
| [outline-offset](https://www.runoob.com/cssref/css3-pr-outline-offset.html) | 外轮廓修饰并绘制超出边框的边缘                 | 3    |
| [resize](https://www.runoob.com/cssref/css3-pr-resize.html)  | 指定一个元素是否是由用户调整大小               | 3    |

## 13. 图片

```css
.responsive {
    padding: 0 6px;
    float: left;
    width: 24.99999%;
}

@media only screen and (max-width: 700px){
    .responsive {
        width: 49.99999%;
        margin: 6px 0;
    }
}

@media only screen and (max-width: 500px){
    .responsive {
        width: 100%;
    }
}
```

**图片 Modal(模态)**

本实例演示了如何结合 CSS 和 JavaScript 来一起渲染图片。

首先，我们使用 CSS 来创建 modal 窗口 (对话框), 默认是隐藏的。

然后，我们使用 JavaScript 来显示模态窗口，当我们点击图片时，图片会在弹出的窗口中显示：

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"> 
<title>111</title> 
<style>
#myImg {
    border-radius: 5px;
    cursor: pointer;
    transition: 0.3s;
}

#myImg:hover {opacity: 0.7;}

/* The Modal (background) */
.modal {
    display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    padding-top: 100px; /* Location of the box */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.9); /* Black w/ opacity */
}

/* Modal Content (image) */
.modal-content {
    margin: auto;
    display: block;
    width: 80%;
    max-width: 700px;
}

/* Caption of Modal Image */
#caption {
    margin: auto;
    display: block;
    width: 80%;
    max-width: 700px;
    text-align: center;
    color: #ccc;
    padding: 10px 0;
    height: 150px;
}

/* Add Animation */
.modal-content, #caption {    
    -webkit-animation-name: zoom;
    -webkit-animation-duration: 0.6s;
    animation-name: zoom;
    animation-duration: 0.6s;
}

@-webkit-keyframes zoom {
    from {-webkit-transform: scale(0)} 
    to {-webkit-transform: scale(1)}
}

@keyframes zoom {
    from {transform: scale(0.1)} 
    to {transform: scale(1)}
}

/* The Close Button */
.close {
    position: absolute;
    top: 15px;
    right: 35px;
    color: #f1f1f1;
    font-size: 40px;
    font-weight: bold;
    transition: 0.3s;
}

.close:hover,
.close:focus {
    color: #bbb;
    text-decoration: none;
    cursor: pointer;
}

/* 100% Image Width on Smaller Screens */
@media only screen and (max-width: 700px){
    .modal-content {
        width: 100%;
    }
}
</style>
</head>
<body>

<h2>图片模态框</h2>
<p>本实例演示了如何结合 CSS 和 JavaScript 来一起渲染图片。</p><p>
首先，我们使用 CSS 来创建 modal 窗口 (对话框), 默认是隐藏的。<p>
<p>然后，我们使用 JavaScript 来显示模态窗口，当我们点击图片时，图片会在弹出的窗口中显示：</p>
<img id="myImg" src="//www.runoob.com/wp-content/uploads/2016/04/img_lights.jpg" alt="Northern Lights, Norway" width="300" height="200">

<!-- The Modal -->
<div id="myModal" class="modal">
  <span class="close">×</span>
  <img class="modal-content" id="img01">
  <div id="caption"></div>
</div>

<script>
// 获取模态窗口
var modal = document.getElementById('myModal');

// 获取图片模态框，alt 属性作为图片弹出中文本描述
var img = document.getElementById('myImg');
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");
img.onclick = function(){
    modal.style.display = "block";
    modalImg.src = this.src;
    modalImg.alt = this.alt;
    captionText.innerHTML = this.alt;
}

// 获取 <span> 元素，设置关闭模态框按钮
var span = document.getElementsByClassName("close")[0];

// 点击 <span> 元素上的 (x), 关闭模态框
span.onclick = function() { 
    modal.style.display = "none";
}
</script>

</body>
</html>
```

## 14. 按钮

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"> 
<title>111</title> 
<style>
.button {
  display: block;
  padding: 15px 25px;
  font-size: 24px;
  cursor: pointer;
  text-align: center;   
  text-decoration: none;
  outline: none;
  color: #fff;
  background-color: #4CAF50;
  border: none;
  border-radius: 15px;
  box-shadow: 0 9px #999;
}

.button:hover {background-color: #3e8e41}

.button:active {
  background-color: #3e8e41;
  box-shadow: 0 5px #666;
  transform: translateY(4px);
}
</style>
</head>
<body>

<h2>按钮动画 - "按压效果"</h2>

<button class="button">Click Me</button>

</body>
</html>
```



```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"> 
<title>菜鸟教程(runoob.com)</title> 
<style>
.button {
  display: inline-block;
  border-radius: 4px;
  background-color: #f4511e;
  border: none;
  color: #FFFFFF;
  text-align: center;
  font-size: 28px;
  padding: 20px;
  width: 200px;
  transition: all 0.5s;
  cursor: pointer;
  margin: 5px;
}

.button span {
  cursor: pointer;
  display: inline-block;
  position: relative;
  transition: 0.5s;
}

.button span:after {
  content: '»';
  position: absolute;
  opacity: 0;
  top: 0;
  right: -20px;
  transition: 0.5s;
}

.button:hover span {
  padding-right: 25px;
}

.button:hover span:after {
  opacity: 1;
  right: 0;
}
</style>
</head>
<body>

<h2>按钮动画</h2>

<button class="button" style="vertical-align:middle"><span>Hover </span></button>

</body>
</html>
```



```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"> 
<title>菜鸟教程(runoob.com)</title> 
<style>
.button {
    position: relative;
    background-color: #4CAF50;
    border: none;
    font-size: 28px;
    color: #FFFFFF;
    padding: 20px;
    width: 200px;
    text-align: center;
    -webkit-transition-duration: 0.4s; /* Safari */
    transition-duration: 0.4s;
    text-decoration: none;
    overflow: hidden;
    cursor: pointer;
}

.button:after {
    content: "";
    background: #90EE90;
    display: block;
    position: absolute;
    padding-top: 300%;
    padding-left: 350%;
    margin-left: -20px!important;
    margin-top: -120%;
    opacity: 0;
    transition: all 0.8s
}

.button:active:after {
    padding: 0;
    margin: 0;
    opacity: 1;
    transition: 0s
}
</style>
</head>
<body>

<h2>按钮动画 - 波纹效果</h2>

<button class="button">Click Me</button>

</body>
</html>
```



## 15. 面包屑导航

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"> 
<title>菜鸟教程(runoob.com)</title> 
<style>
ul.breadcrumb {
    padding: 8px 16px;
    list-style: none;
    background-color: #eee;
}
ul.breadcrumb li {display: inline;}
ul.breadcrumb li+li:before {
    padding: 8px;
    color: black;
    content: "/\00a0";
}
ul.breadcrumb li a {color: green;}
</style>
</head>
<body>

<h2>面包屑导航</h2>
<ul class="breadcrumb">
  <li><a href="#">首页 </a></li>
  <li><a href="#">前端 </a></li>
  <li><a href="#">HTML 教程 </a></li>
  <li>HTML 段落</li>
</ul>

</body>
</html>
```

## 16. 框大小

CSS3 `box-sizing` 属性可以设置 width 和 height 属性中包含了 padding(内边距) 和 border(边框)。

建议全局使用box-sizing: border-box;



## 17. 弹性盒子

| 属性                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [display](https://www.runoob.com/cssref/pr-class-display.html) | 指定 HTML 元素盒子类型。                                     |
| [flex-direction](https://www.runoob.com/cssref/css3-pr-flex-direction.html) | 指定了弹性容器中子元素的排列方式                             |
| [justify-content](https://www.runoob.com/cssref/css3-pr-justify-content.html) | 设置弹性盒子元素在主轴（横轴）方向上的对齐方式。             |
| [align-items](https://www.runoob.com/cssref/css3-pr-align-items.html) | 设置弹性盒子元素在侧轴（纵轴）方向上的对齐方式。             |
| [flex-wrap](https://www.runoob.com/cssref/css3-pr-flex-wrap.html) | 设置弹性盒子的子元素超出父容器时是否换行。                   |
| [align-content](https://www.runoob.com/cssref/css3-pr-align-content.html) | 修改 flex-wrap 属性的行为，类似 align-items, 但不是设置子元素对齐，而是设置行对齐 |
| [flex-flow](https://www.runoob.com/cssref/css3-pr-flex-flow.html) | flex-direction 和 flex-wrap 的简写                           |
| [order](https://www.runoob.com/cssref/css3-pr-order.html)    | 设置弹性盒子的子元素排列顺序。                               |
| [align-self](https://www.runoob.com/cssref/css3-pr-align-self.html) | 在弹性子元素上使用。覆盖容器的 align-items 属性。            |
| [flex](https://www.runoob.com/cssref/css3-pr-flex.html)      | 设置弹性盒子的子元素如何分配空间。                           |