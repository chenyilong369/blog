module.exports = {
  base: '/jschen/',
  dest: 'dist',
  title: 'jschen Blog',
  description: '前端人,前端魂',
  themeConfig: {
    editLinks: false,
    docsDir: 'docs',
    nav: [],
    sidebar: [
      {
        title: 'js基础',
        collapsable: false,
        children: [
          'js01/type',
          'js01/this',
          'js01/closure',
          'js01/prototype'
        ]
      },
    ]
  }
}
