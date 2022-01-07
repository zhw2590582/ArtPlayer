import { def, setStyle } from '../utils';

export default function posterMix(art) {
    const {
        option,
        template: { $poster },
    } = art;

    def(art, 'poster', {
        get: () => option.poster,
        set(url) {
            option.poster = url;
            setStyle($poster, 'backgroundImage', `url(${url})`);
        },
    });
}
