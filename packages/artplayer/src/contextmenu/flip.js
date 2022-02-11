import { inverseClass, queryAll } from '../utils';

export default function flip(option) {
    return (art) => {
        const { i18n } = art;
        return {
            ...option,
            html: `${i18n.get('Video Flip')}:
                <span data-value="normal" class="art-current">${i18n.get('Normal')}</span>
                <span data-value="horizontal">${i18n.get('Horizontal')}</span>
                <span data-value="vertical">${i18n.get('Vertical')}</span>
            `,
            click: (contextmenu, event) => {
                const { value } = event.target.dataset;
                if (value) {
                    art.flip = value;
                    contextmenu.show = false;
                }
            },
            mounted: ($panel) => {
                art.on('flip', (value) => {
                    const $current = queryAll('span', $panel).find((item) => item.dataset.value === value);
                    if ($current) {
                        inverseClass($current, 'art-current');
                    }
                });
            },
        };
    };
}
