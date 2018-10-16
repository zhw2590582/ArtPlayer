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

    this.art.on('video:loadstart', () => {
      this.art.loading.show();
    });

    this.art.on('video:loadeddata', () => {
      this.art.loading.hide();
    });

    this.art.on('video:canplay', () => {
      this.art.controls.show();
      this.art.mask.show();
      if (this.art.option.autoplay) {
        const promise = $video.play();

        // TODO: chrome autoplay policy changes
        if (promise !== undefined) {
          promise.then().catch(err => {
            console.warn(err);
          });
        }
      }
    });

    this.art.on('video:playing', () => {
      this.art.controls.hide();
      this.art.mask.hide();
    });

    this.art.on('video:pause', () => {
      this.art.controls.show();
      this.art.mask.show();
    });

    this.art.on('video:ended', () => {
      this.art.controls.show();
      this.art.mask.show();
    });
  }
}
