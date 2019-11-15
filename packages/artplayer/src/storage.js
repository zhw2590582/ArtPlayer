export default class Storage {
    constructor(art) {
        this.art = art;
        this.name = 'artplayer_settings';
        const { option } = art;

        const volume = this.get('volume');
        if (volume) {
            option.volume = volume;
        }
    }

    get(key) {
        const storage = JSON.parse(window.localStorage.getItem(this.name)) || {};
        return key ? storage[key] : {};
    }

    set(key, value) {
        const storage = Object.assign({}, this.get(), {
            [key]: value,
        });
        window.localStorage.setItem(this.name, JSON.stringify(storage));
    }

    del(key) {
        const storage = this.get();
        delete storage[key];
        window.localStorage.setItem(this.name, JSON.stringify(storage));
    }

    clean() {
        window.localStorage.removeItem(this.name);
    }
}
