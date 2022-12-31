var art = new Artplayer({
    container: '.artplayer-app',
    theme: '#23ade5',
    fullscreen: true,
    fullscreenWeb: true,
    plugins: [
        artplayerPluginAliyundrive({
            onlyOnFullscreen: true,
            playlist: [
                {
                    poster: '/assets/sample/poster.jpg',
                    name: 'Your Name',
                    time: '2022.03.07',
                    quality: [
                        {
                            default: true,
                            html: '1080P',
                            url: '/assets/sample/video.mp4?p=1080',
                        },
                        {
                            html: '720P',
                            url: '/assets/sample/video.mp4?p=720',
                        },
                    ],
                },
                {
                    poster: '/assets/sample/test.png',
                    name: 'The Son of Weather',
                    time: '2022.03.07',
                    quality: [
                        {
                            default: true,
                            html: '1080P',
                            url: '/assets/sample/test1.mp4?p=1080',
                        },
                        {
                            html: '720P',
                            url: '/assets/sample/test1.mp4?p=720',
                        },
                    ],
                }
            ],
        })
    ],
});