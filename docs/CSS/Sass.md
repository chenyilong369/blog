# Sass

Sass 是一个 CSS 预处理器。

## Sass 变量

变量用于存储一些信息，它可以重复使用。

Sass 变量可以存储以下信息：

- 字符串
- 数字
- 颜色值
- 布尔值
- 列表
- null 值

我们可以用 $ 符号来定义变量。

```scss
$myColor: red;
$myWidth: 19px;
$myFontSize: 20px;

body {
    font-size: $myFontSize;
    width: $myWidth;
    color: $myColor;
}
```

翻译成 CSS 就是 ：

```css
body {
    font-size: 20px;
    width: 19px;
    color: red;
}
```

### 作用域

Sass 变量的作用域只能在当前的层级上有效果。

```scss
$myColor: red;

h1 {
  $myColor: green;   // 只在 h1 里头有用，局部作用域
  color: $myColor;
}

p {
  color: $myColor;
}
```

翻译成 css 即为：

```css
h1 {
   	color: green; 
}

p {
    color: red;
}
```

### !global

 Sass 中我们可以使用 **!global** 关键词来设置变量是全局的:

```scss
$myColor: red;

h1 {
  $myColor: green !global;  // 全局作用域
  color: $myColor;
}

p {
  color: $myColor;
}
```

将以上代码转换为 CSS 代码.

```css
h1 {
  color: green;
}

p {
  color: green;
}
```

:::tip

所有的全局变量我们一般定义在同一个文件，如：**_globals.scss**，然后我们使用`@include`来包含该文件。

:::

## Sass 嵌套规则与属性

Sass 嵌套 CSS 选择器类似于 HTML 的嵌套规则。

```scss
nav {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  li {
    display: inline-block;
  }
  a {
    display: block;
    padding: 6px 12px;
    text-decoration: none;
  }
}
```

将其转化为 CSS ：

```CSS
nav ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
nav li {
  display: inline-block;
}
nav a {
  display: block;
  padding: 6px 12px;
  text-decoration: none;
}
```

### Sass 嵌套属性

很多 CSS 属性都有同样的前缀，例如：font-family, font-size 和 font-weight ， text-align, text-transform 和 text-overflow。

在 Sass 中，我们可以使用嵌套属性来编写它们：

```scss
font: {
  family: Helvetica, sans-serif;
  size: 18px;
  weight: bold;
}

text: {
  align: center;
  transform: lowercase;
  overflow: hidden;
}
```

将以上代码转换为 CSS 代码

```css
font-family: Helvetica, sans-serif;
font-size: 18px;
font-weight: bold;

text-align: center;
text-transform: lowercase;
text-overflow: hidden;
```

## @import

类似 CSS，Sass 支持 **@import** 指令。@import 指令可以让我们导入其他文件等内容。

CSS @import 指令在每次调用时，都会创建一个额外的 HTTP 请求。但，Sass @import 指令将文件包含在 CSS 中，不需要额外的 HTTP 请求。

###  导入文件

@import 指令可以让我们导入其他文件等内容。

CSS @import 指令在每次调用时，都会创建一个额外的 HTTP 请求。但，Sass @import 指令将文件包含在 CSS 中，不需要额外的 HTTP 请求。

Sass @import 指令语法如下：

```css
@import filename;
```

此外，你也可以导入 CSS 文件。

导入后我们就可以在主文件中使用导入文件等变量。

```scss
@import "variables";
@import "colors";
@import "reset";
```

我们先创建一个 reset.scss 文件

```scss
html,
body,
ul,
ol {
  margin: 0;
  padding: 0;
}
```

然后我们在 standard.scss 文件中使用 @import 指令导入 reset.scss 文件：

```scss
@import "reset";

body {
  font-family: Helvetica, sans-serif;
  font-size: 18px;
  color: red;
}
```

将其转换为 CSS 代码为：

```css
html, body, ul, ol {
  margin: 0;
  padding: 0;
}

body {
  font-family: Helvetica, sans-serif;
  font-size: 18px;
  color: red;
}
```

### Sass Partials

