function artplayerPluginSubtitle(option) {
    return art => {
        const { errorHandle, clamp, sleep } = art.constructor.utils;

        errorHandle(
            option && typeof option.time === 'number',
            `The plugin 'artplayerPluginSubtitle': 'option.time' require 'number' type, but got '${typeof option.time}'`,
        );

        let retry = 0;
        const maxRetry = 10;
        const time = clamp(option.time, -10, 10);

        function adjust() {
            errorHandle(retry < maxRetry, 'It seems that something wrong for reading subtitle');
            retry += 1;
            const cues = Array.from(art.refs.$track.track.cues);
            if (cues.length === 0) {
                sleep(100).then(adjust);
            } else {
                cues.forEach(cue => {
                    cue.startTime += time;
                    cue.endTime += time;
                });
            }
        }

        art.on('subtitle:load', adjust);
    };
}

window.artplayerPluginSubtitle = artplayerPluginSubtitle;
export default artplayerPluginSubtitle;
