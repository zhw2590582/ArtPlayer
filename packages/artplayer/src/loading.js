import { append } from './utils';
import Component from './utils/components';

export default class Loading extends Component {
    constructor(art) {
        super(art);
        const { $loading } = art.template;
        append($loading, art.icons.loading);
    }
}
