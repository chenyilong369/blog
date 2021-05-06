# path 模块

在nodejs中，path是个使用频率很高，但却让人又爱又恨的模块。部分因为文档说的不够清晰，部分因为接口的平台差异性。

## 获取路径/文件名/扩展名

- 获取路径：path.dirname(filepath)
- 获取文件名：path.basename(filepath)
- 获取扩展名：path.extname(filepath)

### 获取所在路径

```js
let path = require('path');
let filepath = '/tmp/demo/js/test.js';

// 输出：/tmp/demo/js
console.log(path.dirname(filepath));
```

### 获取文件名

严格意义上来说，path.basename(filepath) 只是输出路径的最后一部分，并不会判断是否是文件名。

但大部分时候，我们可以用它来作为简易的“获取文件名“的方法。

```js
let path = require('path');

// 输出：test.js
console.log( path.basename('/tmp/demo/js/test.js') );

// 输出：test
console.log( path.basename('/tmp/demo/js/test/') );

// 输出：test
console.log( path.basename('/tmp/demo/js/test') );
```

如果只想获取文件名，但是不包括文件扩展呢？可以用上第二个参数。

```js
console.log( path.basename('/tmp/demo/js/test.js', '.js') );
```

### 获取文件扩展名

简单的例子如下：

```javascript
var path = require('path');
var filepath = '/tmp/demo/js/test.js';

// 输出：.js
console.log( path.extname(filepath) );
```

更详细的规则是如下：（假设 path.basename(filepath) === B ）

- 从B的最后一个`.`开始截取，直到最后一个字符。
- 如果B中不存在`.`，或者B的第一个字符就是`.`，那么返回空字符串。

```js
path.extname('index.html');
// Returns: '.html'

path.extname('index.coffee.md');
// Returns: '.md'

path.extname('index.');
// Returns: '.'

path.extname('index');
// Returns: ''

path.extname('.index');
// Returns: ''

path.extname('.index.md');
// Returns: '.md'
```

## 路径组合

- path.join([...paths])
- path.resolve([...paths])

### path.join([...paths])

把`path`拼起来，然后再规格化一下。

例子如下：

```js
let path = require('path');

// 输出 '/foo/bar/baz/asdf'
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');
```

path定义的伪代码如下：

```javascript
module.exports.join = function(){
  var paths = Array.prototye.slice.call(arguments, 0);
  return this.normalize( paths.join('/') );
};
```

### path.resolve([...paths])

你可以想象现在你在shell下面，从左到右运行一遍`cd path`命令，最终获取的绝对路径/文件名，就是这个接口所返回的结果了。

比如 `path.resolve('/foo/bar', './baz')` 可以看成下面命令的结果

```bash
cd /foo/bar
cd ./baz
```

更多对比例子如下：

```js
var path = require('path');

// 假设当前工作路径是 /Users/a/Documents/git-code/nodejs-learning-guide/examples/2016.11.08-node-path

// 输出 /Users/a/Documents/git-code/nodejs-learning-guide/examples/2016.11.08-node-path
console.log( path.resolve('') )

// 输出 /Users/a/Documents/git-code/nodejs-learning-guide/examples/2016.11.08-node-path
console.log( path.resolve('.') )

// 输出 /foo/bar/baz
console.log( path.resolve('/foo/bar', './baz') );

// 输出 /foo/bar/baz
console.log( path.resolve('/foo/bar', './baz/') );

// 输出 /tmp/file
console.log( path.resolve('/foo/bar', '/tmp/file/') );

// 输出 /Users/a/Documents/git-code/nodejs-learning-guide/examples/2016.11.08-node-path/www/js/mod.js
console.log( path.resolve('www', 'js/upload', '../mod.js') );
```

## 路径解析

path.parse(path) 方法会返回一个对象，其属性表示 `path` 的有效元素。 尾部的目录分隔符会被忽略。

## path.normalize(filepath)

- 如果路径为空，返回`.`，相当于当前的工作路径。
- 将对路径中重复的路径分隔符（比如linux下的`/`)合并为一个。
- 对路径中的`.`、`..`进行处理。（类似于shell里的`cd ..`）
- 如果路径最后有`/`，那么保留该`/`。

