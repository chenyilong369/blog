# 缓存优化

缓存可以减少网络 IO 消耗，提高访问速度。浏览器缓存是一种操作简单、效果显著的前端性能优化手段。

很多时候，大家倾向于将浏览器缓存简单地理解为“HTTP 缓存”。但事实上，浏览器缓存机制有四个方面，它们按照获取资源时请求的优先级依次排列如下：

1. Memory Cache
2. Service Worker Cache
3. HTTP Cache
4. Push Cache

![image-20210418222057968](C:\Users\陈怿龙\AppData\Roaming\Typora\typora-user-images\image-20210418222057968.png)

形如“（from xxx）”这样的描述对应的资源，这些资源就是我们通过缓存获取到的。其中，“from memory cache”对标到 Memory Cache 类型，“from ServiceWorker”对标到 Service Worker Cache 类型。至于 Push Cache，这个比较特殊，是 HTTP2 的新特性。

## HTTP 缓存

HTTP 缓存是我们日常开发中最为熟悉的一种缓存机制。它又分为**强缓存**和**协商缓存**。优先级较高的是强缓存，在命中强缓存失败的情况下，才会走协商缓存。

### 强缓存的特征

强缓存是利用 http 头中的 Expires 和 Cache-Control 两个字段来控制的。强缓存中，当请求再次发出时，浏览器会根据其中的 expires 和 cache-control 判断目标资源是否“命中”强缓存，若命中则直接从缓存中获取资源，**不会再与服务端发生通信。**

命中强缓存的情况下，返回的 HTTP 状态码为 200 。

### 强缓存的实现：从 expires 到 cache-control

实现强缓存，过去我们一直用 `expires`。
当服务器返回响应时，在 Response Headers 中将过期时间写入 expires 字段。

```
expires: Wed, 11 Sep 2020 16:12:18 GMT
```

可以看到，expires 是一个时间戳，接下来如果我们试图再次向服务器请求资源，浏览器就会先对比本地时间和 expires 的时间戳，如果本地时间小于 expires 设定的过期时间，那么就直接去缓存中取这个资源。由于时间戳是服务器来定义的，而本地时间的取值却来自客户端，因此 expires 的工作机制对客户端时间与服务器时间之间的一致性提出了极高的要求，若服务器与客户端存在时差，将带来意料之外的结果。

expires 允许我们通过**绝对的时间戳**来控制缓存过期时间，相应地，`Cache-Control` 中的`max-age` 字段也允许我们通过设定**相对的时间长度**来达到同样的目的。在 HTTP1.1 标准试图将缓存相关配置收敛进 `Cache-Control` 这样的大背景下， `max-age`可以视作是对 expires 能力的补位/替换。在当下的前端实践里，我们普遍会倾向于使用`max-age`。

```js
cache-control: max-age=31536000
```

如大家所见，在 Cache-Control 中，我们通过 `max-age` 来控制资源的有效期。max-age 不是一个时间戳，而是一个时间长度。在本例中，max-age 是 31536000 秒，它意味着该资源在 31536000 秒以内都是有效的。

max-age 是一个相对时间，这就意味着它有能力规避掉 expires 可能会带来的时差问题：max-age 机制下，资源的过期判定不再受服务器时间戳的限制。客户端会记录请求到资源的时间点，以此作为相对时间的起点，从而确保参与计算的两个时间节点（起始时间和当前时间）都来源于客户端，由此便能够实现更加精准的判断。

**Cache-Control 的 max-age 配置项相对于 expires 的优先级更高。当 Cache-Control 与 expires 同时出现时，我们以 Cache-Control 为准。**

### Cache-Control 应用分析

如下的用法也非常常见：

```
cache-control: max-age=3600, s-maxage=31536000
```

**s-maxage 优先级高于 max-age，两者同时出现时，优先考虑 s-maxage。如果 s-maxage 未过期，则向代理服务器请求其缓存内容。**

但在依赖各种**代理**的大型架构中，我们不得不考虑**代理服务器**的缓存问题。s-maxage 就是用于表示 cache 服务器上（比如 cache CDN）的缓存的有效时间的，并只对 public 缓存有效。（客户端只考虑 max-age）

#### public 与 private

public 与 private 是针对资源是否能够被代理服务缓存而存在的一组对立概念。

如果我们为资源设置了 public，那么它既可以被浏览器缓存，也可以被代理服务器缓存；如果我们设置了 private，则该资源只能被浏览器缓存。private 为**默认值**。

#### no-store与no-cache

no-cache 绕开了浏览器：我们为资源设置了 no-cache 后，每一次发起请求都不会再去询问浏览器的缓存情况，而是直接向服务端去确认该资源是否过期。

no-store 比较绝情，顾名思义就是不使用任何缓存策略。在 no-cache 的基础上，它连服务端的缓存确认也绕开了，只允许你直接向服务端发送请求、并下载完整的响应。

