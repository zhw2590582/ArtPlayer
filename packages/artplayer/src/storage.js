export default class Storage {
    constructor() {
        this.name = 'artplayer_settings';
        this.settings = {};
    }

    get(key) {
        try {
            const storage = JSON.parse(window.localStorage.getItem(this.name)) || {};
            return key ? storage[key] : storage;
        } catch (error) {
            return key ? this.settings[key] : this.settings;
        }
    }

    set(key, value) {
        try {
            const storage = Object.assign({}, this.get(), {
                [key]: value,
            });
            window.localStorage.setItem(this.name, JSON.stringify(storage));
        } catch (error) {
            this.settings[key] = value;
        }
    }

    del(key) {
        try {
            const storage = this.get();
            delete storage[key];
            window.localStorage.setItem(this.name, JSON.stringify(storage));
        } catch (error) {
            delete this.settings[key];
        }
    }

    clear() {
        try {
            window.localStorage.removeItem(this.name);
        } catch (error) {
            this.settings = {};
        }
    }
}
