import { secondToTime } from '../utils';

export default class Time {
  constructor(option) {
    this.option = option;
  }

  apply(art) {
    this.art = art;
    this.init();
  }

  init() {
    this.option.$control.innerHTML = '00:00 / 00:00';

    this.art.on('video:canplay', () => {
      this.option.$control.innerHTML = this.getTime();
    });

    this.art.on('video:timeupdate', () => {
      this.option.$control.innerHTML = this.getTime();
    });

    this.art.on('video:seeking', () => {
      this.option.$control.innerHTML = this.getTime();
    });
  }

  getTime() {
    const { player } = this.art;
    return `${secondToTime(player.currentTime())} / ${secondToTime(player.duration())}`;
  }
}
