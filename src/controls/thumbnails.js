import { errorHandle, setStyle } from '../utils';

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
        setStyle(this.option.$control, 'display', 'block');
        this.showThumbnails(event);
      }
    });

    proxy($progress, 'mouseout', () => {
      setStyle(this.option.$control, 'display', 'none');
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
    const { refs: { $progress }, controls } = this.art;
    errorHandle(controls.progress, '\'thumbnails\' control dependent on \'progress\' control');
    const { width: posWidth } = controls.progress.getPosFromEvent(event);
    const { url, height, width, number, column } = this.art.option.thumbnails;
    const perWidth = $progress.clientWidth / number;
    const perIndex = Math.ceil(posWidth / perWidth);
    let yIndex = Math.ceil(perIndex / column);
    let xIndex = perIndex % column || column;

    setStyle(this.option.$control, 'backgroundImage', `url(${url})`);
    setStyle(this.option.$control, 'height', `${height}px`);
    setStyle(this.option.$control, 'width', `${width}px`);
    setStyle(this.option.$control, 'backgroundPosition', `-${--xIndex * width}px -${--yIndex * height}px`);

    if (posWidth <= width / 2) {
      setStyle(this.option.$control, 'left', 0);
    } else if (posWidth > $progress.clientWidth - width / 2) {
      setStyle(this.option.$control, 'left', `${$progress.clientWidth - width}px`);
    } else {
      setStyle(this.option.$control, 'left', `${posWidth - width / 2}px`);
    }
  }
}
