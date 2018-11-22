import { append } from '../utils';

export default function quality(controlOption) {
    return art => ({
        ...controlOption,
        mounted: $control => {
            const {
                option,
                events: { proxy },
                player,
            } = art;
            let playIndex = -1;
            const defaultQuality = option.quality.find(item => item.default) || option.quality[0];
            playIndex = option.quality.indexOf(defaultQuality);
            const $qualityName = append($control, `<div class="art-quality-name">${defaultQuality.name}</div>`);
            const qualityList = option.quality
                .map((item, index) => `<div class="art-quality-item" data-index="${index}">${item.name}</div>`)
                .join('');
            const $qualitys = append($control, `<div class="art-qualitys">${qualityList}</div>`);

            proxy($qualitys, 'click', event => {
                const index = Number(event.target.dataset.index);
                const { url, name } = option.quality[index];
                if (url && name && playIndex !== index) {
                    player.switchQuality(url, name);
                    $qualityName.innerHTML = name;
                    playIndex = index;
                }
            });
        },
    });
}
