import { append, insertByIndex, setStyles, setStyle, remove } from './index';

export default function component(art, parent, target, component, callback, title) {
    const option = typeof component === 'function' ? component(art) : component;
    if (!option.disable) {
        parent.id += 1;
        const name = option.name || `${title}${parent.id}`;
        const $element = document.createElement('div');
        $element.classList.value = `art-${title} art-${title}-${name}`;

        if (option.html) {
            append($element, option.html);
        }

        if (option.style) {
            setStyles($element, option.style);
        }

        if (option.click) {
            art.events.proxy($element, 'click', event => {
                event.preventDefault();
                option.click.call(parent, event, art);
                art.emit(`${title}:click`, $element);
            });
        }

        Object.defineProperty(option, '$ref', {
            get: () => $element,
        });

        Object.defineProperty(option, 'hide', {
            value: () => {
                setStyle($element, 'display', 'none');
                art.emit(`${title}:hide`, $element);
            },
        });

        Object.defineProperty(option, 'show', {
            value: (type = 'block') => {
                setStyle($element, 'display', type);
                art.emit(`${title}:show`, $element);
            },
        });

        Object.defineProperty(option, 'remove', {
            value: () => {
                remove($element);
                art.emit(`${title}:remove`, $element);
            },
        });

        insertByIndex(target, $element, option.index || parent.id);

        if (option.mounted) {
            option.mounted($element, parent, art);
        }

        if (callback) {
            callback($element, parent, art);
        }

        parent[name] = option;
        art.emit(`${title}:add`, option);
    }
}
