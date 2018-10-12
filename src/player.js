import { clamp } from './utils';

export default class Player {
  constructor(art) {
    this.art = art;
    this.init();
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
}
