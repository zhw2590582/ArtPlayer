/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
  base: '/document/',
  outDir: '../../../docs/document',
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
      {
        text: '5.1.x',
        items: [
          { text: 'Changelog', link: 'https://github.com/zhw2590582/ArtPlayer/blob/master/CHANGELOG_CN.md' },
          { text: 'Donation', link: 'https://github.com/zhw2590582/ArtPlayer#donations' },
          { text: 'Q群: 320881312', link: 'https://github.com/zhw2590582/ArtPlayer#qq-group' },
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
            { text: '安装使用', link: '/' },
            { text: '基础选项', link: '/start/option' },
            { text: '语言设置', link: '/start/i18n' },
          ]
        },
        {
          text: '组件',
          collapsible: true,
          items: [
            { text: '业务层', link: '/component/layers' },
            { text: '控制器', link: '/component/controls' },
            { text: '右键菜单', link: '/component/contextmenu' },
            { text: '设置面板', link: '/component/setting' },
          ]
        },
        {
          text: '高级',
          collapsible: true,
          items: [
            { text: '实例属性', link: '/advanced/property' },
            { text: '高级属性', link: '/advanced/built-in' },
            { text: '静态属性', link: '/advanced/class' },
            { text: '全局属性', link: '/advanced/global' },
            { text: '实例事件', link: '/advanced/event' },
            { text: '编写插件', link: '/advanced/plugin' },
          ]
        },
        {
          text: '插件',
          collapsible: true,
          items: [
            { text: '弹幕库', link: '/plugin/danmuku' },
            { text: '视频广告', link: '/plugin/ads' },
            { text: 'Iframe 控制', link: '/plugin/iframe' },
            { text: 'Hls 画质', link: '/plugin/hls-quality' },
            { text: 'Dash 画质', link: '/plugin/dash-quality' },
            { text: '控制器皮肤', link: '/plugin/control-ui' },
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
      ],
      '/en/': [
        {
          text: 'Quick start',
          collapsible: true,
          items: [
            { text: 'Install', link: '/en/' },
            { text: 'Option', link: '/en/start/option' },
            { text: 'Language', link: '/en/start/i18n' },
          ]
        },
        {
          text: 'Component',
          collapsible: true,
          items: [
            { text: 'Layers', link: '/en/component/layers' },
            { text: 'Controls', link: '/en/component/controls' },
            { text: 'Contextmenu', link: '/en/component/contextmenu' },
            { text: 'Setting', link: '/en/component/setting' },
          ]
        },
        {
          text: 'Advanced',
          collapsible: true,
          items: [
            { text: 'Instance Property', link: '/en/advanced/property' },
            { text: 'Advanced Property', link: '/en/advanced/built-in' },
            { text: 'Static Property', link: '/en/advanced/class' },
            { text: 'Global Property', link: '/en/advanced/global' },
            { text: 'Instance Event', link: '/en/advanced/event' },
            { text: 'Writing Plugin', link: '/en/advanced/plugin' },
          ]
        },
        {
          text: 'Plugins',
          collapsible: true,
          items: [
            { text: 'Video Ads', link: '/en/plugin/ads' },
            { text: 'Iframe Control', link: '/en/plugin/iframe' },
            { text: 'Hls Quality', link: '/en/plugin/hls-quality' },
            { text: 'Dash Quality', link: '/en/plugin/dash-quality' },
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
      ],
    },
    editLink: {
      pattern: 'https://github.com/zhw2590582/ArtPlayer/tree/master/packages/artplayer-vitepress/docs/:path',
      text: 'Edit this page on GitHub'
    },
  },
  markdown: {
    lineNumbers: true
  },
  head: [
    [
      'script',
      { src: "/document/main.js" }
    ],
    [
      'link',
      { rel: "stylesheet", href: "/document/style.css" }
    ],
    [
      'link',
      { rel: "shortcut icon", href: "/document/favicon.ico" }
    ]
  ]
}

export default config
