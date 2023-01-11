import {
    hasClass,
    addClass,
    removeClass,
    append,
    setStyles,
    tooltip,
    getStyle,
    inverseClass,
    createElement,
} from './dom';
import validator from 'option-validator';
import { ComponentOption } from '../scheme';
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

    add(getOption) {
        const option = typeof getOption === 'function' ? getOption(this.art) : getOption;
        option.html = option.html || '';
        validator(option, ComponentOption);

        if (!this.$parent || !this.name || option.disable) return;
        const name = option.name || `${this.name}${this.id}`;
        errorHandle(!has(this, name), `Cannot add an existing name [${name}] to the [${this.name}]`);

        this.id += 1;
        const $ref = createElement('div');
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
            this.art.events.proxy($ref, 'click', (event) => {
                event.preventDefault();
                option.click.call(this.art, this, event);
            });
        }

        if (option.selector && ['left', 'right'].includes(option.position)) {
            this.selector(option, $ref);
        }

        if (option.mounted) {
            option.mounted.call(this.art, $ref);
        }

        def(this, name, {
            value: $ref,
        });

        return $ref;
    }

    selector(option, $ref) {
        const { hover, proxy } = this.art.events;

        addClass($ref, 'art-control-selector');
        const $value = createElement('div');
        addClass($value, 'art-selector-value');
        append($value, option.html);
        $ref.innerText = '';
        append($ref, $value);

        const list = option.selector
            .map(
                (item, index) =>
                    `<div class="art-selector-item ${item.default ? 'art-current' : ''}" data-index="${index}">${
                        item.html
                    }</div>`,
            )
            .join('');
        const $list = createElement('div');
        addClass($list, 'art-selector-list');
        append($list, list);
        append($ref, $list);

        if (this.art.option.backdrop) {
            addClass($list, 'art-backdrop-filter');
        }

        const setLeft = () => {
            const left = getStyle($ref, 'width') / 2 - getStyle($list, 'width') / 2;
            $list.style.left = `${left}px`;
        };

        hover($ref, setLeft);

        proxy($list, 'click', async (event) => {
            const path = event.composedPath() || [];
            const $item = path.find((item) => hasClass(item, 'art-selector-item'));
            if (!$item) return;
            inverseClass($item, 'art-current');
            const index = Number($item.dataset.index);
            const find = option.selector[index] || {};
            $value.innerText = $item.innerText;
            if (option.onSelect) {
                const result = await option.onSelect.call(this.art, find, $item, event);
                if (typeof result === 'string' || typeof result === 'number') {
                    $value.innerHTML = result;
                }
            }
            setLeft();
        });
    }
}
