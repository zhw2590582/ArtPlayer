// npm i artplayer-plugin-multiple-subtitles
// import artplayerPluginMultipleSubtitles from 'artplayer-plugin-multiple-subtitles';

var art = new Artplayer({
	container: '.artplayer-app',
	url: '/assets/sample/video.mp4',
	setting: true,
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
		})
	],
	settings: [
        {
            width: 200,
            html: 'Subtitle',
            tooltip: 'Double',
            icon: '<img width="22" heigth="22" src="/assets/img/subtitle.svg">',
            selector: [
                {
                    html: 'Display',
                    tooltip: 'Show',
                    switch: true,
                    onSwitch: function (item) {
                        item.tooltip = item.switch ? 'Hide' : 'Show';
						// 显示/隐藏字幕
						// Show/hide subtitles
						art.subtitle.show = !item.switch;
                        return !item.switch;
                    },
                },
				{
                    html: 'Reverse',
                    tooltip: 'Off',
                    switch: false,
                    onSwitch: function (item) {
                        item.tooltip = item.switch ? 'Off' : 'On';
						// 修改字幕顺序
						// Change the order of subtitles
						if (item.switch) {
							art.plugins.multipleSubtitles.tracks(['chinese', 'japanese']);
						} else {
							art.plugins.multipleSubtitles.tracks(['japanese', 'chinese']);

						}
                        return !item.switch;
                    },
                },
                {
                    default: true,
                    html: 'Double',
                    name: 'double',
                },
                {
                    html: 'Chinese',
                    name: 'chinese',
                },
                {
                    html: 'Japanese',
                    name: 'japanese',
                },
            ],
            onSelect: function (item) {
				if (item.name === 'double') {
					// 重置字幕
					// Reset subtitles
					art.plugins.multipleSubtitles.reset();
				} else {
					// 显示单个字幕
					// Show single subtitle
					art.plugins.multipleSubtitles.tracks([item.name]);
				}
                return item.html;
            },
        },
    ],
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