import { errorHandle } from '../utils';

export default function rotateMix(art, player) {
  Object.defineProperty(player, 'rotate', {
    value: angle => {
      const angleList = [0, 90, 180, 270];
      errorHandle(angleList.includes(angle), `The 'angle' need to be one of '[0, 90, 180, 270]', but got ${angle}`);
      art.refs.$player.dataset.rotate = angle;
    }
  });

  Object.defineProperty(player, 'rotateRemove', {
    value: () => {
      delete art.refs.$player.dataset.rotate;
    }
  });
}
