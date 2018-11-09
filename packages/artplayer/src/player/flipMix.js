import { errorHandle } from '../utils';

export default function flipMix(art, player) {
  Object.defineProperty(player, 'flipState', {
    get: () => art.refs.$player.dataset.flip
  });

  Object.defineProperty(player, 'flip', {
    value: dir => {
      const dirList = ['normal', 'horizontal', 'vertical'];
      errorHandle(dirList.includes(dir), `The 'angle' need to be one of '[normal, horizontal, vertical]', but got ${dir}`);
      art.refs.$player.dataset.flip = dir;
    }
  });

  Object.defineProperty(player, 'flipRemove', {
    value: () => {
      delete art.refs.$player.dataset.flip;
    }
  });
}
