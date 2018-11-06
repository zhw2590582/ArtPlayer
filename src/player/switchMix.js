export default function switchMix(art, player) {
  const { refs: { $video }, i18n, notice, isPlaying, option } = art;

  Object.defineProperty(player, 'switch', {
    value: (url, name = 'Unknown') => {
      const currentTime = player.currentTime();
      $video.src = url;
      option.url = url;
      player.removePlaybackRate();
      player.removeAspectRatio();
      player.reconnectTime = 0;
      player.seek(currentTime);
      if (isPlaying) {
        player.play();
      }
      notice.show(`${i18n.get('Switch video')}: ${name}`);
      art.emit('switch', url);
    }
  });
}
