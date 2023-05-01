export default function heatmap(art, danmuku) {
    const {
        constructor: {
            utils: { query, setStyles },
        },
        template: { $progress },
    } = art;

    const height = 30;
    const color = 'rgba(255, 255, 255, 0.5)';

    art.controls.add({
        name: 'heatmap',
        position: 'top',
        html: '<canvas></canvas>',
        style: {
            height: height + 'px',
            width: '100%',
            pointerEvents: 'none',
        },
        mounted($heatmap) {
            const $canvas = query('canvas', $heatmap);
            setStyles($canvas, { height: '100%', width: '100%' });
            const ctx = $canvas.getContext('2d');

            function update() {
                $canvas.height = height;
                $canvas.width = $progress.clientWidth;
                ctx.fillStyle = color;
                ctx.clearRect(0, 0, $canvas.width, $canvas.height);
                const gap = art.duration / $canvas.width;
                for (let index = 1; index <= $canvas.width; index += 10) {
                    const length =
                        danmuku.danmus.filter((item) => item.time > (index - 1) * gap && item.time <= index * gap)
                            .length + 5;
                    ctx.fillRect(index - 1, height - length, 1, length);
                }
            }

            art.on('ready', update);
            art.on('resize', update);
            art.emit('artplayerPluginDanmuku:loaded', update);
        },
    });
}
