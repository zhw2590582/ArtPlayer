import { def } from '../utils';

export default function qualityMix(art) {
    def(art, 'quality', {
        set(quality) {
            const { controls, notice, i18n } = art;
            const qualityDefault = quality.find((item) => item.default) || quality[0];
            controls.update({
                name: 'quality',
                position: 'right',
                index: 10,
                style: {
                    marginRight: '10px',
                },
                html: qualityDefault ? qualityDefault.html : '',
                selector: quality,
                async onSelect(item) {
                    await art.switchQuality(item.url);
                    notice.show = `${i18n.get('Switch Video')}: ${item.html}`;
                },
            });
        },
    });
}
