# 图片优化

就图片这块来说，与其说我们是在做“优化”，不如说我们是在做“权衡”。因为我们要做的事情，就是去压缩图片的体积（或者一开始就选取体积较小的图片格式）。但这个优化操作，是以牺牲一部分成像质量为代价的。因此我们的主要任务，是尽可能地去寻求一个质量与性能之间的平衡点。

下面就介绍几种不同类型的图形

## JPEG/JPG

关键字：**有损压缩、体积小、加载快、不支持透明**

#### JPG 的优点

JPG 最大的特点是**有损压缩**。这种高效的压缩算法使它成为了一种非常轻巧的图片格式。另一方面，即使被称为“有损”压缩，JPG的压缩方式仍然是一种高质量的压缩方式：当我们把图片体积压缩至原有体积的 50% 以下时，JPG 仍然可以保持住 60% 的品质。此外，JPG 格式以 24 位存储单个图，可以呈现多达 1600 万种颜色，足以应对大多数场景下对色彩的要求，这一点决定了它压缩前后的质量损耗并不容易被我们人类的肉眼所察觉——前提是你用对了业务场景。

#### 使用场景

JPG 适用于呈现色彩丰富的图片，在我们日常开发中，JPG 图片经常作为大的背景图、轮播图或 Banner 图出现。

#### JPG 的缺陷

有损压缩在轮播图上确实很难露出马脚，但当它处理**矢量图形**和 **Logo** 等线条感较强、颜色对比强烈的图像时，人为压缩导致的图片模糊会相当明显。

此外，JPEG 图像**不支持透明度处理**，透明图片需要召唤 PNG 来呈现。

## PNG-8 与 PNG-24

关键字：**无损压缩、质量高、体积大、支持透明**

#### PNG 的优点

PNG（可移植网络图形格式）是一种无损压缩的高保真的图片格式。8 和 24，这里都是二进制数的位数。按照我们前置知识里提到的对应关系，8 位的 PNG 最多支持 256 种颜色，而 24 位的可以呈现约 1600 万种颜色。

PNG 图片具有比 JPG 更强的色彩表现力，对线条的处理更加细腻，对透明度有良好的支持。它弥补了上文我们提到的 JPG 的局限性，唯一的 BUG 就是**体积太大**。

#### PNG-8 与 PNG-24 的选择题

什么时候用 PNG-8，什么时候用 PNG-24，这是一个问题。

理论上来说，当你追求最佳的显示效果、并且不在意文件体积大小时，是推荐使用 PNG-24 的。

但实践当中，为了规避体积的问题，我们一般不用PNG去处理较复杂的图像。当我们遇到适合 PNG 的场景时，也会优先选择更为小巧的 PNG-8。

如何确定一张图片是该用 PNG-8 还是 PNG-24 去呈现呢？好的做法是把图片先按照这两种格式分别输出，看 PNG-8 输出的结果是否会带来肉眼可见的质量损耗，并且确认这种损耗是否在我们（尤其是你的 UI 设计师）可接受的范围内，基于对比的结果去做判断。

#### 应用场景

前面我们提到，复杂的、色彩层次丰富的图片，用 PNG 来处理的话，成本会比较高，我们一般会交给 JPG 去存储。

考虑到 PNG 在处理线条和颜色对比度方面的优势，我们主要用它来呈现小的 Logo、颜色简单且对比强烈的图片或背景等。

## SVG

关键字：**文本文件、体积小、不失真、兼容性好**

SVG（可缩放矢量图形）是一种基于 XML 语法的图像格式。它和本文提及的其它图片种类有着本质的不同：SVG 对图像的处理不是基于像素点，而是是基于对图像的形状描述。

#### SVG 的特性

和性能关系最密切的一点就是：SVG 与 PNG 和 JPG 相比，**文件体积更小，可压缩性更强**。

当然，作为矢量图，它最显著的优势还是在于**图片可无限放大而不失真**这一点上。这使得 SVG 即使是被放到视网膜屏幕上，也可以一如既往地展现出较好的成像品质——1 张 SVG 足以适配 n 种分辨率。

此外，**SVG 是文本文件**。我们既可以像写代码一样定义 SVG，把它写在 HTML 里、成为 DOM 的一部分，也可以把对图形的描述写入以 .svg 为后缀的独立文件（SVG 文件在使用上与普通图片文件无异）。这使得 SVG 文件可以被非常多的工具读取和修改，具有较强的**灵活性**。

SVG 的局限性主要有两个方面，一方面是它的渲染成本比较高，这点对性能来说是很不利的。另一方面，SVG 存在着其它图片格式所没有的学习成本（它是可编程的）。

#### SVG 的使用方式与应用场景

