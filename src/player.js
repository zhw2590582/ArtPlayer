import { clamp, secondToTime, setStorage, sleep, setStyle, sublings } from './utils';
import config from './config';

export default class Player {
  constructor(art) {
    this.art = art;
    this.init();
    this.eventBind();
    this.firstCanplay = false;
    this.reconnectTime = 0;
    this.maxReconnectTime = 5;
  }

  init() {
    const { option, refs: { $player, $video }, events: { proxy, hover } } = this.art;
    Object.keys(option.moreVideoAttr).forEach(key => {
      $video[key] = option.moreVideoAttr[key];
    });
    $video.volume = clamp(option.volume, 0, 1);
    $video.poster = option.poster;
    $video.autoplay = option.autoplay;

    hover($player, () => {
      $player.classList.add('artplayer-hover');
      this.art.emit('hoverenter');
    }, () => {
      $player.classList.remove('artplayer-hover');
      this.art.emit('hoverleave');
    });

    proxy($video, 'click', () => {
      this.toggle();
    });

    // TODO
    $video.src = option.url;
  }

  eventBind() {
    const { option, events: { proxy }, refs: { $player, $video }, i18n, notice } = this.art;

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
      if (!this.firstCanplay) {
        this.firstCanplay = true;
        this.art.emit('firstCanplay');
      }

      this.art.controls.show();
      this.art.mask.show();
      this.art.loading.hide();
      if (option.autoplay) {
        this.play();
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
      if (option.loop) {
        this.seek(0);
        this.play();
      }
    });

    this.art.on('video:error', () => {
      if (this.reconnectTime < this.maxReconnectTime) {
        sleep(1000).then(() => {
          this.reconnectTime++;
          $video.src = option.url;
          notice.show(`${i18n.get('Reconnect')}: ${this.reconnectTime}`);
        });
      } else {
        this.art.isError = true;
        this.art.isPlaying = false;
        this.art.loading.hide();
        this.art.controls.hide();
        $player.classList.add('artplayer-error');
        sleep(1000).then(() => {
          notice.show(i18n.get('Video load failed'), false);
          this.art.destroy();
        });
      }
    });
  }

  play() {
    const { refs: { $video }, i18n, notice } = this.art;
    const promise = $video.play();
    if (promise !== undefined) {
      promise.then().catch(err => {
        notice.show(err, true, 3000);
        console.warn(err);
      });
    }
    notice.show(i18n.get('Play'));
    this.art.emit('play', $video);
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
    if (percentage !== undefined) {
      $video.volume = clamp(percentage, 0, 1);
      notice.show(`${i18n.get('Volume')}: ${parseInt($video.volume * 100)}`);
      if ($video.volume !== 0) {
        setStorage('volume', $video.volume);
      }
      this.art.emit('volume', $video.volume);
    }
    return $video.volume || 0;
  }

  currentTime() {
    return this.art.refs.$video.currentTime || 0;
  }

  duration() {
    return this.art.refs.$video.duration || 0;
  }

  switch(url, name = 'Unknown') {
    const { refs: { $video }, i18n, notice, isPlaying, option } = this.art;
    const currentTime = this.currentTime();
    $video.src = url;
    option.url = url;
    this.reconnectTime = 0;
    this.seek(currentTime);
    if (isPlaying) {
      this.play();
    }
    this.resetStyle();
    notice.show(`${i18n.get('Switch video')}: ${name}`);
    this.art.emit('switch', url);
  }

  playbackRate(rate) {
    const { refs: { $video, $player }, i18n, notice } = this.art;
    const newRate = clamp(rate, 0.1, 10);
    $video.playbackRate = newRate;
    $player.dataset.playbackRate = newRate;
    notice.show(`${i18n.get('Rate')}: ${newRate === 1 ? i18n.get('Normal') : `${newRate}x`}`);
    this.art.emit('playbackRate', newRate);
  }

  aspectRatio(ratio) {
    const { refs: { $video, $player }, i18n, notice } = this.art;
    const ratioName = ratio.length === 2 ? `${ratio[0]}:${ratio[1]}` : i18n.get('Default');

    if (ratio.length === 2) {
      const { videoWidth, videoHeight } = $video;
      const { clientWidth, clientHeight } = $player;
      const videoRatio = videoWidth / videoHeight;
      const setupRatio = Number(ratio[0]) / Number(ratio[1]);

      if (videoRatio > setupRatio) {
        const percentage = setupRatio * videoHeight / videoWidth;
        setStyle($video, 'width', `${percentage * 100}%`);
        setStyle($video, 'height', '100%');
        setStyle($video, 'padding', `0 ${(clientWidth - clientWidth * percentage) / 2}px`);
      } else {
        const percentage = videoWidth / setupRatio / videoHeight;
        setStyle($video, 'width', '100%');
        setStyle($video, 'height', `${percentage * 100}%`);
        setStyle($video, 'padding', `${(clientHeight - clientHeight * percentage) / 2}px 0`);
      }

      $player.dataset.aspectRatio = ratioName;
    } else {
      setStyle($video, 'width', null);
      setStyle($video, 'height', null);
      setStyle($video, 'padding', null);
      delete $player.dataset.aspectRatio;
    }

    notice.show(`${i18n.get('Aspect ratio')}: ${ratioName}`);
    this.art.emit('aspectRatio', ratio);
  }

  resetStyle() {
    const { refs: { $video }, contextmenu } = this.art;

    if (contextmenu.$playbackRate) {
      const $normal = contextmenu.$playbackRate.querySelector('.normal');
      sublings($normal).forEach(item => item.classList.remove('current'));
      $normal.classList.add('current');
    }

    setStyle($video, 'width', null);
    setStyle($video, 'height', null);
    setStyle($video, 'padding', null);
    if (contextmenu.$aspectRatio) {
      const $default = contextmenu.$aspectRatio.querySelector('.default');
      sublings($default).forEach(item => item.classList.remove('current'));
      $default.classList.add('current');
    }
  }
}
