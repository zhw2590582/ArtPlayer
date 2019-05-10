import { errorHandle } from './utils';

export default class Template {
    constructor(art) {
        this.art = art;
        if (art.option.container instanceof Element) {
            this.$container = art.option.container;
        } else {
            this.$container = document.querySelector(art.option.container);
            errorHandle(this.$container, `No container element found by ${art.option.container}`);
        }

        if (art.constructor.instances.some(art => art.template.$container === this.$container)) {
            errorHandle(false, 'Cannot mount multiple instances on the same dom element');
        }

        if (art.whitelist.state) {
            this.initDesktop();
        } else {
            this.initMobile();
        }
    }

    initDesktop() {
        this.$container.innerHTML = `
          <div class="artplayer-video-player" style="--theme: ${this.art.option.theme}">
            <video class="artplayer-video"></video>
            <div class="artplayer-subtitle"></div>
            <div class="artplayer-danmuku"></div>
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
            <div class="artplayer-contextmenu"></div>
          </div>
        `;
        this.$player = this.$container.querySelector('.artplayer-video-player');
        this.$video = this.$container.querySelector('.artplayer-video');
        this.$subtitle = this.$container.querySelector('.artplayer-subtitle');
        this.$danmuku = this.$container.querySelector('.artplayer-danmuku');
        this.$bottom = this.$container.querySelector('.artplayer-bottom');
        this.$progress = this.$container.querySelector('.artplayer-progress');
        this.$controls = this.$container.querySelector('.artplayer-controls');
        this.$controlsLeft = this.$container.querySelector('.artplayer-controls-left');
        this.$controlsRight = this.$container.querySelector('.artplayer-controls-right');
        this.$layers = this.$container.querySelector('.artplayer-layers');
        this.$loading = this.$container.querySelector('.artplayer-loading');
        this.$notice = this.$container.querySelector('.artplayer-notice');
        this.$noticeInner = this.$container.querySelector('.artplayer-notice-inner');
        this.$mask = this.$container.querySelector('.artplayer-mask');
        this.$setting = this.$container.querySelector('.artplayer-setting');
        this.$settingInner = this.$container.querySelector('.artplayer-setting-inner');
        this.$settingBody = this.$container.querySelector('.artplayer-setting-body');
        this.$info = this.$container.querySelector('.artplayer-info');
        this.$infoPanel = this.$container.querySelector('.artplayer-info-panel');
        this.$infoClose = this.$container.querySelector('.artplayer-info-close');
        this.$pipHeader = this.$container.querySelector('.artplayer-pip-header');
        this.$pipTitle = this.$container.querySelector('.artplayer-pip-title');
        this.$pipClose = this.$container.querySelector('.artplayer-pip-close');
        this.$contextmenu = this.$container.querySelector('.artplayer-contextmenu');
    }

    initMobile() {
        this.$container.innerHTML = `
          <div class="artplayer-video-player">
            <video class="artplayer-video"></video>
          </div>
        `;
        this.$player = this.$container.querySelector('.artplayer-video-player');
        this.$video = this.$container.querySelector('.artplayer-video');
    }

    destroy(removeHtml) {
        if (removeHtml) {
            this.$container.innerHTML = '';
        } else {
            this.$player.classList.add('artplayer-destroy');
        }
    }
}
