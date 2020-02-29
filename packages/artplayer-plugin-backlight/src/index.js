function matrixCallback(callback) {
    const result = [];
    const x = 10;
    const y = 5;
    for (let xIndex = 0; xIndex < x; xIndex += 1) {
        for (let yIndex = 0; yIndex < y; yIndex += 1) {
            if (xIndex === 0 || xIndex === x - 1 || yIndex === 0 || yIndex === y - 1) {
                result.push(callback(xIndex, yIndex, x, y));
            }
        }
    }
    return result;
}

function getColors($canvas, $video, width, height) {
    const ctx = $canvas.getContext('2d');
    $canvas.width = width;
    $canvas.height = height;
    ctx.drawImage($video, 0, 0);
    return matrixCallback((xIndex, yIndex, x, y) => {
        const itemW = width / x;
        const itemH = height / y;
        const itemX = xIndex * itemW;
        const itemY = yIndex * itemH;
        const { data } = ctx.getImageData(itemX, itemY, itemW, itemH);
        let r = 0;
        let g = 0;
        let b = 0;
        for (let i = 0, l = data.length; i < l; i += 4) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
        }
        r = Math.floor(r / (data.length / 4));
        g = Math.floor(g / (data.length / 4));
        b = Math.floor(b / (data.length / 4));
        return { r, g, b };
    });
}

function creatMatrix(parent) {
    return matrixCallback((xIndex, yIndex, x, y) => {
        const $box = document.createElement('div');
        $box.style.position = 'absolute';
        $box.style.left = `${(xIndex * 100) / x}%`;
        $box.style.top = `${(yIndex * 100) / y}%`;
        $box.style.width = `${100 / x}%`;
        $box.style.height = `${100 / y}%`;
        $box.style.webkitBorderRadius = '50%';
        $box.style.borderRadius = '50%';
        $box.style.webkitTransition = 'all .2s ease';
        $box.style.transition = 'all .2s ease';
        parent.appendChild($box);
        return {
            $box,
            left: xIndex === 0,
            right: xIndex === x - 1,
            top: yIndex === 0,
            bottom: yIndex === y - 1,
        };
    });
}

function artplayerPluginBacklight(art) {
    const { setStyles } = art.constructor.utils;
    const {
        template: { $player, $video },
        player,
    } = art;

    const $backlight = document.createElement('div');
    $backlight.classList.add('artplayer-backlight');
    setStyles($backlight, {
        position: 'absolute',
        zIndex: 9,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
    });

    const matrix = creatMatrix($backlight);
    const $canvas = document.createElement('canvas');
    $player.insertBefore($backlight, $video);

    (function loop() {
        setTimeout(() => {
            if (player.playing) {
                const { clientWidth, clientHeight } = $video;
                const colors = getColors($canvas, $video, clientWidth, clientHeight);
                colors.forEach(({ r, g, b }, index) => {
                    const { $box, left, right, top, bottom } = matrix[index];
                    // eslint-disable-next-line no-nested-ternary
                    const x = left ? '-64px' : right ? '64px' : '0';
                    // eslint-disable-next-line no-nested-ternary
                    const y = top ? '-64px' : bottom ? '64px' : '0';
                    $box.style.webkitBoxShadow = `rgb(${r}, ${g}, ${b}) ${x} ${y} 128px`;
                    $box.style.boxShadow = `rgb(${r}, ${g}, ${b}) ${x} ${y} 128px`;
                });
            }

            if (!art.isDestroy) {
                loop();
            }
        }, 200);
    })();

    return {
        name: 'artplayerPluginBacklight',
    };
}

export default artplayerPluginBacklight;
