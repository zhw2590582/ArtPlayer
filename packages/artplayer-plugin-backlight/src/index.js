function getAverageColor(img, left, top, width, height) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, -left, -top);
    const imageData = ctx.getImageData(0, 0, width, height);
    const { data } = imageData;
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
}

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

function getColors($img, width, height) {
    return matrixCallback((xIndex, yIndex, x, y) => {
        return getAverageColor($img, (xIndex * width) / x, (yIndex * height) / y, width / x, height / y);
    });
}

function creatMatrix(parent, width, height) {
    return matrixCallback((xIndex, yIndex, x, y) => {
        const $box = document.createElement('div');
        $box.style.position = 'absolute';
        $box.style.left = `${(xIndex * width) / x}px`;
        $box.style.top = `${(yIndex * height) / y}px`;
        $box.style.width = `${100 / x}%`;
        $box.style.height = `${100 / y}%`;
        $box.style['-webkit-transition'] = 'all .2s ease';
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

    $player.insertBefore($backlight, $video);

    art.on('firstCanplay', () => {
        const { clientWidth, clientHeight } = $video;
        const matrix = creatMatrix($backlight, clientWidth, clientHeight);
        art.on('video:timeupdate', () => {
            const dataUri = player.getScreenshotDataURL();
            const $img = document.createElement('img');
            $img.onload = () => {
                const colors = getColors($img, clientWidth, clientHeight);
                colors.forEach(({ r, g, b }, index) => {
                    const { $box, left, right, top, bottom } = matrix[index];
                    // eslint-disable-next-line no-nested-ternary
                    const x = left ? '-60px' : right ? '60px' : '0';
                    // eslint-disable-next-line no-nested-ternary
                    const y = top ? '-60px' : bottom ? '60px' : '0';
                    $box.style['-webkit-box-shadow'] = `rgb(${r}, ${g}, ${b}) ${x} ${y} 120px`;
                    $box.style.boxShadow = `rgb(${r}, ${g}, ${b}) ${x} ${y} 120px`;
                });
            };
            $img.src = dataUri;
        });
    });

    return {
        name: 'artplayerPluginBacklight',
    };
}

window.artplayerPluginBacklight = artplayerPluginBacklight;
export default artplayerPluginBacklight;
