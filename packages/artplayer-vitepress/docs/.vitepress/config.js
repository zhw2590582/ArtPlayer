/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
  base: '/document/',
  title: 'Artplayer',
  appearance: 'dark',
  lastUpdated: true,
  description: 'ArtPlayer.js is a modern and full featured HTML5 video player',
  themeConfig: {
    siteTitle: 'Artplayer',
    logo: '/logo.png',
    nav: [
      { text: '🚩中文版', link: '/' },
      { text: '🚩English', link: '/en/' },
      { text: 'Online Editor', link: 'https://artplayer.org' },
      { text: 'QQ群: 320881312', link: '#' },
      {
        text: '4.6.0',
        items: [
          { text: 'Changelog', link: 'https://github.com/zhw2590582/ArtPlayer/blob/master/CHANGELOG_CN.md' },
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/zhw2590582/ArtPlayer' },
    ],
    sidebar: [
      {
        text: 'Guide',
        collapsible: true,
        items: [
          { text: 'Introduction', link: '/introduction' },
          { text: 'Getting Started', link: '/getting-started' },
        ]
      },
      {
        text: 'Section Title B',
        collapsible: true,
        items: [
          { text: 'Item C', link: '/item-c' },
          { text: 'Item D', link: '/item-d' },
        ]
      }
    ],
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
      { src:"/docs/main.js" }
    ],
    [
      'link',
      { rel:"shortcut icon", href: "/docs/favicon.ico" }
    ]
  ]
}

export default config

