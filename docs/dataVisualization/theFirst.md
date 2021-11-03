# 一个简单的例子

接下来我们分别用同一个例子来展现 canvas， svg， zrender 的一些语法区别。

我们要实现成下面的样子：

<img :src="$withBase('/dataVisualization/theFirst/01.png')" alt="01"/>

## canvas

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <canvas id="canvas" width="800" height="800"></canvas>
    <script>
      /** @type {HTMLCanvasElement} */
      const canvas = document.getElementById("canvas");
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "red";
      ctx.fillRect(0, 0, 50, 50);

      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "blue";
      ctx.moveTo(100, 100);
      ctx.lineTo(250, 75);
      ctx.lineTo(300, 100);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "green";
      ctx.fillStyle = "red";
      ctx.arc(200, 200, 50, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();

      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "red";
      ctx.moveTo(400, 400);
      ctx.lineTo(401, 401);
      ctx.closePath();
      ctx.stroke();
    </script>
  </body>
</html>
```

关于 canvas 的基础语法请[参考此处](https://www.w3school.com.cn/tags/html_ref_canvas.asp)

## svg

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <svg width="800" height="800">
      <rect width="50" height="50" style="fill: red" />
      <line
        x1="100"
        y1="100"
        x2="250"
        y2="75"
        style="stroke: blue; stroke-width: 1px"
      />
      <line
        x1="250"
        y1="75"
        x2="300"
        y2="100"
        style="stroke: blue; stroke-width: 1px"
      />
      <circle
        cx="200"
        cy="200"
        r="50"
        stroke="green"
        stroke-width="2"
        fill="red"
      />
    </svg>
  </body>
</html>
```

关于 svg 基础语法请[参考此处](https://www.w3school.com.cn/svg/index.asp)

## zrender

zrender 是二维绘图引擎，它提供 Canvas、SVG、VML 等多种渲染方式。ZRender 也是 ECharts 的渲染器。

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdn.jsdelivr.net/npm/zrender@4.3.0/dist/zrender.js"></script>
  </head>
  <body>
    <div id="container" style="width: 800px;height: 800px;"></div>
    <script>
      var zr = zrender.init(document.getElementById("container"));
      var rect = new zrender.Rect({
        shape: {
          x: 0,
          y: 0,
          width: 50,
          height: 50,
        },
        style: {
          fill: "red",
          lineWidth: 0,
        },
      });
      var line = new zrender.Polyline({
        shape: {
          points: [
            [100, 100],
            [250, 75],
            [300, 100],
          ],
        },
        style: {
          stroke: "blue",
          lineWidth: 1,
        },
      });
      var circle = new zrender.Circle({
        shape: {
          cx: 200,
          cy: 200,
          r: 50,
        },
        style: {
          fill: "red",
          stroke: "green",
          lineWidth: 2,
        },
      });
      var point = new zrender.Polyline({
        shape: {
          points: [
            [300, 300],
            [301, 301],
          ],
        },
        style: {
          stroke: "red",
          lineWidth: 1,
        },
      });
      zr.add(rect);
      zr.add(line);
      zr.add(circle);
      zr.add(point);
    </script>
  </body>
</html>
```

zrender 的基础文档请[参考此处](https://ecomfe.github.io/zrender-doc/public/)
