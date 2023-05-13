import { def, setStyle } from '../utils';

export default function posterMix(art) {
    const {
        template: { $poster },
    } = art;

    def(art, 'poster', {
        get: () => {
            try {
                return $poster.style['backgroundImage'].match(/"(.*)"/)[1];
            } catch (error) {
                return '';
            }
        },
        set(url) {
            setStyle($poster, 'backgroundImage', `url(${url})`);
        },
    });
}
