import style from 'bundle-text:./style.less';

export default function artplayerPluginChapter({ chapters = [] }) {
    return (art) => {
        const { setStyle, append, clamp, query, isMobile } = art.constructor.utils;

        const html = `
                <div class="art-chapter">
                    <div class="art-progress-hover"></div>
                    <div class="art-progress-loaded"></div>
                    <div class="art-progress-played"></div>
                </div>
        `;

        let $chapters = [];
        const $progress = art.query('.art-control-progress-inner');
        const $control = append($progress, '<div class="art-chapters"></div>');
        const $text = append($progress, '<div class="art-chapter-text"></div>');

        art.on('setBar', (type, percentage) => {
            const currentTime = art.duration * percentage;

            const index = $chapters.findIndex(({ $chapter }) => {
                const start = parseFloat($chapter.dataset.start);
                const end = parseFloat($chapter.dataset.end);
                return art.currentTime >= start && art.currentTime <= end;
            });

            if (index === -1) return;

            for (let i = 0; i < $chapters.length; i++) {
                const { $chapter, $loaded, $played, $hover } = $chapters[i];

                const $target = {
                    hover: $hover,
                    loaded: $loaded,
                    played: $played,
                }[type];

                if (!$target) return;

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
                    const _percentage = (currentTime - start) / duration;
                    setStyle($target, 'width', `${_percentage * 100}%`);
                }
            }
        });

        art.proxy($control, 'mousemove', (event) => {
            const $target = event.target.closest('.art-chapter');
            if ($target) {
                setStyle($text, 'display', 'flex');
                $text.innerText = $target.dataset.text || '';
                const { left } = $control.getBoundingClientRect();
                const eventLeft = isMobile ? event.touches[0].clientX : event.clientX;
                const width = clamp(eventLeft - left, 0, $control.clientWidth);
                const textWidth = $text.clientWidth;
                if (width <= textWidth / 2) {
                    setStyle($text, 'left', 0);
                } else if (width > $control.clientWidth - textWidth / 2) {
                    setStyle($text, 'left', `${$control.clientWidth - textWidth}px`);
                } else {
                    setStyle($text, 'left', `${width - textWidth / 2}px`);
                }
            } else {
                setStyle($text, 'display', 'none');
            }
        });

        art.proxy($control, 'mouseleave', () => {
            setStyle($text, 'display', 'none');
        });

        art.on('video:loadedmetadata', () => {
            $control.innerHTML = '';
            $chapters = chapters.map((chapter) => {
                const $chapter = append($control, html);
                const start = clamp(chapter.start, 0, art.duration);
                const end = clamp(chapter.end, 0, art.duration);
                const duration = end - start;
                const percentage = duration / art.duration;
                $chapter.dataset.start = start;
                $chapter.dataset.end = end;
                $chapter.dataset.duration = duration;
                $chapter.dataset.text = chapter.text;
                $chapter.dataset.percentage = percentage;
                $chapter.style.width = `${percentage * 100}%`;
                return {
                    $chapter,
                    $hover: query('.art-progress-hover', $chapter),
                    $loaded: query('.art-progress-loaded', $chapter),
                    $played: query('.art-progress-played', $chapter),
                };
            });
        });

        return {
            name: 'artplayerPluginChapter',
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
