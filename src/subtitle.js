import { errorHandle, getExt, setStyle } from './utils';

export default class Subtitle {
  constructor(art) {
    this.art = art;
    if (this.art.option.subtitle) {
      errorHandle(
        getExt(this.art.option.subtitle.url) === 'vtt',
        `'url' option require 'vtt' format, but got '${getExt(this.art.option.subtitle.url)}'.`
      );
      this.init();
    }
  }

  init() {
    const {
      events: { proxy },
      option: { subtitle },
      refs: { $video, $subtitle }
    } = this.art;

    setStyle($subtitle, subtitle.style || {});
    const $track = document.createElement('track');
    $track.default = true;
    $track.kind = 'metadata';
    $track.src = subtitle.url;
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
        this.art.emit('subtitle:update', $subtitle);
      });
    }
  }

  show() {
    const { $subtitle } = this.art.refs;
    $subtitle.style.display = 'block';
    this.art.emit('subtitle:show', $subtitle);
  }

  hide() {
    const { $subtitle } = this.art.refs;
    $subtitle.style.display = 'none';
    this.art.emit('subtitle:hide', $subtitle);
  }

  switch(url) {
    const { $track } = this.art.refs;
    errorHandle(
      getExt(url) === 'vtt',
      `'url' option require 'vtt' format, but got '${getExt(url)}'.`
    );
    errorHandle(
      $track,
      'You need to initialize the subtitle option first.'
    );
    $track.src = url;
    this.art.emit('subtitle:switch', url);
  }
}
