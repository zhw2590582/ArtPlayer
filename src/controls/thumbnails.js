export default class Thumbnails {
  constructor(option) {
    this.option = option;
  }

  apply(art) {
    this.art = art;
    this.init();
  }

  init() {
    const {
      refs: { $progress },
      events: { proxy }
    } = this.art;

    proxy($progress, 'mousemove', event => {
      this.option.$control.style.display = 'block';
      this.showThumbnails(event);
    });

    proxy($progress, 'mouseout', () => {
      this.option.$control.style.display = 'none';
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

    this.option.$control.style.backgroundImage = `url(${url})`;
    this.option.$control.style.height = `${height}px`;
    this.option.$control.style.width = `${width}px`;
    this.option.$control.style.backgroundPosition = `-${--xIndex * width}px -${--yIndex * height}px`;

    if (posWidth <= width / 2) {
      this.option.$control.style.left = 0;
    } else if (posWidth > $progress.clientWidth - width / 2) {
      this.option.$control.style.left = `${$progress.clientWidth - width}px`;
    } else {
      this.option.$control.style.left = `${posWidth - width / 2}px`;
    }
  }
}
