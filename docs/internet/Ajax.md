# 网络请求

Ajax技术涉及发送服务器请求额外数据而不刷新页面，从而实现更好的用户体验。

把 Ajax 推到历史舞台上的关键技术是 XMLHttpRequest（XHR）对象。这个对象最早由微软发明，然后被其他浏览器所借鉴。

XHR 为发送服务器请求和获取响应提供了合理的接口。这个接口可以实现异步从服务器获取额外数据，意味着用户点击不用页面刷新也可以获取数据。通过 XHR 对象获取数据后，可以使用 DOM 方法把数据插入网页。

::: tip

XMLHttpRequest实际上是过时 Web 规范的产物，应该只在旧版本浏览器中使用。实际开发中，应该尽可能使用 fetch()。

:::

## **XMLHttpRequest** 对象

我们可以通过 XMLHttpRequest 构造函数创建 XHR 对象：

```js
let xhr = new XMLHttpRequest(); 
```

### 使用 XHR 

使用 XHR 对象首先要调用 open()方法，这个方法接收 3 个参数：请求类型（"get"、"post"等）、请求 URL，以及表示请求是否异步的布尔值。

```js
xhr.open("get", "example.js", false);
```

这行代码就可以向 `example.js` 发送一个同步的 GET 请求。关于这行代码需要说明几点。首先，这里的 URL 是相对于代码所在页面的，当然也可以使用绝对 URL。其次，调用 open()不会实际发送请求，只是为发送请求做好准备。

> 只能访问同源 URL，也就是域名相同、端口相同、协议相同。如果请求的 URL 与发送请求的页面在任何方面有所不同，则会抛出安全错误。

要发送定义好的请求，需要调用 send()方法：

```js
xhr.open("get", "example.js", false);
xhr.send(null)
```

`send()`方法接收一个参数，是作为请求体发送的数据。如果不需要发送请求体，则必须传 null，因为这个参数在某些浏览器中是必需的。调用 send()之后，请求就会发送到服务器。

因为这个请求是同步的，所以 JavaScript 代码会等待服务器响应之后再继续执行。收到响应后，XHR对象的以下属性会被填充上数据。

- responseText：作为响应体返回的文本。 
- responseXML：如果响应的内容类型是"text/xml"或"application/xml"，那就是包含响应数据的 XML DOM 文档。 
- status：响应的 HTTP 状态。 
- statusText：响应的 HTTP 状态描述

收到响应后，第一步要检查 status 属性以确保响应成功返回。一般来说，HTTP 状态码为 2xx 表示成功。此时，responseText 或 responseXML（如果内容类型正确）属性中会有内容。**如果 HTTP状态码是 304，则表示资源未修改过，是从浏览器缓存中直接拿取的。当然这也意味着响应有效。**为确保收到正确的响应，应该检查这些状态，如下所示：

```js
xhr.open("get", "example.js", false); 
xhr.send(null); 
if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) { 
 alert(xhr.responseText); 
} else { 
 alert("Request was unsuccessful: " + xhr.status); 
}
```

XHR 对象有个 `readyState` 属性，表示当前处在请求/响应过程的哪个阶段。

- 0：未初始化（Uninitialized）。尚未调用 open()方法。
- 1：已打开（Open）。已调用 open()方法，尚未调用 send()方法。
- 2：已发送（Sent）。已调用 send()方法，尚未收到响应。
- 3：接收中（Receiving）。已经收到部分响应。
- 4：完成（Complete）。已经收到所有响应，可以使用了。

每次 readyState 从一个值变成另一个值，都会触发 readystatechange 事件。可以借此机会检查 readyState 的值。一般来说，我们唯一关心的 readyState 值是 4，表示数据已就绪。为保证跨浏览器兼容，onreadystatechange 事件处理程序应该在调用 open()之前赋值。

