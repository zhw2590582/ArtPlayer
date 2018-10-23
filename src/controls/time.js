import { secondToTime } from '../utils';

export default class Time {
  constructor(art, option) {
    this.art = art;
    this.option = option;
    this.init();
  }

  init() {
    this.option.ref.innerHTML = '00:00 / 00:00';

    this.art.on('video:canplay', () => {
      this.option.ref.innerHTML = this.getTime();
    });

    this.art.on('video:timeupdate', () => {
      this.option.ref.innerHTML = this.getTime();
    });

    this.art.on('video:seeking', () => {
      this.option.ref.innerHTML = this.getTime();
    });
  }

  getTime() {
    const { player } = this.art;
    return `${secondToTime(player.currentTime())} / ${secondToTime(player.duration())}`;
  }
}