> In other words, path.normalize is "What is the shortest path I can take that will take me to the same place as the input"

代码示例如下。

```javascript
var path = require('path');

var index = 0;

var compare = function(desc, callback){
  console.log('[用例%d]：%s', ++index, desc);
  callback();
  console.log('\n');
};

compare('路径为空', function(){
  // 输出 .
  console.log( path.normalize('') );
});

compare('路径结尾是否带/', function(){
  // 输出 /tmp/demo/js/upload
  console.log( path.normalize('/tmp/demo/js/upload') );

  // /tmp/demo/js/upload/
  console.log( path.normalize('/tmp/demo/js/upload/') );
});

compare('重复的/', function(){
  // 输出 /tmp/demo/js
  console.log( path.normalize('/tmp/demo//js') );
});

compare('路径带..', function(){
  // 输出 /tmp/demo/js
  console.log( path.normalize('/tmp/demo/js/upload/..') );
});

compare('相对路径', function(){
  // 输出 demo/js/upload/
  console.log( path.normalize('./demo/js/upload/') );

  // 输出 demo/js/upload/
  console.log( path.normalize('demo/js/upload/') );
});

compare('不常用边界', function(){
  // 输出 ..
  console.log( path.normalize('./..') );

  // 输出 ..
  console.log( path.normalize('..') );

  // 输出 ../
  console.log( path.normalize('../') );

  // 输出 /
  console.log( path.normalize('/../') );
  
  // 输出 /
  console.log( path.normalize('/..') );
});
```

