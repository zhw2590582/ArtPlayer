import { append } from './utils';

export default class Info {
    constructor(art) {
        this.art = art;
        this.init();
    }

    init() {
        const {
            template: { $infoClose },
            events: { proxy },
        } = this.art;
        proxy($infoClose, 'click', () => {
            this.show = false;
        });
        this.art.on('destroy', () => {
            if (this.timer) {
                clearTimeout(this.timer);
            }
        });
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
        const { $infoPanel, $video } = this.art.template;
        const types = Array.from($infoPanel.querySelectorAll('[data-video]'));
        types.forEach(item => {
            const value = $video[item.dataset.video];
            if (value !== undefined) {
                item.innerHTML = typeof value === 'number' ? value.toFixed(2) : value;
            } else {
                item.innerHTML = 'unknown';
            }
        });
    }

    loop() {
        this.readInfo();
        this.timer = setTimeout(() => {
            this.readInfo();
            this.loop();
        }, 1000);
    }

    set show(value) {
        const { $player, $infoPanel } = this.art.template;
        if (value) {
            this.state = true;
            $player.classList.add('artplayer-info-show');
            if (!$infoPanel.innerHTML) {
                append($infoPanel, this.creatInfo());
            }
            clearTimeout(this.timer);
            this.loop();
            this.art.emit('info:show');
        } else {
            this.state = false;
            $player.classList.remove('artplayer-info-show');
            clearTimeout(this.timer);
            this.art.emit('info:hide');
        }
    }

    toggle() {
        this.show = !this.state;
    }
}
