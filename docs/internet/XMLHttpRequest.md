# XMLHttpRequest

XMLHttpRequest 提供了从 Web 服务器获取数据的能力，如果你想要更新某条数据，只需要通过 XMLHttpRequest 请求服务器提供的接口，就可以获取到服务器的数据，然后再操作 DOM 来更新页面内容，整个过程只需要更新网页的一部分就可以了。

## 同步回调和异步回调

我们先了解一下回调函数，将一个函数作为参数传递给另外一个函数，那作为参数的这个函数就是回调函数。

可以看个小例子：

```js
let callback = function(){
    console.log('i am do homework')
}
function doWork(cb) {
    console.log('start do work')
    cb()
    console.log('end do work')
}
doWork(callback)
```

可以看到，在函数 doWork 中，callback 就是回调函数。

上面的回调方法有个特点，就是回调函数 callback 是在主函数 doWork 返回之前执行的。这个回调过程称为**同步回调**。

接下来看看异步回调的例子：

```js
let callback = function() {
    console.log("i am chenyilong369")
}
function whatName(cb) {
    console.log('what your name')
    setTimeout(cb, 100)
    console.log('please tell me')
}
whatName(callback)
```

这时 callback 是在 whatName 执行结束后才执行，并非在 whatName 内部被调用。这个回调过程称为**异步回调**。

有两种方式用于实现异步调用：

- 把异步函数做成一个任务，添加到信息队列尾部；
- 把异步函数添加到微任务队列中，在当前任务的末尾处执行微任务。

## 运作机制

大致画了一张参考图：

<img :src="$withBase('/XML01.png')" alt="XML01"/>

首先简要的讲解一下 XMLHttpRequest 的用法。

```js
function GetWebData(URL){
    /**
     * 1:新建XMLHttpRequest请求对象
     */
    let xhr = new XMLHttpRequest()

    /**
     * 2:注册相关事件回调处理函数 
     */
    xhr.onreadystatechange = function () {
        switch(xhr.readyState){
          case 0: //请求未初始化
            console.log("请求未初始化")
            break;
          case 1://OPENED
            console.log("OPENED")
            break;
          case 2://HEADERS_RECEIVED
            console.log("HEADERS_RECEIVED")
            break;
          case 3://LOADING  
            console.log("LOADING")
            break;
          case 4://DONE
            if(this.status == 200||this.status == 304){
                console.log(this.responseText);
                }
            console.log("DONE")
            break;
        }
    }

    xhr.ontimeout = function(e) { console.log('ontimeout') }
    xhr.onerror = function(e) { console.log('onerror') }

    /**
     * 3:打开请求
     */
    xhr.open('Get', URL, true);//创建一个Get请求,采用异步


    /**
     * 4:配置参数
     */
    xhr.timeout = 3000 //设置xhr请求的超时时间
    xhr.responseType = "text" //设置响应返回的数据格式
    xhr.setRequestHeader("X_TEST","time.geekbang")

    /**
     * 5:发送请求
     */
    xhr.send();
}
```

首先要**创建一个 XMLHttpRequest 对象（变量名为 xhr）**，用于执行实际的网络请求操作。

然后对 xhr 对象**注册回调函数**，XMLHttpRequest 的回调函数主要有下面几种：

- ontimeout，用来监控超时请求，如果后台请求超时了，该函数会被调用；
- onerror，用来监控出错信息，如果后台请求出错了，该函数会被调用；
- onreadystatechange，用来监控后台请求过程中的状态，比如可以监控到 HTTP 头加载完成的消息、HTTP 响应体消息以及数据加载完成的消息等。

然后**配置基础的请求信息**，通过 open 接口配置一些基础的请求信息，包括请求的地址、请求方法（是 get 还是 post）和请求方式（同步还是异步请求）。以及通过 xhr 内部属性类配置一些其他可选的请求信息。

还可以通过xhr.responseType = "text"来配置服务器返回的格式，将服务器返回的数据自动转换为自己想要的格式，如果将 responseType 的值设置为 json，那么系统会自动将服务器返回的数据转换为 JavaScript 对象格式。

<img :src="$withBase('/XML02.png')" alt="XML02"/>

最后**发起请求**，一切准备就绪之后，就可以调用xhr.send来发起网络请求了。

渲染进程会将请求发送给网络进程，然后网络进程负责资源的下载，等网络进程接收到数据之后，就会利用 IPC 来通知渲染进程；渲染进程接收到消息之后，会将 xhr 的回调函数封装成任务并添加到消息队列中，等主线程循环系统执行到该任务的时候，就会根据相关的状态来调用对应的回调函数。

- 如果网络请求出错了，就会执行 xhr.onerror；
- 如果超时了，就会执行 xhr.ontimeout；
- 如果是正常的数据接收，就会执行 onreadystatechange 来反馈相应的状态。