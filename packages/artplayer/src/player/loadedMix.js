export default function seekMix(art, player) {
    Object.defineProperty(player, 'loaded', {
        get: () =>
            art.template.$video.buffered.length
                ? art.template.$video.buffered.end(art.template.$video.buffered.length - 1) / art.template.$video.duration
                : 0,
    });
}
