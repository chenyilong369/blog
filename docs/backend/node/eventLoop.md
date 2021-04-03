# node 事件循环

首先先放张流程图：

<img :src="$withBase('/node/eventLoop01.png')" alt="eventLoop01"/>

## 三大关键阶段

- 执行 `定时器回调` 的阶段。检查定时器，如果到了时间，就执行回调。这些定时器就是setTimeout、setInterval。这个阶段暂且叫它`timer`。

- 轮询(英文叫`poll`)阶段。因为在node代码中难免会有异步操作，比如文件I/O，网络I/O等等，那么当这些异步操作做完了，就会来通知JS主线程，怎么通知呢？就是通过'data'、'connect'等事件使得事件循环到达 `poll` 阶段。到达了这个阶段后:

  如果当前已经存在定时器，而且有定时器到时间了，拿出来执行，eventLoop 将回到timer阶段。

  如果没有定时器, 会去看回调函数队列。

  - 如果队列`不为空`，拿出队列中的方法依次执行
  - 如果队列为空，检查是否有 setImmdiate 的回调
    - 有则前往`check阶段`(下面会说)
    - `没有则继续等待`，相当于阻塞了一段时间(阻塞时间是有上限的), 等待 callback 函数加入队列，加入后会立刻执行。一段时间后`自动进入 check 阶段`。

- check 阶段。这是一个比较简单的阶段，直接执行` setImmdiate` 的回调。

## 完善

上面的事件循环暂不完善。

当第 1 阶段结束后，可能并不会立即等待到异步事件的响应，这时候 nodejs 会进入到 `I/O异常的回调阶段`。

在 check 阶段结束后还会进入到 `关闭事件的回调阶段`。如果一个 socket 或句柄（handle）被突然关闭，例如 socket.destroy()， 'close' 事件的回调就会在这个阶段执行。

于是 nodejs 的 eventLoop 分为下面的几个阶段:

1. timer 阶段
2. I/O 异常回调阶段
3. 空闲、预备状态(第2阶段结束，poll 未触发之前)
4. poll 阶段
5. check 阶段
6. 关闭事件的回调阶段

## 例子

```js
setTimeout(()=>{
    console.log('timer1')
    Promise.resolve().then(function() {
        console.log('promise1')
    })
}, 0)
setTimeout(()=>{
    console.log('timer2')
    Promise.resolve().then(function() {
        console.log('promise2')
    })
}, 0)
```

上面代码会输出：

```
timer1
promise1
time2
promise2
```

## 与浏览器的区别

两者最主要的区别在于浏览器中的微任务是在`每个相应的宏任务`中执行的，而nodejs中的微任务是在`不同阶段之间`执行的。

## process.nextTick

process.nextTick 是一个独立于 eventLoop 的任务队列。

在每一个 eventLoop 阶段完成后会去检查这个队列，如果里面有任务，会让这部分任务`优先于微任务`执行。