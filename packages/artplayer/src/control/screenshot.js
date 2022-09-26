import { append } from '../utils';

export default function screenshot(option) {
    return (art) => ({
        ...option,
        tooltip: art.i18n.get('Screenshot'),
        mounted: ($control) => {
            const { proxy, icons } = art;

            append($control, icons.screenshot);
            proxy($control, 'click', () => {
                art.screenshot();
            });
        },
    });
}
