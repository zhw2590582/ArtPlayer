import { remove, append, tooltip, hasClass, addClass, setStyles, removeClass, createElement } from './dom';
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
            this.selector(option, $ref, events);
        }

        this[name] = $ref;
        this.cache.set(name, { $ref, events, option });

        if (option.mounted) {
            option.mounted.call(this.art, $ref);
        }

        return $ref;
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
        if (item) {
            option = Object.assign(item.option, option);
            this.remove(option.name);
        }
        return this.add(option);
    }
}
