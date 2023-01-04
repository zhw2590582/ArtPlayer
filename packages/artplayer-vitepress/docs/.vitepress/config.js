/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
  base: '/document/',
  title: 'Artplayer.js',
  appearance: 'dark',
  lastUpdated: true,
  description: 'ArtPlayer.js is a modern and full featured HTML5 video player',
  themeConfig: {
    siteTitle: 'Artplayer.js',
    logo: '/logo.png',
    nav: [
      { text: '中文版', link: '/' },
      { text: 'English', link: '/en/', activeMatch: '/en/' },
      { text: 'Online Editor', link: 'https://artplayer.org' },
      { text: 'QQ群: 320881312', link: '#' },
      {
        text: '4.6.x',
        items: [
          { text: 'Changelog', link: 'https://github.com/zhw2590582/ArtPlayer/blob/master/CHANGELOG_CN.md' },
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/zhw2590582/ArtPlayer' },
    ],
    sidebar: {
      '/': [
        {
          text: '开始',
          collapsible: true,
          items: [
            { text: '安装使用', link: '/start/install' },
            { text: '基础选项', link: '/start/option' },
          ]
        },
        {
          text: '高级',
          collapsible: true,
          items: [
            { text: '实例属性', link: '/advanced/property' },
            { text: '实例事件', link: '/advanced/event' },
            { text: '内置属性', link: '/advanced/built-in' },
            { text: '静态属性', link: '/advanced/class' },
            { text: '全局属性', link: '/advanced/global' },
          ]
        },
        {
          text: '插件',
          collapsible: true,
          items: [
            { text: '弹幕库', link: '/plugin/danmuku' },
            { text: '广告', link: '/plugin/ads' },
            { text: 'Iframe', link: '/plugin/iframe' },
            { text: 'Hls 画质', link: '/plugin/hls-quality' },
            { text: '控制器 UI', link: '/plugin/control-ui' },
          ]
        },
        {
          text: '第三方库',
          collapsible: true,
          items: [
            { text: 'hls.js', link: '/library/hls' },
            { text: 'flv.js', link: '/library/flv' },
            { text: 'dash.js', link: '/library/dash' },
          ]
        },
        {
          text: '常见问题',
          collapsible: true,
          items: [
            { text: '问题1', link: '/question/hls' },
            { text: '问题2', link: '/question/flv' },
            { text: '问题3', link: '/question/dash' },
          ]
        },
      ],
      '/en/': [
        {
          text: 'Quick start',
          collapsible: true,
          items: [
            { text: 'Install', link: '/en/start/install' },
            { text: 'Option', link: '/en/start/option' },
          ]
        },
        {
          text: 'Advanced',
          collapsible: true,
          items: [
            { text: 'Instance Properties', link: '/en/advanced/property' },
            { text: 'Instance Events', link: '/en/advanced/event' },
            { text: 'Built In Properties', link: '/advanced/built-in' },
            { text: 'Static Properties', link: '/en/advanced/class' },
            { text: 'Global Properties', link: '/en/advanced/global' },
          ]
        },
        {
          text: 'Plugins',
          collapsible: true,
          items: [
            { text: 'Danmuku', link: '/en/plugin/danmuku' },
            { text: 'Ads', link: '/en/plugin/ads' },
            { text: 'Iframe', link: '/en/plugin/iframe' },
            { text: 'Hls Quality', link: '/en/plugin/hls-quality' },
            { text: 'Control UI', link: '/en/plugin/control-ui' },
          ]
        },
        {
          text: 'Libraries',
          collapsible: true,
          items: [
            { text: 'hls.js', link: '/en/library/hls' },
            { text: 'flv.js', link: '/en/library/flv' },
            { text: 'dash.js', link: '/en/library/dash' },
          ]
        },
        {
          text: 'Questions',
          collapsible: true,
          items: [
            { text: 'question1', link: '/question/1' },
            { text: 'question2', link: '/question/2' },
            { text: 'question3', link: '/question/3' },
          ]
        },
      ],
    },
    editLink: {
      pattern: 'https://github.com/zhw2590582/ArtPlayer/packages/artplayer-vitepress/docs/:path',
      text: 'Edit this page on GitHub'
    },
  },
  markdown: {
    lineNumbers: true
  },
  head: [
    [
      'script',
      { src: "/docs/main.js" }
    ],
    [
      'link',
      { rel: "shortcut icon", href: "/docs/favicon.ico" }
    ]
  ]
}

export default config
