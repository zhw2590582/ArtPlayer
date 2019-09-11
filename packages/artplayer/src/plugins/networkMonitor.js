export default function networkMonitor(art) {
    let waitTime = 0;
    let playTime = 0;
    let lastTime = 0;
    let timer = null;

    function resetTime() {
        waitTime = 0;
        playTime = 0;
        lastTime = 0;
        cancelAnimationFrame(timer);
        timer = null;
    }

    function calculatingTime() {
        if (timer) return;
        (function loop() {
            if (art.isDestroy) return;
            timer = requestAnimationFrame(() => {
                const nowTime = Date.now();
                if (lastTime) {
                    const diffTime = nowTime - lastTime;
                    playTime += diffTime;
                    if (!art.player.playing) {
                        waitTime += diffTime;
                    }
                }
                lastTime = nowTime;
                art.emit('networkMonitor', waitTime / playTime);
                loop();
            });
        })();
    }

    art.on('play', calculatingTime);
    art.on('pause', resetTime);

    return {
        name: 'networkMonitor',
        reset: resetTime,
        calculating: calculatingTime,
    };
}