如果不希望将一个 Sass 的代码文件编译到一个 CSS 文件，可以在文件名的开头添加一个下划线。这将告诉 Sass 不要将其编译到 CSS 文件。

但是，在导入语句中我们不需要添加下划线。

```scss
// _colors.scss
$myPink: #EE82EE;
$myBlue: #4169E1;
$myGreen: #8FBC8F;
```

导入该文件

```scss
@import "colors";

body {
  font-family: Helvetica, sans-serif;
  font-size: 18px;
  color: $myBlue;
}
```

:::tip

不要将带下划线与不带下划线的同名文件放置在同一个目录下，比如，_colors.scss 和 colors.scss 不能同时存在于同一个目录下，否则带下划线的文件将会被忽略。

:::

## @mixin 与 @include

@mixin 指令允许我们定义一个可以在整个样式表中重复使用的样式。

@include 指令可以将混入（mixin）引入到文档中。

### 定义混入

混入(mixin)通过 @mixin 指令来定义。

```scss
@mixin important-text {
  color: red;
  font-size: 25px;
  font-weight: bold;
  border: 1px solid blue;
}
```

:::tip

Sass 的连接符号 - 与下划线符号 _ 是相同的，也就是 @mixin important-text { } 与 @mixin important_text { } 是一样的混入。

:::

### 使用混入

@include 指令可用于包含一混入：

```scss
.danger {
  @include important-text;
  background-color: green;
}
```

将其编译成 CSS 文件

```css
.danger {
  color: red;
  font-size: 25px;
  font-weight: bold;
  border: 1px solid blue;
  background-color: green;
}
```

### 向混入传递变量

混入可以接收参数。我们可以向混入传递变量。

```scss
/* 混入接收两个参数 */
@mixin bordered($color: red, $width: 1px) { // 定义默认值
  border: $width solid $color;
}

.myArticle {
  @include bordered(blue, 1px);  // 调用混入，并传递两个参数
}

.myNotes {
  @include bordered(red, 2px); // 调用混入，并传递两个参数
}
```

将上面的代码转化为 CSS

```css
.myArticle {
  border: 1px solid blue;
}

.myNotes {
  border: 2px solid red;
}
```

#### 可变参数

有时，不能确定一个混入（mixin）或者一个函数（function）使用多少个参数，这时我们就可以使用 **...** 来设置可变参数。

```scss
@mixin box-shadow($shadows...) {
      -moz-box-shadow: $shadows;
      -webkit-box-shadow: $shadows;
      box-shadow: $shadows;
}

.shadows {
  @include box-shadow(0px 4px 5px #666, 2px 6px 10px #999);
}
```

转换为 CSS 代码,

```css
.shadows {
  -moz-box-shadow: 0px 4px 5px #666, 2px 6px 10px #999;
  -webkit-box-shadow: 0px 4px 5px #666, 2px 6px 10px #999;
  box-shadow: 0px 4px 5px #666, 2px 6px 10px #999;
}
```

## @extend 与 继承

@extend 指令告诉 Sass 一个选择器的样式从另一选择器继承。

```scss
.button-basic  {
  border: none;
  padding: 15px 30px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
}

.button-report  {
  @extend .button-basic;
  background-color: red;
}

.button-submit  {
  @extend .button-basic;
  background-color: green;
  color: white;
}
```

将其转化为 css

```css
.button-basic, .button-report, .button-submit {
  border: none;
  padding: 15px 30px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
}

.button-report  {
  background-color: red;
}

.button-submit  {
  background-color: green;
  color: white;
}
```

使用 @extend 后，我们在 HTML 按钮标签中就不需要指定多个类 class="button-basic button-report" ，只需要设置 class="button-report" 类就好了。

## 函数

### String 函数

String 函数用于处理字符串并获取相关信息。

:::tip

Sass 字符串的起始索引值从 1 开始

:::

