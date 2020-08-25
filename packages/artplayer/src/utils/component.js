import { hasClass, addClass, removeClass, append, setStyles, tooltip, getStyle } from './dom';
import { has, def } from './property';
import { errorHandle } from './error';

export default class Component {
    constructor(art) {
        this.id = 0;
        this.art = art;
        this.add = this.add.bind(this);
    }

    get show() {
        return hasClass(this.art.template.$player, `art-${this.name}-show`);
    }

    set show(value) {
        const { $player } = this.art.template;
        const className = `art-${this.name}-show`;
        if (value) {
            addClass($player, className);
        } else {
            removeClass($player, className);
        }
        this.art.emit(this.name, value);
    }

    set toggle(value) {
        if (value) {
            this.show = !this.show;
        }
    }

    add(option) {
        if (!this.$parent || !this.name || option.disable) return;
        const name = option.name || `${this.name}${this.id}`;
        errorHandle(!has(this, name), `Cannot add an existing name [${name}] to the [${this.name}]`);

        this.id += 1;
        const result = {};

        result.$ref = document.createElement('div');
        addClass(result.$ref, `art-${this.name}`);
        addClass(result.$ref, `art-${this.name}-${name}`);

        if (option.html) {
            append(result.$ref, option.html);
        }

        if (option.position !== 'top') {
            // if (!(result.$ref.firstElementChild && result.$ref.firstElementChild.tagName === 'I')) {
            //     addClass(result.$ref, 'art-control-onlyText');
            // }

            if (option.switcher) {
                const { hover } = this.art.events;

                addClass(result.$ref, 'art-control-switcher');
                result.$value = document.createElement('div');
                result.$value.classList.value = `art-switcher-value`;
                append(result.$value, option.html);
                result.$ref.innerHTML = '';
                append(result.$ref, result.$value);

                const $list = option.switcher.map((item) => `<div class="art-switcher-item">${item}</div>`).join('');
                result.$switcher = document.createElement('div');
                addClass(result.$switcher, 'art-switcher-list');
                append(result.$switcher, $list);
                append(result.$ref, result.$switcher);

                hover(result.$ref, () => {
                    result.$switcher.style.left = `-${
                        getStyle(result.$switcher, 'width') / 2 - getStyle(result.$ref, 'width') / 2
                    }px`;
                });
            }
        }

        if (option.style) {
            setStyles(result.$ref, option.style);
        }

        if (option.tooltip) {
            tooltip(result.$ref, option.tooltip);
        }

        const childs = Array.from(this.$parent.children);
        result.$ref.dataset.index = option.index || this.id;
        const nextChild = childs.find((item) => Number(item.dataset.index) >= Number(result.$ref.dataset.index));
        if (nextChild) {
            nextChild.insertAdjacentElement('beforebegin', result.$ref);
        } else {
            append(this.$parent, result.$ref);
        }

        def(this, name, {
            get: () => result,
        });

        if (option.click) {
            this.art.events.proxy(result.$ref, 'click', (event) => {
                result.event = event;
                event.preventDefault();
                option.click.call(this.art, result);
            });
        }

        if (option.mounted) {
            option.mounted.call(this.art, result.$ref);
        }
    }
}
