import Component from './utils/component';

export default class Layer extends Component {
    constructor(art) {
        super(art);

        const {
            option,
            template: { $layer },
        } = art;

        this.name = 'layer';
        this.$parent = $layer;

        for (let index = 0; index < option.layers.length; index++) {
            this.add(option.layers[index]);
        }
    }
}
