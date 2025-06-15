// npm i artplayer-plugin-chapter
// import artplayerPluginChapter from 'artplayer-plugin-chapter';

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoSize: true,
	fullscreen: true,
	fullscreenWeb: true,
	miniProgressBar: true,
	autoOrientation: true,
	thumbnails: {
        url: '/assets/sample/thumbnails.png',
        number: 60,
        column: 10,
    },
    plugins: [
        artplayerPluginChapter({
            chapters: [
                { start: 0, end: 18, title: 'One more chance' },
                { start: 18, end: 36, title: '谁でもいいはずなのに' },
                { start: 36, end: 54, title: '夏の想い出がまわる' },
                { start: 54, end: 72, title: 'こんなとこにあるはずもないのに' },
                { start: 72, end: Infinity, title: '终わり' },
            ]
        }),
    ],
});