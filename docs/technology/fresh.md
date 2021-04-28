# 原生 js 实现下拉刷新，上拉加载更多

这里先贴上完成的代码：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
    />
    <title>Document</title>
    <style>
      body {
        margin: 0;
      }

      html,
      body {
        height: 100%;
      }

      header,
      footer {
        width: 100%;
        height: 40px;
        position: absolute;
        left: 0;
        text-align: center;
        line-height: 40px;
        background: #999999;
        color: #ffffff;
        z-index: 999;
      }

      header {
        top: 0;
      }

      footer {
        bottom: 0;
      }
      ul {
        display: block;
        width: 100%;
        position: absolute;
        top: 40px;
        bottom: 40px;
        overflow: auto;
        list-style: none;
        padding: 0;
        margin: 0;
      }

      ul > li {
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-indent: 20px;
        border-bottom: 1px solid #666666;
        background: #ffffff;
        color: #333333;
      }
      /* 下拉刷新的时候做 */
      #loading,
      #loadEnd {
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #333333;
        transition: all 0.5s;
        position: absolute;
        z-index: 1;
        color: #ffffff;
      }
      #loading {
        background: orange;
        top: 0;
      }
      #loadEnd {
        background: green;
        bottom: 0;
      }
    </style>
  </head>

  <body>
    <header>我是头部</header>
    <section id="con">
      <div id="loading">加载中......</div>
      <ul id="list"></ul>
    </section>
    <div id="loadEnd">已加载全部数据</div>
    <footer>我是尾部</footer>
  </body>

  <script>
    //获取数据
    let list = document.getElementById('list')
    var loading = document.getElementById('loading')
    var loadEnd = document.getElementById('loadEnd')
    function getData() {
      let html = ''
      for (var i = 0; i < 20; i++) {
        html += '<li>我是第' + (i + 1) + '个li</li>'
      }
      let length = list.children.length
      if (length === 0) {
        list.innerHTML = html
      } else if (length > 0 && length < 100) {
        let newHtml = parseDom(html)
        insertAfter(newHtml, list.children[length - 1])
      } else if (length === 100) {
        console.log('已经到底了')
        list.style.bottom = '80px'
        loadEnd.style.bottom = '40px'
      }
    }

    function parseDom(arg) {
      let newObj = document.createElement('div')
      newObj.innerHTML = arg
      return [...newObj.childNodes]
    }

    function insertAfter(newHtml, targetElement) {
      newHtml.forEach((element) => {
        console.log(element)
        //在后面插入元素
        targetElement.before(element)
      })
    }

    //初始加载函数
    window.onload = () => {
      //初始请求数据
      getData()
      list.addEventListener('scroll', function () {
        //ul的高度 不变的 定死的
        let listH = list.clientHeight
        //所有li总高度
        let contentH = this.childNodes.length * 41
        if (this.scrollTop === 0) {
          list.style.top = '80px'
          loading.style.top = '40px'
          //刷新数据
          setTimeout(() => {
            loading.style.top = '0'
            list.style.top = '40px'
          }, 1000)
        }
        //差值
        let differValue = contentH - listH
        if (this.scrollTop + 50 >= differValue) {
          console.log('该更新了')
          getData()
        }
      })
    }
  </script>
</html>

```



