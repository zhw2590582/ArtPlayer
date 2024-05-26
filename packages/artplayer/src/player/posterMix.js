import { def, setStyle } from '../utils';

export default function posterMix(art) {
    const {
        template: { $poster },
    } = art;

    def(art, 'poster', {
        get: () => {
            try {
                return $poster.style['backgroundImage'].match(/"(.*)"/)[1];
                // eslint-disable-next-line no-unused-vars
            } catch (error) {
                return '';
            }
        },
        set(url) {
            setStyle($poster, 'backgroundImage', `url(${url})`);
        },
    });
}
