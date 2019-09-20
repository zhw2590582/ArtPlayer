export default function networkMonitor(art) {
    let sampleTime = 10000;
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

    function startTime() {
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
                if (playTime >= sampleTime) {
                    waitTime = 0;
                    playTime = 0;
                }
                loop();
            });
        })();
    }

    art.on('play', startTime);
    art.on('pause', resetTime);

    return {
        name: 'networkMonitor',
        reset: resetTime,
        start: startTime,
        sample: time => {
            sampleTime = time;
        },
    };
}
