import { append } from '../utils';

export default function pip(option) {
    return (art) => ({
        ...option,
        tooltip: art.i18n.get('AirPlay'),
        mounted: ($control) => {
            const { proxy, icons } = art;
            append($control, icons.airplay);
            proxy($control, 'click', () => art.airplay());
        },
    });
}
