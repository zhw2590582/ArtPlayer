export default class Template {
    constructor(art) {
        const { refs } = art;
        refs.$container.innerHTML = `
          <div class="artplayer-video-player">
            <video data-index="10" class="artplayer-video"></video>
            <div data-index="20" class="artplayer-subtitle"></div>
            <div data-index="30" class="artplayer-layers"></div>
            <div data-index="40" class="artplayer-mask"></div>
            <div data-index="50" class="artplayer-bottom">
              <div class="artplayer-progress"></div>
              <div class="artplayer-controls">
                <div class="artplayer-controls-left"></div>
                <div class="artplayer-controls-right"></div>
              </div>
            </div>
            <div data-index="60" class="artplayer-loading"></div>
            <div data-index="70" class="artplayer-notice">
              <div class="artplayer-notice-inner"></div>
            </div>
            <div data-index="80" class="artplayer-setting">
              <div class="artplayer-setting-inner">
                <div class="artplayer-setting-body"></div>
                <div class="artplayer-setting-close">×</div>
              </div>
            </div>
            <div data-index="90" class="artplayer-info">
              <div class="artplayer-info-panel"></div>
              <div class="artplayer-info-close">[x]</div>
            </div>
            <div data-index="100" class="artplayer-pip-header">
              <div class="artplayer-pip-title"></div>
              <div class="artplayer-pip-close">×</div>
            </div>
            <div data-index="110" class="artplayer-contextmenu"></div>
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
        refs.$contextmenu = refs.$container.querySelector('.artplayer-contextmenu');
    }
}
