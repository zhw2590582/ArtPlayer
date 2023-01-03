/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
  base: '/docs/',
  title: 'Artplayer',
  appearance: 'dark',
  lastUpdated: true,
  description: 'ArtPlayer.js is a modern and full featured HTML5 video player',
  themeConfig: {
    siteTitle: 'Artplayer',
    logo: '/logo.png',
    nav: [
      { text: 'Guide', link: '/guide' },
      { text: 'Configs', link: '/configs' },
      { text: 'Changelog', link: 'https://github.com/...' },
      {
        text: 'Dropdown Menu',
        items: [
          { text: 'Item A', link: '/item-1' },
          { text: 'Item B', link: '/item-2' },
          { text: 'Item C', link: '/item-3' },
          {
            items: [
              { text: 'Section A Item A', link: '...' },
              { text: 'Section B Item B', link: '...' }
            ]
          }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
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
      pattern: 'https://github.com/vuejs/vitepress/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2019-present Evan You'
    }
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

