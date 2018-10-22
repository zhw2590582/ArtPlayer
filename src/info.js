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
      this.getHeader();
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
        <div class="art-info-content" data-video="currentSrc"></div>
      </div>
    `);

    infoHtml.push(`
      <div class="art-info-item">
        <div class="art-info-title">Video type:</div>
        <div class="art-info-content" data-head="Content-Type"></div>
      </div>
    `);

    infoHtml.push(`
      <div class="art-info-item">
        <div class="art-info-title">Video size:</div>
        <div class="art-info-content" data-head="Content-length"></div>
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

  getHeader() {
    const { option: { url }, refs: { $infoPanel } } = this.art;
    const types = Array.from($infoPanel.querySelectorAll('[data-head]'));
    fetch(url, {
      method: 'HEAD'
    }).then(data => {
      types.forEach(item => {
        item.innerHTML = data.headers.get(item.dataset.head) || 'unknown';
      });
    }).catch(() => {
      types.forEach(item => {
        item.innerHTML = 'unknown';
      });
    });
  }

  loop() {
    const { $infoPanel, $video } = this.art.refs;
    this.timer = setTimeout(() => {
      const types = Array.from($infoPanel.querySelectorAll('[data-video]'));
      types.forEach(item => {
        item.innerHTML = $video[item.dataset.video] || 'unknown';
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
