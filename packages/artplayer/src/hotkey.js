export default class Hotkey {
    constructor(art) {
        this.keys = {};
        if (art.option.hotkey) {
            art.on('ready', () => {
                this.add(27, () => {
                    if (art.player.fullscreenWeb) {
                        art.player.fullscreenWeb = false;
                    }
                });

                this.add(32, () => {
                    art.player.toggle = true;
                });

                this.add(37, () => {
                    art.player.seek = art.player.currentTime - 5;
                });

                this.add(38, () => {
                    art.player.volume += 0.1;
                });

                this.add(39, () => {
                    art.player.seek = art.player.currentTime + 5;
                });

                this.add(40, () => {
                    art.player.volume -= 0.1;
                });

                const { proxy } = art.events;
                proxy(window, 'keydown', event => {
                    if (art.isFocus) {
                        const tag = document.activeElement.tagName.toUpperCase();
                        const editable = document.activeElement.getAttribute('contenteditable');
                        if (tag !== 'INPUT' && tag !== 'TEXTAREA' && editable !== '' && editable !== 'true') {
                            const events = this.keys[event.keyCode];
                            if (events) {
                                event.preventDefault();
                                events.forEach(fn => fn());
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
