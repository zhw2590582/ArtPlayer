export default function switchMix(art, player) {
  Object.defineProperty(player, 'switch', {
    value: (url, name = 'Unknown') => {
      const { refs: { $video }, i18n, notice, isPlaying, option } = art;
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
