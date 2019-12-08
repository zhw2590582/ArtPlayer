import { append, getStyle } from '../utils';

export default function quality(option) {
    return art => ({
        ...option,
        mounted: $control => {
            const {
                option: { quality },
                events: { proxy, hover },
                player,
            } = art;

            let playIndex = -1;
            const defaultQuality = quality.find(item => item.default) || quality[0];
            playIndex = quality.indexOf(defaultQuality);
            const $qualityName = append($control, `<div class="art-quality-name">${defaultQuality.name}</div>`);
            const qualityList = quality
                .map((item, index) => `<div class="art-quality-item" data-index="${index}">${item.name}</div>`)
                .join('');
            const $qualitys = append($control, `<div class="art-qualitys">${qualityList}</div>`);

            hover($control, () => {
                $qualitys.style.left = `-${getStyle($qualitys, 'width') / 2 - $control.clientWidth / 2}px`;
            });

            proxy($qualitys, 'click', event => {
                const index = Number(event.target.dataset.index);
                const { url, name } = quality[index];
                if (url && name && playIndex !== index) {
                    player.switchQuality(url, name);
                    $qualityName.innerText = name;
                    playIndex = index;
                }
            });
        },
    });
}
