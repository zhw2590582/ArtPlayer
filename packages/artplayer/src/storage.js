import { sleep } from './utils';

export default class Storage {
    constructor(art) {
        this.art = art;
        this.storageName = 'artplayer_settings';
        sleep().then(() => {
            this.init();
        });
    }

    init() {
        const { player } = this.art;
        const volume = this.get('volume');
        if (volume) {
            player.volume = volume;
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
