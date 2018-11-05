export default function pauseMin(art, player) {
  Object.defineProperty(player, 'pause', {
    value: () => {
      const { refs: { $video }, i18n, notice } = art;
      $video.pause();
      notice.show(i18n.get('Pause'));
      art.emit('pause', $video);
    }
  });
}
