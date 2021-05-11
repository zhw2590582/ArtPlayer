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
            art.constructor.instances.every((ins) => ins.template.$container !== this.$container),
            'Cannot mount multiple instances on the same dom element',
        );

        if (art.whitelist.state) {
            this.desktop();
        } else {
            this.mobile();
        }
    }

    query(className) {
        return query(className, this.$container);
    }

    desktop() {
        const { theme, backdrop } = this.art.option;
        this.$container.innerHTML = `
          <div class="art-undercover"></div>
          <div class="art-video-player art-subtitle-show art-layer-show" style="--theme: ${theme}">
            <video class="art-video"></video>
            <div class="art-poster"></div>
            <div class="art-subtitle"></div>
            <div class="art-danmuku"></div>
            <div class="art-layers"></div>
            <div class="art-mask">
              <div class="art-state"></div>
            </div>
            <div class="art-bottom">
              <div class="art-progress"></div>
              <div class="art-controls">
                <div class="art-controls-left"></div>
                <div class="art-controls-right"></div>
              </div>
            </div>
            <div class="art-loading"></div>
            <div class="art-notice">
              <div class="art-notice-inner"></div>
            </div>
            <div class="art-settings">
              <div class="art-setting-inner">
                <div class="art-setting-body"></div>
              </div>
            </div>
            <div class="art-info">
              <div class="art-info-panel">
                <div class="art-info-item">
                  <div class="art-info-title">Player version:</div>
                  <div class="art-info-content">__VERSION__</div>
                </div>
                <div class="art-info-item">
                  <div class="art-info-title">Video url:</div>
                  <div class="art-info-content" data-video="src"></div>
                </div>
                <div class="art-info-item">
                  <div class="art-info-title">Video volume:</div>
                  <div class="art-info-content" data-video="volume"></div>
                </div>
                <div class="art-info-item">
                  <div class="art-info-title">Video time:</div>
                  <div class="art-info-content" data-video="currentTime"></div>
                </div>
                <div class="art-info-item">
                  <div class="art-info-title">Video duration:</div>
                  <div class="art-info-content" data-video="duration"></div>
                </div>
                <div class="art-info-item">
                  <div class="art-info-title">Video resolution:</div>
                  <div class="art-info-content">
                    <span data-video="videoWidth"></span> x <span data-video="videoHeight"></span>
                  </div>
                </div>
              </div>
              <div class="art-info-close">[x]</div>
            </div>
            <div class="art-mini-header">
              <div class="art-mini-title"></div>
              <div class="art-mini-close">×</div>
            </div>
            <div class="art-contextmenus"></div>
          </div>
        `;

        this.$undercover = this.query('.art-undercover');
        this.$player = this.query('.art-video-player');
        this.$video = this.query('.art-video');
        this.$poster = this.query('.art-poster');
        this.$subtitle = this.query('.art-subtitle');
        this.$danmuku = this.query('.art-danmuku');
        this.$bottom = this.query('.art-bottom');
        this.$progress = this.query('.art-progress');
        this.$controls = this.query('.art-controls');
        this.$controlsLeft = this.query('.art-controls-left');
        this.$controlsRight = this.query('.art-controls-right');
        this.$layer = this.query('.art-layers');
        this.$loading = this.query('.art-loading');
        this.$notice = this.query('.art-notice');
        this.$noticeInner = this.query('.art-notice-inner');
        this.$mask = this.query('.art-mask');
        this.$state = this.query('.art-state');
        this.$setting = this.query('.art-settings');
        this.$settingInner = this.query('.art-setting-inner');
        this.$settingBody = this.query('.art-setting-body');
        this.$info = this.query('.art-info');
        this.$infoPanel = this.query('.art-info-panel');
        this.$infoClose = this.query('.art-info-close');
        this.$miniHeader = this.query('.art-mini-header');
        this.$miniTitle = this.query('.art-mini-title');
        this.$miniClose = this.query('.art-mini-close');
        this.$contextmenu = this.query('.art-contextmenus');

        if (backdrop) {
            addClass(this.$settingInner, 'art-backdrop-filter');
            addClass(this.$info, 'art-backdrop-filter');
            addClass(this.$contextmenu, 'art-backdrop-filter');
        }

        if (this.art.isMobile) {
            addClass(this.$container, 'art-mobile');
        }
    }

    mobile() {
        this.$container.innerHTML = `
          <div class="art-video-player">
            <video class="art-video"></video>
          </div>
        `;
        this.$player = this.query('.art-video-player');
        this.$video = this.query('.art-video');
    }

    destroy(remove) {
        if (remove) {
            this.$container.innerHTML = '';
        } else {
            addClass(this.$player, 'art-destroy');
        }
    }
}
