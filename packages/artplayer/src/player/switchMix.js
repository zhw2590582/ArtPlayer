export default function switchMix(art, player) {
  const { refs: { $video }, i18n, notice, isPlaying, option } = art;

  Object.defineProperty(player, 'switch', {
    value: (url, name = 'unknown') => {
      const { currentTime } = player;
      art.emit('beforeMountUrl', url);
      $video.src = player.mountUrl(url);
      option.url = url;
      player.playbackRateRemove();
      player.aspectRatioRemove();
      player.seek(currentTime);
      if (isPlaying) {
        player.play();
      }
      notice.show(`${i18n.get('Switch video')}: ${name}`);
      art.emit('switch', url);
    }
  });
}
