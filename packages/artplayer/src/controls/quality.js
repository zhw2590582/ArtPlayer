import { append } from '../utils';

export default class Quality {
    constructor(option) {
        this.option = option;
        this.playIndex = -1;
    }

    apply(art, $control) {
        const {
            option,
            events: { proxy, hover },
            player,
        } = art;
        const defaultQuality = option.quality.find(item => item.default) || option.quality[0];
        this.playIndex = option.quality.indexOf(defaultQuality);
        const $qualityName = append($control, `<div class="art-quality-name">${defaultQuality.name}</div>`);
        const qualityList = option.quality
            .map((item, index) => `<div class="art-quality-item" data-index="${index}">${item.name}</div>`)
            .join('');
        const $qualitys = append($control, `<div class="art-qualitys">${qualityList}</div>`);

        hover(
            $control,
            () => {
                $control.classList.add('art-quality-hover');
            },
            () => {
                $control.classList.remove('art-quality-hover');
            },
        );

        proxy($qualitys, 'click', event => {
            const index = Number(event.target.dataset.index);
            const { url, name } = option.quality[index];
            if (url && name && this.playIndex !== index) {
                player.switchQuality(url, name);
                $qualityName.innerHTML = name;
                this.playIndex = index;
            }
        });
    }
}
