# HTML

## HTML5 新增了哪些标签

`template` `section` `nav` `article` `aside` `header` `footer` `main` `canvas` `svg` `video` `audio` `source` `track` `menu`

## 块级标签

`div` `p` `h1-h6` `ul` `ol` `dl` `li` `header` `footer` `aside` `section` `acticle` `form` `table`等

## 行内标签

`span` `b` `q` `i` `a` `em` `label` 等

## link 标签

- link 标签可以实现资源加载、DNS 预解析。
- 与 `@import` 方法相比，首先是加载时间的不同，link标签不会被 DOM 解析阻塞，可以并行加载资源，而@import 加载的资源必须等到 DOM 解析结束后才能被加载；
- link 标签可以通过 JS createElement 创建并加入到文档中，实现动态引入，@import 只能在 CSS 中使用。
- link是XHTML标签，除了加载CSS外，还可以定义RSS等其他事务；@import属于CSS范畴，只能加载CSS。
- link引用CSS时，在页面载入时同时加载；@import需要页面网页完全载入以后加载。
- link是XHTML标签，无兼容问题；@import是在CSS2.1提出的，低版本的浏览器不支持。
- link支持使用Javascript控制DOM去改变样式；而@import不支持。

## href和src的区别

- **href**标识超文本引用，用在**link**和**a**等元素上，**href**是引用和页面关联，是在当前元素和引用资源之间建立联系，href 不会阻塞 DOM 解析，而且是并行加载。

- **src**表示引用资源，表示替换当前元素，用在**img**，**script**，**iframe**上，src 加载的资源是会阻塞 DOM 解析的。

## script 标签上的属性

- async: 并行加载，记载完成后立即执行加载的资源，会打断 DOM 解析。
- defer: 并行加载后延迟，加载完成后等待 DOM 解析完成后执行加载的资源，不会打断 DOM 解析。
- 区别在于 async 加载完成后会立即执行加载的资源，先加载完成的资源先执行。defer 加载完成后会将加载的资源按照加载开始顺序放到队列中，等待 DOM 解析完成后依次执行。

## 标签语义化好处

- 无障碍：方便无障碍引擎对网页内容进行解析。
- SEO：语义清晰，对搜索引擎爬虫友好。
- 可读性：HTML 代码可读性提高，利于维护。

