export default function seekMix(art, player) {
  Object.defineProperty(player, 'loaded', {
    get: () =>
      art.refs.$video.buffered.length
        ? art.refs.$video.buffered.end(art.refs.$video.buffered.length - 1) /
          art.refs.$video.duration
        : 0
  });
}
