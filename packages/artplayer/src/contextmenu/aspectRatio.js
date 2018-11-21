import { inverseClass } from '../utils';

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
        art.contextmenu.hide();
      }
    },
    callback: $menu => {
      art.on('aspectRatioChange', ratio => {
        const $current = Array.from($menu.querySelectorAll('span')).find(
          item => item.dataset.ratio === ratio.join(':')
        );
        inverseClass($current, 'current');
      });
    }
  };
}
