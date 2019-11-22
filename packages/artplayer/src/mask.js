import { append } from './utils';
import Component from './utils/components';

export default class Mask extends Component {
    constructor(art) {
        super(art);
        const { $state } = art.template;
        append($state, art.icons.state);
    }
}
