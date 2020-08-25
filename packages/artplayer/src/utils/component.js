import { hasClass, addClass, removeClass, append, setStyles, tooltip } from './dom';
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
        const $ref = document.createElement('div');
        $ref.classList.value = `art-${this.name} art-${this.name}-${name}`;

        const $value = document.createElement('div');
        if (option.html) {
            append($value, option.html);
            append($ref, $value);
        }

        if (option.switcher) {
            //
        }

        if (option.style) {
            setStyles($ref, option.style);
        }

        if (option.tooltip) {
            tooltip($ref, option.tooltip);
        }

        const childs = Array.from(this.$parent.children);
        $ref.dataset.index = option.index || this.id;
        const nextChild = childs.find((item) => Number(item.dataset.index) >= Number($ref.dataset.index));
        if (nextChild) {
            nextChild.insertAdjacentElement('beforebegin', $ref);
        } else {
            append(this.$parent, $ref);
        }

        const result = {
            $ref,
            $value,
            get value() {
                return $value.innerHTML;
            },
            set value(html) {
                $value.innerHTML = html;
            },
        };

        def(this, name, {
            get: () => result,
        });

        if (option.click) {
            this.art.events.proxy($ref, 'click', (event) => {
                event.preventDefault();
                option.click.call(this.art, event);
            });
        }

        if (option.mounted) {
            option.mounted.call(this.art, $ref);
        }

        if (option.position !== 'top' && !($ref.firstElementChild && $ref.firstElementChild.tagName === 'I')) {
            addClass($ref, 'art-control-onlyText');
        }
    }
}
