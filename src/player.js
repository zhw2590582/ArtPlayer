import { clamp, secondToTime } from './utils';
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
    $video.src = option.url;
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

    this.art.on('video:waiting', () => {
      this.art.loading.show();
    });

    this.art.on('video:seeking', () => {
      this.art.loading.show();
    });

    this.art.on('video:canplay', () => {
      this.art.controls.show();
      this.art.mask.show();
      this.art.loading.hide();
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
      this.art.isPlaying = true;
      this.art.controls.hide();
      this.art.mask.hide();
    });

    this.art.on('video:pause', () => {
      this.art.isPlaying = false;
      this.art.controls.show();
      this.art.mask.show();
    });

    this.art.on('video:ended', () => {
      this.art.isPlaying = false;
      this.art.controls.show();
      this.art.mask.show();
    });

    this.art.on('video:error', () => {
      this.art.isPlaying = false;
      this.art.loading.hide();
    });
  }

  play() {
    const { refs: { $video }, i18n, notice } = this.art;
    const promise = $video.play();
    notice.show(i18n.get('Start'));
    this.art.emit('play', $video);
    return promise;
  }

  pause() {
    const { refs: { $video }, i18n, notice } = this.art;
    $video.pause();
    notice.show(i18n.get('Pause'));
    this.art.emit('pause', $video);
  }

  toggle() {
    if (this.art.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  seek(time) {
    const { refs: { $video }, notice } = this.art;
    let newTime = Math.max(time, 0);
    if ($video.duration) {
      newTime = Math.min(newTime, $video.duration);
    }
    $video.currentTime = newTime;
    notice.show(`${secondToTime(newTime)} / ${secondToTime($video.duration)}`);
    this.art.emit('seek', newTime);
  }

  volume(percentage) {
    const { refs: { $video }, i18n, notice } = this.art;
    if (percentage) {
      $video.volume = clamp(percentage, 0, 1);
      notice.show(`${i18n.get('Volume')}: ${parseInt($video.volume * 100)}`);
      this.art.emit('volume', $video.volume);
    }
    return $video.volume;
  }

  currentTime() {
    return this.art.refs.$video.currentTime;
  }

  duration() {
    return this.art.refs.$video.duration;
  }

  playbackRate(rate) {
    const { refs: { $video }, i18n, notice } = this.art;
    const newRate = clamp(rate, 0.1, 10);
    $video.playbackRate = newRate;
    notice.show(`${i18n.get('Rate')}: ${newRate}x`);
    this.art.emit('playbackRate', newRate);
  }
}
