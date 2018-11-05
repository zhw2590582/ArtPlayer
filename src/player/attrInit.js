import { clamp } from '../utils';

export default function attrInit(art) {
  const { option, refs: { $video } } = art;
  Object.keys(option.moreVideoAttr).forEach(key => {
    $video[key] = option.moreVideoAttr[key];
  });
  $video.volume = clamp(option.volume, 0, 1);
  $video.poster = option.poster;
  $video.autoplay = option.autoplay;
  $video.src = option.url;
}
