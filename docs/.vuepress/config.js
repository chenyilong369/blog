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
      collapsable: false,
      children: [
        'js01/type',
        'js01/this',
        'js01/scope',
        'js01/prototype',
        'js01/callStack',
        
      ]
    },
    {
      title: 'V8',
      collapsable: false,
      children: [
        'V8/storeAndDelete',
        'V8/Compiler'
      ]
    },
  ]
}

function getAlgroithm() {
  return [
    {
      title: 'DP',
      collapsable: false,
      children: [
        'dp/validity',
        'dp/base',
      ]
    }
  ]
}
