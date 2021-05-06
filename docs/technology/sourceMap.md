# 正确使用 SourceMap

## 什么是 Source Map
在前端开发过程中，通常我们编写的源代码会经过多重处理（编译、封装、压缩等），最后形成产物代码。这些代码由于被压缩， 可读性降低。这时候就需要一种在调试时将产物代码显示回源代码的功能，source map 就是实现这一目标的工具。

source-map 的基本原理是，在编译处理的过程中，在生成产物代码的同时生成产物代码中被转换的部分与源代码中相应部分的映射关系表。

对于同一个源文件，根据不同的目标，可以生成不同效果的 source map。它们在构建速度、质量（反解代码与源代码的接近程度以及调试时行号列号等辅助信息的对应情况）、访问方式（在产物文件中或是单独生成 source map 文件）和文件大小等方面各不相同。在开发环境和生产环境下，我们对于 source map 功能的期望也有所不同：

- 在开发环境中，通常我们关注的是构建速度快，质量高，以便于提升开发效率，而不关注生成文件的大小和访问方式。

- 在生产环境中，通常我们更关注是否需要提供线上 source map , 生成的文件大小和访问方式是否会对页面性能造成影响等，其次才是质量和构建速度。

## Webpack 中的 source map 预设

在 Webpack 中，通过设置 devtool 来选择 source map 的预设类型，文档中共有 20 余种 source map 的预设（注意：其中部分预设实际效果与其他预设相同，即页面表格中空白行条目）可供选择，这些预设通常包含了 "eval" "cheap" "module" "inline" "hidden" "nosource" "source-map" 等关键字的组合，这些关键字的具体逻辑如下：

```js
webpack/lib/WebpackOptionsApply.js:232 
if (options.devtool.includes("source-map")) { 
  const hidden = options.devtool.includes("hidden"); 
  const inline = options.devtool.includes("inline"); 
  const evalWrapped = options.devtool.includes("eval"); 
  const cheap = options.devtool.includes("cheap"); 
  const moduleMaps = options.devtool.includes("module"); 
  const noSources = options.devtool.includes("nosources"); 

  const Plugin = evalWrapped 
    ? require("./EvalSourceMapDevToolPlugin") 
    : require("./SourceMapDevToolPlugin"); 

  new Plugin({ 
    filename: inline ? null : options.output.sourceMapFilename, 
    moduleFilenameTemplate: options.output.devtoolModuleFilenameTemplate, 
    fallbackModuleFilenameTemplate: 
      options.output.devtoolFallbackModuleFilenameTemplate, 
    append: hidden ? false : undefined, 
    module: moduleMaps ? true : cheap ? false : true, 
    columns: cheap ? false : true, 
    noSources: noSources, 
    namespace: options.output.devtoolNamespace 
  }).apply(compiler); 
} else if (options.devtool.includes("eval")) { 
  const EvalDevToolModulePlugin = require("./EvalDevToolModulePlugin"); 
  new EvalDevToolModulePlugin({ 
    moduleFilenameTemplate: options.output.devtoolModuleFilenameTemplate, 
    namespace: options.output.devtoolNamespace 
  }).apply(compiler); 
}

devtool 的值匹配并非精确匹配，某个关键字只要包含在赋值中即可获得匹配，例如：'foo-eval-bar' 等同于 'eval'，'cheapfoo-source-map' 等同于 'cheap-source-map'。

### Source Map 名称关键字

各字段的作用各不相同，为了便于记忆，我们在这里简单整理下这些关键字的作用：

- **false**：即不开启 source map 功能，其他不符合上述规则的赋值也等价于 false。
- **eval**：是指在编译器中使用 EvalDevToolModulePlugin 作为 source map 的处理插件。
- **[xxx-...]source-map**：根据 devtool 对应值中是否有 **eval** 关键字来决定使用 EvalSourceMapDevToolPlugin 或 SourceMapDevToolPlugin 作为 source map 的处理插件，其余关键字则决定传入到插件的相关字段赋值。
- **inline**：决定是否传入插件的 filename 参数，作用是决定单独生成 source map 文件还是在行内显示，**该参数在 eval- 参数存在时无效**。
- **hidden**：决定传入插件 append 的赋值，作用是判断是否添加 SourceMappingURL 的注释，**该参数在 eval- 参数存在时无效**。
- **module**：为 true 时传入插件的 module 为 true ，作用是为加载器（Loaders）生成 source map。
- **cheap**：这个关键字有两处作用。首先，当 module 为 false 时，它决定插件 module 参数的最终取值，最终取值与 cheap 相反。其次，它决定插件 columns 参数的取值，作用是决定生成的 source map 中是否包含列信息，在不包含列信息的情况下，调试时只能定位到指定代码所在的行而定位不到所在的列。
- **nosource**：nosource 决定了插件中 noSource 变量的取值，作用是决定生成的 source map 中是否包含源代码信息，不包含源码情况下只能显示调用堆栈信息。

### Source Map 处理插件
从上面的规则中我们还可以看到，根据不同规则，实际上 Webpack 是从三种插件中选择其一作为 source map 的处理插件。

- EvalDevToolModulePlugin：模块代码后添加 sourceURL=webpack:///+ 模块引用路径，不生成 source map 内容，模块产物代码通过 eval() 封装。

- EvalSourceMapDevToolPlugin：生成 base64 格式的 source map 并附加在模块代码之后， source map 后添加 sourceURL=webpack:///+ 模块引用路径，不单独生成文件，模块产物代码通过 eval() 封装。

- SourceMapDevToolPlugin：生成单独的 .map 文件，模块产物代码不通过 eval 封装。

### 不同预设的结果对比

- 质量：生成的 source map 的质量分为 5 个级别，对应的调试便捷性依次降低：源代码 > 缺少列信息的源代码 > loader 转换后的代码 > 生成后的产物代码 > 无法显示代码（具体参见下面的不同质量的源码示例小节）。对应对质量产生影响的预设关键字优先级为 souce-map = eval-source-map > cheap-module- > cheap- > eval = none > nosource-。

- 构建的速度：再次构建速度都要显著快于初次构建速度。不同环境下关注的速度也不同：
  - 在开发环境下：一直开着 devServer，再次构建的速度对我们的效率影响远大于初次构建的速度。从结果中可以看到，eval- 对应的 EvalSourceMapDevToolPlugin 整体要快于不带 eval- 的 SourceMapDevToolPlugin。尤其在质量最佳的配置下，eval-source-map 的再次构建速度要远快于其他几种。而同样插件配置下，不同质量配置与构建速度成反比，但差异程度有限，更多是看具体项目的大小而定。
  - 在生产环境下：通常不会开启再次构建，因此相比再次构建，初次构建的速度更值得关注，甚至对构建速度以外因素的考虑要优先于对构建速度的考虑，这一部分我们在之后的构建优化的课程里会再次讨论到。

- 包的大小和生成方式：在开发环境下我们并不需要关注这些因素，正如在开发环境下也通常不考虑使用分包等优化方式。我们需要关注速度和质量来保证我们的高效开发体验，而其他的部分则是在生产环境下需要考虑的问题。