```js
let xhr = new XMLHttpRequest()
xhr.onreadystatechange = function () {
  if (xhr.readyState == 4) {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
      alert(xhr.responseText)
    } else {
      alert('Request was unsuccessful: ' + xhr.status)
    }
  }
}
xhr.open('get', 'example.js', true)
xhr.send(null)
```

在收到响应之前如果想取消异步请求，可以调用 `abort()` 方法:

```js
xhr.abort();
```

调用这个方法后，XHR 对象会停止触发事件，并阻止访问这个对象上任何与响应相关的属性。中断请求后，应该取消对 XHR 对象的引用。

## HTTP 头部

XHR 对象会通过一些方法暴露与请求和响应相关的头部字段。默认情况下，XHR 请求会发送以下头部字段。

- Accept：浏览器可以处理的内容类型。
- Accept-Charset：浏览器可以显示的字符集。
- Accept\-Encoding：浏览器可以处理的压缩编码类型。
- Accept\-Language：浏览器使用的语言。
- Connection：浏览器与服务器的连接类型。
- Cookie：页面中设置的 Cookie。 
- Host：发送请求的页面所在的域。
- Referer：发送请求的页面的 URI。注意，这个字段在 HTTP 规范中就拼错了，所以考虑到兼容性也必须将错就错。（正确的拼写应该是 Referrer。）
- User\-Agent：浏览器的用户代理字符串。

如果需要发送额外的请求头部，可以使用 `setRequestHeader()`方法。这个方法接收两个参数：头部字段的名称和值。为保证请求头部被发送，必须在 open()之后、send()之前调用 setRequestHeader()。

```js
let xhr = new XMLHttpRequest()
xhr.onreadystatechange = function () {
  if (xhr.readyState == 4) {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
      alert(xhr.responseText)
    } else {
      alert('Request was unsuccessful: ' + xhr.status)
    }
  }
}
xhr.open('get', 'example.js', true)
xhr.setRequestHeader('MyHeader', 'MyValue')
xhr.send(null)
```

可以使用 getResponseHeader()方法从 XHR 对象获取响应头部，只要传入要获取头部的名称即可。如果想取得所有响应头部，可以使用 getAllResponseHeaders()方法，这个方法会返回包含所有响应头部的字符串。

```js
let myHeader = xhr.getResponseHeader("MyHeader"); 
let allHeaders xhr.getAllResponseHeaders();
```

下面看两个常见的请求实例：

### Get请求

Get 请求用于向服务器查询某些信息。必要时，需要在 GET 请求的 URL 后面添加查询字符串参数。

 对 XHR 而言，查询字符串必须正确编码后添加到 URL 后面，然后再传给open()方法。

查询字符串中的每个名和值都必须使用 `encodeURIComponent()` 编码，所有名/值对必须以和号（&）分隔。

```js
xhr.open("get", "example.php?name1=value1&name2=value2", true);
```

可以使用以下函数将查询字符串参数添加到现有的 URL 末尾：

```js
function addURLParam(url, name, value) { 
  url += (url.indexOf("?") == -1 ? "?" : "&"); 
  url += encodeURIComponent(name) + "=" + encodeURIComponent(value); 
  return url; 
}
```

这里定义了一个 addURLParam()函数，它接收 3 个参数：要添加查询字符串的 URL、查询参数和参数值。

首先，这个函数会检查 URL 中是否已经包含问号（以确定是否已经存在其他参数）。如果没有，则加上一个问号；否则就加上一个和号。然后，分别对参数名和参数值进行编码，并添加到 URL 末尾。最后一步是返回更新后的 URL。

```js
let url = "example.js"; 
// 添加参数
url = addURLParam(url, "name", "Nicholas"); 
url = addURLParam(url, "book", "Professional JavaScript"); 
// 初始化请求
xhr.open("get", url, false);
```

### POST 请求

Post 请求用于向服务器发送应该保存的数据。每个 POST 请求都应该在请求体中携带提交的数据。

```js
xhr.open("post", "example.php", true);
```

