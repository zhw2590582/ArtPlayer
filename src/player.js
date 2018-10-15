import { clamp } from './utils';
import mediaElement from './utils/mediaElement';

export default class Player {
  constructor(art) {
    this.art = art;
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
    const { proxy } = this.art.events;
    const { $video } = this.art.refs;
    const { events } = mediaElement;
    events.forEach(eventName => {
      proxy($video, eventName, event => {
        this.art.emit(`video:${event.type}`, event);
      });
    });
  }
}
