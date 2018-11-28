import { setStyle } from './utils';
import component from './utils/component';

export default class Layers {
    constructor(art) {
        this.id = 0;
        this.art = art;
        this.add = this.add.bind(this);
        this.art.option.layers.forEach(item => {
            this.add(item);
        });
    }

    add(item, callback) {
        const { $layers } = this.art.template;
        component(this.art, this, $layers, item, callback, 'layer');
    }

    show() {
        const { $layers } = this.art.template;
        setStyle($layers, 'display', 'block');
        this.art.emit('layers:show', $layers);
    }

    hide() {
        const { $layers } = this.art.template;
        setStyle($layers, 'display', 'none');
        this.art.emit('layers:hide', $layers);
    }
}
