import { errorHandle, query, addClass } from './utils';

export default class Template {
    constructor(art) {
        this.art = art;
        if (art.option.container instanceof Element) {
            this.$container = art.option.container;
        } else {
            this.$container = query(art.option.container);
            errorHandle(this.$container, `No container element found by ${art.option.container}`);
        }

        errorHandle(
            art.constructor.instances.every(art => art.template.$container !== this.$container),
            'Cannot mount multiple instances on the same dom element',
        );

        errorHandle(
            this.$container.clientWidth && this.$container.clientHeight,
            'The width and height of the container cannot be 0',
        );

        if (art.whitelist.state) {
            this.initDesktop();
        } else {
            this.initMobile();
        }
    }

    query(className) {
        return query(className, this.$container);
    }

    initDesktop() {
        this.$container.innerHTML = `
          <div class="artplayer-video-player" style="--theme: ${this.art.option.theme}">
            <video class="artplayer-video">
              <track default kind="metadata"></track>
            </video>
            <div class="artplayer-subtitle"></div>
            <div class="artplayer-danmuku"></div>
            <div class="artplayer-layers"></div>
            <div class="artplayer-mask">
              <div class="artplayer-state"></div>
            </div>
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
              <div class="artplayer-setting-inner artplayer-backdrop-filter">
                <div class="artplayer-setting-body"></div>
              </div>
            </div>
            <div class="artplayer-info artplayer-backdrop-filter">
              <div class="artplayer-info-panel"></div>
              <div class="artplayer-info-close">[x]</div>
            </div>
            <div class="artplayer-pip-header">
              <div class="artplayer-pip-title"></div>
              <div class="artplayer-pip-close">×</div>
            </div>
            <div class="artplayer-contextmenu artplayer-backdrop-filter"></div>
          </div>
        `;
        this.$player = this.query('.artplayer-video-player');
        this.$video = this.query('.artplayer-video');
        this.$track = this.query('.artplayer-video track');
        this.$subtitle = this.query('.artplayer-subtitle');
        this.$danmuku = this.query('.artplayer-danmuku');
        this.$bottom = this.query('.artplayer-bottom');
        this.$progress = this.query('.artplayer-progress');
        this.$controls = this.query('.artplayer-controls');
        this.$controlsLeft = this.query('.artplayer-controls-left');
        this.$controlsRight = this.query('.artplayer-controls-right');
        this.$layers = this.query('.artplayer-layers');
        this.$loading = this.query('.artplayer-loading');
        this.$notice = this.query('.artplayer-notice');
        this.$noticeInner = this.query('.artplayer-notice-inner');
        this.$mask = this.query('.artplayer-mask');
        this.$state = this.query('.artplayer-state');
        this.$setting = this.query('.artplayer-setting');
        this.$settingInner = this.query('.artplayer-setting-inner');
        this.$settingBody = this.query('.artplayer-setting-body');
        this.$info = this.query('.artplayer-info');
        this.$infoPanel = this.query('.artplayer-info-panel');
        this.$infoClose = this.query('.artplayer-info-close');
        this.$pipHeader = this.query('.artplayer-pip-header');
        this.$pipTitle = this.query('.artplayer-pip-title');
        this.$pipClose = this.query('.artplayer-pip-close');
        this.$contextmenu = this.query('.artplayer-contextmenu');
    }

    initMobile() {
        this.$container.innerHTML = `
          <div class="artplayer-video-player">
            <video class="artplayer-video"></video>
          </div>
        `;
        this.$player = this.query('.artplayer-video-player');
        this.$video = this.query('.artplayer-video');
    }

    destroy(removeHtml) {
        if (removeHtml) {
            this.$container.innerHTML = '';
        } else {
            addClass(this.$player, 'artplayer-destroy');
        }
    }
}