默认情况下，对服务器而言，POST 请求与提交表单是不一样的。服务器逻辑需要读取原始 POST数据才能取得浏览器发送的数据。不过，可以使用 XHR 模拟表单提交。为此，第一步需要把 ContentType 头部设为"application/x-www-formurlencoded"，这是提交表单时使用的内容类型。第二步是创建对应格式的字符串。

```js
function submitData() {
  let xhr = new XMLHttpRequest()
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        alert(xhr.responseText)
      } else {
        alert('Request was unsuccessful: ' + xhr.status)
      }
    }
  }
  xhr.open('post', 'postexample.js', true)
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  let form = document.getElementById('user-info')
  xhr.send(serialize(form))
}
```

> POST 请求相比 GET 请求要占用更多资源。从性能方面说，发送相同数量的数据，GET 请求比 POST 请求要快两倍。

## XMLHttpRequest Level 2 

### **FormData** 类型

FormData 类型便于表单序列化，也便于创建与表单类似格式的数据然后通过 XHR发送。

```js
let data = new FormData(); 
data.append("name", "Nicholas");
```

append()方法接收两个参数：键和值，相当于表单字段名称和该字段的值。

也可以通过直接给 FormData 构造函数传入一个表单元素，将表单中的数据作为键/值对填充进去

```js
let data = new FormData(document.forms[0]);
```

```js
let xhr = new XMLHttpRequest()
xhr.onreadystatechange = function () {
  if (xhr.readyState == 4) {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
      alert(xhr.responseText)
    } else {
      alert('Request was unsuccessful: ' + xhr.status)
    }
  }
}
xhr.open('post', 'postexample.php', true)
let form = document.getElementById('user-info')
xhr.send(new FormData(form))
```

### 超时

XHR 对象增加了一个 timeout 属性，用于表示发送请求后等待多少毫秒，如果响应不成功就中断请求。

在给 timeout 属性设置了一个时间且在该时间过后没有收到响应时，XHR 对象就会触发 timeout 事件，调用 `ontimeout` 事件处理程序。

```js
let xhr = new XMLHttpRequest()
xhr.onreadystatechange = function () {
  if (xhr.readyState == 4) {
    try {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        alert(xhr.responseText)
      } else {
        alert('Request was unsuccessful: ' + xhr.status)
      }
    } catch (ex) {
      // 假设由 ontimeout 处理
    }
  }
}
xhr.open('get', 'timeout.php', true)
xhr.timeout = 1000 // 设置 1 秒超时
xhr.ontimeout = function () {
  alert('Request did not return in a second.')
}
xhr.send(null)
```

给 timeout 设置 1000 毫秒意味着，如果请求没有在 1秒钟内返回则会中断。此时则会触发 ontimeout 事件处理程序，readyState 仍然会变成 4，因此也会调用 onreadystatechange 事件处理程序。不过，如果在超时之后访问 status 属性则会发生错误。为做好防护，可以把检查 status 属性的代码封装在 try/catch 语句中。

### **overrideMimeType()**方法

`overrideMimeType()` 方法用于重写 XHR 响应的 MIME 类型。

响应返回的 MIME 类型决定了 XHR 对象如何处理响应，所以如果有办法覆盖服务器返回的类型，那么是有帮助的。

假设服务器实际发送了 XML 数据，但响应头设置的 MIME 类型是 text/plain。结果就会导致虽然数据是 XML，但 responseXML 属性值是 null。

```js
let xhr = new XMLHttpRequest(); 
xhr.open("get", "text.js", true); 
xhr.overrideMimeType("text/xml"); 
xhr.send(null);
```

强制让 XHR 把响应当成 XML 而不是纯文本来处理。为了正确覆盖响应的 MIME 类型，必须在调用 send()之前调用 overrideMimeType()。

## 进度事件

有以下几个常见的进度事件：

