export default function currentTimeMix(art, player) {
    Object.defineProperty(player, 'currentTime', {
        get: () => art.template.$video.currentTime || 0,
        set: currentTime => {
            art.template.$video.currentTime = currentTime;
        },
    });
}