SVG 是文本文件，我们既可以像写代码一样定义 SVG，把它写在 HTML 里、成为 DOM 的一部分，也可以把对图形的描述写入以 .svg 为后缀的独立文件（SVG 文件在使用上与普通图片文件无异）。

## Base64

关键字：**文本文件、依赖编码、小图标解决方案**

Base64 并非一种图片格式，而是一种编码方式。Base64 和雪碧图一样，是作为小图标解决方案而存在的。在了解 Base64 之前，我们先来了解一下雪碧图。

#### 前置知识：最经典的小图标解决方案——雪碧图（CSS Sprites）

雪碧图、CSS 精灵、CSS Sprites、图像精灵，说的都是这个东西——一种将小图标和背景图像合并到一张图片上，然后利用 CSS 的背景定位来显示其中的每一部分的技术。

MDN 对雪碧图的解释已经非常到位：

> 图像精灵（sprite，意为精灵），被运用于众多使用大量小图标的网页应用之上。它可取图像的一部分来使用，使得使用一个图像文件替代多个小文件成为可能。相较于一个小图标一个图像文件，单独一张图片所需的 HTTP 请求更少，对内存和带宽更加友好。

和雪碧图一样，Base64 图片的出现，也是为了减少加载网页图片时对服务器的请求次数，从而提升网页性能。**Base64 是作为雪碧图的补充而存在的。**

#### 理解 Base64

通过我们上文的演示，大家不难看出，每次加载图片，都是需要单独向服务器请求这个图片对应的资源的——这也就意味着一次 HTTP 请求的开销。

**Base64 是一种用于传输 8Bit 字节码的编码方式，通过对图片进行 Base64 编码，我们可以直接将编码结果写入 HTML 或者写入 CSS，从而减少 HTTP 请求的次数。**

我们来一起看一个实例，现在我有这么一个小小的放大镜 Logo：

![img](https://user-gold-cdn.xitu.io/2018/9/15/165db7e94699824b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

它对应的链接如下：

```
https://user-gold-cdn.xitu.io/2018/9/15/165db7e94699824b?w=22&h=22&f=png&s=3680
```

按照一贯的思路，我们加载图片需要把图片链接写入 img 标签：

```html
<img src="https://user-gold-cdn.xitu.io/2018/9/15/165db7e94699824b?w=22&h=22&f=png&s=3680">
```

浏览器就会针对我们的图片链接去发起一个资源请求。

但是如果我们对这个图片进行 Base64 编码，我们会得到一个这样的字符串：

```
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAA...
```

字符串比较长，我们可以直接用这个字符串替换掉上文中的链接地址。你会发现浏览器原来是可以理解这个字符串的，它自动就将这个字符串解码为了一个图片，而不需再去发送 HTTP 请求。

#### Base64 的应用场景

- 图片的实际尺寸很小 （几乎没有超过 2kb 的）
- 图片无法以雪碧图的形式与其它小图结合（合成雪碧图仍是主要的减少 HTTP 请求的途径，Base64 是雪碧图的补充）
- 图片的更新频率非常低（不需我们重复编码和修改文件内容，维护成本较低）

## WebP

关键字：**年轻的全能型选手**

WebP 是今天在座各类图片格式中最年轻的一位，它于 2010 年被提出， 是 Google 专为 Web 开发的一种**旨在加快图片加载速度**的图片格式，它支持有损压缩和无损压缩。

#### WebP 的优点

WebP 像 JPEG 一样对细节丰富的图片信手拈来，像 PNG 一样支持透明，像 GIF 一样可以显示动态图片——它集多种图片文件格式的优点于一身。
WebP 的官方介绍对这一点有着更权威的阐述：

> 与 PNG 相比，WebP 无损图像的尺寸缩小了 26％。在等效的 SSIM 质量指数下，WebP 有损图像比同类 JPEG 图像小 25-34％。

无损 WebP 支持透明度（也称为 alpha 通道），仅需 22％ 的额外字节。对于有损 RGB 压缩可接受的情况，有损 WebP 也支持透明度，与 PNG 相比，通常提供 3 倍的文件大小。

#### WebP 的局限性

WebP 纵有千般好，但它毕竟**太年轻**。我们知道，任何新生事物，都逃不开兼容性的大坑。

此外，WebP 还会增加服务器的负担——和编码 JPG 文件相比，编码同样质量的 WebP 文件会占用更多的计算资源。

#### WebP 的应用场景

现在限制我们使用 WebP 的最大问题不是“这个图片是否适合用 WebP 呈现”的问题，而是“浏览器是否允许 WebP”的问题，即我们上文谈到的兼容性问题。具体来说，一旦我们选择了 WebP，就要考虑在 Safari 等浏览器下它无法显示的问题，也就是说我们需要准备 PlanB，准备降级方案。