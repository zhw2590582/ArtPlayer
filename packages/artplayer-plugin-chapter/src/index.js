import style from 'bundle-text:./style.less';

export default function artplayerPluginChapter(option = {}) {
    return (art) => {
        const { $player } = art.template;
        const { setStyle, append, clamp, query, isMobile, addClass, removeClass } = art.constructor.utils;

        const html = `
                <div class="art-chapter">
                    <div class="art-chapter-inner">
                        <div class="art-progress-hover"></div>
                        <div class="art-progress-loaded"></div>
                        <div class="art-progress-played"></div>
                    </div>
                </div>
        `;

        let titleTimer = null;
        let $chapters = [];

        const $progress = art.query('.art-control-progress');
        const $inner = art.query('.art-control-progress-inner');
        const $control = append($inner, '<div class="art-chapters"></div>');
        const $title = append($inner, '<div class="art-chapter-title"></div>');

        function showTitle({ $chapter, width }) {
            const title = $chapter.dataset.title.trim();
            if (title) {
                setStyle($title, 'display', 'flex');
                $title.innerText = title;
                const titleWidth = $title.clientWidth;
                if (width <= titleWidth / 2) {
                    setStyle($title, 'left', 0);
                } else if (width > $inner.clientWidth - titleWidth / 2) {
                    setStyle($title, 'left', `${$inner.clientWidth - titleWidth}px`);
                } else {
                    setStyle($title, 'left', `${width - titleWidth / 2}px`);
                }
            } else {
                setStyle($title, 'display', 'none');
            }
        }

        function update(chapters = []) {
            $chapters = [];
            $control.innerText = '';
            removeClass($player, 'artplayer-plugin-chapter');

            if (!Array.isArray(chapters)) return;
            if (!chapters.length) return;
            if (!art.duration) return;

            chapters = chapters.sort((a, b) => a.start - b.start);

            for (let i = 0; i < chapters.length; i++) {
                const chapter = chapters[i];
                const nextChapter = chapters[i + 1];

                if (chapter.end === Infinity) {
                    chapter.end = art.duration;
                }

                if (
                    typeof chapter.start !== 'number' ||
                    typeof chapter.end !== 'number' ||
                    typeof chapter.title !== 'string'
                ) {
                    throw new Error('Illegal chapter data type');
                }

                if (chapter.start < 0 || chapter.end > art.duration || chapter.start >= chapter.end) {
                    throw new Error('Illegal chapter time point');
                }

                if (nextChapter && chapter.end > nextChapter.start) {
                    throw new Error('Illegal chapter time point');
                }
            }

            if (chapters[0].start > 0) {
                chapters.unshift({ start: 0, end: chapters[0].start, title: '' });
            }

            if (chapters[chapters.length - 1].end < art.duration) {
                chapters.push({ start: chapters[chapters.length - 1].end, end: art.duration, title: '' });
            }

            for (let i = 0; i < chapters.length - 1; i++) {
                if (chapters[i].end !== chapters[i + 1].start) {
                    chapters.splice(i + 1, 0, {
                        start: chapters[i].end,
                        end: chapters[i + 1].start,
                        title: '',
                    });
                }
            }

            $chapters = chapters.map((chapter) => {
                const $chapter = append($control, html);
                const start = clamp(chapter.start, 0, art.duration);
                const end = clamp(chapter.end, 0, art.duration);
                const duration = end - start;
                const percentage = duration / art.duration;
                $chapter.dataset.start = start;
                $chapter.dataset.end = end;
                $chapter.dataset.duration = duration;
                $chapter.dataset.title = chapter.title.trim();
                $chapter.style.width = `${percentage * 100}%`;

                return {
                    $chapter,
                    $hover: query('.art-progress-hover', $chapter),
                    $loaded: query('.art-progress-loaded', $chapter),
                    $played: query('.art-progress-played', $chapter),
                };
            });

            addClass($player, 'artplayer-plugin-chapter');
            art.emit('setBar', 'loaded', art.loaded || 0);
        }

        art.on('setBar', (type, percentage, event) => {
            if (!$chapters.length) return;

            for (let i = 0; i < $chapters.length; i++) {
                const { $chapter, $loaded, $played, $hover } = $chapters[i];

                const $target = {
                    hover: $hover,
                    loaded: $loaded,
                    played: $played,
                }[type];

                if (!$target) return;

                const width = $control.clientWidth * percentage;
                const currentTime = art.duration * percentage;
                const duration = parseFloat($chapter.dataset.duration);
                const start = parseFloat($chapter.dataset.start);
                const end = parseFloat($chapter.dataset.end);

                if (currentTime < start) {
                    setStyle($target, 'width', 0);
                }

                if (currentTime > end) {
                    setStyle($target, 'width', '100%');
                }

                if (currentTime >= start && currentTime <= end) {
                    const percentage = (currentTime - start) / duration;
                    setStyle($target, 'width', `${percentage * 100}%`);

                    if (isMobile) {
                        if (type === 'played' && event) {
                            showTitle({ $chapter, width });
                            clearTimeout(titleTimer);
                            titleTimer = setTimeout(() => {
                                setStyle($title, 'display', 'none');
                            }, 500);
                        }
                    } else {
                        if (type === 'hover') {
                            showTitle({ $chapter, width });
                        }
                    }
                }
            }
        });

        if (!isMobile) {
            art.proxy($progress, 'mouseleave', () => {
                if (!$chapters.length) return;
                setStyle($title, 'display', 'none');
            });
        }

        art.once('video:loadedmetadata', () => update(option.chapters));

        return {
            name: 'artplayerPluginChapter',
            update: ({ chapters }) => update(chapters),
        };
    };
}

if (typeof document !== 'undefined') {
    const id = 'artplayer-plugin-chapter';
    let $style = document.getElementById(id);
    if (!$style) {
        $style = document.createElement('style');
        $style.id = id;
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                document.head.appendChild($style);
            });
        } else {
            (document.head || document.documentElement).appendChild($style);
        }
    }
    $style.textContent = style;
}

if (typeof window !== 'undefined') {
    window['artplayerPluginChapter'] = artplayerPluginChapter;
}
