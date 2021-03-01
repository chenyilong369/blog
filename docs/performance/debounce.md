# 防抖和节流

其实这个问题在生活中还挺常见的。比如**监听浏览器滚动事件，返回当前滚条与顶部的距离**。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body style="height: 600vh">
    <script>
      function showTop() {
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop
        console.log('滚动条位置：' + scrollTop)
      }
      window.onscroll = showTop
    </script>
  </body>
</html>
```

在运行的时候会发现存在一个问题：**这个函数的默认执行频率，太高了。**会导致性能的丢失。

## 防抖

**在第一次触发事件时，不立即执行函数，而是给出一个期限值比如200ms**，然后：

- 如果在200ms内没有再次触发滚动事件，那么就执行函数
- 如果在200ms内再次触发滚动事件，那么当前的计时取消，重新开始计时

也就是说如果短时间内大量触发同一事件，只会执行一次函数。且执行的是最后一次的函数。

```js
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body style="height: 600vh">
    <script>
      function showTop() {
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop
        console.log('滚动条位置：' + scrollTop)
      }
	  // 新增
      function debounce(fn, delay) {
        let timer = null // 借用闭包
        return function()  {
          if(timer) {
            clearTimeout(timer)
          }
          timer = setTimeout(fn, delay)
        }
      }

      window.onscroll = debounce(showTop, 200)
    </script>
  </body>
</html>
```

到这里，已经把**防抖**实现了，现在给出定义：

对于**短时间内连续触发**的事件（上面的滚动事件），**防抖的含义就是让某个时间期限（如上面的 200 毫秒）内，事件处理函数只执行一次。**

## 节流

使用上面的防抖方案来处理问题的结果是：

如果在限定时间段内，不断触发滚动事件（比如某个用户闲着无聊，按住滚动不断的拖来拖去），只要不停止触发，理论上就永远不会输出当前距离顶部的距离。

但是如果我们的需求是**用户不断拖动滚动条，也能在某个时间间隔之后给出反馈呢？**

想想也挺简单的，不就是 CD 嘛。执行一个函数后让该函数进入冷却时间，期间不能使用函数，冷却时间结束后才可以再次执行该函数。(建议出件 CD 鞋)。

```js
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body style="height: 600vh">
    <script>
      function showTop() {
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop
        console.log('滚动条位置：' + scrollTop)
      }

      function throttle(fn, delay) {
        let valid = true
        return function()  {
          if(!valid) {
            return false // 还在冷却
          }
          valid = false
          setTimeout(() => {
            fn(),
            valid = true
          }, delay)
        }
      }

      window.onscroll = throttle(showTop, 200)
    </script>
  </body>
</html>

```

如果一直拖着滚动条进行滚动，那么会以 200ms 的时间间隔，持续输出当前位置和顶部的距离。

<img :src="$withBase('/debounce01.png')" alt="debounce01"/>

## 应用场景

1. 搜索框input事件，例如要支持输入实时搜索可以使用节流方案（间隔一段时间就必须查询相关内容），或者实现输入间隔大于某个值（如500ms），就当做用户输入完成，然后开始搜索，具体使用哪种方案要看业务需求。
2. 页面resize事件，常见于需要做页面适配的时候。需要根据最终呈现的页面情况进行dom渲染（这种情形一般是使用防抖，因为只需要判断最后一次的变化情况）

