export default class Events {
  constructor(art) {
    this.art = art;
    this.destroys = [];
    this.proxy = this.proxy.bind(this);
    this.init();
  }

  proxy(target, name, callback) {
    target.addEventListener(name, callback);
    this.destroys.push(() => {
      target.removeEventListener(name, callback);
    });
  }

  init() {
    console.log('Events init');
  }
}
