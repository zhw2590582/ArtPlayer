import { def, clamp } from '../utils';

export default function subtitleOffsetMix(art) {
    const { notice, i18n, template } = art;

    def(art, 'subtitleOffset', {
        get() {
            return template.$track?.offset || 0;
        },
        set(value) {
            const { cues } = art.subtitle;
            if (!template.$track || cues.length === 0) return;
            const offset = clamp(value, -10, 10);
            template.$track.offset = offset;
            for (let index = 0; index < cues.length; index++) {
                const cue = cues[index];
                cue.originalStartTime = cue.originalStartTime ?? cue.startTime;
                cue.originalEndTime = cue.originalEndTime ?? cue.endTime;
                cue.startTime = clamp(cue.originalStartTime + offset, 0, art.duration);
                cue.endTime = clamp(cue.originalEndTime + offset, 0, art.duration);
            }
            art.subtitle.update();
            notice.show = `${i18n.get('Subtitle Offset')}: ${value}s`;
            art.emit('subtitleOffset', value);
        },
    });
}
