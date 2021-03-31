# 网络编程

## 构建 TCP 服务

TCP 全名为传输控制协议，在 OSI 模型（由七层组成，分别对应物理层、数据链路层、网络层、传输层、会话层、表示层、应用层）中属于传输层协议。许多应用层协议都是基于 TCP 架构的，比如 HTTP、SMTP、IMAP 等。

TCP 是面向连接的协议，最显著的就是传输之前需要进行 3 次握手形成会话。

### 创建服务端

```js
let net = require('net')

let server = net.createServer((socket) => {
  socket.on('data', (data) => {
    socket.write("hello")
  })

  socket.on('end', () => {
    console.log('连接断开')
  })

  socket.write("实例\n")
})

server.listen(8125, () => {
  console.log('server bound')
})

```

首先我们通过 `net.createServer(listener)`创建一个 TCP 服务器。`listener`是连接事件 `connection`的侦听器。

当然也可以采取下面写法：

```js
let net = require('net')

let server = net.createServer()

server.on('connection', (socket) => {
  socket.on('data', (data) => {
    socket.write('hello')
  })

  socket.on('end', () => {
    console.log('连接断开')
  })

  socket.write('实例\n')
})

server.listen(8125, () => {
  console.log('server bound')
})
```

然后我们编写客户端：

```js
let net = require("net")

let client = net.connect({port: 8125}, () => {
  console.log('client connected')
  client.write('world! \n')
});

client.on('data', (data) => {
  console.log(data.toString())
  client.end()
})

client.on('end', () => { 
  console.log('client disconnected')
})
```

可以看到控制台的输出结果：

```
PS E:\html,js,css\es6\tcp> node .\client.js
client connected
实例

hello
client disconnected
```

显然，客户端已经通过 TCP 服务器拿取到了数据。那么下面就细讲一下 TCP 服务的一些基本事件（基础啦）。

### TCP 服务的事件

首先来了解一下服务器的一些基本事件：

- listening: `server.listen(port, listeningListener)`，通过 `listen`方法的第二个参数传入。

- connection：每个客户端套接字连接到服务器端时触发，简洁写法为通过 net.createServer()，最后一个参数传递。
- close：当服务器关闭时触发（调用 `server.close()`）

- error：当服务器发生异常时，将会触发该事件。

连接事件：

服务器可以与多个客户端相连，每个连接都是典型的可读可写 Stream 对象。

- data：当一端调用 write() 来发送数据时，另一端会触发 data 事件，事件传递的数据就是 write() 发送的数据。
- end：当连接中的任意一端发送了 FIN 数据时，将会触发该事件
- connect：用于客户端，当与服务器连接成功后会触发。
- drain：当任意一端调用 write() 发送数据时

- error：当异常发生时，触发该事件
- close：当套接字完全关闭时，触发该事件
- timeout：当一定时间后连接不再活跃时，该事件就会被触发，通知用户当前该连接已经被闲置了。

同时值得注意的是，由于 TCP  连接是可读可写的 Stream 对象，可以利用 pipe() 方法实现管道操作，下面修改一下上面写过的服务器：

```js
let net = require('net')

let server = net.createServer()

server.on('connection', (socket) => {
  socket.write('Echo\n')
  socket.pipe(socket)
})

server.listen(8125, () => {
  console.log('server bound')
})

```

我们运行客户端，可以得到如下的结果：

```
PS E:\html,js,css\es6\tcp> node .\client.js
client connected
Echo

world!

client disconnected
```

TCP 对网络中的小数据包做了一次优化（Nagle）算法，如果每次只发送一个字节的内容而不优化，网络中将充满只有极少数有效数据的数据包，这会十分浪费网络资源。Nagle 算法要求缓冲区的数据达到一定数量或者一定时间后才将其发出，小数据包会被 Nagle 合并，以此来优化网络。但是这样会导致数据可能延迟发送。

Node 中，TCP 默认开启 Nagle 算法，可以调用 `socket.setNoDelay(true)` 去掉 Nagle 算法，使得 `write()` 可以立即发送数据到网络中。

这可能会引发一个小问题，当服务器发送多个小数据包时（write()），接收端可能会将多个小数据包合并，然后只触发一次 data 事件。

