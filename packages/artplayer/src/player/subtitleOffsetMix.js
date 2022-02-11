import { def } from '../utils';

export default function subtitleOffsetMix(art) {
    const { clamp } = art.constructor.utils;
    const { notice, template, i18n } = art;

    let offsetCache = 0;
    let cuesCache = [];
    art.on('subtitle:switch', () => {
        cuesCache = [];
    });

    def(art, 'subtitleOffset', {
        get() {
            return offsetCache;
        },
        set(value) {
            if (template.$track && template.$track.track) {
                const cues = Array.from(template.$track.track.cues);
                offsetCache = clamp(value, -5, 5);

                for (let index = 0; index < cues.length; index++) {
                    const cue = cues[index];
                    if (!cuesCache[index]) {
                        cuesCache[index] = {
                            startTime: cue.startTime,
                            endTime: cue.endTime,
                        };
                    }
                    cue.startTime = clamp(cuesCache[index].startTime + offsetCache, 0, art.duration);
                    cue.endTime = clamp(cuesCache[index].endTime + offsetCache, 0, art.duration);
                }

                art.subtitle.update();
                notice.show = `${i18n.get('Subtitle Offset')}: ${value}s`;
                art.emit('subtitleOffset', value);
            } else {
                art.emit('subtitleOffset', 0);
            }
        },
    });
}
