export default class Thumbnails {
  constructor(art, option) {
    this.art = art;
    this.option = option;
    this.init();
  }

  init() {
    const {
      refs: { $progress },
      events: { proxy }
    } = this.art;

    proxy($progress, 'mousemove', event => {
      this.option.ref.style.display = 'block';
      this.showThumbnails(event);
    });

    proxy($progress, 'mouseout', () => {
      this.option.ref.style.display = 'none';
    });
  }

  showThumbnails(event) {
    const { $progress } = this.art.refs;
    const { width: posWidth } = this.getPosFromEvent(event);
    const { url, height, width, number, column } = this.art.option.thumbnails;
    const perWidth = $progress.clientWidth / number;
    const perIndex = Math.ceil(posWidth / perWidth);
    let yIndex = Math.ceil(perIndex / column);
    let xIndex = perIndex % column || column;

    this.option.ref.style.backgroundImage = `url(${url})`;
    this.option.ref.style.height = `${height}px`;
    this.option.ref.style.width = `${width}px`;
    this.option.ref.style.backgroundPosition = `-${--xIndex * width}px -${--yIndex * height}px`;

    if (posWidth <= width / 2) {
      this.option.ref.style.left = 0;
    } else if (posWidth > $progress.clientWidth - width / 2) {
      this.option.ref.style.left = `${$progress.clientWidth - width}px`;
    } else {
      this.option.ref.style.left = `${posWidth - width / 2}px`;
    }
  }
}
