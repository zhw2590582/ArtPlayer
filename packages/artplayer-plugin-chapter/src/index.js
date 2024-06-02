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
            $title.innerText = $chapter.dataset.title || '';
            const titleWidth = $title.clientWidth;
            if (width <= titleWidth / 2) {
                setStyle($title, 'left', 0);
            } else if (width > $inner.clientWidth - titleWidth / 2) {
                setStyle($title, 'left', `${$inner.clientWidth - titleWidth}px`);
            } else {
                setStyle($title, 'left', `${width - titleWidth / 2}px`);
            }
        }

        function update(chapters = []) {
            $control.innerText = '';

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

            if ($chapters.length) {
                addClass($player, 'artplayer-plugin-chapter');
            } else {
                removeClass($player, 'artplayer-plugin-chapter');
            }
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
                            setStyle($title, 'display', 'flex');
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
            art.proxy($progress, 'mousemove', () => {
                if (!$chapters.length) return;
                setStyle($title, 'display', 'flex');
            });

            art.proxy($progress, 'mouseleave', () => {
                if (!$chapters.length) return;
                setStyle($title, 'display', 'none');
            });
        }

        art.once('video:loadedmetadata', () => update(option.chapters));

        return {
            name: 'artplayerPluginChapter',
            update: (chapters) => update(chapters),
        };
    };
}

if (typeof document !== 'undefined') {
    const id = 'artplayer-plugin-chapter';
    const $style = document.getElementById(id);
    if ($style) {
        $style.textContent = style;
    } else {
        const $style = document.createElement('style');
        $style.id = id;
        $style.textContent = style;
        document.head.appendChild($style);
    }
}

if (typeof window !== 'undefined') {
    window['artplayerPluginChapter'] = artplayerPluginChapter;
}
