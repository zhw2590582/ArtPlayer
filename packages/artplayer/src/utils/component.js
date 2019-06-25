import { append, setStyles, setStyle, remove, errorHandle, hasOwnProperty } from './index';

export default function component(art, parent, target, getOption, callback, title) {
    const option = typeof getOption === 'function' ? getOption(art) : getOption;
    if (option.disable) return null;
    const componentID = parent.id;
    const name = option.name || `${title}${componentID}`;
    errorHandle(
        !hasOwnProperty(parent, name),
        `Cannot create a component that already has the same name: ${title} -> ${name}`,
    );
    const $element = document.createElement('div');
    $element.classList.value = `art-${title} art-${title}-${name}`;

    if (option.html) {
        append($element, option.html);
    }

    if (option.style) {
        setStyles($element, option.style);
    }

    const childs = Array.from(target.children);
    $element.dataset.index = option.index || componentID;
    const nextChild = childs.find(item => Number(item.dataset.index) >= Number($element.dataset.index));
    if (nextChild) {
        nextChild.insertAdjacentElement('beforebegin', $element);
    } else {
        append(target, $element);
    }

    if (option.click) {
        art.events.proxy($element, 'click', event => {
            event.preventDefault();
            option.click.call(art, parent, event);
            art.emit(`${title}:click`, $element);
        });
    }

    if (option.mounted) {
        option.mounted($element, parent, art);
    }

    if (callback) {
        callback($element, parent, art);
    }

    Object.defineProperty(parent, name, {
        value: {
            get id() {
                return componentID;
            },
            get $ref() {
                return $element;
            },
            set show(value) {
                if (value) {
                    setStyle($element, 'display', 'block');
                    art.emit(`${title}:show`, $element);
                } else {
                    setStyle($element, 'display', 'none');
                    art.emit(`${title}:hide`, $element);
                }
            },
            set remove(value) {
                if (value) {
                    remove($element);
                    art.emit(`${title}:remove`, $element);
                }
            },
        },
    });

    art.emit(`${title}:add`, option);
    return parent[name];
}
