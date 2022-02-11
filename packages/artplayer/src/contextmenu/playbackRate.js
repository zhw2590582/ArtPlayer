import { inverseClass, queryAll } from '../utils';

export default function playbackRate(option) {
    return (art) => {
        const { i18n } = art;
        return {
            ...option,
            html: `${i18n.get('Play Speed')}:
                <span data-value="0.5">0.5</span>
                <span data-value="0.75">0.75</span>
                <span data-value="1.0" class="art-current">${i18n.get('Normal')}</span>
                <span data-value="1.25">1.25</span>
                <span data-value="1.5">1.5</span>
                <span data-value="2.0">2.0</span>
            `,
            click: (contextmenu, event) => {
                const { value } = event.target.dataset;
                if (value) {
                    art.playbackRate = Number(value);
                    contextmenu.show = false;
                }
            },
            mounted: ($panel) => {
                art.on('playbackRate', (value) => {
                    const $current = queryAll('span', $panel).find((item) => Number(item.dataset.value) === value);
                    if ($current) {
                        inverseClass($current, 'art-current');
                    }
                });
            },
        };
    };
}
