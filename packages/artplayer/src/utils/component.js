import { hasClass, addClass, removeClass, append, setStyles, tooltip, getStyle } from './dom';
import { has } from './property';
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
        const { hover, proxy } = this.art.events;

        if (!this.$parent || !this.name || option.disable) return;
        const name = option.name || `${this.name}${this.id}`;
        errorHandle(!has(this, name), `Cannot add an existing name [${name}] to the [${this.name}]`);

        this.id += 1;
        const $ref = document.createElement('div');
        addClass($ref, `art-${this.name}`);
        addClass($ref, `art-${this.name}-${name}`);

        const childs = Array.from(this.$parent.children);
        $ref.dataset.index = option.index || this.id;
        const nextChild = childs.find((item) => Number(item.dataset.index) >= Number($ref.dataset.index));
        if (nextChild) {
            nextChild.insertAdjacentElement('beforebegin', $ref);
        } else {
            append(this.$parent, $ref);
        }

        if (option.html) {
            append($ref, option.html);
        }

        if (option.style) {
            setStyles($ref, option.style);
        }

        if (option.tooltip) {
            tooltip($ref, option.tooltip);
        }

        if (option.click) {
            proxy($ref, 'click', (event) => {
                event.preventDefault();
                option.click.call(this.art, event);
            });
        }

        if (['left', 'right'].includes(option.position)) {
            if (option.selector) {
                addClass($ref, 'art-control-selector');
                const $value = document.createElement('div');
                $value.classList.value = `art-selector-value`;
                append($value, option.html);
                $ref.innerText = '';
                append($ref, $value);

                const list = option.selector
                    .map((item) => `<div class="art-selector-item">${item.name}</div>`)
                    .join('');
                const $list = document.createElement('div');
                addClass($list, 'art-selector-list');
                append($list, list);
                append($ref, $list);

                const setLeft = () => {
                    $list.style.left = `-${getStyle($list, 'width') / 2 - getStyle($ref, 'width') / 2}px`;
                };

                hover($ref, setLeft);

                proxy($ref, 'click', (event) => {
                    if (hasClass(event.target, 'art-selector-item')) {
                        const name = event.target.innerText;
                        const find = option.selector.find((item) => item.name === name);
                        $value.innerText = name;
                        setLeft();
                        if (option.onSelect && find) {
                            option.onSelect.call(this.art, find.value);
                        }
                    }
                });
            }
        }

        if (option.mounted) {
            option.mounted.call(this.art, $ref);
        }

        if (!($ref.firstElementChild && $ref.firstElementChild.tagName === 'I')) {
            addClass($ref, 'art-control-onlyText');
        }
    }
}