### 协商缓存

协商缓存依赖于服务端与浏览器之间的通信。

协商缓存机制下，浏览器需要向服务器去询问缓存的相关信息，进而判断是重新发起请求、下载完整的响应，还是从本地获取缓存的资源。

如果服务端提示缓存资源未改动（Not Modified），资源会被**重定向**到浏览器缓存，**这种情况下网络请求对应的状态码是 304**。

### 协商缓存的实现：从 Last-Modified 到 Etag

Last-Modified 是一个时间戳，如果我们启用了协商缓存，它会在首次请求时随着 Response Headers 返回：

```
Last-Modified: Fri, 27 Oct 2020 06:35:57 GMT
```

随后我们每次请求时，会带上一个叫 If-Modified-Since 的时间戳字段，它的值正是上一次 response 返回给它的 last-modified 值：

```
If-Modified-Since: Fri, 27 Oct 2020 06:35:57 GMT
```

服务器接收到这个时间戳后，会比对该时间戳和资源在服务器上的最后修改时间是否一致，从而判断资源是否发生了变化。如果发生了变化，就会返回一个完整的响应内容，并在 Response Headers 中添加新的 Last-Modified 值；否则，返回如上图的 304 响应，Response Headers 不会再添加 Last-Modified 字段。

使用 Last-Modified 存在一些弊端，这其中最常见的就是这样两个场景：

- 我们编辑了文件，但文件的内容没有改变。服务端并不清楚我们是否真正改变了文件，它仍然通过最后编辑时间进行判断。因此这个资源在再次被请求时，会被当做新资源，进而引发一次完整的响应——不该重新请求的时候，也会重新请求。
- 当我们修改文件的速度过快时（比如花了 100ms 完成了改动），由于 If-Modified-Since 只能检查到以秒为最小计量单位的时间差，所以它是感知不到这个改动的——该重新请求的时候，反而没有重新请求了。

这两个场景其实指向了同一个 bug——服务器并没有正确感知文件的变化。为了解决这样的问题，Etag 作为 Last-Modified 的补充出现了。

Etag 是由服务器为每个资源生成的唯一的**标识字符串**，这个标识字符串是基于文件内容编码的，只要文件内容不同，它们对应的 Etag 就是不同的，反之亦然。因此 Etag 能够精准地感知文件的变化。

Etag 和 Last-Modified 类似，当首次请求时，我们会在响应头里获取到一个最初的标识符字符串。

```
ETag: W/"2a3b-1602480f459"
```

那么下一次请求时，请求头里就会带上一个值相同的、名为 if-None-Match 的字符串供服务端比对了：

```
If-None-Match: W/"2a3b-1602480f459"
```

Etag 的生成过程需要服务器额外付出开销，会影响服务端的性能，这是它的弊端。

 **Etag 在感知文件变化上比 Last-Modified 更加准确，优先级也更高。当 Etag 和 Last-Modified 同时存在时，以 Etag 为准。**

## HTTP 缓存决策指南

Chrome 官方给出的这张流程图：

![image-20210418223313252](C:\Users\陈怿龙\AppData\Roaming\Typora\typora-user-images\image-20210418223313252.png)

当我们的资源内容不可复用时，直接为 Cache-Control 设置 no-store，拒绝一切形式的缓存；否则考虑是否每次都需要向服务器进行缓存有效确认，如果需要，那么设 Cache-Control 的值为 no-cache；否则考虑该资源是否可以被代理服务器缓存，根据其结果决定是设置为 private 还是 public；然后考虑该资源的过期时间，设置对应的 max-age 和 s-maxage 值；最后，配置协商缓存需要用到的 Etag、Last-Modified 等参数。

## MemoryCache

MemoryCache，是指存在内存中的缓存。从优先级上来说，它是浏览器最先尝试去命中的一种缓存。从效率上来说，它是响应速度最快的一种缓存。当进程结束后，也就是 tab 关闭以后，内存里的数据也将不复存在。

## Service Worker Cache

Service Worker 是一种独立于主线程之外的 Javascript 线程。它脱离于浏览器窗体，因此无法直接访问 DOM。这样独立的个性使得 Service Worker 的“个人行为”无法干扰页面的性能，这个“幕后工作者”可以帮我们实现离线缓存、消息推送和网络代理等功能。我们借助 Service worker 实现的离线缓存就称为 Service Worker Cache。

Service Worker 的生命周期包括 install、active、working 三个阶段。一旦 Service Worker 被 install，它将始终存在，只会在 active 与 working 之间切换，除非我们主动终止它。这是它可以用来实现离线存储的重要先决条件。

下面举个例子演示一下：

```js
window.navigator.serviceWorker.register('/test.js').then(
   function () {
      console.log('注册成功')
    }).catch(err => {
      console.error("注册失败")
    })
```

