export default function close(art) {
  return {
    disable: false,
    name: 'close',
    html: art.i18n.get('Close'),
    click: () => {
      art.contextmenu.hide();
    }
  };
}
