import { secondToTime } from '../utils';

export default class Time {
  constructor(option) {
    this.option = option;
  }

  apply(art, $control) {
    this.art = art;
    $control.innerHTML = '00:00 / 00:00';

    this.art.on('video:canplay', () => {
      $control.innerHTML = this.getTime();
    });

    this.art.on('video:timeupdate', () => {
      $control.innerHTML = this.getTime();
    });

    this.art.on('video:seeking', () => {
      $control.innerHTML = this.getTime();
    });
  }

  getTime() {
    const { player } = this.art;
    return `${secondToTime(player.currentTime())} / ${secondToTime(player.duration())}`;
  }
}
