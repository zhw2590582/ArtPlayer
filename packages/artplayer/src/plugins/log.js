import { append, setStyle, remove, escape } from '../utils';

export default function log(art) {
    const { layers } = art;

    let $log = null;
    layers.add({
        name: 'log',
        mounted($el) {
            $log = $el;
        },
    });

    let timer = null;
    const max = 5;
    const timeout = 3000;

    function check() {
        const count = $log.childElementCount;
        if (count) {
            if (count > max) {
                remove($log.firstElementChild);
                timer = setTimeout(check, timeout);
            } else {
                timer = setTimeout(() => {
                    remove($log.firstElementChild);
                    check();
                }, timeout);
            }
        } else {
            setStyle($log, 'display', 'none');
        }
    }

    art.on('destroy', () => clearTimeout(timer));

    return {
        name: 'log',
        emit(msg) {
            append($log, `<p>${escape(msg)}</p>`);
            setStyle($log, 'display', 'block');
            clearTimeout(timer);
            check();
        },
    };
}
