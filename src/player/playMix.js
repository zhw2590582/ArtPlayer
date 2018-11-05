export default function playMix(art, player) {
  Object.defineProperty(player, 'play', {
    value: () => {
      const { refs: { $video }, i18n, notice } = art;
      const promise = $video.play();
      if (promise !== undefined) {
        promise.then().catch(err => {
          notice.show(err, true, 3000);
          console.warn(err);
        });
      }
      notice.show(i18n.get('Play'));
      art.emit('play', $video);
    }
  });
}
