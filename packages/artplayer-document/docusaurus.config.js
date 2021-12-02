const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

module.exports = {
    title: 'Artplayer.js',
    tagline: 'Public Product Api Document',
    url: 'https://artplayer.org',
    baseUrl: '/document/',
    onBrokenLinks: 'ignore',
    onBrokenMarkdownLinks: 'ignore',
    organizationName: 'zhw2590582',
    projectName: 'Artplayer',
    favicon: 'img/favicon.ico',
    clientModules: [require.resolve('./src/script/main.js')],
    themeConfig: {
        hideableSidebar: true,
        navbar: {
            title: 'Artplayer.js',
            logo: {
                alt: 'Artplayer.js',
                src: 'img/logo.png',
                href: 'https://artplayer.org/document',
                target: '_self',
                width: 26,
                height: 30,
            },
            items: [
                {
                    href: 'https://artplayer.org',
                    position: 'left',
                    label: 'Online Editor',
                },
                {
                    href: 'https://github.com/zhw2590582/ArtPlayer',
                    position: 'left',
                    label: 'Github',
                },
                {
                    href: '#',
                    label: 'QQ群: 320881312',
                    position: 'right',
                },
                {
                    label: 'v 4.x.x',
                    position: 'right',
                    items: [
                        {
                            label: 'v 3.x.x',
                            href: 'https://artplayer.org/document_v3/',
                        },
                    ],
                },
                {
                    label: 'English',
                    position: 'right',
                    items: [
                        {
                            label: 'English',
                            href: '/',
                        },
                        {
                            label: '中文',
                            href: '/zh-cn/',
                        },
                    ],
                },
            ],
        },
        footer: {
            style: 'dark',
            copyright: `Copyright © ${new Date().getFullYear()} Artplayer.js, Inc. Built with Docusaurus.`,
        },
        prism: {
            theme: lightCodeTheme,
            darkTheme: darkCodeTheme,
        },
    },
    plugins: [require.resolve('docusaurus-lunr-search')],
    presets: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    path: './docs',
                    routeBasePath: '/',
                    sidebarPath: require.resolve('./sidebars.js'),
                },
                blog: false,
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            },
        ],
    ],
};
