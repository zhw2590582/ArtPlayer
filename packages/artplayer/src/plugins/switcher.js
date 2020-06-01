import { queryAll, query, inverseClass, getStyle, addClass } from '../utils';

export default function switcher(art) {
    const {
        controls,
        option,
        events: { hover },
    } = art;

    function add(item) {
        const list = item.list
            .map((child) => `<div class="art-switcher-item" data-switcher-name="${child.name}">${child.text}</div>`)
            .join('');
        const html = `<div class="art-switcher-list">${list}</div><div class="art-switcher-current"></div>`;

        let $list;
        let $childs;
        let $current;

        controls.add({
            name: item.name,
            position: 'right',
            index: item.index,
            html,
            mounted($switcher) {
                addClass($switcher, 'art-control-switcher');
                $list = query('.art-switcher-list', $switcher);
                $childs = queryAll('.art-switcher-item', $switcher);
                $current = query('.art-switcher-current', $switcher);
                const active = item.list.find((child) => child.name === item.default) || item.list[0];
                if (active) {
                    $current.innerText = active.text;
                    const $active = $childs.find(($child) => $child.dataset.switcherName === active.name);
                    if ($active) {
                        inverseClass($active, 'art-current');
                    }
                }

                hover($switcher, () => {
                    $list.style.left = `-${getStyle($list, 'width') / 2 - getStyle($switcher, 'width') / 2}px`;
                });
            },
            click(_, event) {
                const name = event.target.dataset.switcherName;
                if (name) {
                    const active = item.list.find((child) => child.name === name);
                    if (active) {
                        const $active = $childs.find(($child) => $child.dataset.switcherName === active.name);
                        $current.innerText = active.text;
                        inverseClass($active, 'art-current');
                        if (item.click) {
                            item.click.call(art, name, event);
                        }
                    }
                }
            },
        });
    }

    option.switcher.forEach(add);

    return {
        name: 'switcher',
        add,
    };
}
