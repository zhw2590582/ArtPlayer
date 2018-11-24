import { append, setStyle } from './utils';

export default class Info {
    constructor(art) {
        this.art = art;
        this.init();
    }

    init() {
        const {
            refs: { $infoClose },
            events: { proxy },
        } = this.art;
        proxy($infoClose, 'click', () => {
            this.hide();
        });
    }

    show() {
        const { $info, $infoPanel } = this.art.refs;
        setStyle($info, 'display', 'block');
        if (!$infoPanel.innerHTML) {
            append($infoPanel, this.creatInfo());
        }
        clearTimeout(this.timer);
        this.loop();
        this.art.emit('info:show', $info);
    }

    creatInfo() {
        const infoHtml = [];

        infoHtml.push(`
          <div class="art-info-item ">
            <div class="art-info-title">Player version:</div>
            <div class="art-info-content">__VERSION__</div>
          </div>
        `);

        infoHtml.push(`
          <div class="art-info-item">
            <div class="art-info-title">Video url:</div>
            <div class="art-info-content">${this.art.option.url}</div>
          </div>
        `);

        infoHtml.push(`
          <div class="art-info-item">
            <div class="art-info-title">Video volume:</div>
            <div class="art-info-content" data-video="volume"></div>
          </div>
        `);

        infoHtml.push(`
          <div class="art-info-item">
            <div class="art-info-title">Video time:</div>
            <div class="art-info-content" data-video="currentTime"></div>
          </div>
        `);

        infoHtml.push(`
          <div class="art-info-item">
            <div class="art-info-title">Video duration:</div>
            <div class="art-info-content" data-video="duration"></div>
          </div>
        `);

        infoHtml.push(`
          <div class="art-info-item">
            <div class="art-info-title">Video resolution:</div>
            <div class="art-info-content">
              <span data-video="videoWidth"></span> x <span data-video="videoHeight"></span>
            </div>
          </div>
        `);

        return infoHtml.join('');
    }

    readInfo() {
        const { $infoPanel, $video } = this.art.refs;
        const types = Array.from($infoPanel.querySelectorAll('[data-video]'));
        types.forEach(item => {
            const value = $video[item.dataset.video];
            item.innerHTML = value !== undefined ? value : 'unknown';
        });
    }

    loop() {
        this.readInfo();
        this.timer = setTimeout(() => {
            this.readInfo();
            this.loop();
        }, 1000);
    }

    hide() {
        const { $info } = this.art.refs;
        setStyle($info, 'display', 'none');
        clearTimeout(this.timer);
        this.art.emit('info:hide', $info);
    }
}
