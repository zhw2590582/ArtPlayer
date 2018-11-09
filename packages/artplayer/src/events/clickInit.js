export default function clickInit(art, events) {
  const { refs: { $player } } = art;
  events.proxy(document, ['click', 'contextmenu'], event => {
    if (event.composedPath().indexOf($player) > -1) {
      art.isFocus = true;
    } else {
      art.isFocus = false;
      art.contextmenu.hide();
    }
  });
}
