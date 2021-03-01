module.exports = {
  plugins: [
    'latex' // or 'vuepress-plugin-latex'
  ],
  base: '/',
  dest: 'dist',
  title: 'jschen Blog',
  description: '前端人,前端魂',
  themeConfig: {
    editLinks: false,
    docsDir: 'docs',
    lastUpdated: 'Last Updated',
    smoothScroll: true,
    nav: [
      {
        text: '前端',
        ariaLabel: 'webDesign',
        items: [
          {text: 'CSS', link: '/CSS/'},
          {text: 'JS', link: '/JS/'},
          {text: 'HTTP', link: '/HTTP/'},
          {text: '浏览器', link: '/internet/'},
          {text: '性能', link: '/performance/'},
        ]
      },
      {text: '算法', link: '/algorithm/'},
      {text: 'Github', link: 'https://github.com/chenyilong369'}
    ],
    sidebar: {
      '/CSS/': getCSS(),
      '/JS/': getWebDesign(),
      '/algorithm/': getAlgroithm(),
      '/HTTP/': getHTTP(),
      '/internet/': getInternet(),
      '/performance/': getPerformance(),
    }
  }
}

function getWebDesign() {
  return [
    {
      title: 'js基础',
      children: [
        'js/type',
        'js/this',
        'js/array',
        'js/scope',
        'js/prototype',
        'js/callStack',
        'js/extend',
        'js/copy',
        'js/templete',
        'js/event',
        'js/generator',
        'js/promise',
        'js/promiseA+',
        'js/async',
        'js/writeCallApplyBind',
        'js/writeInstanceof',
        'js/writeNew',
        'js/writePromise',
        'js/writeArray',
        'js/writeJSON',
      ]
    },
    {
      title: 'V8',
      children: [
        'V8/storeAndDelete',
        'V8/Compiler'
      ]
    },
    {
      title: 'DOM',
      children: [
        'DOM/quickUseDOM'
      ]
    }
  ]
}

function getAlgroithm() {
  return [
    {
      title: 'DP',
      children: [
        'dp/validity',
        'dp/base',
      ]
    }
  ]
}

function getHTTP() {
  return [
    {
      title: 'HTTP',
      
      children: [
        'whatHTTP',
        'HTTP1',
        'HTTP2'
      ]
    }
  ]
}

function getInternet() {
  return [
    {
      title: '浏览器',
      children: [
        'cross',
        'event',
        'setTimeout',
        'XMLHttpRequest',
        'storage',
        'sameOrigin',
        'XSS',
      ]
    }
  ]
}

function getCSS() {
  return [
    {
      title: 'CSS',
      children: [
        'box',
        'internet',
        'style',
        'layout'
      ]
    }
  ]
}

function getPerformance() {
  return [
    {
      title: '性能',
      children: [
        'debounce',
      ]
    }
  ]
}
