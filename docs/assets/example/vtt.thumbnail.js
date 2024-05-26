// npm i artplayer-plugin-vtt-thumbnail
// import artplayerPluginVttThumbnail from 'artplayer-plugin-vtt-thumbnail';

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/bbb-video.mp4',
	plugins: [
		artplayerPluginVttThumbnail({
			vtt: '/assets/sample/bbb-thumbnails.vtt',
		})
	]
});