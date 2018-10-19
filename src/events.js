export default class Events {
  constructor(art) {
    this.art = art;
    this.destroyEvents = [];
    this.proxy = this.proxy.bind(this);
  }

  proxy(target, name, callback, option = {}) {
    if (Array.isArray(name)) {
      name.forEach(item => this.proxy(target, item, callback, option));
    }

    target.addEventListener(name, callback, option);

    const destroy = () => {
      target.removeEventListener(name, callback, option);
    };

    this.destroyEvents.push(destroy);

    return destroy;
  }

  destroy() {
    this.destroyEvents.forEach(event => event());
  }
}
