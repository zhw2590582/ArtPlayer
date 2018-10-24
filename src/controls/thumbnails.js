export default class Thumbnails {
  constructor(option) {
    this.option = option;
    this.loading = false;
    this.isLoad = false;
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
      if (!this.loading) {
        this.loading = true;
        this.load(this.art.option.thumbnails.url).then(() => {
          this.isLoad = true;
        });
      }

      if (this.isLoad) {
        this.option.$control.style.display = 'block';
        this.showThumbnails(event);
      }
    });

    proxy($progress, 'mouseout', () => {
      this.option.$control.style.display = 'none';
    });
  }

  load(url) {
    const { proxy } = this.art.events;
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = url;

      if (image.complete) {
        return resolve(image);
      }

      proxy(image, 'load', () => resolve(image));

      proxy(image, 'error', () => reject(image));
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
