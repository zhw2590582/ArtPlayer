export default function playMix(art, player) {
  const { refs: { $video }, i18n, notice, option: { mutex } } = art;

  Object.defineProperty(player, 'play', {
    value: () => {
      const promise = $video.play();
      if (promise !== undefined) {
        promise.then().catch(err => {
          notice.show(err, true, 3000);
          console.warn(err);
        });
      }

      if (mutex) {
        art.constructor.instances
          .filter(item => item !== art)
          .forEach(item => item.player.pause());
      }

      notice.show(i18n.get('Play'));
      art.emit('play', $video);
    }
  });
}
