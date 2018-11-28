export default class Storage {
    constructor(art) {
        this.art = art;
        this.storageName = 'artplayer_settings';
        this.init();
    }

    init() {
        const { option } = this.art;
        const volume = this.get('volume');
        if (volume) {
            option.volume = volume;
        }
    }

    get(key) {
        const storage = JSON.parse(localStorage.getItem(this.storageName)) || {};
        return key ? storage[key] : {};
    }

    set(key, value) {
        const storage = Object.assign({}, this.get(), {
            [key]: value,
        });
        localStorage.setItem(this.storageName, JSON.stringify(storage));
    }
}
