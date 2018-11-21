import { secondToTime } from '../utils';

export default class Time {
  constructor(option) {
    this.option = option;
  }

  apply(art, $control) {
    function getTime() {
      const newTime = `${secondToTime(art.player.currentTime)} / ${secondToTime(art.player.duration)}`;
      if (newTime !== $control.innerHTML) {
        $control.innerHTML = newTime;
      }
    }

    getTime();
    ['video:loadedmetadata', 'video:timeupdate', 'video:progress'].forEach(event => {
      art.on(event, getTime);
    });
  }
}
