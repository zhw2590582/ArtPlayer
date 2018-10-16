export default class Events {
  constructor(art) {
    this.art = art;
    this.destroyEvents = [];
    this.proxy = this.proxy.bind(this);
  }

  proxy(target, name, callback, option = {}) {
    target.addEventListener(name, callback, option);
    this.destroyEvents.push(() => {
      target.removeEventListener(name, callback, option);
    });
  }

  destroy() {
    this.destroyEvents.forEach(event => event());
  }
}
