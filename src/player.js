import { clamp } from './utils';
import config from './config';

export default class Player {
  constructor(art) {
    this.art = art;
    this.init();
    this.eventBind();
  }

  init() {
    const { option } = this.art;
    const { $video } = this.art.refs;
    $video.controls = false;
    $video.poster = option.poster;
    $video.volume = clamp(option.volume, 0, 1);
    $video.autoplay = option.autoplay;
    $video.preload = option.preload;
  }

  eventBind() {
    const { proxy } = this.art.events;
    const { $video } = this.art.refs;
    const { events } = config.video;
    events.forEach(eventName => {
      proxy($video, eventName, event => {
        this.art.emit(`video:${event.type}`, event);
      });
    });
  }
}
