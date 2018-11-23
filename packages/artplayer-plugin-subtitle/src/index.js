function i18nMix(i18n) {
    i18n.update({
        'zh-cn': {
            'Subtitle offset time': '字幕偏移时间',
        },
        'zh-tw': {
            'Subtitle offset time': '字幕偏移時間',
        },
    });
}

function settingMix(art) {
    const {
        i18n,
        events: { proxy },
    } = art;
    return {
        title: 'Subtitle',
        name: 'subtitle',
        index: 20,
        html: `
            <div class="art-setting-header">
                ${i18n.get('Subtitle offset time')}: <span class="art-subtitle-value">0</span>s
            </div>
            <div class="art-setting-body">
                <input style="width: 100%;" class="art-subtitle-range" type="range" min="-5" max="5" step="0.5">
            </div>
        `,
        mounted: $setting => {
            const $range = $setting.querySelector('.art-subtitle-range');
            const $value = $setting.querySelector('.art-subtitle-value');
            proxy($range, 'change', () => {
                const { value } = $range;
                $value.innerText = value;
                art.plugins.artplayerPluginSubtitle.set(Number(value));
            });
        },
    };
}

function artplayerPluginSubtitle(art) {
    const { setting, notice, refs, i18n } = art;
    const cuesCache = [];
    i18nMix(i18n);
    setting.add(settingMix);
    const { clamp } = art.constructor.utils;
    return {
        set(value) {
            const cues = Array.from(refs.$track.track.cues);
            const time = clamp(value, -5, 5);
            cues.forEach((cue, index) => {
                if (!cuesCache[index]) {
                    cuesCache[index] = {
                        startTime: cue.startTime,
                        endTime: cue.endTime,
                    };
                }
                cue.startTime = cuesCache[index].startTime + time;
                cue.endTime = cuesCache[index].endTime + time;
            });
            notice.show(`${i18n.get('Subtitle offset time')}: ${value}s`);
            art.emit('subtitle:offset', value);
        },
    };
}

window.artplayerPluginSubtitle = artplayerPluginSubtitle;
export default artplayerPluginSubtitle;
