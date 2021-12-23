export default function timeupdateInit(art, player) {
    let timer = null;

    (function timeupdate() {
        art.emit('timeupdate', player.currentTime || 0);
        if (!art.isDestroy) {
            timer = window.requestAnimationFrame(timeupdate);
        }
    })();

    art.on('destroy', () => {
        window.cancelAnimationFrame(timer);
    });
}
