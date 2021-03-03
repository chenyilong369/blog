# 存储

## 常见缓存

|     特性     |                   cookie                   |       localStorage       | sessionStorage |         indexDB          |
| :----------: | :----------------------------------------: | :----------------------: | :------------: | :----------------------: |
| 数据生命周期 |     一般由服务器生成，可以设置过期时间     | 除非被清理，否则一直存在 | 页面关闭就清理 | 除非被清理，否则一直存在 |
| 数据存储大小 |                     4K                     |            5M            |       5M       |           无限           |
| 与服务端通信 | 每次都会携带在 header 中，对于请求性能影响 |          不参与          |     不参与     |          不参与          |

对于 `cookie` 来说，我们还需要注意安全性。

| 属性            | 作用                                                         |
| --------------- | ------------------------------------------------------------ |
| Value           | 如果用于保存用户登录态，应该将该值加密，不能使用明文的用户标识 |
| HttpOnly        | 不能通过 JS 访问 Cookie，减少 XSS 攻击                       |
| Secure          | 只能在协议为 HTTPS 的请求中携带                              |
| SameSite        | 规定浏览器不能在跨域请求中携带 Cookie，减少 CSRF 攻击        |
| Path            | 能够携带该键值对的文件路径                                   |
| Name            | 键名                                                         |
| Domain          | 能够携带该键值对的域名，开头为`.` 则表示其子域名也可以携带   |
| Size            | cookie 大小                                                  |
| Exptres/Max-Age | cookie 过期时间的时间戳，超时则自动删除                      |

::: tip SameSite 的值

- None：任何请求都可以携带该 cookie
- Lax：部分跨站请求无法发送该 cookie
- Strict：所有跨站请求都无法发送该 cookie，仅同站请求允许。

:::



## Service Worker

Service Worker 是运行在浏览器背后的**独立线程**，一般可以用来实现缓存功能。使用 Service Worker的话，传输协议必须为 **HTTPS**。因为 Service Worker 中涉及到请求拦截，所以必须使用 HTTPS 协议来保障安全。

Service Worker 实现缓存功能一般分为三个步骤：

1. 首先需要先注册 Service Worker，
2. 然后监听到 `install` 事件以后就可以缓存需要的文件，
3. 那么在下次用户访问的时候就可以通过拦截请求的方式查询是否存在缓存，存在缓存的话就可以直接读取缓存文件，否则就去请求数据。

```js
if (navigator.serviceWorker) {
  navigator.serviceWorker
    .register('sw.js')
    .then(function(registration) {
      console.log('service worker 注册成功')
    })
    .catch(function(err) {
      console.log('servcie worker 注册失败')
    })
}
// sw.js
// 监听 `install` 事件，回调中缓存所需文件
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('my-cache').then(function(cache) {
      return cache.addAll(['./index.html', './index.js'])
    })
  )
})

// 拦截所有请求事件
// 如果缓存中已经有请求的数据就直接用缓存，否则去请求数据
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      if (response) {
        return response
      }
      console.log('fetch source')
    })
  )
})
```

