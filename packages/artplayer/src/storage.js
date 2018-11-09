import { sleep } from './utils';

export default class Storage {
  constructor(art) {
    this.art = art;
    this.storageName = 'artplayer_settings';
    sleep().then(() => {
      this.initVolume();
    });
  }

  get(key) {
    const storage = JSON.parse(localStorage.getItem(this.storageName));
    return storage[key];
  }

  set(key, value) {
    const storage = Object.assign({}, this.get() || {}, {
      [key]: value
    });
    localStorage.setItem(this.storageName, JSON.stringify(storage));
  }

  initVolume() {
    const { player } = this.art;
    const volume = this.get('volume');
    if (volume) {
      player.volume = volume;
    }
  }
}
