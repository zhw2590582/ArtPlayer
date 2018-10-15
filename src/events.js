export default class Events {
  constructor(art) {
    this.art = art;
    this.destroyEvents = [];
    this.proxy = this.proxy.bind(this);
    this.init();
  }

  proxy(target, name, callback) {
    target.addEventListener(name, callback);
    this.destroyEvents.push(() => {
      target.removeEventListener(name, callback);
    });
  }

  init() {
    console.log('Events init');
  }

  destroy() {
    this.destroyEvents.forEach(event => event());
  }
}
