export default class Storage {
    constructor(art) {
        this.name = 'artplayer_settings';

        const volume = this.get('volume');
        if (volume) {
            art.option.volume = volume;
        }
    }

    get(key) {
        const storage = JSON.parse(localStorage.getItem(this.name)) || {};
        return key ? storage[key] : {};
    }

    set(key, value) {
        const storage = Object.assign({}, this.get(), {
            [key]: value,
        });
        localStorage.setItem(this.name, JSON.stringify(storage));
    }

    del(key) {
        const storage = this.get();
        delete storage[key];
        localStorage.setItem(this.name, JSON.stringify(storage));
    }

    clean() {
        localStorage.removeItem(this.name);
    }
}
