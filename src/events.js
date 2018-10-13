export default class Events {
  constructor(art) {
    this.art = art;
    this.destroys = [];
    this.proxy = this.proxy.bind(this);
  }

  proxy(target, name, callback) {
    target.addEventListener(name, callback);
    this.destroys.push(() => {
      target.removeEventListener(name, callback);
    });
  }
}
