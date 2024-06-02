// npm i artplayer-plugin-chapter
// import artplayerPluginChapter from 'artplayer-plugin-chapter';

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoSize: true,
	fullscreen: true,
	fullscreenWeb: true,
    plugins: [
        artplayerPluginChapter({
            chapters: [
                { start: 0, end: 18, text: 'Chapter 1' },
                { start: 18, end: 36, text: 'Chapter 2' },
                { start: 36, end: 54, text: 'Chapter 3' },
                { start: 54, end: 72, text: 'Chapter 4' },
                { start: 72, end: 90, text: 'Chapter 5' },
            ]
        }),
    ],
});