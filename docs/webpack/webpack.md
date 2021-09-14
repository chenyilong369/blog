# webpack

**webpack** 是一个用于现代 JavaScript 应用程序的 *静态模块打包工具*。当 webpack 处理应用程序时，它会在内部构建一个 [依赖图(dependency graph)](https://webpack.docschina.org/concepts/dependency-graph/)，此依赖图对应映射到项目所需的每个模块，并生成一个或多个 *bundle*。

## webpack 配置文件

webpack 默认配置文件：webpack.config.js。可以通过 webpack --config 指定配置文件。

webpack 主要配置组成：

```javascript
module.exports = {
    entry: './src/index.js', // 入口文件（默认）
    output: './dist/main.js', // 出口文件（默认）
    mode: 'production', // 环境
    module: { // Loader 配置
        rules: [
            { test: /\.txt$/, use: 'raw-loader' }
        ]
    },
    plugins: [ // 插件配置
        new HtmlwebpackPlugin({
            templete: './src/index.js'
        })
    ]
}
```

## 安装

我们先简单的安装一下 webpack 的核心模块。（webpack、webpack-cli）。

```
yarn add webpack webpack-cli
or
npm install webpack webpack-cli --save-dev
```

安装完成后可以运行一下

```
./node_modules/.bin/webpack -v
```

即可以查看到当前安装的 webpack 的版本号。

## 简单的举例

首先我们先创建一个小项目，新建一个文件夹后打开终端执行：

```
npm init -y
```

这样当前目录下就有了 package.json 文件。当我们安装完 webpack 后，package.json 为以下的样子。

```json
{
  "name": "webpackTest",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "webpack": "^5.42.0",
    "webpack-cli": "^4.7.2"
  }
}
```

接下来在根目录上创建 webpack.config.js。

```javascript
'use stract'
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  mode: 'production'
}
```

可以看到，入口文件是 src 目录下的 index.js 文件。出口文件为当前目录下的 dist 目录下的 bundle.js 文件。

首先我们现在 src 目录下写点东西。

```javascript
// index.js

import { helloworld } from "./helloworld";
document.write(helloworld());

// helloworld.js
export function helloworld() {
  return 'Hello Webpack'
}
```

然后我们运行 webpack 对文件进行打包。

```
./node_modules/.bin/webpack
```

打包后我们来看看 dist 目录下的 bundle.js 文件。

```javascript
(()=>{"use strict";document.write("Hello Webpack")})();
```

然后我们在 dist 目录下写一个 html 文件来展示我们打包后的文件。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <script src='./bundle.js' type='text/javascript'></script>
</body>
</html>
```

可以看到页面上显示 `Hello Webpack`。

当然，我们可以在 package.json 中添加脚本命令：

```json
{
  "name": "webpackTest",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "webpack": "^5.42.0",
    "webpack-cli": "^4.7.2"
  }
}
```

## 基础用法

### Entry

Entry 用来指定 webpack 的打包入口。

它分为单入口和多入口 entry：

```javascript
module.exports = { 
    entry: './src/app.js' // 单入口 entry: string | [string]
}

module.exports = {
  entry: ['./src/file_1.js', './src/file_2.js'], // 单入口 entry: string | [string]
  output: {
    filename: 'bundle.js',
  },
};

