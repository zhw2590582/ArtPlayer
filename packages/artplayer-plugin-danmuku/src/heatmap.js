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

                const points = [];
                for (let index = 1; index <= $canvas.width; index += 1) {
                    const length =
                        danmuku.danmus.filter((item) => item.time > (index - 1) * gap && item.time <= index * gap)
                            .length + 5;
                    points.push({ x: index - 1, y: height - length });
                }

                function drawCurve(points, tension) {
                    ctx.beginPath();
                    ctx.moveTo(points[0].x, points[0].y);

                    var t = tension != null ? tension : 1;
                    for (var i = 0; i < points.length - 1; i++) {
                        var p0 = i > 0 ? points[i - 1] : points[0];
                        var p1 = points[i];
                        var p2 = points[i + 1];
                        var p3 = i != points.length - 2 ? points[i + 2] : p2;

                        var cp1x = p1.x + ((p2.x - p0.x) / 6) * t;
                        var cp1y = p1.y + ((p2.y - p0.y) / 6) * t;

                        var cp2x = p2.x - ((p3.x - p1.x) / 6) * t;
                        var cp2y = p2.y - ((p3.y - p1.y) / 6) * t;

                        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
                    }
                    ctx.stroke();
                }

                drawCurve(points);
            }

            art.on('ready', update);
            art.on('resize', update);
            art.emit('artplayerPluginDanmuku:loaded', update);
        },
    });
}
