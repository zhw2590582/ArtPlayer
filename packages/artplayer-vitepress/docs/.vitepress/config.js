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
      { text: 'English Docs', link: '/en/', activeMatch: '/en/' },
      { text: 'Online Editor', link: 'https://artplayer.org' },
      { text: '🤖LLMs', link: 'https://artplayer.org/llms.txt' },
      {
        text: '5.3.x',
        items: [
          { text: 'Changelog', link: 'https://github.com/zhw2590582/ArtPlayer/blob/master/CHANGELOG.md' },
          { text: 'Donation', link: 'https://github.com/zhw2590582/ArtPlayer#donations' },
        ],
      },
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
          ],
        },
        {
          text: '组件',
          collapsible: true,
          items: [
            { text: '业务层', link: '/component/layers' },
            { text: '控制器', link: '/component/controls' },
            { text: '右键菜单', link: '/component/contextmenu' },
            { text: '设置面板', link: '/component/setting' },
          ],
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
          ],
        },
        {
          text: '插件',
          collapsible: true,
          items: [
            { text: '🎉 弹幕库', link: '/plugin/danmuku' },
            { text: '弹幕遮罩', link: 'https://artplayer.org/?libs=./uncompiled/artplayer-plugin-danmuku/index.js%0A./uncompiled/artplayer-plugin-danmuku-mask/index.js&example=danmuku.mask' },
            { text: '视频广告', link: 'https://artplayer.org/?libs=./uncompiled/artplayer-plugin-ads/index.js&example=ads' },
            { text: 'Iframe 控制', link: 'https://artplayer.org/?libs=./uncompiled/artplayer-tool-iframe/index.js&example=iframe' },
            { text: 'HLS 控制', link: 'https://artplayer.org/?libs=https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.17/hls.min.js%0A./uncompiled/artplayer-plugin-hls-control/index.js&example=hls.control' },
            { text: 'DASH 控制', link: 'https://artplayer.org/?libs=https://cdnjs.cloudflare.com/ajax/libs/dashjs/4.5.2/dash.all.min.js%0A./uncompiled/artplayer-plugin-dash-control/index.js&example=dash.control' },
            { text: 'VTT 缩略图', link: 'https://artplayer.org/?libs=./uncompiled/artplayer-plugin-vtt-thumbnail/index.js&example=vtt.thumbnail' },
            { text: '多重字幕', link: 'https://artplayer.org/?libs=./uncompiled/artplayer-plugin-multiple-subtitles/index.js&example=multiple.subtitles' },
            { text: 'ASS 字幕 - JASSUB', link: 'https://artplayer.org/?libs=./uncompiled/artplayer-plugin-jassub/index.js&example=jassub' },
            { text: 'Chromecast', link: 'https://artplayer.org/?libs=./uncompiled/artplayer-plugin-chromecast/index.js&example=chromecast' },
            { text: 'VAST 广告', link: 'https://artplayer.org/?libs=./uncompiled/artplayer-plugin-vast/index.js&example=vast' },
            { text: '视频章节', link: 'https://artplayer.org/?libs=./uncompiled/artplayer-plugin-chapter/index.js&example=chapter' },
            { text: '视频背光', link: 'https://artplayer.org/?libs=./uncompiled/artplayer-plugin-ambilight/index.js&example=ambilight' },
            { text: '文档画中画', link: 'https://artplayer.org/?libs=./uncompiled/artplayer-plugin-document-pip/index.js&example=document.pip' },
            { text: '独立音轨', link: 'https://artplayer.org/?libs=./uncompiled/artplayer-plugin-audio-track/index.js&example=audio.track' },
          ],
        },
        {
          text: '第三方库',
          collapsible: true,
          items: [
            { text: 'hls.js', link: 'https://artplayer.org/?libs=https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.17/hls.min.js&example=hls' },
            { text: 'flv.js', link: 'https://artplayer.org/?libs=https://cdnjs.cloudflare.com/ajax/libs/flv.js/1.6.2/flv.min.js&example=flv' },
            { text: 'dash.js', link: 'https://artplayer.org/?libs=https://cdnjs.cloudflare.com/ajax/libs/dashjs/4.5.2/dash.all.min.js&example=dash' },
            { text: 'mpegts.js', link: 'https://artplayer.org/?libs=https://cdn.jsdelivr.net/npm/mpegts.js@1.7.3/dist/mpegts.min.js&example=mpegts' },
            { text: 'webtorrent.js', link: 'https://artplayer.org/?libs=https://cdn.jsdelivr.net/npm/webtorrent@1/webtorrent.min.js&example=webtorrent' },
          ],
        },
        {
          text: '代理',
          collapsible: true,
          items: [
            { text: 'Canvas', link: 'https://artplayer.org/?libs=./uncompiled/artplayer-proxy-canvas/index.js&example=canvas' },
            { text: 'Mediabunny', link: 'https://artplayer.org/?libs=./uncompiled/artplayer-proxy-mediabunny/index.js&example=mediabunny' },
          ],
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
          ],
        },
        {
          text: 'Component',
          collapsible: true,
          items: [
            { text: 'Layers', link: '/en/component/layers' },
            { text: 'Controls', link: '/en/component/controls' },
            { text: 'Contextmenu', link: '/en/component/contextmenu' },
            { text: 'Setting', link: '/en/component/setting' },
          ],
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
          ],
        },
        {
          text: 'Plugins',
          collapsible: true,
          items: [
            { text: 'Advertise', link: 'https://artplayer.org/?libs=./uncompiled/artplayer-plugin-ads/index.js&example=ads' },
            { text: 'Iframe Control', link: 'https://artplayer.org/?libs=./uncompiled/artplayer-tool-iframe/index.js&example=iframe' },
            { text: 'HLS Control', link: 'https://artplayer.org/?libs=https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.17/hls.min.js%0A./uncompiled/artplayer-plugin-hls-control/index.js&example=hls.control' },
            { text: 'DASH Control', link: 'https://artplayer.org/?libs=https://cdnjs.cloudflare.com/ajax/libs/dashjs/4.5.2/dash.all.min.js%0A./uncompiled/artplayer-plugin-dash-control/index.js&example=dash.control' },
            { text: 'VTT Thumbnail', link: 'https://artplayer.org/?libs=./uncompiled/artplayer-plugin-vtt-thumbnail/index.js&example=vtt.thumbnail' },
            { text: 'Multiple Subtitles', link: 'https://artplayer.org/?libs=./uncompiled/artplayer-plugin-multiple-subtitles/index.js&example=multiple.subtitles' },
            { text: 'ASS Subtitle - JASSUB', link: 'https://artplayer.org/?libs=./uncompiled/artplayer-plugin-jassub/index.js&example=jassub' },
            { text: 'Chromecast', link: 'https://artplayer.org/?libs=./uncompiled/artplayer-plugin-chromecast/index.js&example=chromecast' },
            { text: 'VAST', link: 'https://artplayer.org/?libs=./uncompiled/artplayer-plugin-vast/index.js&example=vast' },
            { text: 'Video Chapters', link: 'https://artplayer.org/?libs=./uncompiled/artplayer-plugin-chapter/index.js&example=chapter' },
            { text: 'Video Ambilight', link: 'https://artplayer.org/?libs=./uncompiled/artplayer-plugin-ambilight/index.js&example=ambilight' },
            { text: 'Document PIP', link: 'https://artplayer.org/?libs=./uncompiled/artplayer-plugin-document-pip/index.js&example=document.pip' },
            { text: 'Audio Track', link: 'https://artplayer.org/?libs=./uncompiled/artplayer-plugin-audio-track/index.js&example=audio.track' },
          ],
        },
        {
          text: 'Libraries',
          collapsible: true,
          items: [
            { text: 'hls.js', link: 'https://artplayer.org/?libs=https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.17/hls.min.js&example=hls' },
            { text: 'flv.js', link: 'https://artplayer.org/?libs=https://cdnjs.cloudflare.com/ajax/libs/flv.js/1.6.2/flv.min.js&example=flv' },
            { text: 'dash.js', link: 'https://artplayer.org/?libs=https://cdnjs.cloudflare.com/ajax/libs/dashjs/4.5.2/dash.all.min.js&example=dash' },
            { text: 'mpegts.js', link: 'https://artplayer.org/?libs=https://cdn.jsdelivr.net/npm/mpegts.js@1.7.3/dist/mpegts.min.js&example=mpegts' },
            { text: 'webtorrent.js', link: 'https://artplayer.org/?libs=https://cdn.jsdelivr.net/npm/webtorrent@1/webtorrent.min.js&example=webtorrent' },
          ],
        },
        {
          text: 'Proxys',
          collapsible: true,
          items: [
            { text: 'Canvas', link: 'https://artplayer.org/?libs=./uncompiled/artplayer-proxy-canvas/index.js&example=canvas' },
            { text: 'Mediabunny', link: 'https://artplayer.org/?libs=./uncompiled/artplayer-proxy-mediabunny/index.js&example=mediabunny' },
          ],
        },
      ],
    },
    editLink: {
      pattern: 'https://github.com/zhw2590582/ArtPlayer/tree/master/packages/artplayer-vitepress/docs/:path',
      text: 'Edit this page on GitHub',
    },
  },
  markdown: {
    lineNumbers: true,
  },
  head: [
    [
      'script',
      { src: '/document/main.js' },
    ],
    [
      'link',
      { rel: 'stylesheet', href: '/document/style.css' },
    ],
    [
      'link',
      { rel: 'shortcut icon', href: '/document/favicon.ico' },
    ],
    [
      'meta',
      { name: 'google-adsense-account', content: 'ca-pub-8579453810848662' },
    ],
    [
      'script',
      { async: true, src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8579453810848662', crossorigin: 'anonymous' },
    ],
  ],
}

export default config
