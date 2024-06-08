import { query, clamp, append, setStyle, secondToTime, includeFromEvent, isMobile, getRect } from '../utils';

export function getPosFromEvent(art, event) {
    const { $progress } = art.template;
    const { left } = getRect($progress);
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
        art.emit('setBar', 'played', percentage, event);
        art.seek = second;
    } else {
        const { second, percentage } = getPosFromEvent(art, event);
        art.emit('setBar', 'played', percentage, event);
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
                let tipTimer = null;
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
                    $tip.innerText = text;
                    const tipWidth = $tip.clientWidth;
                    if (width <= tipWidth / 2) {
                        setStyle($tip, 'left', 0);
                    } else if (width > $control.clientWidth - tipWidth / 2) {
                        setStyle($tip, 'left', `${$control.clientWidth - tipWidth}px`);
                    } else {
                        setStyle($tip, 'left', `${width - tipWidth / 2}px`);
                    }
                }

                function showTime(event, touch) {
                    const { width, time } = touch || getPosFromEvent(art, event);
                    $tip.innerText = time;
                    const tipWidth = $tip.clientWidth;
                    if (width <= tipWidth / 2) {
                        setStyle($tip, 'left', 0);
                    } else if (width > $control.clientWidth - tipWidth / 2) {
                        setStyle($tip, 'left', `${$control.clientWidth - tipWidth}px`);
                    } else {
                        setStyle($tip, 'left', `${width - tipWidth / 2}px`);
                    }
                }

                function updateHighlight() {
                    $highlight.innerText = '';
                    for (let index = 0; index < option.highlight.length; index++) {
                        const item = option.highlight[index];
                        const left = (clamp(item.time, 0, art.duration) / art.duration) * 100;
                        const html = `<span data-text="${item.text}" data-time="${item.time}" style="left: ${left}%"></span>`;
                        append($highlight, html);
                    }
                }

                function setBar(type, percentage, event) {
                    const isMobileDroging = type === 'played' && event && isMobile;

                    if (type === 'loaded') {
                        setStyle($loaded, 'width', `${percentage * 100}%`);
                    }

                    if (type === 'hover') {
                        setStyle($hover, 'width', `${percentage * 100}%`);
                    }

                    if (type === 'played') {
                        setStyle($played, 'width', `${percentage * 100}%`);
                        setStyle($indicator, 'left', `${percentage * 100}%`);
                    }

                    if (isMobileDroging) {
                        setStyle($tip, 'display', 'flex');
                        const width = $control.clientWidth * percentage;
                        const time = secondToTime(percentage * art.duration);
                        showTime(event, { width, time });
                        clearTimeout(tipTimer);
                        tipTimer = setTimeout(() => {
                            setStyle($tip, 'display', 'none');
                        }, 500);
                    }
                }

                art.on('setBar', setBar);
                art.on('video:loadedmetadata', updateHighlight);

                art.on('video:progress', () => {
                    art.emit('setBar', 'loaded', art.loaded);
                });

                if (art.constructor.USE_RAF) {
                    art.on('raf', () => {
                        art.emit('setBar', 'played', art.played);
                    });
                } else {
                    art.on('video:timeupdate', () => {
                        art.emit('setBar', 'played', art.played);
                    });
                }

                art.on('video:ended', () => {
                    art.emit('setBar', 'played', 1);
                });

                art.emit('setBar', 'loaded', art.loaded || 0);

                if (!isMobile) {
                    proxy($control, 'click', (event) => {
                        if (event.target !== $indicator) {
                            setCurrentTime(art, event);
                        }
                    });

                    proxy($control, 'mousemove', (event) => {
                        const { percentage } = getPosFromEvent(art, event);
                        art.emit('setBar', 'hover', percentage, event);
                        setStyle($tip, 'display', 'flex');
                        if (includeFromEvent(event, $highlight)) {
                            showHighlight(event);
                        } else {
                            showTime(event);
                        }
                    });

                    proxy($control, 'mouseleave', (event) => {
                        setStyle($tip, 'display', 'none');
                        art.emit('setBar', 'hover', 0, event);
                    });

                    proxy($control, 'mousedown', (event) => {
                        isDroging = event.button === 0;
                    });

                    art.on('document:mousemove', (event) => {
                        if (isDroging) {
                            const { second, percentage } = getPosFromEvent(art, event);
                            art.emit('setBar', 'played', percentage, event);
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