源码就放在这了：[传送门]([node/path.js at master · nodejs/node (github.com)](https://github.com/nodejs/node/blob/master/lib/path.js))

```js
normalize(path) {
  validateString(path, 'path');
  const len = path.length;
  if (len === 0)
    return '.';
  let rootEnd = 0;
  let device;
  let isAbsolute = false;
  const code = StringPrototypeCharCodeAt(path, 0);

  // Try to match a root
  if (len === 1) {
    // `path` contains just a single char, exit early to avoid
    // unnecessary work
    return isPosixPathSeparator(code) ? '\\' : path;
  }
  if (isPathSeparator(code)) {
    // Possible UNC root

    // If we started with a separator, we know we at least have an absolute
    // path of some kind (UNC or otherwise)
    isAbsolute = true;

    if (isPathSeparator(StringPrototypeCharCodeAt(path, 1))) {
      // Matched double path separator at beginning
      let j = 2;
      let last = j;
      // Match 1 or more non-path separators
      while (j < len &&
             !isPathSeparator(StringPrototypeCharCodeAt(path, j))) {
        j++;
      }
      if (j < len && j !== last) {
        const firstPart = StringPrototypeSlice(path, last, j);
        // Matched!
        last = j;
        // Match 1 or more path separators
        while (j < len &&
               isPathSeparator(StringPrototypeCharCodeAt(path, j))) {
          j++;
        }
        if (j < len && j !== last) {
          // Matched!
          last = j;
          // Match 1 or more non-path separators
          while (j < len &&
                 !isPathSeparator(StringPrototypeCharCodeAt(path, j))) {
            j++;
          }
          if (j === len) {
            // We matched a UNC root only
            // Return the normalized version of the UNC root since there
            // is nothing left to process
            return `\\\\${firstPart}\\${StringPrototypeSlice(path, last)}\\`;
          }
          if (j !== last) {
            // We matched a UNC root with leftovers
            device =
              `\\\\${firstPart}\\${StringPrototypeSlice(path, last, j)}`;
            rootEnd = j;
          }
        }
      }
    } else {
      rootEnd = 1;
    }
  } else if (isWindowsDeviceRoot(code) &&
             StringPrototypeCharCodeAt(path, 1) === CHAR_COLON) {
    // Possible device root
    device = StringPrototypeSlice(path, 0, 2);
    rootEnd = 2;
    if (len > 2 && isPathSeparator(StringPrototypeCharCodeAt(path, 2))) {
      // Treat separator following drive name as an absolute path
      // indicator
      isAbsolute = true;
      rootEnd = 3;
    }
  }

  let tail = rootEnd < len ?
    normalizeString(StringPrototypeSlice(path, rootEnd),
                    !isAbsolute, '\\', isPathSeparator) :
    '';
  if (tail.length === 0 && !isAbsolute)
    tail = '.';
  if (tail.length > 0 &&
      isPathSeparator(StringPrototypeCharCodeAt(path, len - 1)))
    tail += '\\';
  if (device === undefined) {
    return isAbsolute ? `\\${tail}` : tail;
  }
  return isAbsolute ? `${device}\\${tail}` : `${device}${tail}`;
}
```

## 文件路径分解/组合

- path.format(pathObject)：将pathObject的root、dir、base、name、ext属性，按照一定的规则，组合成一个文件路径。
- path.parse(filepath)：path.format()方法的反向操作。

我们先来看看官网对相关属性的说明。

首先是linux下

```bash
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
"  /    home/user/dir / file  .txt "
└──────┴──────────────┴──────┴─────┘
(all spaces in the "" line should be ignored -- they are purely for formatting)
```

然后是windows下

```bash
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
" C:\      path\dir   \ file  .txt "
└──────┴──────────────┴──────┴─────┘
(all spaces in the "" line should be ignored -- they are purely for formatting)
```

### path.format(pathObject)

阅读相关API文档说明后发现，path.format(pathObject)中，pathObject的配置属性是可以进一步精简的。

根据接口的描述来看，以下两者是等价的。

- `root` vs `dir`：两者可以互相替换，区别在于，路径拼接时，`root`后不会自动加`/`，而`dir`会。
- `base` vs `name+ext`：两者可以互相替换。

```js
var path = require('path');

var p1 = path.format({
  root: '/tmp/', 
  base: 'hello.js'
});
console.log( p1 ); // 输出 /tmp/hello.js

var p2 = path.format({
  dir: '/tmp', 
  name: 'hello',
  ext: '.js'
});
console.log( p2 );  // 输出 /tmp/hello.js
```

### path.parse(filepath)

path.format(pathObject) 的反向操作。

四个属性，对于使用者是挺便利的，不过path.format(pathObject) 中也是四个配置属性，就有点容易搞混。

```js
path.parse('/home/user/dir/file.txt')
// returns
// {
//    root : "/",
//    dir : "/home/user/dir",
//    base : "file.txt",
//    ext : ".txt",
//    name : "file"
// }
```

## 获取相对路径

接口：path.relative(from, to)

描述：从`from`路径，到`to`路径的相对路径。

边界：

- 如果`from`、`to`指向同个路径，那么，返回空字符串。
- 如果`from`、`to`中任一者为空，那么，返回当前工作路径。

上例子：

```javascript
var path = require('path');

var p1 = path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb');
console.log(p1);  // 输出 "../../impl/bbb"

var p2 = path.relative('/data/demo', '/data/demo');
console.log(p2);  // 输出 ""

var p3 = path.relative('/data/demo', '');
console.log(p3);
```

## 平台相关接口/属性

以下属性、接口，都跟平台的具体实现相关。也就是说，同样的属性、接口，在不同平台上的表现不同。

- path.posix：path相关属性、接口的linux实现。
- path.win32：path相关属性、接口的win32实现。
- path.sep：路径分隔符。在linux上是`/`，在windows上是`\`。
- path.delimiter：path设置的分割符。linux上是`:`，windows上是`;`。

注意，当使用 path.win32 相关接口时，参数同样可以使用`/`做分隔符，但接口返回值的分割符只会是`\`。

直接来例子更直观。

```js
> path.win32.join('/tmp', 'fuck')
'\\tmp\\fuck'
> path.win32.sep
'\\'
> path.win32.join('\tmp', 'demo')
'\\tmp\\demo'
> path.win32.join('/tmp', 'demo')
'\\tmp\\demo'
```

### path.delimiter

linux系统例子：

```bash
console.log(process.env.PATH)
// '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin'

process.env.PATH.split(path.delimiter)
// returns ['/usr/bin', '/bin', '/usr/sbin', '/sbin', '/usr/local/bin']
```

windows系统例子：

```bash
console.log(process.env.PATH)
// 'C:\Windows\system32;C:\Windows;C:\Program Files\node\'

process.env.PATH.split(path.delimiter)
// returns ['C:\\Windows\\system32', 'C:\\Windows', 'C:\\Program Files\\node\\']
```

