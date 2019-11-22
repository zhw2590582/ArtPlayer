import { append } from './utils';
import Component from './utils/component';

export default class Loading extends Component {
    constructor(art) {
        super(art);
        append(art.template.$loading, art.icons.loading);
    }
}
