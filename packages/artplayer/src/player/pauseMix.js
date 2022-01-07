import { def } from '../utils';

export default function pauseMix(art) {
    const {
        template: { $video },
        i18n,
        notice,
    } = art;

    def(art, 'pause', {
        value() {
            const result = $video.pause();
            notice.show = i18n.get('Pause');
            art.emit('pause');
            return result;
        },
    });
}
