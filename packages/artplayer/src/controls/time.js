import { secondToTime } from '../utils';

export default class Time {
  constructor(option) {
    this.option = option;
  }

  apply(art, $control) {
    function getTime() {
      $control.innerHTML = `${secondToTime(art.player.currentTime)} / ${secondToTime(art.player.duration)}`;
    }

    getTime();
    ['video:loadedmetadata', 'video:timeupdate', 'video:progress'].forEach(event => {
      art.on(event, getTime);
    });
  }
}