- loadstart：在接收到响应的第一个字节时触发。
- progress：在接收响应期间反复触发。
- error：在请求出错时触发。
- abort：在调用 abort()终止连接时触发。
- load：在成功接收完响应时触发。
- loadend：在通信完成时，且在 error、abort 或 load 之后触发。

每次请求都会首先触发 loadstart 事件，之后是一个或多个 progress 事件，接着是 error、abort 或 load 中的一个，最后以 loadend 事件结束。

### **load** 事件

load 事件在响应接收完成后立即触发，这样就不用检查 readyState 属性了。onload 事件处理程序会收到一个 event 对象，其 target 属性设置为 XHR 实例，在这个实例上可以访问所有 XHR 对象属性和方法。

只要是从服务器收到响应，无论状态码是什么，都会触发 load 事件。这意味着还需要检查 status属性才能确定数据是否有效。

### **progress** 事件

在浏览器接收数据期间，这个事件会反复触发。每次触发时，`onprogress` 事件处理程序都会收到 event 对象，其 target 属性是 XHR 对象，且包含 3 个额外属性：lengthComputable、position 和 totalSize。其中lengthComputable 是一个布尔值，表示进度信息是否可用；position 是接收到的字节数；totalSize 是响应的 Content-Length 头部定义的总字节数。

有了这些信息，就可以给用户提供进度条了。

```js
let xhr = new XMLHttpRequest()
xhr.onload = function (event) {
  if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
    alert(xhr.responseText)
  } else {
    alert('Request was unsuccessful: ' + xhr.status)
  }
}
xhr.onprogress = function (event) {
  let divStatus = document.getElementById('status')
  if (event.lengthComputable) {
    divStatus.innerHTML = 'Received ' + event.position + ' of ' + event.totalSize + ' bytes'
  }
}
xhr.open('get', 'altevents.js', true)
xhr.send(null)
```

为了保证正确执行，必须在调用 open()之前添加 onprogress 事件处理程序。

##  跨源资源共享

默认情况下，XHR 只能访问与发起请求的页面在同一个域内的资源。这个安全限制可以防止某些恶意行为。不过，浏览器也需要支持合法跨源访问的能力。

跨源资源共享（CORS，Cross-Origin Resource Sharing）定义了浏览器与服务器如何实现跨源通信。CORS 背后的基本思路就是使用自定义的 HTTP 头部允许浏览器和服务器相互了解，以确认请求或响应应该成功还是失败。

对于简单的请求，比如 GET 或 POST 请求，没有自定义头部，而且请求体是 text/plain 类型，这样的请求在发送时会有一个额外的头部叫 Origin。Origin 头部包含发送请求的页面的源（协议、域名和端口），以便服务器确定是否为其提供响应。

```
Origin: https://www.baidu.com
```

如果服务器决定响应请求，那么应该发送 Access-Control-Allow-Origin 头部，包含相同的源；或者如果资源是公开的，那么就包含"*"。比如：

```
Access-Control-Allow-Origin: https://www.baidu.com
```

如果没有这个头部，或者有但源不匹配，则表明不会响应浏览器请求。否则，服务器就会处理这个请求。注意，无论请求还是响应都不会包含 cookie 信息。

现代浏览器通过 XMLHttpRequest 对象原生支持 CORS。在尝试访问不同源的资源时，这个行为会被自动触发。要向不同域的源发送请求，可以使用标准 XHR对象并给 open()方法传入一个绝对 URL。

```js
let xhr = new XMLHttpRequest()
xhr.onreadystatechange = function () {
  if (xhr.readyState == 4) {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
      alert(xhr.responseText)
    } else {
      alert('Request was unsuccessful: ' + xhr.status)
    }
  }
}
xhr.open('get', 'http://www.somewhere-else.com/page/', true)
xhr.send(null)
```

跨域 XHR 对象允许访问 status 和 statusText 属性，也允许同步请求。出于安全考虑，跨域 XHR对象也施加了一些额外限制。

- 不能使用 setRequestHeader()设置自定义头部。

