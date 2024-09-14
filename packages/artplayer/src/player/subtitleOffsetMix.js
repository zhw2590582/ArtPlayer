import { def } from '../utils';

export default function subtitleOffsetMix(art) {
    const { clamp } = art.constructor.utils;
    const { notice, i18n } = art;

    let subtitleOffset = 0;

    art.on('subtitleTrackLoad', () => {
        subtitleOffset = 0;
        art.emit('subtitleOffset', 0);
    });

    def(art, 'subtitleOffset', {
        get() {
            return subtitleOffset;
        },
        set(value) {
            const { cues } = art.subtitle;
            subtitleOffset = clamp(value, -5, 5);
            for (let index = 0; index < cues.length; index++) {
                const cue = cues[index];
                cue.originalStartTime = cue.originalStartTime ?? cue.startTime;
                cue.originalEndTime = cue.originalEndTime ?? cue.endTime;
                cue.startTime = clamp(cue.originalStartTime + subtitleOffset, 0, art.duration);
                cue.endTime = clamp(cue.originalEndTime + subtitleOffset, 0, art.duration);
            }
            art.subtitle.update();
            notice.show = `${i18n.get('Subtitle Offset')}: ${value}s`;
            art.emit('subtitleOffset', value);
        },
    });
}
