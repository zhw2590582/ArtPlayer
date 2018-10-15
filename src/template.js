export default class Template {
  constructor(art) {
    this.art = art;
    this.init();
  }

  init() {
    const { refs } = this.art;
    refs.$container.innerHTML = `
        <div class="artplayer-wrap">
          <video class="artplayer-video" webkit-playsinline playsinline></video>
          <div class="artplayer-controls"></div>
          <div class="artplayer-layers"></div>
          <div class="artplayer-loading"></div>
          <div class="artplayer-notice"></div>
        </div>
      `;
    refs.$wrap = refs.$container.querySelector('.artplayer-wrap');
    refs.$video = refs.$container.querySelector('.artplayer-video');
    refs.$controls = refs.$container.querySelector('.artplayer-controls');
    refs.$layers = refs.$container.querySelector('.artplayer-layers');
    refs.$loading = refs.$container.querySelector('.artplayer-loading');
    refs.$notice = refs.$container.querySelector('.artplayer-notice');
  }
}
