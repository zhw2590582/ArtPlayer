import { query, clamp, append, setStyle, secondToTime, includeFromEvent, isMobile } from '../utils';

export function getPosFromEvent(art, event) {
    const { $progress } = art.template;
    const { left } = $progress.getBoundingClientRect();
    const eventLeft = isMobile ? event.touches[0].clientX : event.clientX;
    const width = clamp(eventLeft - left, 0, $progress.clientWidth);
    const second = (width / $progress.clientWidth) * art.duration;
    const time = secondToTime(second);
    const percentage = clamp(width / $progress.clientWidth, 0, 1);
    return { second, time, width, percentage };
}

export function setCurrentTime(art, event) {
    if (art.isRotate) {
        const percentage = event.touches[0].clientY / art.height;
        const second = percentage * art.duration;
        art.emit('setBar', 'played', percentage);
        art.seek = second;
    } else {
        const { second, percentage } = getPosFromEvent(art, event);
        art.emit('setBar', 'played', percentage);
        art.seek = second;
    }
}

export default function progress(options) {
    return (art) => {
        const { icons, option, proxy } = art;

        return {
            ...options,
            html: `
                <div class="art-control-progress-inner">
                    <div class="art-progress-hover"></div>
                    <div class="art-progress-loaded"></div>
                    <div class="art-progress-played"></div>
                    <div class="art-progress-highlight"></div>
                    <div class="art-progress-indicator"></div>
                    <div class="art-progress-tip"></div>
                </div>
            `,
            mounted: ($control) => {
                let isDroging = false;
                const $hover = query('.art-progress-hover', $control);
                const $loaded = query('.art-progress-loaded', $control);
                const $played = query('.art-progress-played', $control);
                const $highlight = query('.art-progress-highlight', $control);
                const $indicator = query('.art-progress-indicator', $control);
                const $tip = query('.art-progress-tip', $control);

                if (icons.indicator) {
                    append($indicator, icons.indicator);
                } else {
                    setStyle($indicator, 'backgroundColor', 'var(--art-theme)');
                }

                function showHighlight(event) {
                    const { width } = getPosFromEvent(art, event);
                    const { text } = event.target.dataset;
                    $tip.innerHTML = text;
                    const tipWidth = $tip.clientWidth;
                    if (width <= tipWidth / 2) {
                        setStyle($tip, 'left', 0);
                    } else if (width > $control.clientWidth - tipWidth / 2) {
                        setStyle($tip, 'left', `${$control.clientWidth - tipWidth}px`);
                    } else {
                        setStyle($tip, 'left', `${width - tipWidth / 2}px`);
                    }
                }

                function showTime(event) {
                    const { width, time } = getPosFromEvent(art, event);
                    $tip.innerHTML = time;
                    const tipWidth = $tip.clientWidth;
                    if (width <= tipWidth / 2) {
                        setStyle($tip, 'left', 0);
                    } else if (width > $control.clientWidth - tipWidth / 2) {
                        setStyle($tip, 'left', `${$control.clientWidth - tipWidth}px`);
                    } else {
                        setStyle($tip, 'left', `${width - tipWidth / 2}px`);
                    }
                }

                function setBar(type, percentage) {
                    if (type === 'loaded') {
                        setStyle($loaded, 'width', `${percentage * 100}%`);
                    }

                    if (type === 'played') {
                        setStyle($played, 'width', `${percentage * 100}%`);
                        setStyle($indicator, 'left', `${percentage * 100}%`);
                    }
                }

                function setHover(event) {
                    const { width } = getPosFromEvent(art, event);
                    setStyle($hover, 'width', `${width}px`);
                    setStyle($hover, 'display', 'flex');
                }

                art.on('video:loadedmetadata', () => {
                    for (let index = 0; index < option.highlight.length; index++) {
                        const item = option.highlight[index];
                        const left = (clamp(item.time, 0, art.duration) / art.duration) * 100;
                        const html = `<span data-text="${item.text}" data-time="${item.time}" style="left: ${left}%"></span>`;
                        append($highlight, html);
                    }
                });

                setBar('loaded', art.loaded);

                art.on('setBar', (type, percentage) => {
                    setBar(type, percentage);
                });

                art.on('video:progress', () => {
                    setBar('loaded', art.loaded);
                });

                art.on('video:timeupdate', () => {
                    setBar('played', art.played);
                });

                art.on('video:ended', () => {
                    setBar('played', 1);
                });

                if (!isMobile) {
                    proxy($control, 'click', (event) => {
                        if (event.target !== $indicator) {
                            setCurrentTime(art, event);
                        }
                    });

                    proxy($control, 'mousemove', (event) => {
                        setHover(event);
                        setStyle($tip, 'display', 'flex');
                        if (includeFromEvent(event, $highlight)) {
                            showHighlight(event);
                        } else {
                            showTime(event);
                        }
                    });

                    proxy($control, 'mouseleave', () => {
                        setStyle($tip, 'display', 'none');
                        setStyle($hover, 'display', 'none');
                    });

                    proxy($control, 'mousedown', (event) => {
                        isDroging = event.button === 0;
                    });

                    art.on('document:mousemove', (event) => {
                        if (isDroging) {
                            const { second, percentage } = getPosFromEvent(art, event);
                            setBar('played', percentage);
                            art.seek = second;
                        }
                    });

                    art.on('document:mouseup', () => {
                        if (isDroging) {
                            isDroging = false;
                        }
                    });
                }
            },
        };
    };
}
