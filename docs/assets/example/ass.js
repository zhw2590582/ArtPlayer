var art = new Artplayer({
    container: '.artplayer-app',
    url: 'https://artplayer.org/assets/sample/video.mp4',
    autoSize: true,
    plugins: [artplayerPluginAss('/assets/sample/subtitle.ass')],
});
