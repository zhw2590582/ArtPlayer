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
    const { events: { proxy }, refs: { $video } } = this.art;

    config.video.events.forEach(eventName => {
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
        const promise = this.play();
        if (promise !== undefined) {
          promise.then().catch(err => {
            console.warn(err);
          });
        }
      }
    });

    this.art.on('video:playing', () => {
      this.art.playing = true;
      this.art.controls.hide();
      this.art.mask.hide();
    });

    this.art.on('video:pause', () => {
      this.art.playing = false;
      this.art.controls.show();
      this.art.mask.show();
    });

    this.art.on('video:ended', () => {
      this.art.playing = false;
      this.art.controls.show();
      this.art.mask.show();
    });
  }

  play() {
    const { refs: { $video } } = this.art;
    const promise = $video.play();
    this.art.emit('play', $video);
    return promise;
  }

  pause() {
    const { refs: { $video } } = this.art;
    $video.pause();
    this.art.emit('pause', $video);
  }

  toggle() {
    if (this.art.playing) {
      this.pause();
    } else {
      this.play();
    }
  }

  seek(time) {
    const { refs: { $video } } = this.art;
    let newTime = Math.max(time, 0);
    if ($video.duration) {
      newTime = Math.min(newTime, $video.duration);
    }

    $video.currentTime = newTime;
    this.art.emit('seek', newTime);
  }

  currentTime() {
    return this.art.refs.$video.currentTime;
  }

  volume(percentage) {
    const { refs: { $video } } = this.art;
    if (percentage) {
      $video.volume = clamp(percentage, 0, 1);
    }

    this.art.emit('volume', $video.volume);
  }

  switchVolumeIcon() {
    //
  }

  switchVideo() {
    //
  }

  switchQuality() {
    //
  }

  resize() {
    //
  }

  speed(rate) {
    const { refs: { $video } } = this.art;
    $video.playbackRate = rate;
    this.art.emit('speed', rate);
  }
}