```js
// Service Worker会监听 install事件，我们在其对应的回调里可以实现初始化的逻辑  
self.addEventListener('install', event => {
  event.waitUntil(
    // 考虑到缓存也需要更新，open内传入的参数为缓存的版本号
    caches.open('test-v1').then(cache => {
      return cache.addAll([
        // 此处传入指定的需缓存的文件名
        '/test.html',
        '/test.css',
        '/test.js'
      ])
    })
  )
})

// Service Worker会监听所有的网络请求，网络请求的产生触发的是fetch事件，我们可以在其对应的监听函数中实现对请求的拦截，进而判断是否有对应到该请求的缓存，实现从Service Worker中取到缓存的目的
self.addEventListener('fetch', event => {
  event.respondWith(
    // 尝试匹配该请求对应的缓存值
    caches.match(event.request).then(res => {
      // 如果匹配到了，调用Server Worker缓存
      if (res) {
        return res;
      }
      // 如果没匹配到，向服务端发起这个资源请求
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200) {
          return response;
        }
        // 请求成功的话，将请求缓存起来。
        caches.open('test-v1').then(function(cache) {
          cache.put(event.request, response);
        });
        return response.clone();
      });
    })
  );
});
```

Server Worker 对协议是有要求的，必须以 https 协议为前提。

## Push Cache

Push Cache 是指 HTTP2 在 server push 阶段存在的缓存。

- 浏览器只有在 Memory Cache、HTTP Cache 和 Service Worker Cache 均未命中的情况下才会去询问 Push Cache。
- Push Cache 是一种存在于会话阶段的缓存，当 session 终止时，缓存也随之释放。
- 不同的页面只要共享了同一个 HTTP2 连接，那么它们就可以共享同一个 Push Cache。

## CDN

CDN （Content Delivery Network，即内容分发网络）指的是一组分布在各个地区的服务器。这些服务器存储着数据的副本，因此服务器可以根据哪些服务器与用户距离最近，来满足数据的请求。 CDN 提供快速服务，较少受高流量影响。

下面举个例子来看看 CDN 的作用。

假设我的根服务器在杭州，同时在图示的五个城市里都有自己可用的机房。

此时有一位北京的用户向我请求资源。在网络带宽小、用户访问量大的情况下，杭州的这一台服务器或许不那么给力，不能给用户非常快的响应速度。于是我灵机一动，把这批资源 copy 了一批放在北京的机房里。当用户请求资源时，就近请求北京的服务器，北京这台服务器低头一看，这个资源我存了，离得这么近，响应速度肯定噌噌的！那如果北京这台服务器没有 copy 这批资源呢？它会再向杭州的根服务器去要这个资源。在这个过程中，北京这台服务器就扮演着 CDN 的角色。

### CDN的核心功能特写

CDN 的核心点有两个，一个是**缓存**，一个是**回源**。

这两个概念都非常好理解。对标到上面描述的过程，“缓存”就是说我们把资源 copy 一份到 CDN 服务器上这个过程，“回源”就是说 CDN 发现自己没有这个资源（一般是缓存的数据过期了），转头向根服务器（或者它的上层服务器）去要这个资源的过程。

**CDN 往往被用来存放静态资源**。上文中我们举例所提到的“根服务器”本质上是业务服务器，它的核心任务在于**生成动态页面或返回非纯静态页面**，这两种过程都是需要计算的。业务服务器仿佛一个车间，车间里运转的机器轰鸣着为我们产出所需的资源；相比之下，CDN 服务器则像一个仓库，它只充当资源的“栖息地”和“搬运工”。

所谓“静态资源”，就是像 JS、CSS、图片等**不需要业务服务器进行计算即得的资源**。而“动态资源”，顾名思义是需要**后端实时动态生成的资源**，较为常见的就是 JSP、ASP 或者依赖服务端渲染得到的 HTML 页面。

什么是“非纯静态资源”呢？它是指**需要服务器在页面之外作额外计算的 HTML 页面**。具体来说，当我打开某一网站之前，该网站需要通过权限认证等一系列手段确认我的身份、进而决定是否要把 HTML 页面呈现给我。

### CDN 的实际应用

CDN 是静态资源提速的重要手段。静态资源本身具有访问频率高、承接流量大的特点，因此静态资源加载速度始终是前端性能的一个非常关键的指标。

### CDN 优化细节

下面就从 CDN 的域名选取讲讲优化：大家先回头看一下我刚刚选取的淘宝首页的例子，我们注意到业务服务器的域名是这个：

```
www.taobao.com
```

而 CDN 服务器的域名是这个：

```
g.alicdn.com
```

你会发现他们不一样。

同一个域名下的请求会携带 Cookie，而静态资源往往并不需要 Cookie 携带什么认证信息。把静态资源和主页面置于不同的域名下，完美地避免了不必要的 Cookie 的出现。