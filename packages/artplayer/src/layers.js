import component from './utils/component';

export default class Layers {
    constructor(art) {
        this.id = 0;
        this.art = art;
        this.add = this.add.bind(this);
        this.art.once('video:canplay', () => {
            this.art.option.layers.forEach(item => {
                this.add(item);
            });
        });
    }

    add(item, callback) {
        this.id += 1;
        const { $layers } = this.art.template;
        return component(this.art, this, $layers, item, callback, 'layer');
    }

    set show(value) {
        const { $player } = this.art.template;
        if (value) {
            this.state = true;
            $player.classList.remove('artplayer-layers-hide');
            this.art.emit('layers:show');
        } else {
            this.state = false;
            $player.classList.add('artplayer-layers-hide');
            this.art.emit('layers:hide');
        }
    }

    toggle() {
        this.show = !this.state;
    }
}
