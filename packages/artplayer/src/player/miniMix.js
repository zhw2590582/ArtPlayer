import { append, setStyle, addClass, removeClass, hasClass, def, isInViewport, createElement } from '../utils';

export default function miniMix(art) {
    const {
        icons,
        proxy,
        storage,
        template: { $player, $video },
    } = art;

    let isDroging = false;
    let lastPageX = 0;
    let lastPageY = 0;

    function hideMini() {
        const { $mini } = art.template;
        if ($mini) {
            removeClass($player, 'art-mini');
            setStyle($mini, 'display', 'none');
            $player.prepend($video);
            art.emit('mini', false);
        }
    }

    function initState($play, $pause) {
        if (art.playing) {
            setStyle($play, 'display', `none`);
            setStyle($pause, 'display', `flex`);
        } else {
            setStyle($play, 'display', `flex`);
            setStyle($pause, 'display', `none`);
        }
    }

    function createMini() {
        const { $mini } = art.template;
        if ($mini) {
            append($mini, $video);
            return setStyle($mini, 'display', 'flex');
        } else {
            const $mini = createElement('div');
            addClass($mini, 'art-mini-popup');
            append(document.body, $mini);
            art.template.$mini = $mini;
            append($mini, $video);

            const $close = append($mini, `<div class="art-mini-close"></div>`);
            append($close, icons.close);
            proxy($close, 'click', hideMini);

            const $state = append($mini, `<div class="art-mini-state"></div>`);
            const $play = append($state, icons.play);
            const $pause = append($state, icons.pause);
            proxy($play, 'click', () => art.play());
            proxy($pause, 'click', () => art.pause());
            initState($play, $pause);
            art.on('video:playing', () => initState($play, $pause));
            art.on('video:pause', () => initState($play, $pause));
            art.on('video:timeupdate', () => initState($play, $pause));

            proxy($mini, 'mousedown', (event) => {
                isDroging = event.button === 0;
                lastPageX = event.pageX;
                lastPageY = event.pageY;
            });

            art.on('document:mousemove', (event) => {
                if (isDroging) {
                    addClass($mini, 'art-mini-droging');
                    const x = event.pageX - lastPageX;
                    const y = event.pageY - lastPageY;
                    setStyle($mini, 'transform', `translate(${x}px, ${y}px)`);
                }
            });

            art.on('document:mouseup', () => {
                if (isDroging) {
                    isDroging = false;
                    removeClass($mini, 'art-mini-droging');
                    const rect = $mini.getBoundingClientRect();
                    storage.set('left', rect.left);
                    storage.set('top', rect.top);
                    setStyle($mini, 'left', `${rect.left}px`);
                    setStyle($mini, 'top', `${rect.top}px`);
                    setStyle($mini, 'transform', null);
                }
            });

            return $mini;
        }
    }

    function initMini() {
        const { $mini } = art.template;
        const rect = $mini.getBoundingClientRect();
        const top = window.innerHeight - rect.height - 50;
        const left = window.innerWidth - rect.width - 50;
        storage.set('top', top);
        storage.set('left', left);
        setStyle($mini, 'top', `${top}px`);
        setStyle($mini, 'left', `${left}px`);
    }

    def(art, 'mini', {
        get() {
            return hasClass($player, 'art-mini');
        },
        set(value) {
            if (value) {
                art.state = 'mini';
                addClass($player, 'art-mini');
                const $mini = createMini();
                const top = storage.get('top');
                const left = storage.get('left');
                if (top && left) {
                    setStyle($mini, 'top', `${top}px`);
                    setStyle($mini, 'left', `${left}px`);
                    if (!isInViewport($mini)) {
                        initMini();
                    }
                } else {
                    initMini();
                }
                art.emit('mini', true);
            } else {
                hideMini();
            }
        },
    });
}
