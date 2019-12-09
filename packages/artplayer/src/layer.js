import Component from './utils/component';

export default class Layer extends Component {
    constructor(art) {
        super(art);
        this.name = 'layer';
        this.$parent = art.template.$layer;
        art.on('ready', () => {
            art.option.layers.forEach(item => {
                this.add(item);
            });
        });
    }
}
