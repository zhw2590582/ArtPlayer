import { append, insertByIndex, setStyles, setStyle } from './index';

function commonMethod(art, option, $element, title) {
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
        value: () => {
            setStyle($element, 'display', 'block');
            art.emit(`${title}:show`, $element);
        },
    });
}

export default function componentMethod(art, parent, target, component, callback, title) {
    const { proxy } = art.events;
    const option = typeof component === 'function' ? component(art) : component;
    if (!option.disable) {
        parent.id += 1;
        const name = option.name || `${title}${parent.id}`;
        const $element = document.createElement('div');
        $element.classList.value = `art-${title} art-${title}-${name}`;
        insertByIndex(target, $element, option.index || parent.id);
        if (option.html) {
            append($element, option.html);
        }
        if (option.style) {
            setStyles($element, option.style);
        }
        if (option.click) {
            proxy($element, 'click', event => {
                event.preventDefault();
                option.click.call(parent, event);
                art.emit(`${title}:click`, $element);
            });
        }
        if (option.mounted) {
            option.mounted($element);
        }
        if (callback) {
            callback($element);
        }
        commonMethod(art, option, $element, title);
        parent[name] = option;
        art.emit(`${title}:add`, option);
    }
}
