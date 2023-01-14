var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/bbb-video.mp4',
	plugins: [
		artplayerPluginVttThumbnail({
			vtt: '/assets/sample/bbb-thumbnails.vtt',
		})
	]
});