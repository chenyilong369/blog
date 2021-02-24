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
    smoothScroll: true,
    nav: [
      {text: '前端', link: '/webDesign/'},
      {text: '算法', link: '/algorithm/'},
      {text: 'Github', link: 'https://github.com/chenyilong369'}
    ],
    sidebar: {
      '/webDesign/': getWebDesign(),
      '/algorithm/': getAlgroithm()
    }
  }
}

function getWebDesign() {
  return [
    {
      title: 'js基础',
      children: [
        'js01/type',
        'js01/this',
        'js01/scope',
        'js01/prototype',
        'js01/callStack',
        'js01/copy',
        'js01/templete',
        'js01/event',
        'js01/generator',
        'js01/promise',
        'js01/promiseA+',
        'js01/async',
        'js01/writeCallApplyBind',
        'js01/writeInstanceof',
        'js01/writeNew',
        'js01/writePromise',
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
      title: '浏览器',
      children: [
        'internet/event',
        'internet/setTimeout',
        'internet/cross',
        'internet/storage'
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
