var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    flip: true,
    playbackRate: true,
    aspectRatio: true,
    subtitleOffset: true,
    settings: [
        {
            width: 200,
            html: 'Subtitle',
            name: 'subtitle',
            tooltip: 'Bilingual',
            icon: '<img width="22" heigth="22" src="/assets/img/subtitle.svg">',
            selector: [
                {
                    html: 'Display',
                    tooltip: 'Show',
                    switch: true,
                    onSwitch: function (item) {
                        item.tooltip = item.switch ? 'Hide' : 'Show';
                        art.subtitle.show = !item.switch;
                        return !item.switch;
                    },
                },
                {
                    default: true,
                    html: 'Bilingual',
                    url: '/assets/sample/subtitle.srt',
                },
                {
                    html: 'Chinese',
                    url: '/assets/sample/subtitle.cn.srt',
                },
                {
                    html: 'Japanese',
                    url: '/assets/sample/subtitle.jp.srt',
                },
            ],
            onSelect: function (item) {
                art.subtitle.switch(item.url, {
                    name: item.html,
                });
                return item.html;
            },
            mounted: function (...args) {
                console.info(args);
            },
        },
        {
            html: 'Switcher',
            icon: '<img width="22" heigth="22" src="/assets/img/state.svg">',
            tooltip: 'OFF',
            switch: false,
            onSwitch: function (item) {
                item.tooltip = item.switch ? 'OFF' : 'ON';
                console.info('You clicked on the custom switch', item.switch);
                return !item.switch;
            },
            mounted: function (...args) {
                console.info(args);
            },
        },
        {
            html: 'Slider',
            icon: '<img width="22" heigth="22" src="/assets/img/state.svg">',
            tooltip: '5x',
            range: [5, 1, 10, 0.1],
            onRange: function (item) {
                return item.range[0] + 'x';
            },
            mounted: function (...args) {
                console.info(args);
            },
        },
    ],
}, async () => {
    const { sleep } = Artplayer.utils;
    art.setting.show = true;
    console.log(art.setting.builtin);
    console.log(art.setting.find('aspect-ratio'));
    console.log(art.setting.find('aspect-ratio2'));
    await sleep(1000);
    art.setting.resize();
    await sleep(1000);
    art.setting.inactivate(art.setting.find('subtitle'));
    art.setting.remove('aspect-ratio');
    try {
        art.setting.remove('aspect-ratio2');
    } catch (error) {
        console.log(error.message);
    }
    await sleep(1000);
    art.setting.update({
        name: 'subtitle-offset',
        html: 'new offset',
        range: [5, -11, 11, 1],
    });
    await sleep(1000);
    art.setting.find('subtitle-offset').range = [0, -0, 10, 1];
    await sleep(1000);
    art.setting.update({
        name: 'subtitle-offset2',
        html: 'new offset 2',
        range: [5, -11, 11, 1],
        onChange(item) {
            return item.range[0] + 's';
        },
    });
    await sleep(1000);
    art.setting.update({
        name: 'flip',
        html: 'new flip',
        tooltip: 'OFF',
        switch: false,
    });
    await sleep(1000);
    art.setting.find('flip').switch = true;
    await sleep(1000);
    art.setting.update({
        name: 'flip2',
        html: 'new flip2',
        tooltip: 'OFF',
        switch: true,
    });
    await sleep(1000);
    try {
        art.setting.add({
            name: 'flip2',
            html: 'new flip2',
            tooltip: 'OFF',
            switch: true,
        });
    } catch (error) {
        console.log(error.message);
    }
});
