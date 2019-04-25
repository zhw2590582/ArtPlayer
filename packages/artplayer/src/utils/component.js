import { append, insertByIndex, setStyles, setStyle, remove } from './index';

export default function component(art, parent, target, getOption, callback, title) {
    const option = typeof getOption === 'function' ? getOption(art) : getOption;
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

        insertByIndex(target, $element, option.index || parent.id);

        if (option.click) {
            art.events.proxy($element, 'click', event => {
                event.preventDefault();
                option.click.call(parent, event, art);
                art.emit(`${title}:click`, $element);
            });
        }

        if (option.mounted) {
            option.mounted($element, parent, art);
        }

        if (callback) {
            callback($element, parent, art);
        }

        parent[name] = {
            $ref: $element,
            hide() {
                setStyle($element, 'display', 'none');
                art.emit(`${title}:hide`, $element);
            },
            show(type = 'block') {
                setStyle($element, 'display', type);
                art.emit(`${title}:show`, $element);
            },
            remove() {
                remove($element);
                art.emit(`${title}:remove`, $element);
            },
        };

        art.emit(`${title}:add`, option);
        return parent[name];
    }

    return null;
}
