const lib = {
    map(value, inMin, inMax, outMin, outMax) {
        return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    },
    range(start, end, tick) {
        const s = Math.round(start / tick) * tick;
        return Array.from(
            {
                length: Math.floor((end - start) / tick),
            },
            (v, k) => {
                return k * tick + s;
            },
        );
    },
};

const line = (pointA, pointB) => {
    const lengthX = pointB[0] - pointA[0];
    const lengthY = pointB[1] - pointA[1];
    return {
        length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
        angle: Math.atan2(lengthY, lengthX),
    };
};

export default function heatmap(art, danmuku, option) {
    const { query } = art.constructor.utils;

    art.controls.add({
        name: 'heatmap',
        position: 'top',
        html: '',
        style: {
            position: 'absolute',
            top: '-100px',
            left: '0px',
            right: '0px',
            height: '100px',
            width: '100%',
            pointerEvents: 'none',
        },
        mounted($heatmap) {
            let $start = null;
            let $stop = null;

            function update(arg = []) {
                $start = null;
                $stop = null;
                $heatmap.innerHTML = '';

                if (!art.duration || art.option.isLive) return;

                const svg = {
                    w: $heatmap.offsetWidth,
                    h: $heatmap.offsetHeight,
                };

                const options = {
                    xMin: 0,
                    xMax: svg.w,
                    yMin: 0,
                    yMax: 128,
                    scale: 0.25,
                    opacity: 0.2,
                    minHeight: Math.floor(svg.h * 0.05),
                    sampling: Math.floor(svg.w / 100),
                    smoothing: 0.2,
                    flattening: 0.2,
                };

                if (typeof option === 'object') {
                    Object.assign(options, option);
                }

                let points = [];

                if (Array.isArray(arg) && arg.length) {
                    points = [...arg];
                } else {
                    const gap = art.duration / svg.w;
                    for (let x = 0; x <= svg.w; x += options.sampling) {
                        const y = danmuku.queue.filter(
                            ({ time }) => time > x * gap && time <= (x + options.sampling) * gap,
                        ).length;
                        points.push([x, y]);
                    }
                }

                if (points.length === 0) return;

                const lastPoint = points[points.length - 1];
                const lastX = lastPoint[0];
                const lastY = lastPoint[1];
                if (lastX !== svg.w) {
                    points.push([svg.w, lastY]);
                }

                const yPoints = points.map((point) => point[1]);
                const yMin = Math.min(...yPoints);
                const yMax = Math.max(...yPoints);
                const yMid = (yMin + yMax) / 2;

                for (let i = 0; i < points.length; i++) {
                    const point = points[i];
                    const y = point[1];
                    point[1] = y * (y > yMid ? 1 + options.scale : 1 - options.scale) + options.minHeight;
                }

                const controlPoint = (current, previous, next, reverse) => {
                    const p = previous || current;
                    const n = next || current;
                    const o = line(p, n);
                    const flat = lib.map(Math.cos(o.angle) * options.flattening, 0, 1, 1, 0);
                    const angle = o.angle * flat + (reverse ? Math.PI : 0);
                    const length = o.length * options.smoothing;
                    const x = current[0] + Math.cos(angle) * length;
                    const y = current[1] + Math.sin(angle) * length;
                    return [x, y];
                };

                const bezierCommand = (point, i, a) => {
                    const cps = controlPoint(a[i - 1], a[i - 2], point);
                    const cpe = controlPoint(point, a[i - 1], a[i + 1], true);
                    const close = i === a.length - 1 ? ' z' : '';
                    return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}${close}`;
                };

                const pointsPositions = points.map((e) => {
                    const x = lib.map(e[0], options.xMin, options.xMax, 0, svg.w);
                    const y = lib.map(e[1], options.yMin, options.yMax, svg.h, 0);
                    return [x, y];
                });

                const pathD = pointsPositions.reduce(
                    (acc, e, i, a) =>
                        i === 0
                            ? `M ${a[a.length - 1][0]},${svg.h} L ${e[0]},${svg.h} L ${e[0]},${e[1]}`
                            : `${acc} ${bezierCommand(e, i, a)}`,
                    '',
                );

                $heatmap.innerHTML = `
                    <svg viewBox="0 0 ${svg.w} ${svg.h}">
                        <defs>
                            <linearGradient id="heatmap-solids" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style="stop-color:var(--art-theme);stop-opacity:${options.opacity}" />
                                <stop offset="0%" style="stop-color:var(--art-theme);stop-opacity:${options.opacity}" id="heatmap-start" />
                                <stop offset="0%" style="stop-color:var(--art-progress-color);stop-opacity:1" id="heatmap-stop" />
                                <stop offset="100%" style="stop-color:var(--art-progress-color);stop-opacity:1" />
                            </linearGradient>
                        </defs>
                        <path fill="url(#heatmap-solids)" d="${pathD}"></path>
                    </svg>
                `;

                $start = query('#heatmap-start', $heatmap);
                $stop = query('#heatmap-stop', $heatmap);
                $start.setAttribute('offset', `${art.played * 100}%`);
                $stop.setAttribute('offset', `${art.played * 100}%`);
            }

            art.on('video:timeupdate', () => {
                if ($start && $stop) {
                    $start.setAttribute('offset', `${art.played * 100}%`);
                    $stop.setAttribute('offset', `${art.played * 100}%`);
                }
            });

            art.on('setBar', (type, percentage) => {
                if ($start && $stop && type === 'played') {
                    $start.setAttribute('offset', `${percentage * 100}%`);
                    $stop.setAttribute('offset', `${percentage * 100}%`);
                }
            });

            art.on('ready', () => update());
            art.on('resize', () => update());
            art.on('artplayerPluginDanmuku:loaded', () => update());
            art.on('artplayerPluginDanmuku:points', (points) => update(points));
        },
    });
}
