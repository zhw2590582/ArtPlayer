export default function info(art) {
  return {
    name: 'info',
    html: art.i18n.get('Video info'),
    click: () => {
      art.info.show();
      art.contextmenu.hide();
    }
  };
}
