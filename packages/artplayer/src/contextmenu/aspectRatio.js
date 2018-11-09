import { sublings } from '../utils';

export default function aspectRatio(art) {
  const { option, i18n, player } = art;
  return {
    disable: !option.aspectRatio,
    name: 'aspectRatio',
    index: 20,
    html: `
      ${i18n.get('Aspect ratio')}:
      <span data-ratio="default" class="default current">${i18n.get('Default')}</span>
      <span data-ratio="4:3">4:3</span>
      <span data-ratio="16:9">16:9</span>
    `,
    click: event => {
      const { target } = event;
      const { ratio } = target.dataset;
      if (ratio) {
        player.aspectRatio(ratio.split(':'));
        sublings(target).forEach(item => item.classList.remove('current'));
        target.classList.add('current');
        art.contextmenu.hide();
      }
    }
  };
}
