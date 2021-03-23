# requestAnimationFrame

为什么需要`requestAnimationFrame`这个新增的定时器呢？

大多数电脑显示器的刷新频率是60Hz，大概相当于每秒钟重绘60次。大多数浏览器都会对重绘操作加以限制，不超过显示器的重绘频率，因为即使超过那个频率用户体验也不会有提升。因此，最平滑动画的最佳循环间隔是1000ms/60，约等于16.6ms。

在前面讲 `setTimeout` 说过，`setTimeout` 和 `setInterval` 他们的定时时间并不精确，它们的内在运行机制决定了时间间隔参数实际上只是指定了把动画代码添加到浏览器UI线程队列中以等待执行的时间。如果队列前面已经加入了其他任务，那动画代码就要等前面的任务完成后再执行。

`requestAnimationFrame`采用系统时间间隔，保持最佳绘制效率，不会因为间隔时间过短，造成过度绘制，增加开销；也不会因为间隔时间太长，使用动画卡顿不流畅，让各种网页动画效果能够有一个统一的刷新机制，从而节省系统资源，提高系统性能，改善视觉效果。

## 特点

- 它会把每一帧中的所有 DOM 操作集合起来，在一次重绘或回流中就完成，并且重绘或回流的时间间隔紧紧跟随浏览器的刷新频率。（大多数电脑刷新频率大约为 60hz，即每秒重绘 60 次）

- 在隐藏或不可见的元素中，它将不会进行重绘或回流，这当然就意味着更少的CPU、GPU和内存使用量。
- 它是由浏览器专门为动画提供的API，在运行时浏览器会自动优化方法的调用，并且如果页面不是激活状态下的话，动画会自动暂停，有效节省了CPU开销。

## 使用方法

`requestAnimationFrame`使用一个回调函数作为参数，这个回调函数会在浏览器重绘之前调用。它返回一个整数，表示定时器的编号，这个值可以传递给`cancelAnimationFrame`用于取消这个函数的执行。

```js
//控制台输出1和0
var timer = requestAnimationFrame(function(){
    console.log(0);
}); 
console.log(timer);//1
```

`cancelAnimationFrame`方法用于取消定时器

```js
var timer = requestAnimationFrame(function(){
    console.log(0);
}); 
cancelAnimationFrame(timer); // 没任何输出（已经被取消了）
```

## 实例

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
    <div id="animation">
      111
    </div>
    <script>
      const element = document.getElementById('animation')
      let start

      function step(timestamp) {
        if(start === undefined) {
          start = timestamp
        }
        const decTime = timestamp - start
        // 确保正好停在 200px
        element.style.transform = 'translateX(' + Math.min(0.1 * decTime, 200) + 'px)'
        if(decTime < 2000) { // 在两秒后停止动画
          window.requestAnimationFrame(step)
        }  
      }
      window.requestAnimationFrame(step)
    </script>
  </body>
</html>

```

::: tip

若你在浏览器下次重绘之前继续更新下一帧动画，那么回调函数自身必须再次调用`window.requestAnimationFrame()`

:::