export default class Contextmenu {
  constructor(art) {
    this.art = art;
    this.state = false;
    this.init();
  }

  init() {
    this.art.layers.add({
      name: 'test1',
      html: 'test2',
      index: 10
    });
    this.art.layers.add({
      name: 'test3',
      html: 'test4',
      index: 11
    });
    const { option, i18n, refs, events: { proxy } } = this.art;
    option.contextmenu.push({
      text: i18n.get('Video info'),
      click: art => {
        console.log(art);
      }
    }, {
      text: i18n.get('About author'),
      link: 'https://github.com/zhw2590582'
    });

    proxy(refs.$container, 'contextmenu', event => {
      event.preventDefault();
      if (!this.state) {
        this.creatMenu();
        this.state = true;
      }
      this.setPos(event);
      this.show();
    });

    proxy(document, 'contextmenu', event => {
      if (!event.path.includes(refs.$container)) {
        this.hide();
      }
    });
  }

  creatMenu() {
    console.log('creatMenu');
  }

  setPos() {
    console.log('setPos');
  }

  hide() {
    console.log('hide');
  }

  show() {
    console.log('show');
  }
}
