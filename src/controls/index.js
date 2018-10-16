export default class Controls {
  constructor(art) {
    this.art = art;
  }

  show() {
    const { $wrap } = this.art.refs;
    $wrap.classList.add('controls-show');
  }

  hide() {
    const { $wrap } = this.art.refs;
    $wrap.classList.remove('controls-show');
  }
}
