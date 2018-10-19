import { append, secondToTime, clamp } from '../utils';

export default class Progress {
  constructor(art, option) {
    this.art = art;
    this.option = option;
    this.getLoaded = this.getLoaded.bind(this);
    this.getPlayed = this.getPlayed.bind(this);
    this.getPos = this.getPos.bind(this);
    this.set = this.set.bind(this);
    this.init();
  }

  init() {
    const { option: { theme }, events: { proxy }, player } = this.art;

    append(this.option.ref, `
      <div class="art-control-progress-inner">
        <div class="art-progress-loaded"></div>
        <div class="art-progress-played" style="background: ${theme}"></div>
        <div class="art-progress-indicator" style="background: ${theme}"></div>
        <div class="art-progress-timer">00:00</div>
      </div>
    `);

    this.$loaded = this.option.ref.querySelector('.art-progress-loaded');
    this.$played = this.option.ref.querySelector('.art-progress-played');
    this.$indicator = this.option.ref.querySelector('.art-progress-indicator');
    this.$timer = this.option.ref.querySelector('.art-progress-timer');

    this.art.on('video:canplay', () => {
      this.set('loaded', this.getLoaded());
    });

    this.art.on('video:progress', () => {
      this.set('loaded', this.getLoaded());
    });

    this.art.on('video:timeupdate', () => {
      this.set('played', this.getPlayed());
    });

    this.art.on('video:ended', () => {
      this.set('played', 1);
    });

    proxy(this.option.ref, 'mousemove', event => {
      const { width, time } = this.getPos(event);
      if (width <= 20) {
        this.$timer.style.left = 0;
      } else if (width > this.option.ref.clientWidth - 20) {
        this.$timer.style.left = `${this.option.ref.clientWidth - 40}px`;
      } else {
        this.$timer.style.left = `${width - 20}px`;
      }
      this.$timer.innerHTML = time;
    });

    proxy(this.option.ref, 'click', event => {
      if (event.target !== this.$indicator) {
        const { second, percentage } = this.getPos(event);
        this.set('played', percentage);
        player.seek(second);
      }
    });

    this.isDroging = false;
    proxy(this.$indicator, 'mousedown', () => {
      this.isDroging = true;
    });

    proxy(document, 'mousemove', event => {
      if (this.isDroging) {
        const { second, percentage } = this.getPos(event);
        this.$indicator.classList.add('show-indicator');
        this.set('played', percentage);
        player.seek(second);
      }
    });

    proxy(document, 'mouseup', () => {
      if (this.isDroging) {
        this.isDroging = false;
        this.$indicator.classList.remove('show-indicator');
      }
    });
  }

  getPos(event) {
    const { $video } = this.art.refs;
    const { left } = this.option.ref.getBoundingClientRect();
    const width = event.x - left;
    const second = width / this.option.ref.clientWidth * $video.duration;
    const time = secondToTime(second);
    const percentage = clamp(width / this.option.ref.clientWidth, 0, 1);
    return { second, time, width, percentage };
  }

  getPlayed() {
    const { $video } = this.art.refs;
    return $video.currentTime / $video.duration;
  }

  getLoaded() {
    const { $video } = this.art.refs;
    return $video.buffered.length ? $video.buffered.end($video.buffered.length - 1) / $video.duration : 0;
  }

  set(type, percentage) {
    this[`$${type}`].style.width = `${percentage * 100}%`;
    if (type === 'played') {
      this.$indicator.style.left = `calc(${percentage * 100}% - 6.5px)`;
    }
  }
}

