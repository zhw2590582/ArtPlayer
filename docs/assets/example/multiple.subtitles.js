var art = new Artplayer({
	container: '.artplayer-app',
	url: '/assets/sample/video.mp4',
	plugins: [
		artplayerPluginMultipleSubtitles({
			subtitles: [
				{
					name: 'chinese',
					url: '/assets/sample/subtitle.cn.srt',
				},
				{
					name: 'japanese',
					url: '/assets/sample/subtitle.jp.srt',
				}
			],
			onMerge(trees) {
				console.log(trees)
			}
		})
	]
});

// 自定义你自己的样式，请勿复制以下代码
// Customize your own style, please do not copy the following code
const style = `
.art-subtitle-chinese {
	color: red;
	font-size: 18px;
}

.art-subtitle-japanese {
	color: yellow;
	font-size: 12px;
}
`;

const $style = document.getElementById('artplayer-subtitle-style');
if ($style) {
	$style.textContent = style;
} else {
	const $style = document.createElement('style');
	$style.id = 'artplayer-subtitle-style';
	$style.textContent = style;
	document.head.appendChild($style);
}