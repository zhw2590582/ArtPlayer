import { append } from './utils';

export default class Info {
  constructor(art) {
    this.art = art;
    this.init();
  }

  init() {
    const { refs: { $infoClose }, events: { proxy } } = this.art;
    proxy($infoClose, 'click', () => {
      this.hide();
    });
  }

  show() {
    const { $info, $infoPanel } = this.art.refs;
    $info.style.display = 'block';
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
        <div class="art-info-content" data-type="currentSrc"></div>
      </div>
    `);

    infoHtml.push(`
      <div class="art-info-item">
        <div class="art-info-title">Video volume:</div>
        <div class="art-info-content" data-type="volume"></div>
      </div>
    `);

    infoHtml.push(`
      <div class="art-info-item">
        <div class="art-info-title">Video time:</div>
        <div class="art-info-content" data-type="currentTime"></div>
      </div>
    `);

    infoHtml.push(`
      <div class="art-info-item">
        <div class="art-info-title">Video duration:</div>
        <div class="art-info-content" data-type="duration"></div>
      </div>
    `);

    infoHtml.push(`
      <div class="art-info-item">
        <div class="art-info-title">Video resolution:</div>
        <div class="art-info-content">
          <span data-type="videoWidth"></span> x <span data-type="videoHeight"></span>
        </div>
      </div>
    `);

    return infoHtml.join('');
  }

  loop() {
    const { $infoPanel, $video } = this.art.refs;
    this.timer = setTimeout(() => {
      const types = Array.from($infoPanel.querySelectorAll('[data-type]'));
      types.forEach(item => {
        item.innerHTML = $video[item.dataset.type];
      });
      this.loop();
    }, 1000);
  }

  hide() {
    const { $info } = this.art.refs;
    $info.style.display = 'none';
    clearTimeout(this.timer);
    this.art.emit('info:hide', $info);
  }
}
