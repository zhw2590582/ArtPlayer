/*!
 * artplayer-plugin-chapter.js v1.1.0
 * Github: https://github.com/zhw2590582/ArtPlayer
 * (c) 2017-2026 Harvey Zhao
 * Released under the MIT License.
 */
const style = ".artplayer-plugin-chapter .art-control-progress-inner {\n  height: 100% !important;\n  background-color: transparent !important;\n}\n.artplayer-plugin-chapter .art-control-progress-inner > .art-progress-hover,\n.artplayer-plugin-chapter .art-control-progress-inner > .art-progress-loaded,\n.artplayer-plugin-chapter .art-control-progress-inner > .art-progress-played {\n  display: none !important;\n}\n.artplayer-plugin-chapter .art-control-thumbnails {\n  bottom: calc(var(--art-bottom-gap) + 64px) !important;\n}\n.artplayer-plugin-chapter .art-chapters {\n  position: absolute;\n  z-index: 0;\n  inset: 0;\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  height: 100%;\n  transform: scaleY(1.25);\n}\n.artplayer-plugin-chapter .art-chapters .art-chapter {\n  display: flex;\n  align-items: center;\n  height: 100%;\n}\n.artplayer-plugin-chapter .art-chapters .art-chapter .art-chapter-inner {\n  position: relative;\n  cursor: pointer;\n  width: 100%;\n  height: 50%;\n  border-radius: 10px;\n  overflow: hidden;\n  transition: height var(--art-transition-duration) ease;\n  background-color: var(--art-progress-color);\n}\n.artplayer-plugin-chapter .art-chapters .art-chapter:hover .art-chapter-inner {\n  height: 100%;\n}\n.artplayer-plugin-chapter .art-chapter-title {\n  transform-origin: bottom center;\n  transform: scale(0.5);\n  opacity: 0;\n  position: absolute;\n  z-index: 70;\n  top: -50px;\n  left: 0;\n  padding: 3px 5px;\n  line-height: 1;\n  font-size: 14px;\n  border-radius: var(--art-border-radius);\n  white-space: nowrap;\n  background-color: var(--art-tip-background);\n  transition: transform var(--art-transition-duration) ease, opacity var(--art-transition-duration) ease;\n}\n.artplayer-plugin-chapter.art-progress-hover .art-chapter-title {\n  transform: scale(1);\n  opacity: 1;\n}\n";
function artplayerPluginChapter(option = {}) {
  return (art) => {
    const { $player } = art.template;
    const { setStyle, append, clamp, query, addClass, removeClass } = art.constructor.utils;
    const html = `
                <div class="art-chapter">
                    <div class="art-chapter-inner">
                        <div class="art-progress-hover"></div>
                        <div class="art-progress-loaded"></div>
                        <div class="art-progress-played"></div>
                    </div>
                </div>
        `;
    let $chapters = [];
    const $inner = art.query(".art-control-progress-inner");
    const $control = append($inner, '<div class="art-chapters"></div>');
    const $title = append($inner, '<div class="art-chapter-title"></div>');
    function showTitle({ $chapter, width }) {
      const title = $chapter.dataset.title.trim();
      if (title) {
        $title.textContent = title;
        const titleWidth = $title.clientWidth;
        if (width <= titleWidth / 2) {
          setStyle($title, "left", 0);
        } else if (width > $inner.clientWidth - titleWidth / 2) {
          setStyle($title, "left", `${$inner.clientWidth - titleWidth}px`);
        } else {
          setStyle($title, "left", `${width - titleWidth / 2}px`);
        }
      }
    }
    function update(chapters = []) {
      $chapters = [];
      $control.textContent = "";
      removeClass($player, "artplayer-plugin-chapter");
      if (!Array.isArray(chapters))
        return;
      if (!chapters.length)
        return;
      if (!art.duration)
        return;
      chapters = chapters.sort((a, b) => a.start - b.start);
      for (let i = 0; i < chapters.length; i++) {
        const chapter = chapters[i];
        const nextChapter = chapters[i + 1];
        if (chapter.end === Infinity) {
          chapter.end = art.duration;
        }
        if (typeof chapter.start !== "number" || typeof chapter.end !== "number" || typeof chapter.title !== "string") {
          throw new TypeError("Illegal chapter data type");
        }
        if (chapter.start < 0 || chapter.end > art.duration || chapter.start >= chapter.end) {
          throw new Error("Illegal chapter time point");
        }
        if (nextChapter && chapter.end > nextChapter.start) {
          throw new Error("Illegal chapter time point");
        }
      }
      if (chapters[0].start > 0) {
        chapters.unshift({ start: 0, end: chapters[0].start, title: "" });
      }
      if (chapters[chapters.length - 1].end < art.duration) {
        chapters.push({ start: chapters[chapters.length - 1].end, end: art.duration, title: "" });
      }
      for (let i = 0; i < chapters.length - 1; i++) {
        if (chapters[i].end !== chapters[i + 1].start) {
          chapters.splice(i + 1, 0, {
            start: chapters[i].end,
            end: chapters[i + 1].start,
            title: ""
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
          $hover: query(".art-progress-hover", $chapter),
          $loaded: query(".art-progress-loaded", $chapter),
          $played: query(".art-progress-played", $chapter)
        };
      });
      addClass($player, "artplayer-plugin-chapter");
      art.emit("setBar", "loaded", art.loaded || 0);
    }
    art.on("setBar", (type, percentage) => {
      if (!$chapters.length)
        return;
      for (let i = 0; i < $chapters.length; i++) {
        const { $chapter, $loaded, $played, $hover } = $chapters[i];
        const $target = {
          hover: $hover,
          loaded: $loaded,
          played: $played
        }[type];
        if (!$target)
          return;
        const width = $control.clientWidth * percentage;
        const currentTime = art.duration * percentage;
        const duration = Number.parseFloat($chapter.dataset.duration);
        const start = Number.parseFloat($chapter.dataset.start);
        const end = Number.parseFloat($chapter.dataset.end);
        if (currentTime < start) {
          setStyle($target, "width", 0);
        }
        if (currentTime > end) {
          setStyle($target, "width", "100%");
        }
        if (currentTime >= start && currentTime <= end) {
          const percentage2 = (currentTime - start) / duration;
          setStyle($target, "width", `${percentage2 * 100}%`);
          if (type === "hover" && width > 0) {
            showTitle({ $chapter, width });
          }
        }
      }
    });
    art.once("video:loadedmetadata", () => update(option.chapters));
    return {
      name: "artplayerPluginChapter",
      update: ({ chapters }) => update(chapters)
    };
  };
}
if (typeof document !== "undefined") {
  const id = "artplayer-plugin-chapter";
  let $style = document.getElementById(id);
  if (!$style) {
    $style = document.createElement("style");
    $style.id = id;
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        document.head.appendChild($style);
      });
    } else {
      (document.head || document.documentElement).appendChild($style);
    }
  }
  $style.textContent = style;
}
export {
  artplayerPluginChapter as default
};
