import { append, setStyles, setStyle, remove } from './index';

export default function component(art, parent, target, getOption, callback, title) {
    const option = typeof getOption === 'function' ? getOption(art) : getOption;
    if (!option.disable) {
        const name = option.name || `${title}${parent.id}`;
        const $element = document.createElement('div');
        $element.classList.value = `art-${title} art-${title}-${name}`;

        if (option.html) {
            append($element, option.html);
        }

        if (option.style) {
            setStyles($element, option.style);
        }

        const childs = Array.from(target.children);
        $element.dataset.index = option.index || parent.id;
        const nextChild = childs.find(item => Number(item.dataset.index) >= Number($element.dataset.index));
        if (nextChild) {
            nextChild.insertAdjacentElement('beforebegin', $element);
        } else {
            append(target, $element);
        }

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
            id: parent.id,
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
