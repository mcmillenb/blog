const path = require('path');

module.exports = {
  themeConfig: {
    logo: '/assets/images/dino.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Posts', link: '/posts/' }
    ],
    sidebar: [
      {
        title: 'Posts',
        collapsable: false,
        children: [
          '/posts/dnd-party-app',
          '/posts/node-project',
          '/posts/push-to-github'
        ]
      }
    ],
    lastUpdated: 'Last Updated',
    repo: 'mcmillenb/blog'
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.join(__dirname, '../')
      }
    }
  }
}
