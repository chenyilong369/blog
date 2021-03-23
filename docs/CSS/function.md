# CSS函数

**CSS函数**指复杂类型或调用特殊处理的组件值类型。为单调的属性声明增加了更强大的点缀，让简单的CSS变得更有艺术感。其语法也很简单，编写形式为`function(params)`，JS里的函数调用一致。在CSS代码中，只要带有`()`的属性值都是函数。

## 分类

### 颜色函数

-  **rgb()**：RGB色彩模式
-  **rgba()**：RGBA色彩模式
-  **hsl()**：HSL色彩模式
-  **hsla()**：HSLA色彩模式
-  **color()**：色彩模式，基于当前颜色衍生出其他颜色

### 属性函数

-  **attr()**：属性
-  **var()**：变量

### 数学函数

-  **clamp()**：区间范围值
-  **counter()**：计数器
-  **counters()**：嵌套计数器
-  **calc()**：计算
-  **max()**：最大值
-  **min()**：最小值

###  背景函数

-  **url()**：图像路径
-  **element()**：图像映射，渲染指定元素为图像
-  **image-set()**：图像集合，根据屏幕分辨率匹配合适图像
-  **linear-gradient()**：线性渐变
-  **radial-gradient()**：径向渐变
-  **conic-gradient()**：锥形渐变
-  **repeating-linear-gradient()**：重复线性渐变
-  **repeating-radial-gradient()**：重复径向渐变
-  **repeating-conic-gradient()**：重复锥形渐变

### 滤镜函数

-  **blur()**：模糊
-  **brightness()**：亮度
-  **contrast()**：对比度
-  **drop-shadow()**：阴影
-  **grayscale()**：灰度
-  **hue-rotate()**：色相旋转
-  **invert()**：反相
-  **opacity()**：透明度
-  **saturate()**：饱和度
-  **sepia()**：褐色

### 图像函数

-  **circle()**：圆形
-  **ellipse()**：椭圆形
-  **inset()**：矩形
-  **path()**：路径
-  **polygon()**：多边行

### 变换函数

-  **matrix()**：矩阵
-  **matrix3d()**：3D矩阵
-  **perspective()**：视距
-  **rotate()**：旋转
-  **rotate3d()**：3D旋转
-  **rotateX()**：X轴旋转
-  **rotateY()**：Y轴旋转
-  **rotateZ()**：Z轴旋转
-  **scale()**：缩放
-  **scale3d()**：3D缩放
-  **scaleX()**：X轴缩放
-  **scaleY()**：Y轴缩放
-  **scaleZ()**：Z轴缩放
-  **skew()**：扭曲
-  **skewX()**：X轴扭曲
-  **skewY()**：Y轴扭曲
-  **translate()**：位移
-  **translate3d()**：3D位移
-  **translateX()**：X轴位移
-  **translateY()**：Y轴位移
-  **translateZ()**：Z轴位移

### 缓动函数

-  **cubic-bezier()**：贝塞尔曲线
-  **steps()**：逐帧

## 颜色函数

`颜色函数`是最常用的函数，没有之一。`颜色函数`可用在`border-color`、`outline-color`、`background-color`、`box-shadow`、`color`、`caret-color`等属性上使用。

### RGB色彩模式：rgb()、rgba()

