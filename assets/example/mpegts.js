// npm i mpegts
// import mpegts from 'mpegts';

function playFlv(video, url, art) {
	if (mpegts.isSupported()) {
		if (art.flv) art.flv.destroy();

		const flv = mpegts.createPlayer({
			type: 'flv',
			url: url
		});
		flv.attachMediaElement(video);
		flv.load();
		flv.play();

		art.flv = flv;
		art.on('destroy', () => flv.destroy());
	} else {
		art.notice.show = 'Unsupported playback format: flv';
	}
}

var art = new Artplayer({
	container: '.artplayer-app',
	url: '/assets/sample/video.flv',
	type: 'flv',
	customType: {
		flv: playFlv,
	},
});

art.on('ready', () => {
	console.info(art.flv);
});