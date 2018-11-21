import { errorHandle, setStyle } from '../utils';

export default class Thumbnails {
  constructor(option) {
    this.option = option;
    this.loading = false;
    this.isLoad = false;
  }

  apply(art, $control) {
    this.art = art;
    errorHandle(art.controls.progress, '\'thumbnails\' control dependent on \'progress\' control');
    const { refs: { $progress }, events: { proxy, loadImg } } = art;
    this.$control = $control;

    proxy($progress, 'mousemove', event => {
      if (!this.loading) {
        this.loading = true;
        loadImg(this.art.option.thumbnails.url).then(() => {
          this.isLoad = true;
        });
      }

      if (this.isLoad) {
        setStyle($control, 'display', 'block');
        this.showThumbnails(event);
      }
    });

    proxy($progress, 'mouseout', () => {
      setStyle($control, 'display', 'none');
    });
  }

  showThumbnails(event) {
    const { refs: { $progress }, controls } = this.art;
    const { width: posWidth } = controls.progress.getPosFromEvent(event);
    const { url, height, width, number, column } = this.art.option.thumbnails;
    const perWidth = $progress.clientWidth / number;
    const perIndex = Math.ceil(posWidth / perWidth);
    let yIndex = Math.ceil(perIndex / column);
    let xIndex = perIndex % column || column;

    setStyle(this.$control, 'backgroundImage', `url(${url})`);
    setStyle(this.$control, 'height', `${height}px`);
    setStyle(this.$control, 'width', `${width}px`);
    setStyle(this.$control, 'backgroundPosition', `-${--xIndex * width}px -${--yIndex * height}px`);

    if (posWidth <= width / 2) {
      setStyle(this.$control, 'left', 0);
    } else if (posWidth > $progress.clientWidth - width / 2) {
      setStyle(this.$control, 'left', `${$progress.clientWidth - width}px`);
    } else {
      setStyle(this.$control, 'left', `${posWidth - width / 2}px`);
    }
  }
}
