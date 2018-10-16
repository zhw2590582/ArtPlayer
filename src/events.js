export default class Events {
  constructor(art) {
    this.art = art;
    this.destroyEvents = [];
    this.proxy = this.proxy.bind(this);
    this.init();
  }

  proxy(target, name, callback, option = {}) {
    target.addEventListener(name, callback, option);
    this.destroyEvents.push(() => {
      target.removeEventListener(name, callback, option);
    });
  }

  init() {
    console.log('Events init');
  }

  destroy() {
    this.destroyEvents.forEach(event => event());
  }
}
