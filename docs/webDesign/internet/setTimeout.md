# setTimeout

setTimeout() 方法用于在指定的毫秒数后调用函数或计算表达式。

那么，浏览器怎么处理它呢？

由于消息队列中的任务是按照顺序执行的，所以为了保证回调函数能在指定时间内执行，不能将定时器的回调函数直接添加到消息队列中。

## **用法**

```js
var timeoutID = setTimeout(function[, delay, arg1, arg2, ...]);  
var timeoutID = setTimeout(function[, delay]);  
var timeoutID = setTimeout(code[, delay]); 
```

- 第一个参数为函数或可执行的字符串(比如alert('test'),此法不建议使用)
- 第二个参数为延迟毫秒数，可选的，默认值为0.
- 第三个及后面的参数为函数的入参。
- setTimeout 的返回值是一个数字，这个值为timeoutID，可以用于取消该定时器。

## 实现

在 Chrome 中除了正常使用的消息队列之外，还有另外一个消息队列，这个队列中维护了需要延迟执行的任务列表，包括了定时器和 Chromium 内部一些需要延迟执行的任务。

定义如下：

```c++
DelayedIncomingQueue delayed_incoming_queue;
```

当通过 JS 调用 setTimeout 设置回调函数的时候，渲染进程将会创建一个回调任务，包含了回调函数 showName、当前发起时间、延迟执行时间：

```c++
struct DelayTask{
  int64 id；
  CallBackFunction cbf;
  int start_time;
  int delay_time;
};
DelayTask timerTask;
timerTask.cbf = showName;
timerTask.start_time = getCurrentTime(); //获取当前时间
timerTask.delay_time = 200;//设置延迟执行时间
```

创建好回调函数后，将其添加到延迟执行队列中。

```c++
delayed_incoming_queue.push(timerTask)；
```

那这个回调任务，什么时候会被执行呢？

浏览器中有个函数是专门用来处理延迟执行任务的，暂且称为ProcessDelayTask.

```c++
void ProcessTimerTask(){  
  //从delayed_incoming_queue中取出已经到期的定时器任务  
  //依次执行这些任务  
}  
TaskQueue task_queue；  
void ProcessTask();  
bool keep_running = true;  
void MainTherad(){  
  for(;;){  
    //执行消息队列中的任务  
    Task task = task_queue.takeTask();  
    ProcessTask(task);  
    //执行延迟队列中的任务  
    ProcessDelayTask()  
    if(!keep_running) //如果设置了退出标志，那么直接退出线程循环  
        break;   
  }  
} 
```

当浏览器处理完消息队列中的一个任务之后，就会开始执行 ProcessDelayTask 函数。ProcessDelayTask 函数会根据发起时间和延迟时间计算出到期的任务，然后依次执行这些到期的任务。等到期的任务执行完成之后，再继续下一个循环过程。这样定时器就实现了，从这个过程也可以明显看出，定时器并不一定是准时延后执行的。

## 注意事项

1. **如果当前任务执行时间过久，会延迟到期定时器任务的执行**

我们来看看下面这个代码

```js
const startTime = Date.now()
function bar() {  
    console.log('jsChen')  
    const endTime = Date.now()  
    console.log('cost time',endTime - startTime)  
}  
function foo() {  
    setTimeout(bar, 0);  
    for (let i = 0; i < 5000; i++) {  
        let i = 5+8+8+8  
        console.log(i)  
    }  
}  
foo() 
```

<img :src="$withBase('/setTimeout01.png')" alt="setTimeout01"/>

从结果可以看到，执行 foo 函数所消耗的时长是 271 毫秒，这也就意味着通过 setTimeout 设置的任务被推迟了 271 毫秒才执行，而设置 setTimeout 的回调延迟时间是 0。

2. **使用 setTimeout 设置的回调函数中的 this 环境不是指向回调函数**

依旧看一段代码

```js
var name = 1
var MyObj = {  
  name: 2,  
  test:1,  
  showName: function(){  
    console.log(this.name,this.test);  
  }  
}  
setTimeout(MyObj.showName,1000)  
MyObj.showName()  
```

会怎么输出呢，先输出 2 1,再输出 1 undefined。

在 setTimeout 中，入参是MyObj.showName，这里是把这个值传了进去，类似于

```js
const fn = MyObj.showName
setTimeout(fn, 1000)
```

这样看，在setTimeout里面，当执行到的时候，实际上就是在window下执行fn，此时的this，就指向了window,而不是原来的函数。

3. **setTimeout 存在嵌套调用问题**

如果 setTimeout 存在嵌套调用，调用超过5次后，系统会设置最短执行时间间隔为 4 毫秒。我们可以测试一下：

```js
let startTime = Date.now()  
function cb() {   
  const endTime = Date.now()  
  console.log('cost time',endTime - startTime)  
  startTimestartTime = startTime  
  setTimeout(cb, 0);   
}  
setTimeout(cb, 0); 
```

<img :src="$withBase('/setTimeout02.png')" alt="setTimeout02"/>

可以看出，前面五次调用的时间间隔比较小，嵌套调用超过五次以上，后面每次的调用最小时间间隔是 4 毫秒（会有误差）。

在 Chrome 中，定时器被嵌套调用 5 次以上，系统会判断该函数方法被阻塞了，如果定时器的调用时间间隔小于 4 毫秒，那么浏览器会将每次调用的时间间隔设置为 4 毫秒。

```c++
static const int kMaxTimerNestingLevel = 5;  
// Chromium uses a minimum timer interval of 4ms. We'd like to go  
// lower; however, there are poorly coded websites out there which do  
// create CPU-spinning loops.  Using 4ms prevents the CPU from  
// spinning too busily and provides a balance between CPU spinning and  
// the smallest possible interval timer.  
static constexpr base::TimeDelta kMinimumInterval = base::TimeDelta::FromMilliseconds(4);
```

所以实时性的事件不适合 setTimeout。

4. **未激活的页面，setTimeout 执行最小间隔是 1000 毫秒**

如果标签不是当前的激活标签，那么定时器最小的时间间隔是 1000 毫秒，目的是为了优化后台页面的加载损耗以及降低耗电量。

5. **延时执行时间有最大值**

Chrome、Safari、Firefox 都是以 32 个 bit 来存储延时值的，32bit 最大只能存放的数字是 2147483647 毫秒，这就意味着，如果 setTimeout 设置的延迟值大于 2147483647 毫秒（大约 24.8 天）时就会溢出，这导致定时器会被立即执行。

下面我们尝试一下超过最大值会发生什么。

```js
let startTime = Date.now()  
function foo(){  
  const endTime = Date.now()  
  console.log('cost time',endTime - startTime)  
  console.log("test")  
}  
var timerID = setTimeout(foo,3333333333);//会被立即调用执行
console.log(111)
```

<img :src="$withBase('/setTimeout03.png')" alt="setTimeout03"/>

定时器会被立即执行。

