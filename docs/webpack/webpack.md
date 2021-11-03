# webpack

## 配置文件

webpack 默认配置文件：webpack.config.js。

可以通过 webpack --config 指定配置文件。

下面看一个简单的 webpack 配置：

```js
var path = require('path');

module.exports = {
  mode: 'development', // 环境
  entry: './foo.js', // 入口文件 （默认为 ./src/index.js）
  output: { // 输出文件 (默认为 ./dist/main.js)
    path: path.resolve(__dirname, 'dist'),
    filename: 'foo.bundle.js'
  },
  module: { // Loader 配置
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  },
  plugins: [ // 插件配置
    new HtmlwebpackPlugin({
        templete: './src/index.html'
    })
  ]
};
```

## 占位符含义

- \[ext\]: 资源后缀名
- \[name]: 文件名称
- \[path]: 文件的相对路径
- \[folder]: 文件所在的文件夹
- \[contenthash]: 文件的内容hash，默认是 md5 生成。
- \[hash\]: 文件的内容hash，默认是 md5 生成。
- \[emoji]: 一个随机的指代文件内容的 emoji。

## 文件指纹

文件指纹主要是做版本的管理。主要是文件名后面带的字符串。

### 如何生成

- Hash：和整个项目的构建有关，只要项目文件有修改，整个项目构建的 hash 值就会更改。
- Chunkhash：和 webpack 打包的chunk有关，不同的entry会生成不同的chunkhash值。
- Contenthash：根据文件内容来定义 hash，文件内容不变，则 Contenthash 不变。

```js
var path = require('path');

module.exports = {
  mode: 'development', // 环境
  entry: './foo.js', // 入口文件 （默认为 ./src/index.js）
  output: { // 输出文件 (默认为 ./dist/main.js)
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]_[chunkhash:8].js' // js 文件指纹
  },
  module: { // Loader 配置
    rules: [
      {
        test: /.(png|jpg|gif|jepg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name]_[hash:8].[ext]' // 文件指纹
            }
          } 
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({ // 将样式提取成单独的 css 文件
      filename: '[name]_[contenthash:8].css', // css 文件指纹
    })
  ]
};
```

## 代码压缩

主要是 HTML 压缩， Js压缩，css 压缩

### js 的压缩

webpack 内置了 uglifyjs-webpack-plugin。

### css 文件的压缩

使用 optimize-css-assets-webpack-plugin 插件，同时搭配 cssnano 来进行代码的压缩。

```js
var path = require('path');

module.exports = {
  mode: 'development', // 环境
  entry: './foo.js', // 入口文件 （默认为 ./src/index.js）
  output: { // 输出文件 (默认为 ./dist/main.js)
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]_[chunkhash:8].js' // js 文件指纹
  },
  plugins: [
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano')
    })
  ]
};
```

### Html 文件的压缩

可以利用 html-webpack-plugin 插件的 minify 去进行设置。

## 自动清除构建目录

可以使用 clean-wepack-plugin，它默认会删除 output 指定的输出目录。

```js
var path = require('path');

module.exports = {
  mode: 'development', // 环境
  entry: './foo.js', // 入口文件 （默认为 ./src/index.js）
  output: { // 输出文件 (默认为 ./dist/main.js)
    path: path.resolve(__dirname, 'dist'),
    filename: 'foo.bundle.js'
  },
  plugins: [ // 插件配置
    new CleanWebpackPlugin()
  ]
};
```

## 自动补齐css3前缀

可以使用 autoprefixer 插件，

```js
var path = require('path');

module.exports = {
  mode: 'development', // 环境
  entry: './foo.js', // 入口文件 （默认为 ./src/index.js）
  output: { // 输出文件 (默认为 ./dist/main.js)
    path: path.resolve(__dirname, 'dist'),
    filename: 'foo.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer')({
                  browsers: ["last 2 version", ">1%", "iOS 7"]
                })
              ]
            }
          }
        ]
      }
    ]
  }
};
```

## 移动端 css px 自动转换成 rem

使用 px2rem-loader，这样页面渲染时会去计算根元素的 font-size 值。可以搭配 lib-flexible 进行使用，lib-flexible 会根据设备宽高来计算根元素字体大小。

```js
var path = require('path');

module.exports = {
  mode: 'development', // 环境
  entry: './foo.js', // 入口文件 （默认为 ./src/index.js）
  output: { // 输出文件 (默认为 ./dist/main.js)
    path: path.resolve(__dirname, 'dist'),
    filename: 'foo.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader',
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75, // 相对 px 的比例
              remPrecision: 8
            }
          }
        ]
      }
    ]
  }
};
```

## 资源内联

- 页面框架的初始化
- 上报相关打点
- css 内联避免页面闪动
- 减少 HTTP 网络请求数（小图标或者字体内联）（url-loader）

### HTML 和 JS 内联

使用 raw-loader 内联 html 和 js。

```html
<script>${require('raw-loader!babel-loader!./meta.html')}</script>

<script>${require('raw-loader!babel-loader!./index.js')}</script>
```

### CSS 内联

- 借助 style-loader

```js
var path = require('path');

module.exports = {
  mode: 'development', // 环境
  entry: './foo.js', // 入口文件 （默认为 ./src/index.js）
  output: { // 输出文件 (默认为 ./dist/main.js)
    path: path.resolve(__dirname, 'dist'),
    filename: 'foo.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              insertAt: 'top', // 样式插入到 <head>
              singleton: true, // 将所有 style 标签合并成一个
            }
          },
          'css-loader',
          'less-loader',
        ]
      }
    ]
  }
};
```

- html-inline-css-webpack-plugin

## 多页面打包

每次进行页面跳转的时候，后台服务器都会发送一个新的 html 文档，这种类型的网站叫做多页网站。

- 页面解耦合
- seo

### 基本思路

每个页面对应一个 entry，对应一个 html-webpack-plugin。

这种方式的缺点在于每次新增或者删除页面的时候需要修改 webpack。

所以我们可以动态的获取 entry 和 设置 html-webpack-plugin。

使用 glob.sync

```js
entry: glob.sync(path.join(__dirname, './src/*/index.js'))
```

 ## 使用 source map

作用在于通过 source map 定位到源代码，基本是在开发环境开启，线上环境关闭。

source map 关键字：（devtool）

- eval：使用 eval 包裹模块代码
- source map：产生 .map 文件
- cheap：不包含列信息
- inline：将 .map 作为 DataURI 嵌入，不单独生成 .map 文件
- module：包含 loader 的 sourcemap



