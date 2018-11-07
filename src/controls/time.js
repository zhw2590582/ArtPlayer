import { secondToTime } from '../utils';

export default class Time {
  constructor(option) {
    this.option = option;
  }

  apply(art, $control) {
    $control.innerHTML = '00:00 / 00:00';

    function setTime() {
      $control.innerHTML = `${secondToTime(art.player.currentTime())} / ${secondToTime(art.player.duration())}`;
    }

    art.on('video:canplay', () => {
      setTime();
    });

    art.on('video:timeupdate', () => {
      setTime();
    });

    art.on('video:seeking', () => {
      setTime();
    });
  }
}
