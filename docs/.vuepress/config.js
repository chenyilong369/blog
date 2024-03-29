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
          {text: 'Babel', link: '/Babel/'},
          {text: 'CSS', link: '/CSS/'},
          {text: 'JS', link: '/JS/'},
          {text: 'TS', link: '/TS/'},
          {text: 'HTTP', link: '/HTTP/'},
          {text: '浏览器', link: '/internet/'},
          {text: '性能', link: '/performance/'},
          {text: '技术杂谈', link: '/technology/'},
          {text: '可视化', link: '/dataVisualization/'},
          {
            text: 'React', 
            items: [
              {
                text: 'React基础',
                link: '/React/ReactBase/'
              },
              {
                text: 'React扩展',
                link: '/React/ReactExtend/'
              },
              {
                text: 'React API',
                link: '/React/ReactApi/'
              }
            ]
          },
          {
            text: 'Vue',
            items: [
              {
                text: 'Vue基础',
                link: '/Vue/VueBase/'
              }
            ]
          },
        ]
      },
      {
        text: '后端',
        ariaLabel: 'backend',
        items: [
          {text: 'node 基础', link: '/backend/node/'},
        ]
      },
      {
        text: '机器学习',
        ariaLabel: 'machineLearning',
        items: [
          {text: '数学基础', link:'/machineLearning/math/'}
        ]
      },
      {
        text: '面试', 
        ariaLabel: 'interface',
        items: [
          {text: '前端基础', link: '/interface/webDesignBase/'},
          {text: '面试经历', link: '/interface/interfaceEnd/'}
        ]
      },
      {
        text: '算法', 
        ariaLabel: 'algorithm', 
        items: [
          {text: 'DP', link: '/algorithm/dp/'},
        ]
      },
      {
        text:'leetcode',
        ariaLabel: 'leetcode',
        items: [
          {text: '2021', link: '/leetcode/2021/'},
          {text: '2023', link: '/leetcode/2023/'}
        ]
      },
      {text: 'Github', link: 'https://github.com/chenyilong369'}
    ],
    sidebar: {
      '/CSS/': getCSS(),
      '/JS/': getWebDesign(),
      '/TS/': getTS(),
      '/algorithm/': getAlgroithm(),
      '/HTTP/': getHTTP(),
      '/internet/': getInternet(),
      '/performance/': getPerformance(),
      '/interface/webDesignBase/': getwebDesignBase(),
      '/interface/interfaceEnd/': getZijie(),
      '/technology/': getTechnology(),
      '/machineLearning/math/': getMachineLearningMath(),
      '/leetcode/2021/': getLeetcode2021(),
      '/leetcode/2023/': getLeetcode2023(),
      '/algorithm/dp/': getDP(),
      '/React/ReactBase/': getReactBase(),
      '/React/ReactExtend/': getReactExtend(),
      '/React/ReactApi/':getReactApi(),
      '/Vue/VueBase/': getVueBase(),
      '/backend/node/': getNode(),
      '/Babel/': getBabel(),
      '/dataVisualization/': getDataVisualization(),
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
        'js/curry',
        'js/prototype',
        'js/callStack',
        'js/extend',
        'js/copy',
        'js/templete',
        'js/eventType',
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
        'beforeHTTP',
        'whatHTTP',
        'HTTP1',
        'HTTP2',
        'HTTPS',
        'httpStorage'
      ]
    }
  ]
}

function getDataVisualization() {
  return [
    {
      title: 'dataVisualization',
      children: [
        'canvasCompress',
        'introduce',
        'theFirst'
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
        'task',
        'setTimeout',
        'XMLHttpRequest',
        'storage',
        'sameOrigin',
        'XSS',
        'CSRF',
        'navigation',
        'requestAnimationFrame',
        'Ajax'
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
        'layout',
        'flex',
        'Sass',
        'css',
        'Css3'
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
        'cache',
        'SSR',
        'picture'
      ]
    }
  ]
}

function getwebDesignBase() {
  return [
    {
      title: '面试',
      children: [
        'webDesignBase'
      ]
    }
  ]
}



function getTechnology() {
  return [
    {
      title: '技术杂谈',
      children: [
        'PWA',
        'login'
      ]
    }
  ]
}

function  getMachineLearningMath() {
  return [
    {
      title: '数学基础',
      children: [
        'daoshu'
      ]
    }
  ]
}

function getLeetcode2021() {
  return [
    {
      title: '2021-03',
      children:[
        '03/03_01'
      ]
    }
  ]
}

function getLeetcode2023() {
  return [
    {
      title: '2023-09',
      children:[
        '09/09_06'
      ]
    }
  ]
}

function getDP() {
  return [
    {
      title: 'DP',
      children: [
        'base',
        'validity'
      ]
    }
  ]
}

function getReactExtend() {
  return [
    {
      title: 'React扩展',
      children: [
        'DVA',
        'Redux',
        'ReactRouter',
        'writeReact'
      ]
    }
  ]
}

function getReactApi() {
  return [
    {
      title: 'React Api',
      children: [
        'React',
        'hook',
        'tool'
      ]
    }
  ]
}

function getReactBase() {
  return [
    {
      title: 'React 基础',
      children: [
        'JSX',
        'itemRender',
        'props',
        'queue',
        'hooks',
        'VirtualDOM',
        'stack',
        'setState',
        'Fiber'
      ]
    }
  ]
}

function getZijie(){
  return [
    {
      title: '面试经历',
      children: [
        'zijie'
      ]
    }
  ]
}

function getVueBase() {
  return [
    {
      title: 'Vue基础',
      children: [
        'xiangying'
      ]
    }
  ]
}

function getTS() {
  return [
    {
      title: 'TS',
      children: [
        'type',
        'interface',
        'class'
      ]
    }
  ]
}

function getNode() {
  return [
    {
      title: 'node 基础',
      children: [
        'IO',
        'nodeEvent',
        'eventLoop',
        'net',
        'someTools',
        'someUse',
        'path'
      ]
    }
  ]
}

function getBabel() {
  return [
    {
      title: 'Babel',
      children: [
        'BabelBase'
      ]
    }
  ]
}