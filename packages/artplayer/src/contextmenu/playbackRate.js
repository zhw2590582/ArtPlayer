import { inverseClass } from '../utils';

export default function playbackRate(art) {
  const { option, i18n, player } = art;
  return {
    disable: !option.playbackRate,
    name: 'playbackRate',
    index: 10,
    html: `
      ${i18n.get('Play speed')}:
      <span data-rate="0.5">0.5</span>
      <span data-rate="0.75">0.75</span>
      <span data-rate="1" class="normal current">${i18n.get('Normal')}</span>
      <span data-rate="1.25">1.25</span>
      <span data-rate="1.5">1.5</span>
      <span data-rate="2.0">2.0</span>
    `,
    click: event => {
      const { target } = event;
      const { rate } = target.dataset;
      if (rate) {
        player.playbackRate(Number(rate));
        inverseClass(target, 'current');
        art.contextmenu.hide();
      }
    }
  };
}