- 不能发送和接收 cookie。 

- getAllResponseHeaders()方法始终返回空字符串。

最好在访问本地资源时使用相对 URL，在访问远程资源时使用绝对 URL。这样可以更明确地区分使用场景，同时避免出现访问本地资源时出现头部或 cookie 信息访问受限的问题。

### 预检请求

CORS 通过一种叫预检请求（preflighted request）的服务器验证机制，允许使用自定义头部、除 GET 和 POST 之外的方法，以及不同请求体内容类型。

它会先向服务器发送一个“预检”请求。这个请求使用 OPTIONS 方法发送并包含以下头部。

Origin：与简单请求相同。

- Access-Control-Request-Method：请求希望使用的方法。
- Access-Control-Request-Headers：（可选）要使用的逗号分隔的自定义头部列表。

下面是一个假设的 POST 请求，包含自定义的 NCZ 头部：

```
Origin: http://www.nczonline.net 
Access-Control-Request-Method: POST 
Access-Control-Request-Headers: NCZ 
```


在这个请求发送后，服务器可以确定是否允许这种类型的请求。

服务器会通过在响应中发送如下头部与浏览器沟通这些信息。

- Access-Control-Allow-Origin：与简单请求相同。
- Access-Control-Allow-Methods：允许的方法（逗号分隔的列表）。
- Access-Control-Allow-Headers：服务器允许的头部（逗号分隔的列表）。
- Access-Control-Max-Age：缓存预检请求的秒数。

预检请求返回后，结果会按响应指定的时间缓存一段时间。换句话说，只有第一次发送这种类型的请求时才会多发送一次额外的 HTTP 请求。

### 凭据请求

默认情况下，跨源请求不提供凭据（cookie、HTTP 认证和客户端 SSL 证书）。可以通过将 `withCredentials` 属性设置为 true 来表明请求会发送凭据。如果服务器允许带凭据的请求，那么可以在响应中包含如下 HTTP 头部：

```
Access-Control-Allow-Credentials: true
```

如果发送了凭据请求而服务器返回的响应中没有这个头部，则浏览器不会把响应交给 JavaScript（responseText 是空字符串，status 是 0，onerror()被调用）。注意，服务器也可以在预检请求的响应中发送这个 HTTP 头部，以表明这个源允许发送凭据请求。

## 替代性跨源技术

### JSONP 

JSONP 是“JSON with padding”的简写，是在 Web 服务上流行的一种 JSON 变体。JSONP 看起来跟 JSON 一样，只是会被包在一个函数调用里。

```js
callback({ "name": "Nicholas" });
```

JSONP 格式包含两个部分：回调和数据。回调是在页面接收到响应之后应该调用的函数，通常回调函数的名称是通过请求来动态指定的。而数据就是作为参数传给回调函数的 JSON 数据。

```
http://freegeoip.net/json/?callback=handleResponse
```

上面就是一个典型的 jsonp 请求。

JSONP 服务通常支持以查询字符串形式指定回调函数的名称。

JSONP 调用是通过动态创建\<script>元素并为 src 属性指定跨域 URL 实现的。此时的\<script>与\<img>元素类似，能够不受限制地从其他域加载资源。因为 JSONP 是有效的 JavaScript，所以 JSONP响应在被加载完成之后会立即执行。

```js
function handleResponse(response) {
  console.log(` 
  You're at IP address ${response.ip}, which is in 
  ${response.city}, ${response.region_name}`)
}
let script = document.createElement('script')
script.src = 'http://freegeoip.net/json/?callback=handleResponse'
document.body.insertBefore(script, document.body.firstChild)
```

JSONP 也有一些缺点。

- JSONP 是从不同的域拉取可执行代码。如果这个域并不可信，则可能在响应中加入恶意内容。此时除了完全删除 JSONP 没有其他办法。在使用不受控的 Web 服务时，一定要保证是可以信任的。

- 不好确定 JSONP 请求是否失败。