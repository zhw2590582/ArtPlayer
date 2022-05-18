import { append, setStyle } from './utils';
import Component from './utils/component';

export default class Mask extends Component {
    constructor(art) {
        super(art);

        this.name = 'mask';
        const { template, icons, events } = art;

        const $state = append(template.$state, icons.state);
        const $error = append(template.$state, icons.error);

        setStyle($error, 'display', 'none');

        art.on('destroy', () => {
            setStyle($state, 'display', 'none');
            setStyle($error, 'display', null);
        });

        events.proxy(template.$state, 'click', () => art.play());
    }
}
