import { errorHandle } from '../utils';

export default function flipMix(art, player) {
  Object.defineProperty(player, 'flip', {
    value: dir => {
      const dirList = ['horizontal', 'vertical'];
      errorHandle(dirList.includes(dir), `The 'angle' need to be one of '[horizontal, vertical]', but got ${dir}`);
      art.refs.$player.dataset.flip = dir;
    }
  });

  Object.defineProperty(player, 'flipRemove', {
    value: () => {
      delete art.refs.$player.dataset.flip;
    }
  });
}
