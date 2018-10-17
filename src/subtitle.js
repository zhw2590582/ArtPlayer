import { errorHandle, getExt } from './utils';

export default class Subtitle {
  constructor(art) {
    this.art = art;
    if (this.art.option.subtitle) {
      errorHandle(
        getExt(this.art.option.subtitle) === 'vtt',
        `'subtitle' option require 'vtt' format, but got '${getExt(this.art.option.subtitle)}'.`
      );
      this.init();
    }
  }

  init() {
    const {
      events: { proxy },
      option: { subtitle, subtitleStyle },
      refs: { $video, $subtitle }
    } = this.art;

    Object.keys(subtitleStyle).forEach(key => {
      $subtitle.style[key] = subtitleStyle[key];
    });

    const $track = document.createElement('track');
    $track.default = true;
    $track.kind = 'metadata';
    $track.src = subtitle;
    $video.appendChild($track);
    this.art.refs.$track = $track;

    if ($video.textTracks && $video.textTracks[0]) {
      const [track] = $video.textTracks;
      proxy(track, 'cuechange', () => {
        const [cue] = track.activeCues;
        $subtitle.innerHTML = '';
        if (cue) {
          const template = document.createElement('div');
          template.appendChild(cue.getCueAsHTML());
          $subtitle.innerHTML = template.innerHTML
            .split(/\r?\n/)
            .map(item => `<p>${item}</p>`)
            .join('');
        }
      });
    }
  }

  show() {
    this.art.refs.$subtitle.style.display = 'block';
  }

  hide() {
    this.art.refs.$subtitle.style.display = 'none';
  }

  change(url) {
    errorHandle(
      getExt(url) === 'vtt',
      `'url' option require 'vtt' format, but got '${getExt(url)}'.`
    );
    this.art.refs.$track.src = url;
  }
}
