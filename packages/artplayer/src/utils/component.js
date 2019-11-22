import { hasClass, addClass, removeClass, append, setStyle, setStyles, tooltip } from './dom';
import { hasOwnProperty, defineProperty } from './property';
import { errorHandle } from './error';

export default class Component {
    constructor(art) {
        this.id = 0;
        this.art = art;
        this.add = this.add.bind(this);
        this.name = this.constructor.name.toLowerCase();
    }

    get show() {
        return hasClass(this.art.template.$player, `art-${this.name}-show`);
    }

    set show(value) {
        errorHandle(value === false || value === true, 'The show attribute expects a boolean value');
        const { $player } = this.art.template;
        const className = `art-${this.name}-show`;
        if (value) {
            addClass($player, className);
        } else {
            removeClass($player, className);
        }
        this.art.emit(`${this.name}:toggle`, value);
    }

    toggle() {
        this.show = !this.show;
    }

    add(getOption, callback) {
        const option = typeof getOption === 'function' ? getOption(this.art) : getOption;
        if (!this.$parent || option.disable) return {};
        this.id += 1;
        const name = option.name || `${this.name}${this.id}`;
        errorHandle(!hasOwnProperty(this, name), `Cannot add a component that already has the same name: ${name}`);
        const $ref = document.createElement('div');
        $ref.classList.value = `art-${this.name} art-${this.name}-${name}`;

        if (option.html) {
            append($ref, option.html);
        }

        if (option.style) {
            setStyles($ref, option.style);
        }

        if (option.tooltip) {
            tooltip($ref, option.tooltip);
        }

        const childs = Array.from(this.$parent.children);
        $ref.dataset.index = option.index || this.id;
        const nextChild = childs.find(item => Number(item.dataset.index) >= Number($ref.dataset.index));
        if (nextChild) {
            nextChild.insertAdjacentElement('beforebegin', $ref);
        } else {
            append(this.$parent, $ref);
        }

        if (option.click) {
            this.art.events.proxy($ref, 'click', event => {
                event.preventDefault();
                option.click.call(this.art, this, event);
            });
        }

        if (option.mounted) {
            option.mounted($ref, this, this.art);
        }

        if (callback) {
            callback($ref, this, this.art);
        }

        defineProperty(this, name, {
            value: {
                get $ref() {
                    return $ref;
                },
                set show(value) {
                    if (value) {
                        setStyle($ref, 'display', 'block');
                    } else {
                        setStyle($ref, 'display', 'none');
                    }
                },
            },
        });

        this.art.emit(`${this.name}:add`, option);
        return this[name];
    }
}
