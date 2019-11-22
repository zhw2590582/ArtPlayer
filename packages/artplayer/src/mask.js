import { append } from './utils';
import Component from './utils/component';

export default class Mask extends Component {
    constructor(art) {
        super(art);
        append(art.template.$state, art.icons.state);
    }
}
