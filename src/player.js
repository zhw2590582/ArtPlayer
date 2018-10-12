import { clamp } from './utils';
import mediaElement from './utils/mediaElement';

export default class Player {
  constructor(art) {
    this.art = art;
    this.eventFn = this.eventFn.bind(this);
    this.init();
    this.eventBind();
  }

  init() {
    const { option } = this.art;
    const { $video } = this.art.refs;
    $video.controls = true;
    $video.poster = option.poster;
    $video.volume = clamp(option.volume, 0, 1);
    $video.autoplay = option.autoplay;
    $video.preload = option.preload;
  }

  eventBind() {
    const { $video } = this.art.refs;
    const { events } = mediaElement;
    for (let index = 0; index < events.length; index++) {
      const eventName = events[index];
      $video.addEventListener(eventName, this.eventFn);
      this.art.destroyEvents.push(() => {
        $video.removeEventListener(eventName, this.eventFn);
      });
    }
  }

  eventFn(event) {
    this.art.emit(`video:${event.type}`, event);
  }
}
