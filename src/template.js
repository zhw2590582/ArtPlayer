export default class Template {
  constructor(art) {
    const { refs } = art;
    refs.$container.innerHTML = `
      <div class="artplayer-video-player">
        <video class="artplayer-video"></video>
        <div class="artplayer-subtitle"></div>
        <div class="artplayer-danmu"></div>
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
        <div class="artplayer-notice">
          <div class="artplayer-notice-inner"></div>
        </div>
        <div class="artplayer-setting">
          <div class="artplayer-setting-inner">
            <div class="artplayer-setting-body"></div>
            <div class="artplayer-setting-close">×</div>
          </div>
        </div>
        <div class="artplayer-info">
          <div class="artplayer-info-panel"></div>
          <div class="artplayer-info-close">[x]</div>
        </div>
        <div class="artplayer-pip-header">
          <div class="artplayer-pip-title"></div>
          <div class="artplayer-pip-close">×</div>
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
    refs.$danmu = refs.$container.querySelector('.artplayer-danmu');
    refs.$loading = refs.$container.querySelector('.artplayer-loading');
    refs.$notice = refs.$container.querySelector('.artplayer-notice');
    refs.$noticeInner = refs.$container.querySelector('.artplayer-notice-inner');
    refs.$mask = refs.$container.querySelector('.artplayer-mask');
    refs.$setting = refs.$container.querySelector('.artplayer-setting');
    refs.$settingInner = refs.$container.querySelector('.artplayer-setting-inner');
    refs.$settingBody = refs.$container.querySelector('.artplayer-setting-body');
    refs.$settingClose = refs.$container.querySelector('.artplayer-setting-close');
    refs.$info = refs.$container.querySelector('.artplayer-info');
    refs.$infoPanel = refs.$container.querySelector('.artplayer-info-panel');
    refs.$infoClose = refs.$container.querySelector('.artplayer-info-close');
    refs.$pipHeader = refs.$container.querySelector('.artplayer-pip-header');
    refs.$pipTitle = refs.$container.querySelector('.artplayer-pip-title');
    refs.$pipClose = refs.$container.querySelector('.artplayer-pip-close');
  }
}
