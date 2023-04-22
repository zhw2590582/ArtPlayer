import {
    remove,
    append,
    tooltip,
    hasClass,
    addClass,
    getStyle,
    setStyles,
    removeClass,
    inverseClass,
    createElement,
} from './dom';
import { isStringOrNumber } from './format';
import { errorHandle } from './error';
import validator from 'option-validator';
import { ComponentOption } from '../scheme';

export default class Component {
    constructor(art) {
        this.id = 0;
        this.art = art;
        this.cache = new Map();
        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);
        this.update = this.update.bind(this);
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

    toggle() {
        this.show = !this.show;
    }

    add(getOption) {
        const option = typeof getOption === 'function' ? getOption(this.art) : getOption;
        option.html = option.html || '';
        validator(option, ComponentOption);
        if (!this.$parent || !this.name || option.disable) return;
        const name = option.name || `${this.name}${this.id}`;
        const item = this.cache.get(name);
        errorHandle(!item, `Can't add an existing [${name}] to the [${this.name}]`);

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

        const events = [];
        if (option.click) {
            const destroyEvent = this.art.events.proxy($ref, 'click', (event) => {
                event.preventDefault();
                option.click.call(this.art, this, event);
            });
            events.push(destroyEvent);
        }

        if (option.selector && ['left', 'right'].includes(option.position)) {
            this.addSelector(option, $ref, events);
        }

        this[name] = $ref;
        this.cache.set(name, { $ref, events, option });

        if (option.mounted) {
            option.mounted.call(this.art, $ref);
        }

        return $ref;
    }

    addSelector(option, $ref, events) {
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

        const setLeft = () => {
            const refWidth = getStyle($ref, 'width');
            const listWidth = getStyle($list, 'width');
            const left = refWidth / 2 - listWidth / 2;
            $list.style.left = `${left}px`;
        };

        hover($ref, setLeft);

        const destroyEvent = proxy($list, 'click', async (event) => {
            const path = event.composedPath() || [];
            const $item = path.find((item) => hasClass(item, 'art-selector-item'));
            if (!$item) return;
            inverseClass($item, 'art-current');
            const index = Number($item.dataset.index);
            const find = option.selector[index] || {};
            $value.innerText = $item.innerText;
            if (option.onSelect) {
                const result = await option.onSelect.call(this.art, find, $item, event);
                if (isStringOrNumber(result)) {
                    $value.innerHTML = result;
                }
            }
            setLeft();
        });

        events.push(destroyEvent);
    }

    remove(name) {
        const item = this.cache.get(name);
        errorHandle(item, `Can't find [${name}] from the [${this.name}]`);

        if (item.option.beforeUnmount) {
            item.option.beforeUnmount.call(this.art, item.$ref);
        }

        for (let index = 0; index < item.events.length; index++) {
            this.art.events.remove(item.events[index]);
        }

        this.cache.delete(name);
        delete this[name];
        remove(item.$ref);
    }

    update(option) {
        const item = this.cache.get(option.name);
        if (item) this.remove(option.name);
        return this.add(option);
    }
}
