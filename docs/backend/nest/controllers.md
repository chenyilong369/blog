# 控制器

按照官方文档的说法，控制器负责处理传入的 **请求** 和向客户端返回 **响应** 。

控制器的目的是接收应用的特定请求。**路由**机制控制哪个控制器接收哪些请求。通常，每个控制器有多个路由，不同的路由可以执行不同的操作。

为了创建一个基本的控制器，我们使用类和`装饰器`。装饰器将类与所需的元数据相关联，并使 `Nest` 能够创建路由映射（将请求绑定到相应的控制器）。

## 路由

在 `@Controller`装饰器中使用前缀可以十分轻松的对一组相关的路由进行分组，并最大程度上减少代码的复用。

我们首先在建立好的 nest 项目下运行以下代码：

```
nest g module cats server
nest g controller cats server
```

下面看一段代码：

```ts
// cats.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    return 'this action returns all cats';
  }
}
```

`findAll() `方法之前的`@Get()`HTTP请求方法装饰器告诉 Nest 为 HTTP 请求的特定端点创建处理程序。端点对应于 HTTP 请求方法（GET）和路由。而处理程序的路由是由当前连接控制器的前缀与请求装饰器中的任何路由组合而成的。例如 `animal`与装饰器组合的路由前缀`@Get('cats')`，那么就会生成路由映射`Get /animal/cats`。

当此端点发出`Get`请求的时候，`Nest`会将请求路由定位到用户定义的`findAll()`上。

在我们书写的例子中，他会返回 200 状态码以及一个字符串。

这里先将装饰器和普通表达对象的关系：

|                           |                                     |
| :------------------------ | :---------------------------------- |
| `@Request()`              | `req`                               |
| `@Response() @Res()*`     | `res`                               |
| `@Next()`                 | `next`                              |
| `@Session()`              | `req.session`                       |
| `@Param(key?: string)`    | `req.params` / `req.params[key]`    |
| `@Body(key?: string)`     | `req.body` / `req.body[key]`        |
| `@Query(key?: string)`    | `req.query` / `req.query[key]`      |
| `@Headers(name?: string)` | `req.headers` / `req.headers[name]` |
| `@Ip()`                   | `req.ip`                            |

## 常用操作

在实际开发中，许多端点需要访问客户端的请求细节。我们可以强制 Nest 使用`@Req()`装饰器将请求对象注入处理程序。

```ts
import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(@Req() request: Request): string {
    return 'this action returns all cats';
  }
}
```

有时我们也想提交一些东西到服务器上（Post）：

```ts
import { Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('cats')
export class CatsController {
  @Post()
  create(): string {
    return 'This action adds a new cat';
  }

  @Get()
  findAll(): string {
    return 'this action returns all cats';
  }
}
```

当然，路由支持模式匹配：（类似正则表达式）

```ts
@Get('ab*de')
findAll() {
    return 'This route uses a wildcard'
}
```

也可以自己手动设置状态码（`@HttpCode`）

```ts
@Post
@HttpCode(204)
create() {
    return 'This action adds a new cat'
}
```

也可以自定义响应头（`@Header`）

```ts
@Post
@Header('Cache-Control', 'none')
create() {
    return 'This action adds a new cat'
}
```

也可以自定义重定向（`@Redirect`）

```ts
@Post
@Redirect('www.baidu.com', 301) // 第二个参数若未指定，则其默认为 302
```

如果说想动态定义 HTTP 状态码或者重定向 URL。可以通过路由处理程序方法返回一个形状为如下形式的对象：

```ts
{
	"url": string,
	"statusCode": number
}
```

返回的值将覆盖传递给 `@Redirect`装饰器中的所有参数。

```ts
@Get()
@Redirect('https://www.baidu.com', 302)
getCats(@Query('version') version) {
  if (version && version === '5') {
    return {
      url: 'https://github.com',
    };
  }
}
```

对于路由，有时候我们期望能接受一部分动态数据来进行请求，我们可以在`@Get`中定义动态数据。然后利用`@Param`装饰器访问路由参数。

```ts
@Get(':id')
findOne(@Param() params): string {
  console.log(params.id);
  return `This action returns a #${params.id} cat`;
}
```

也可以采用另一种方式来写

```ts
@Get(':id')
findOne(@Param('id') id): string {
    return `This action returns a #${id} cat`
}
```

`@Controller`装饰器可以接受一个`host`选项，以要求传入请求的`HTTP`主机匹配某个特定值。

```ts
@Controller({ host: 'admin.example.com' })
export class AdminController {
  @Get()
  index(): string {
    return 'Admin page';
  }
}
```

## Async

我们使用`JavaScript`的时候，数据读取大多是**异步**的。这就是为什么 `Nest` 支持 `async` 功能并与功能完美配合的原因。

每个异步函数都必须返回 `Promise`。这意味着可以返回延迟值, 而 `Nest` 将自行解析它。

```ts
@Get()
async findAll(): Promise<any[]> {
  return [];
}
```



