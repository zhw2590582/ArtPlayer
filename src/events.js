export default class Events {
  constructor(art) {
    this.art = art;
    this.destroyEvents = [];
    this.proxy = this.proxy.bind(this);
    this.hover = this.hover.bind(this);
  }

  proxy(target, name, callback, option = {}) {
    if (Array.isArray(name)) {
      name.forEach(item => this.proxy(target, item, callback, option));
    }

    target.addEventListener(name, callback, option);
    this.destroyEvents.push(() => {
      target.removeEventListener(name, callback, option);
    });
  }

  hover(target, mouseenter, mouseleave) {
    this.proxy(target, 'mouseenter', mouseenter);
    this.proxy(target, 'mouseleave', mouseleave);
  }

  destroy() {
    this.destroyEvents.forEach(event => event());
  }
}