| 函数                                    | 描述                                                         |
| :-------------------------------------- | :----------------------------------------------------------- |
| quote(*string*)                         | 给字符串添加引号。                                           |
| str-index(*string*, *substring*)        | 返回 substring 子字符串第一次在 string 中出现的位置。如果没有匹配到子字符串，则返回 null。 |
| str-insert(*string*, *insert*, *index*) | 在字符串 string 中 index 位置插入 insert。                   |
| str-length(*string*)                    | 返回字符串的长度。                                           |
| str-slice(*string*, *start*, *end*)     | 从 string 中截取子字符串，通过 start-at 和 end-at 设置始末位置，未指定结束索引值则默认截取到字符串末尾。 |
| to-lower-case(*string*)                 | 将字符串转成小写                                             |
| to-upper-case(*string*)                 | 将字符串转成大写                                             |
| unique-id()                             | 返回一个无引号的随机字符串作为 id。不过也只能保证在单次的 Sass 编译中确保这个 id 的唯一性。 |
| unquote(*string*)                       | 移除字符串的引号                                             |

### 数字函数

| 函数                       | 描述                                                   |
| :------------------------- | :----------------------------------------------------- |
| abs(*number*)              | 返回一个数值的绝对值。                                 |
| ceil(*number*)             | 向上取整                                               |
| comparable(*num1*, *num2*) | 返回一个布尔值，判断 *num1* 与 *num2* 是否可以进行比较 |
| floor(*number*)            | 向下取整                                               |
| max(*number...*)           | 返回最大值                                             |
| min(*number...*)           | 返回最小值                                             |
| percentage(*number*)       | 将数字转化为百分比的表达形式。                         |
| random()                   | 返回 0-1 区间内的小数，                                |
| random(*number*)           | 返回 1 至 number 之间的整数，包括 1 和 limit。         |
| round(*number*)            | 返回最接近该数的一个整数，四舍五入。                   |

### 列表函数

| 函数                                             | 描述                                                         |
| :----------------------------------------------- | :----------------------------------------------------------- |
| append(*list*, *value*, [*separator*])           | 将单个值 *value* 添加到列表尾部。*separator* 是分隔符，默认会自动侦测，或者指定为逗号或空格。 |
| index(*list*, *value*)                           | 返回元素 *value* 在列表中的索引位置。                        |
| is-bracketed(*list*)                             | 判断列表中是否有中括号                                       |
| join(*list1*, *list2*, [*separator, bracketed*]) | 合并两列表，将列表 *list2* 添加到列表 *list1* 的末尾。*separator* 是分隔符，默认会自动侦测，或者指定为逗号或空格。 *bracketed* 默认会自动侦测是否有中括号，可以设置为 true 或 false。 |
| length(*list*)                                   | 返回列表的长度                                               |
| list-separator(*list*)                           | 返回一列表的分隔符类型。可以是空格或逗号。                   |
| nth(*list*, *n*)                                 | 获取第 *n* 项的值。                                          |
| set-nth(*list*, *n*, *value*)                    | 设置列表第 *n* 项的值为 *value*。                            |
| zip(*lists*)                                     | 将多个列表按照以相同索引值为一组，重新组成一个新的多维度列表。 |

### Map(映射)函数

| 函数                         | 描述                                                         |
| :--------------------------- | :----------------------------------------------------------- |
| map-get(*map*, *key*)        | 返回 Map 中 *key* 所对应的 value(值)。如没有对应的 key，则返回 null 值。 |
| map-has-key(*map*, *key*)    | 判断 *map* 是否有对应的 *key*，存在返回 true，否则返回 false。 |
| map-keys(*map*)              | 返回 *map* 中所有的 key 组成的队列。                         |
| map-merge(*map1*, *map2*)    | 合并两个 map 形成一个新的 map 类型，即将 *map2* 添加到 *map1*的尾部 |
| map-remove(*map*, *keys...*) | 移除 *map* 中的 keys，多个 key 使用逗号隔开。                |
| map-values(*map*)            | 返回 *map* 中所有的 value 并生成一个队列。                   |

### 选择器函数

