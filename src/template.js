export default class Template {
  constructor(art) {
    this.art = art;
    this.init();
  }

  init() {
    const { refs } = this.art;
    refs.$container.innerHTML = `
        <div class="artplayer-video-player">
          <video class="artplayer-video"></video>
          <div class="artplayer-subtitle"></div>
          <div class="artplayer-layers"></div>
          <div class="artplayer-mask"></div>
          <div class="artplayer-bottom">
            <div class="artplayer-progress"></div>
            <div class="artplayer-controls">
              <div class="artplayer-controls-left"></div>
              <div class="artplayer-controls-right"></div>
            </div>
          </div>
          <div class="artplayer-loading"></div>
          <div class="artplayer-notice"></div>
          <div class="artplayer-info">
            <div class="artplayer-info-panel"></div>
            <div class="artplayer-info-close">[x]</div>
          </div>
        </div>
      `;
    refs.$player = refs.$container.querySelector('.artplayer-video-player');
    refs.$video = refs.$container.querySelector('.artplayer-video');
    refs.$subtitle = refs.$container.querySelector('.artplayer-subtitle');
    refs.$bottom = refs.$container.querySelector('.artplayer-bottom');
    refs.$progress = refs.$container.querySelector('.artplayer-progress');
    refs.$controls = refs.$container.querySelector('.artplayer-controls');
    refs.$controlsLeft = refs.$container.querySelector('.artplayer-controls-left');
    refs.$controlsRight = refs.$container.querySelector('.artplayer-controls-right');
    refs.$layers = refs.$container.querySelector('.artplayer-layers');
    refs.$loading = refs.$container.querySelector('.artplayer-loading');
    refs.$notice = refs.$container.querySelector('.artplayer-notice');
    refs.$mask = refs.$container.querySelector('.artplayer-mask');
    refs.$info = refs.$container.querySelector('.artplayer-info');
    refs.$infoPanel = refs.$container.querySelector('.artplayer-info-panel');
    refs.$infoClose = refs.$container.querySelector('.artplayer-info-close');
  }
}
