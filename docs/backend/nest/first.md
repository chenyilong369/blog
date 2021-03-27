# 安装与运行

首先确保操作系统上安装了 [Node.js](http://nodejs.cn/download/)**（>= 10.13.0）**。

接下来使用 [Nest CLI](https://docs.nestjs.cn/6/cli?id=overview) 建立新项目。

``` 
npm i -g @nestjs/cli
nest new project-name
```

或者使用 yarn

```
yarn global add @nestjs/cli
nest new project-name
```

来看一下 src 目录下有什么：

```
src
├── app.controller.ts
├── app.module.ts
└── main.ts
```

|                   |                                                              |
| :---------------- | ------------------------------------------------------------ |
| app.controller.ts | 带有单个路由的基本控制器示例。                               |
| app.module.ts     | 应用程序的根模块。                                           |
| main.ts           | 应用程序入口文件。它使用 `NestFactory` 用来创建 Nest 应用实例。 |

`main.ts` 包含一个异步函数，它负责**引导**应用程序：

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000); // 使用 localhost:3000 访问
}
bootstrap();
```

`NestFactory` 暴露了一些静态方法用于创建应用实例。 `create()` 方法返回一个实现 `INestApplication` 接口的对象, 并提供一组可用的方法。

在上面的实例中，只是启动了 http 服务器，他允许应用程序等待入站 http 请求。

运行时，可以在系统命令提示符下运行以下命令：

```
yarn start 
// or
npm run start
```

打开浏览器并访问 `http://localhost:3000/`就可以看到 `Hello world!` 信息。