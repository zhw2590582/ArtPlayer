import { secondToTime } from '../utils';

export default class Time {
  constructor(option) {
    this.option = option;
  }

  apply(art, $control) {
    this.art = art;
    this.$control = $control;
    $control.innerHTML = '00:00 / 00:00';

    this.art.on('video:canplay', () => {
      this.getTime();
    });

    this.art.on('video:timeupdate', () => {
      this.getTime();
    });

    this.art.on('video:seeking', () => {
      this.getTime();
    });
  }

  getTime() {
    const { player } = this.art;
    this.$control.innerHTML = `${secondToTime(player.currentTime())} / ${secondToTime(player.duration())}`;
  }
}
