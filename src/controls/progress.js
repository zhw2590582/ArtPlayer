import { append, secondToTime, clamp } from '../utils';

export default class Progress {
  constructor(art, option) {
    this.art = art;
    this.option = option;
    this.isDroging = false;
    this.getLoaded = this.getLoaded.bind(this);
    this.getPlayed = this.getPlayed.bind(this);
    this.getPos = this.getPos.bind(this);
    this.set = this.set.bind(this);
    this.init();
  }

  init() {
    const {
      option: { highlight, theme },
      events: { proxy },
      refs: { $video },
      player
    } = this.art;

    append(
      this.option.ref,
      `
      <div class="art-control-progress-inner">
        <div class="art-progress-loaded"></div>
        <div class="art-progress-played" style="background: ${theme}"></div>
        <div class="art-progress-highlight"></div>
        <div class="art-progress-screenshot"></div>
        <div class="art-progress-indicator" style="background: ${theme}"></div>
        <div class="art-progress-tip art-tip"></div>
      </div>
    `
    );

    this.$loaded = this.option.ref.querySelector('.art-progress-loaded');
    this.$played = this.option.ref.querySelector('.art-progress-played');
    this.$highlight = this.option.ref.querySelector('.art-progress-highlight');
    this.$screenshot = this.option.ref.querySelector(
      '.art-progress-screenshot'
    );
    this.$indicator = this.option.ref.querySelector('.art-progress-indicator');
    this.$tip = this.option.ref.querySelector('.art-progress-tip');

    this.art.on('video:canplay', () => {
      this.set('loaded', this.getLoaded());
      highlight.forEach(item => {
        const left = Number(item.time) / $video.duration;
        append(this.$highlight, `
          <span data-text="${item.text}" data-time="${item.time}" style="left: ${left * 100}%"></span>
        `
        );
      });
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
      this.$tip.style.display = 'block';
      if (event.path.indexOf(this.$highlight) > -1) {
        this.showHighlight(event);
      } else {
        this.showTime(event);
      }
    });

    proxy(this.option.ref, 'mouseout', () => {
      this.$tip.style.display = 'none';
    });

    proxy(this.option.ref, 'click', event => {
      if (event.target !== this.$indicator) {
        const { second, percentage } = this.getPos(event);
        this.set('played', percentage);
        player.seek(second);
      }
    });

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

  showHighlight(event) {
    const { $video } = this.art.refs;
    const { text, time } = event.target.dataset;
    this.$tip.innerHTML = text;
    const left =
      Number(time) / $video.duration * this.option.ref.clientWidth +
      event.target.clientWidth / 2 -
      this.$tip.clientWidth / 2;
    this.$tip.style.left = `${left}px`;
  }

  showTime(event) {
    const { width, time } = this.getPos(event);
    this.$tip.innerHTML = time;
    if (width <= 20) {
      this.$tip.style.left = 0;
    } else if (width > this.option.ref.clientWidth - 20) {
      this.$tip.style.left = `${this.option.ref.clientWidth - 40}px`;
    } else {
      this.$tip.style.left = `${width - 20}px`;
    }
  }

  showScreenshot() {
    //
  }

  getPos(event) {
    const { $video } = this.art.refs;
    const { left } = this.option.ref.getBoundingClientRect();
    const width = clamp(event.x - left, 0, this.option.ref.clientWidth);
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
    return $video.buffered.length
      ? $video.buffered.end($video.buffered.length - 1) / $video.duration
      : 0;
  }

  set(type, percentage) {
    this[`$${type}`].style.width = `${percentage * 100}%`;
    if (type === 'played') {
      this.$indicator.style.left = `calc(${percentage * 100}% - 6.5px)`;
    }
  }
}
