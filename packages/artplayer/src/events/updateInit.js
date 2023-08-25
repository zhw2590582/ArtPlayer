export default function updateInit(art) {
    if (art.constructor.USE_RAF) {
        let timer = null;

        (function update() {
            if (art.playing) {
                art.emit('raf');
            }

            if (!art.isDestroy) {
                timer = requestAnimationFrame(update);
            }
        })();

        art.on('destroy', () => {
            cancelAnimationFrame(timer);
        });
    }
}
