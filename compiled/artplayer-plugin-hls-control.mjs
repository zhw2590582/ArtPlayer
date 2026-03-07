/*!
 * artplayer-plugin-hls-control.js v1.0.2
 * Github: https://github.com/zhw2590582/ArtPlayer
 * (c) 2017-2026 Harvey Zhao
 * Released under the MIT License.
 */
const $audio = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="18"><path fill="#fff" d="M256 80C149.9 80 62.4 159.4 49.6 262c9.4-3.8 19.6-6 30.4-6c26.5 0 48 21.5 48 48l0 128c0 26.5-21.5 48-48 48c-44.2 0-80-35.8-80-80l0-16 0-48 0-48C0 146.6 114.6 32 256 32s256 114.6 256 256l0 48 0 48 0 16c0 44.2-35.8 80-80 80c-26.5 0-48-21.5-48-48l0-128c0-26.5 21.5-48 48-48c10.8 0 21 2.1 30.4 6C449.6 159.4 362.1 80 256 80z"/></svg>';
const $quality = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="18"><path fill="#fff" d="M0 96C0 60.7 28.7 32 64 32l384 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6l96 0 32 0 208 0c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/></svg>';
function uniqBy(array, property) {
  const seen = /* @__PURE__ */ new Map();
  return array.filter((item) => {
    const key = item[property];
    if (key === void 0) {
      return true;
    }
    return !seen.has(key) && seen.set(key, 1);
  });
}
function artplayerPluginHlsControl(option = {}) {
  return (art) => {
    const { $video } = art.template;
    const { errorHandle } = art.constructor.utils;
    function updateQuality(hls) {
      if (!hls.levels.length)
        return;
      const config = option.quality || {};
      const auto = config.auto || "Auto";
      const title = config.title || "Quality";
      const getName = config.getName || ((level) => level.name || `${level.height}P`);
      const defaultLevel = hls.levels[hls.currentLevel];
      const defaultHtml = defaultLevel ? getName(defaultLevel) : auto;
      const selector = uniqBy(
        hls.levels.map((item, index) => {
          return {
            html: getName(item, index),
            value: index,
            default: hls.currentLevel === index
          };
        }),
        "html"
      ).sort((a, b) => b.value - a.value);
      selector.push({
        html: auto,
        value: -1,
        default: hls.currentLevel === -1
      });
      const onSelect = (item) => {
        hls.currentLevel = item.value;
        art.notice.show = `${title}: ${item.html}`;
        if (config.control)
          art.controls.check(item);
        if (config.setting)
          art.setting.check(item);
        return item.html;
      };
      if (config.control) {
        art.controls.update({
          name: "hls-quality",
          position: "right",
          html: defaultHtml,
          style: { padding: "0 10px" },
          selector,
          onSelect
        });
      }
      if (config.setting) {
        art.setting.update({
          name: "hls-quality",
          tooltip: defaultHtml,
          html: title,
          icon: $quality,
          width: 200,
          selector,
          onSelect
        });
      }
    }
    function updateAudio(hls) {
      if (!hls.audioTracks.length)
        return;
      const config = option.audio || {};
      const auto = config.auto || "Auto";
      const title = config.title || "Audio";
      const getName = config.getName || ((track) => track.name || track.lang || track.language);
      const defaultTrack = hls.audioTracks[hls.audioTrack];
      const defaultHtml = defaultTrack ? getName(defaultTrack) : auto;
      const selector = uniqBy(
        hls.audioTracks.map((item, index) => {
          return {
            html: getName(item, index),
            value: item.id,
            default: hls.audioTrack === item.id
          };
        }),
        "html"
      );
      const onSelect = (item) => {
        hls.audioTrack = item.value;
        art.notice.show = `${title}: ${item.html}`;
        if (config.control)
          art.controls.check(item);
        if (config.setting)
          art.setting.check(item);
        return item.html;
      };
      if (config.control) {
        art.controls.update({
          name: "hls-audio",
          position: "right",
          html: defaultHtml,
          style: { padding: "0 10px" },
          selector,
          onSelect
        });
      }
      if (config.setting) {
        art.setting.update({
          name: "hls-audio",
          tooltip: defaultHtml,
          html: title,
          icon: $audio,
          width: 200,
          selector,
          onSelect
        });
      }
    }
    function update() {
      errorHandle(art.hls?.media === $video, 'Cannot find instance of HLS from "art.hls"');
      updateQuality(art.hls);
      updateAudio(art.hls);
    }
    art.on("ready", update);
    art.on("restart", update);
    return {
      name: "artplayerPluginHlsControl",
      update
    };
  };
}
export {
  artplayerPluginHlsControl as default
};