| 函数                                                    | 描述                                                         |
| :------------------------------------------------------ | :----------------------------------------------------------- |
| is-superselector(*super*, *sub*)                        | 比较两个选择器匹配的范围，即判断 *super* 选择器是否包含了 *sub* 选择器所匹配的范围，是的话返回 true，否则返回 false。 |
| selector-append(*selectors*)                            | 将第二个 (也可以有多个) 添加到第一个选择器的后面。 selector. |
| selector-extend(*selector*, *extendee*, *extender*)     |                                                              |
| selector-nest(*selectors*)                              | 返回一个新的选择器，该选择器通过提供的列表选择器生成一个嵌套的列表。 |
| selector-parse(*selector*)                              | 将字符串的选择符 *selector* 转换成选择器队列。               |
| selector-replace(*selector*, *original*, *replacement*) | 给定一个选择器，用replacement 替换 original 后返回一个新的选择器队列。 |
| selector-unify(*selector1*, *selector2*)                | 将两组选择器合成一个复合选择器。如两个选择器无法合成，则返回 null 值。 |
| simple-selectors(*selectors*)                           | 将合成选择器拆为单个选择器。                                 |

###  Introspection 函数

Sass Introspection 函数比较少用于构建样式表，一般用于代码的调试上。

| 函数                                     | 描述                                                         |
| :--------------------------------------- | :----------------------------------------------------------- |
| call(*function*, *arguments*...)         | 函数的动态调用，即调用函数 function 参数为 arguments，并返回结果。 |
| content-exists()                         | 查看当前的混入是否传递 @content 块。                         |
| feature-exists(*feature*)                | 检查当前的 Sass 实现是否支持该特性。                         |
| function-exists(*functionname*)          | 检测指定的函数是否存在                                       |
| get-function(*functionname*, css: false) | 返回指定函数。如果 css 为 true，则返回纯 CSS 函数。          |
| global-variable-exists(*variablename*)   | 检测某个全局变量是否定义。                                   |
| inspect(*value*)                         | 返回一个字符串的表示形式，value 是一个 sass 表达式。         |
| mixin-exists(*mixinname*)                | 检测指定混入 (mixinname) 是否存在。                          |
| type-of(*value*)                         | 返回值类型。返回值可以是 number, string, color, list, map, bool, null, function, arglist。  r |
| unit(*number*)                           | 返回传入数字的单位（或复合单位）。                           |
| unitless(*number*)                       | 返回一个布尔值，判断传入的数字是否带有单位。                 |
| variable-exists(*variablename*)          | 判断变量是否在当前的作用域下。                               |

### 颜色函数

Sass 颜色函数可以分为三个部分：颜色设置、颜色获取以及颜色操作。

#### 颜色设置

| 函数                                            | 描述                                                         |
| :---------------------------------------------- | :----------------------------------------------------------- |
| rgb(*red*, *green*, *blue*)                     | 创建一个 Red-Green-Blue (RGB) 色。其中 R 是 "red" 表示红色，而 G 是 "green" 绿色，B 是 "blue" 蓝色。 |
| rgba(*red*, *green*, *blue*, *alpha*)           | 根据红、绿、蓝和透明度值创建一个颜色。                       |
| hsl(*hue*, *saturation*, *lightness*)           | 通过色相（hue）、饱和度(saturation)和亮度（lightness）的值创建一个颜色。 |
| hsla(*hue*, *saturation*, *lightness*, *alpha*) | 通过色相（hue）、饱和度(saturation)、亮度（lightness）和透明（alpha）的值创建一个颜色。 |
| grayscale(*color*)                              | 将一个颜色变成灰色，相当于 desaturate( color,100%)。         |
| complement(*color*)                             | 返回一个补充色，相当于adjust-hue($color,180deg)。            |
| invert(*color*, *weight*)                       | 返回一个反相色，红、绿、蓝色值倒过来，而透明度不变。         |

#### Sass 颜色获取

