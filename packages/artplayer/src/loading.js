import { append, setStyle } from './utils';

export default class Loading {
    constructor(art) {
        this.art = art;
        const { $loading } = art.template;
        append($loading, art.icons.loading);
    }

    hide() {
        const { $loading } = this.art.template;
        setStyle($loading, 'display', 'none');
        this.art.emit('loading:hide', $loading);
    }

    show() {
        const { $loading } = this.art.template;
        setStyle($loading, 'display', 'flex');
        this.art.emit('loading:show', $loading);
    }
}
