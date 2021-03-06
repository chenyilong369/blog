# 进程和线程

我们首先用两个问题来进入主题：

- 进程内部都有哪些数据？

- 为什么创建进程的成本很高？

## 进程和线程

进程（Process），顾名思义就是正在执行的应用程序，是软件的执行副本。而线程是轻量级的进程。

进程是分配资源的基础单位。而线程很长一段时间被称作轻量级进程（Light Weighted Process），是程序执行的基本单位。

每一种应用，比如游戏，执行后是一个进程。但是游戏内部需要图形渲染、需要网络、需要响应用户操作，这些行为不可以互相阻塞，必须同时进行，这样就设计成线程。

### 资源分配问题

设计进程和线程，操作系统需要思考分配资源。最重要的 3 种资源是：计算资源（CPU）、内存资源和文件资源。在早期的 os 系统中没有线程，3 种资源都分配给进程，多个进程通过分时技术交替执行，进程之间通过管道技术等进行通信。

但是这样做的话，设计者们发现用户（程序员），一个应用往往需要开多个进程，因为应用总是有很多必须要并行做的事情。并行并不是说绝对的同时，而是说需要让这些事情看上去是同时进行的——比如图形渲染和响应用户输入。于是设计者们想到了，进程下面，需要一种程序的执行单位，仅仅被分配 CPU 资源，这就是线程。

### 轻量级进程

线程设计出来后，因为只被分配了计算资源（CPU），因此被称为轻量级进程。被分配的方式，就是由操作系统调度线程。操作系统创建一个进程后，进程的入口程序被分配到了一个主线程执行，这样看上去操作系统是在调度进程，其实是调度进程中的线程。

这种被操作系统直接调度的线程，也称为内核级线程。另外，有的程序语言或者应用，用户（程序员）自己还实现了线程。相当于操作系统调度主线程，主线程的程序用算法实现子线程，这种情况称为用户级线程。

### 分时和调度

每个进程在执行时都会获得操作系统分配的一个时间片段，如果超出这个时间，就会轮到下一个进程（线程）执行。现代操作系统都是直接调度线程，不会调度进程。

#### 分配时间片段

分配过程就如下图所示。

注意，上面的图是以进程为单位演示，如果换成线程，操作系统依旧是这么处理。

### 进程和线程的状态

一个进程（线程）运行的过程，会经历以下 3 个状态：

- 进程（线程）创建后，就开始排队，此时它会处在“就绪”（Ready）状态；

- 当轮到该进程（线程）执行时，会变成“运行”（Running）状态；

- 当一个进程（线程）将操作系统分配的时间片段用完后，会回到“就绪”（Ready）状态。

这里一直用进程(线程）是因为旧的操作系统调度进程，没有线程；现代操作系统调度线程。

有时候一个进程（线程）会等待磁盘读取数据，或者等待打印机响应，此时进程自己会进入“阻塞”（Block）状态。