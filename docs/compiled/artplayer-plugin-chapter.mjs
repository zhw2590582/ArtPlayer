/*!
 * artplayer-plugin-chapter.js v1.1.0
 * Github: https://github.com/zhw2590582/ArtPlayer
 * (c) 2017-2026 Harvey Zhao
 * Released under the MIT License.
 */
function normalizeChapters(chapters = [], duration) {
  if (!Array.isArray(chapters) || !chapters.length || !Number.isFinite(duration) || duration <= 0)
    return [];
  chapters.sort((a, b) => a.start - b.start);
  for (const [index, chapter] of chapters.entries()) {
    if (!chapter || typeof chapter.start !== "number" || typeof chapter.end !== "number" || typeof chapter.title !== "string")
      throw new TypeError("Illegal chapter data type");
    if (chapter.end === Infinity)
      chapter.end = duration;
    const next = chapters[index + 1];
    if (!Number.isFinite(chapter.start) || !Number.isFinite(chapter.end) || chapter.start < 0 || chapter.end > duration || chapter.start >= chapter.end || next && chapter.end > next.start) {
      throw new Error("Illegal chapter time point");
    }
  }
  const first = chapters[0];
  const last = chapters[chapters.length - 1];
  if (first && first.start > 0)
    chapters.unshift({ start: 0, end: first.start, title: "" });
  if (last && last.end < duration)
    chapters.push({ start: last.end, end: duration, title: "" });
  for (let index = 0; index < chapters.length - 1; index++) {
    const current = chapters[index];
    const next = chapters[index + 1];
    if (current && next && current.end !== next.start)
      chapters.splice(index + 1, 0, { start: current.end, end: next.start, title: "" });
  }
  return chapters;
}
function createProgress(inner) {
  const create = (parent, className) => {
    const element = inner.ownerDocument.createElement("div");
    element.className = className;
    parent.appendChild(element);
    return element;
  };
  const control = create(inner, "art-chapters");
  const title = create(inner, "art-chapter-title");
  let segments = [];
  function clearTitle() {
    title.textContent = "";
    title.style.left = "0px";
    title.style.visibility = "hidden";
  }
  function clear() {
    segments = [];
    control.textContent = "";
    clearTitle();
  }
  function render(chapters, duration) {
    segments = chapters.map((chapter) => {
      const element = create(control, "art-chapter");
      const body = create(element, "art-chapter-inner");
      const length = chapter.end - chapter.start;
      element.dataset.start = String(chapter.start);
      element.dataset.end = String(chapter.end);
      element.dataset.duration = String(length);
      element.dataset.title = chapter.title.trim();
      element.style.width = `${length / duration * 100}%`;
      return {
        start: chapter.start,
        end: chapter.end,
        title: chapter.title.trim(),
        bars: {
          hover: create(body, "art-progress-hover"),
          loaded: create(body, "art-progress-loaded"),
          played: create(body, "art-progress-played")
        }
      };
    });
  }
  function setBar(type, percentage, duration) {
    if (type !== "hover" && type !== "loaded" && type !== "played")
      return;
    if (!Number.isFinite(percentage))
      return;
    const currentTime = duration * percentage;
    let hovered;
    for (const segment of segments) {
      const target = segment.bars[type];
      target.style.width = currentTime < segment.start ? "0px" : currentTime > segment.end ? "100%" : `${(currentTime - segment.start) / (segment.end - segment.start) * 100}%`;
      if (currentTime >= segment.start && currentTime <= segment.end)
        hovered = segment;
    }
    if (type !== "hover")
      return;
    clearTitle();
    const width = control.clientWidth * percentage;
    if (hovered?.title && width > 0) {
      title.textContent = hovered.title;
      title.style.visibility = "visible";
      title.style.left = `${Math.max(0, Math.min(width - title.clientWidth / 2, inner.clientWidth - title.clientWidth))}px`;
    }
  }
  function destroy() {
    clear();
    control.remove();
    title.remove();
  }
  clearTitle();
  return { clear, render, setBar, destroy };
}
const style = ".artplayer-plugin-chapter .art-control-progress-inner {\n  height: 100% !important;\n  background-color: transparent !important;\n}\n.artplayer-plugin-chapter .art-control-progress-inner > .art-progress-hover,\n.artplayer-plugin-chapter .art-control-progress-inner > .art-progress-loaded,\n.artplayer-plugin-chapter .art-control-progress-inner > .art-progress-played {\n  display: none !important;\n}\n.artplayer-plugin-chapter .art-control-thumbnails {\n  bottom: calc(var(--art-bottom-gap) + 64px) !important;\n}\n.artplayer-plugin-chapter .art-chapters {\n  position: absolute;\n  z-index: 0;\n  inset: 0;\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  height: 100%;\n  transform: scaleY(1.25);\n}\n.artplayer-plugin-chapter .art-chapters .art-chapter {\n  display: flex;\n  align-items: center;\n  height: 100%;\n}\n.artplayer-plugin-chapter .art-chapters .art-chapter .art-chapter-inner {\n  position: relative;\n  cursor: pointer;\n  width: 100%;\n  height: 50%;\n  border-radius: 10px;\n  overflow: hidden;\n  transition: height var(--art-transition-duration) ease;\n  background-color: var(--art-progress-color);\n}\n.artplayer-plugin-chapter .art-chapters .art-chapter:hover .art-chapter-inner {\n  height: 100%;\n}\n.artplayer-plugin-chapter .art-chapter-title {\n  transform-origin: bottom center;\n  transform: scale(0.5);\n  opacity: 0;\n  position: absolute;\n  z-index: 70;\n  top: -50px;\n  left: 0;\n  padding: 3px 5px;\n  line-height: 1;\n  font-size: 14px;\n  border-radius: var(--art-border-radius);\n  white-space: nowrap;\n  background-color: var(--art-tip-background);\n  transition: transform var(--art-transition-duration) ease, opacity var(--art-transition-duration) ease;\n}\n.artplayer-plugin-chapter.art-progress-hover .art-chapter-title {\n  transform: scale(1);\n  opacity: 1;\n}\n";
function installStyle() {
  if (typeof document === "undefined")
    return;
  const id = "artplayer-plugin-chapter";
  const install = () => {
    let element = document.getElementById(id);
    if (!element) {
      element = document.createElement("style");
      element.id = id;
      (document.head || document.documentElement).appendChild(element);
    }
    element.textContent = style;
  };
  if (document.getElementById(id) || document.readyState !== "loading")
    install();
  else
    document.addEventListener("DOMContentLoaded", install, { once: true });
}
function artplayerPluginChapter(option = {}) {
  return (art) => {
    const player = art.template.$player;
    const inner = art.query(".art-control-progress-inner");
    if (!inner)
      throw new Error("Missing ArtPlayer progress container");
    const className = "artplayer-plugin-chapter";
    let progress = createProgress(inner);
    function update(chapters) {
      if (!progress || art.isDestroy)
        return;
      progress.clear();
      player.classList.remove(className);
      const normalized = normalizeChapters(chapters, art.duration);
      if (!normalized.length)
        return;
      progress.render(normalized, art.duration);
      player.classList.add(className);
      art.emit("setBar", "loaded", art.loaded || 0);
    }
    function setBar(type, percentage) {
      if (!art.isDestroy)
        progress?.setBar(type, percentage, art.duration);
    }
    function initialize() {
      update(option.chapters);
    }
    function destroy() {
      art.off("setBar", setBar);
      art.off("video:loadedmetadata", initialize);
      art.off("destroy", destroy);
      progress?.destroy();
      progress = void 0;
      player.classList.remove(className);
    }
    art.on("setBar", setBar);
    art.once("video:loadedmetadata", initialize);
    art.on("destroy", destroy);
    return { name: "artplayerPluginChapter", update: ({ chapters }) => update(chapters) };
  };
}
installStyle();
export {
  artplayerPluginChapter as default
};
