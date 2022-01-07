import { def } from '../utils';

export default function attrMix(art) {
    const {
        template: { $video },
    } = art;

    def(art, 'attr', {
        value(key, value) {
            if (value === undefined) return $video[key];
            $video[key] = value;
        },
    });
}