module.exports = {
    entry: { // 对象语法 entry: { <entryChunkName> string | [string] } | {}
        app: './src/app/js',
        adminApp: './src/adminApp.js',
    }
};
```

用于描述入口的对象。你可以使用如下属性：

- `dependOn`: 当前入口所依赖的入口。它们必须在该入口被加载前被加载。
- `filename`: 指定要输出的文件名称。
- `import`: 启动时需加载的模块。
- `library`: 指定 library 选项，为当前 entry 构建一个 library。
- `runtime`: 运行时 chunk 的名字。如果设置了，就会创建一个以这个名字命名的运行时 chunk，否则将使用现有的入口作为运行时。
- `publicPath`: 当该入口的输出文件在浏览器中被引用时，为它们指定一个公共 URL 地址。

```javascript
module.exports = {
  entry: {
    a2: 'dependingfile.js',
    b2: {
      dependOn: 'a2',
      import: './src/app.js',
    },
  },
};
```

- `runtime` 和 `dependOn` 不应在同一个入口上同时使用

- 确保 `runtime` 不能指向已存在的入口名称

- `dependOn` 不能是循环引用的


### Output

Output 用来指定 webpack 如何将编译后的文件输出到磁盘。

```javascript
module.exports = { 
    entry: './src/app.js', // 单入口 entry: string | [string]
    output: {
        filename: 'bundle.js',
        path: __dirname + '/dist', // 相对于但入口的配置
    }
};
```

```javascript
module.exports = {
    entry: { // 对象语法 entry: { <entryChunkName> string | [string] } | {}
        app: './src/app/js',
        adminApp: './src/adminApp.js',
    },
    output: {
        filename: '[name].js', // 通过占位符确保文件名的统一
        path: __dirname + '/dist',
    };
};
```

接下来举一个例子，在 src 目录中加入 `search.js` ,

```javascript
document.write('search Page');
```

然后就修改 webpack.config.js 文件

```javascript
'use stract'
const path = require('path');

module.exports = {
  entry: {
    index: './src/index.js',
    search: './src/search.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  mode: 'production'
}
```

可以看到 dist 目录下出现了 2 个文件`index.js`， `search.js`。

### loader

webpack 只能理解 JavaScript 和 JSON 文件，这是 webpack 开箱可用的自带能力。**loader** 让 webpack 能够去处理其他类型的文件，并将它们转换为有效模块，以供应用程序使用，以及被添加到依赖图中。

例如：

```javascript
const path = require('path');

module.exports = {
  output: {
    filename: 'my-first-webpack.bundle.js',
  },
  module: {
    rules: [{ test: /\.txt$/, use: 'raw-loader' }],
  },
};
```

对一个单独的 module 对象定义了 `rules` 属性，里面包含两个必须属性：`test` 和 `use`。这告诉 webpack 编译器(compiler) 如下信息：

> *“嘿，webpack 编译器，当你碰到「在* `require()`*/*`import` *语句中被解析为 '.txt' 的路径」时，在你对它打包之前，先* **use(使用)** `raw-loader` *转换一下。”*

### 插件(plugin) 

loader 用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。包括：打包优化，资源管理，注入环境变量。

想要使用一个插件，你只需要 `require()` 它，然后把它添加到 `plugins` 数组中。多数插件可以通过选项(option)自定义。你也可以在一个配置文件中因为不同目的而多次使用同一个插件，这时需要通过使用 `new` 操作符来创建一个插件实例。

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const webpack = require('webpack'); // 用于访问内置插件

module.exports = {
  module: {
    rules: [{ test: /\.txt$/, use: 'raw-loader' }],
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
};
```

`html-webpack-plugin` 为应用程序生成一个 HTML 文件，并自动注入所有生成的 bundle。

### 模式(mode) 

通过选择 `development`, `production` 或 `none` 之中的一个，来设置 `mode` 参数，你可以启用 webpack 内置在相应环境下的优化。其默认值为 `production`。

```js
module.exports = {
  mode: 'production',
};
```

| 选项        | 描述                                                         |
| ----------- | ------------------------------------------------------------ |
| development | 设置 process.env.NODE_ENV 的值为 development。开启 NamedChunksPlugin 和 NameMoudlePlugin。 |
| production  | 设置 process.env.NODE_ENV 的值为 production。开启 FlagDependencyUsagePlugin，FlagIncludedChunksPlugin，ModuleConcatenationPlugin，NoEmitOnErrorsPlugin，OccurrenceOrderPlugin，SideEffectsFlagPlugin 和 TerserPlugin。 |
| none        | 不开启任何优化                                               |

