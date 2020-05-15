export default class Hotkey {
    constructor(art) {
        this.keys = {};

        const {
            option,
            player,
            events: { proxy },
        } = art;

        if (option.hotkey) {
            art.once('ready', () => {
                this.add(27, () => {
                    if (player.fullscreenWeb) {
                        player.fullscreenWeb = false;
                    }
                });

                this.add(32, () => {
                    player.toggle = true;
                });

                this.add(37, () => {
                    player.backward = 5;
                });

                this.add(38, () => {
                    player.volume += 0.1;
                });

                this.add(39, () => {
                    player.forward = 5;
                });

                this.add(40, () => {
                    player.volume -= 0.1;
                });

                proxy(window, 'keydown', (event) => {
                    if (art.isFocus) {
                        const tag = document.activeElement.tagName.toUpperCase();
                        const editable = document.activeElement.getAttribute('contenteditable');
                        if (tag !== 'INPUT' && tag !== 'TEXTAREA' && editable !== '' && editable !== 'true') {
                            const events = this.keys[event.keyCode];
                            if (events) {
                                event.preventDefault();
                                events.forEach((fn) => fn());
                                art.emit('hotkey', event);
                            }
                        }
                    }
                });
            });
        }
    }

    add(key, event) {
        if (this.keys[key]) {
            this.keys[key].push(event);
        } else {
            this.keys[key] = [event];
        }
    }
}
