import component from './utils/component';
import Component from './utils/components';

export default class Layers extends Component {
    constructor(art) {
        super(art);
        this.add = this.add.bind(this);
        this.art.on('ready', () => {
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
}
