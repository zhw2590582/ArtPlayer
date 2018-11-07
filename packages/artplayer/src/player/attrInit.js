import { clamp, sleep } from '../utils';

export default function attrInit(art, player) {
  const { option, refs: { $video } } = art;
  Object.keys(option.moreVideoAttr).forEach(key => {
    $video[key] = option.moreVideoAttr[key];
  });
  $video.volume = clamp(option.volume, 0, 1);
  $video.poster = option.poster;
  $video.autoplay = option.autoplay;
  sleep().then(() => {
    art.emit('beforeMountUrl', option.url);
    $video.src = player.mountUrl(option.url);
  });
}
