import { append } from './utils';
import Component from './utils/component';

export default class Mask extends Component {
    constructor(art) {
        super(art);
        this.name = 'mask';
        const { template, icons, events } = art;
        append(template.$state, icons.state);
        events.proxy(template.$state, 'click', () => art.play());
    }
}