| 函数                | 描述                                                         |
| :------------------ | :----------------------------------------------------------- |
| red(*color*)        | 从一个颜色中获取其中红色值（0-255）。  **实例:** red(#7fffd4); 结果: 127 red(red); 结果: 255 |
| green(*color*)      | 从一个颜色中获取其中绿色值（0-255）。  **实例:** green(#7fffd4); 结果: 255 green(blue); 结果: 0 |
| blue(*color*)       | 从一个颜色中获取其中蓝色值（0-255）。  **实例:** blue(#7fffd4); 结果: 212 blue(blue); 结果: 255 |
| hue(*color*)        | 返回颜色在 HSL 色值中的角度值 (0deg - 255deg)。  **实例:** hue(#7fffd4); 结果: 160deg |
| saturation(*color*) | 获取一个颜色的饱和度值(0% - 100%)。  **实例:** saturation(#7fffd4); 结果: 100% |
| lightness(*color*)  | 获取一个颜色的亮度值(0% - 100%)。  **实例:** lightness(#7fffd4); 结果: 74.9% |
| alpha(*color*)      | Returns the alpha channel of *color* as a number between 0 and 1.  **实例:** alpha(#7fffd4); 结果: 1 |
| opacity(*color*)    | 获取颜色透明度值(0-1)。  **实例:** opacity(rgba(127, 255, 212, 0.5); 结果: 0.5 |

#### Sass 颜色操作

| 函数                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| mix(*color1*, *color2*, *weight*)                            | 把两种颜色混合起来。 *weight* 参数必须是 0% 到 100%。默认 weight 为 50%，表明新颜色各取 50% color1 和 color2 的色值相加。如果 weight 为 25%，那表明新颜色为 25% color1 和 75% color2 的色值相加。 |
| adjust-hue(*color*, *degrees*)                               | 通过改变一个颜色的色相值（-360deg - 360deg），创建一个新的颜色。 |
| adjust-color(*color*, *red*, *green*, *blue*, *hue*, *saturation*, *lightness*, *alpha*) | 这个函数能够调整给定色彩的一个或多个属性值，包括 RGB 和 HSL 色彩的各项色值参数，另外还有 alpha 通道的取值。这些属性值的调整依赖传入的关键值参数，通过这些参数再与给定颜色相应的色彩值做加减运算。 |
| change-color(*color*, *red*, *green*, *blue*, *hue*, *saturation*, *lightness*, *alpha*) | 跟上面 adjust-color 类似，只是在该函数中传入的参数将直接替换原来的值，而不做任何的运算。 |
| scale-color(*color*, *red*, *green*, *blue*, *saturation*, *lightness*, *alpha*) | 另一种实用的颜色调节函数。adjust-color 通过传入的参数简单的与本身的色值参数做加减，有时候可能会导致累加值溢出，当然，函数会把结果控制在有效的阈值内。而 scale-color 函数则避免了这种情况，可以不必担心溢出，让参数在阈值范围内进行有效的调节。 |
| rgba(*color*, *alpha*)                                       | 根据红、绿、蓝和透明度值创建一个颜色。                       |
| lighten(*color*, *amount*)                                   | 通过改变颜色的亮度值（0% - 100%），让颜色变亮，创建一个新的颜色。 |
| darken(*color*, *amount*)                                    | 通过改变颜色的亮度值（0% - 100%），让颜色变暗，创建一个新的颜色。 |
| saturate(*color*, *amount*)                                  | 提高传入颜色的色彩饱和度。等同于 adjust-color( color, saturation: amount) |
| desaturate(*color*, *amount*)                                | 调低一个颜色的饱和度后产生一个新的色值。同样，饱和度的取值区间在 0% ~ 100%。等同于 adjust-color(color, saturation: -amount) |
| opacify(*color*, *amount*)                                   | 降低颜色的透明度，取值在 0-1 之。等价于 adjust-color(color, alpha: amount) |
| fade-in(*color*, *amount*)                                   | 降低颜色的透明度，取值在 0-1 之。等价于 adjust-color(color, alpha: amount) |
| transparentize(*color*, *amount*)                            | 提升颜色的透明度，取值在 0-1 之间。等价于 adjust-color(color, alpha: -amount) |
| fade-out(*color*, *amount*)                                  | 提升颜色的透明度，取值在 0-1 之间。等价于 adjust-color(color, alpha: -amount) |