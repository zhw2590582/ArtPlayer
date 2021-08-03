import { append, setStyle, remove, escape } from '../utils';

export default function log(art) {
    const { layers } = art;

    let $log = null;
    layers.add({
        name: 'log',
        style: {
            bottom: '50px',
        },
        mounted($el) {
            $log = $el;
        },
    });

    let timer = null;
    const max = 5;
    const timeout = 3000;

    function check() {
        const count = $log.childElementCount;
        setStyle($log, 'bottom', art.controls.show ? '50px' : '10px');
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
            if (typeof msg !== 'string') return;
            append($log, `<p>${escape(msg)}</p>`);
            setStyle($log, 'display', 'block');
            clearTimeout(timer);
            check();
        },
    };
}
