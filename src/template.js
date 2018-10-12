export default class Template {
  constructor(art) {
    this.art = art;
    this.init();
  }

  init() {
    this.art.refs.$container.innerHTML = `
        <div class="artplayer-wrap">
          <video class="artplayer-video" webkit-playsinline playsinline></video>
          <div class="artplayer-controls"></div>
          <div class="artplayer-layers"></div>
          <div class="artplayer-loading"></div>
          <div class="artplayer-notice"></div>
        </div>
      `;
    this.art.refs.$wrap = this.art.refs.$container.querySelector(
      '.artplayer-wrap'
    );
    this.art.refs.$video = this.art.refs.$container.querySelector(
      '.artplayer-video'
    );
    this.art.refs.$controls = this.art.refs.$container.querySelector(
      '.artplayer-controls'
    );
    this.art.refs.$layers = this.art.refs.$container.querySelector(
      '.artplayer-layers'
    );
    this.art.refs.$loading = this.art.refs.$container.querySelector(
      '.artplayer-loading'
    );
    this.art.refs.$notice = this.art.refs.$container.querySelector(
      '.artplayer-notice'
    );
  }
}
