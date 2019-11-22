import { hasClass, addClass, removeClass } from './dom';
import { errorHandle } from './error';

export default class Component {
    constructor(art) {
        this.id = 0;
        this.art = art;
        this.$player = art.template.$player;
        this.name = this.constructor.name.toLowerCase();
        this.showClassName = `art-${this.name}-show`;
    }

    get show() {
        return hasClass(this.$player, this.showClassName);
    }

    set show(value) {
        errorHandle(value === false || value === true, 'The show attribute expects a boolean value');
        if (value) {
            addClass(this.$player, this.showClassName);
        } else {
            removeClass(this.$player, this.showClassName);
        }
        this.art.emit(`${this.name}:toggle`, value);
    }

    toggle() {
        this.show = !this.show;
    }
}
