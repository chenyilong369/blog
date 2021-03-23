# CSRF 攻击

 首先看一个案例，假设一个叫 David 的人登录了他的邮箱，并点击了其中一个邮件里面的链接，然后他的域名就被盗了。

<img :src="$withBase('/CSRF01.png')" alt="CSRF01"/>

- 首先 David 发起登录 Gmail 邮箱请求，然后 Gmail 服务器返回一些登录状态给 David 的浏览器，这些信息包括了 Cookie、Session 等，这样在 David 的浏览器中，Gmail 邮箱就处于登录状态了。

- 接着黑客通过各种手段引诱 David 去打开他的链接，比如 hacker.com，然后在 hacker.com 页面中，黑客编写好了一个邮件过滤器，并通过 Gmail 提供的 HTTP 设置接口设置好了新的邮件过滤功能，该过滤器会将 David 所有的邮件都转发到黑客的邮箱中。

- 有了 David 的邮件内容，所以黑客就可以去域名服务商那边重置 David 域名账户的密码，重置好密码之后，就可以将其转出到黑客的账户了。

## 什么是 CSRF 攻击

CSRF 英文全称是 Cross-site request forgery，所以又称为“跨站请求伪造”，是指黑客引诱用户打开黑客的网站，在黑客的网站中，利用用户的登录状态发起的跨站请求。简单来讲，**CSRF 攻击就是黑客利用了用户的登录状态，并通过第三方的站点来做一些坏事。**

有三种攻击方式：

### 自动发起 Get 请求

黑客最容易实施的攻击方式是自动发起 Get 请求。

```html
<!DOCTYPE html>
<html>
  <body>
    <img src="https://www.baidu.com">
  </body>
</html>
```

当该页面被加载时，浏览器会自动发起 img 的资源请求，如果服务器没有对该请求做判断的话，那么服务器就会认为该请求是一个其他请求。黑客的目的可能就达到了。

### 自动发起 POST 请求

有些服务器的接口是使用 POST 方法的，所以黑客还需要在他的站点上伪造 POST 请求，当用户打开黑客的站点时，是自动提交 POST 请求。

```html
<!DOCTYPE html>
<html>
<body>
  <form id='hacker-form' action="https://www.baidu.com" method=POST>
    <input type="hidden" name="user" value="hacker" />
    <input type="hidden" name="number" value="100" />
  </form>
  <script> document.getElementById('hacker-form').submit(); </script> // 自动提交
</body>
</html>
```

当用户打开该站点之后，这个表单会被自动执行提交；当表单被提交之后，服务器就会执行转账操作。因此使用构建自动提交表单这种方式，就可以自动实现跨站点 POST 数据提交。

### 引诱用户点击链接

还有一种方式是诱惑用户点击黑客站点上的链接，这种方式通常出现在论坛或者恶意邮件上。

```html
<div>
  <a href="https://www.baidu.com" taget="_blank">
    点击下载美女照片
  </a>
</div>
```

**和 XSS 不同的是，CSRF 攻击不需要将恶意代码注入用户的页面，仅仅是利用服务器的漏洞和用户的登录状态来实施攻击。**

## CSRF 攻击的条件

- 目标站点一定要有 CSRF 漏洞；
- 用户要登录过目标站点，并且在浏览器上保持有该站点的登录状态；
- 需要用户打开一个第三方站点，可以是黑客的站点，也可以是一些论坛。

## 预防 CSRF 攻击

### Cookie 的 SameSite 属性

黑客会利用用户的登录状态来发起 CSRF 攻击，而 Cookie 正是浏览器和服务器之间维护登录状态的一个关键数据，因此要阻止 CSRF 攻击，我们可以考虑在 Cookie 上来做文章。

SameSite 选项通常有 Strict、Lax 和 None 三个值。

- Strict 最为严格。如果 SameSite 的值是 Strict，那么浏览器会完全禁止第三方 Cookie。
- Lax 相对宽松一点。在跨站点的情况下，从第三方站点的链接打开和从第三方站点提交 Get 方式的表单这两种方式都会携带 Cookie。
- 而如果使用 None 的话，在任何情况下都会发送 Cookie 数据。

### 验证请求的来源站点

由于 CSRF 攻击大多来自于第三方站点，因此服务器可以禁止来自第三方站点的请求。那么该怎么判断请求是否来自第三方站点呢？

**Referer** 是 HTTP 请求头中的一个字段，记录了该 HTTP 请求的来源地址。

虽然可以通过 Referer 告诉服务器 HTTP 请求的来源，但是有一些场景是不适合将来源 URL 暴露给服务器的，因此浏览器提供给开发者一个选项，可以不用上传 Referer 值。

**Origin** 属性只包含了域名信息，并没有包含具体的 URL 路径，这是 Origin 和 Referer 的一个主要区别。

服务器的策略是优先判断 Origin，如果请求头中没有包含 Origin 属性，再根据实际情况判断是否使用 Referer 值。

### CSRF Token

在浏览器向服务器发起请求时，服务器生成一个 CSRF Token。CSRF Token 其实就是服务器生成的字符串，然后将该字符串植入到返回的页面中。

在浏览器端如果要发起请求，那么需要带上页面中的 CSRF Token，然后服务器会验证该 Token 是否合法。如果是从第三方站点发出的请求，那么将无法获取到 CSRF Token 的值，所以即使发出了请求，服务器也会因为 CSRF Token 不正确而拒绝请求。