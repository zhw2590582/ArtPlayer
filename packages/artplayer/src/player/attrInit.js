import { clamp, sleep } from '../utils';

export default function attrInit(art, player) {
  const { option, refs: { $video } } = art;
  Object.keys(option.moreVideoAttr).forEach(key => {
    $video[key] = option.moreVideoAttr[key];
  });

  if (option.volume) {
    $video.volume = clamp(option.volume, 0, 1);
  }

  if (option.poster) {
    $video.poster = option.poster;
  }

  if (option.autoplay) {
    $video.autoplay = option.autoplay;
  }

  sleep().then(() => {
    art.emit('beforeMountUrl', option.url);
    $video.src = player.mountUrl(option.url);
  });
}
