var artplayerPluginAmbilight = (function() {
  "use strict";
  function artplayerPluginAmbilight2(option = {}) {
    return (art) => {
      const { $video } = art.template;
      const { createElement, addClass, setStyles } = art.constructor.utils;
      const { blur = "50px", opacity = 0.5, frequency = 10, duration = 0.3 } = option;
      const $ambilight = createElement("div");
      const gridItems = createGridItems($ambilight);
      setupAmbilight($ambilight, $video);
      setupGridItems(gridItems, blur, opacity, duration);
      const updateColors = createColorUpdater($video, gridItems, frequency);
      let animationFrameId = null;
      function start() {
        if (!animationFrameId) {
          updateColors();
        }
      }
      function stop() {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      }
      art.on("ready", start);
      art.on("destroy", stop);
      return {
        name: "artplayerPluginAmbilight",
        start,
        stop
      };
      function createGridItems($ambilight2) {
        $ambilight2.innerHTML = Array.from({ length: 9 }).fill("<div></div>").join("");
        return Array.from($ambilight2.children);
      }
      function setupAmbilight($ambilight2, $video2) {
        addClass($ambilight2, "artplayer-plugin-ambilight");
        $video2.parentNode.insertBefore($ambilight2, $video2);
        setStyles($ambilight2, {
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 9,
          inset: 0,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gridTemplateRows: "1fr 1fr 1fr"
        });
      }
      function setupGridItems(gridItems2, blur2, opacity2, duration2) {
        gridItems2.forEach(($item) => {
          setStyles($item, {
            opacity: opacity2,
            filter: `blur(${blur2})`,
            transition: `background-color ${duration2}s ease`
          });
        });
      }
      function createColorUpdater($video2, gridItems2, frequency2) {
        const canvas = createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 3;
        canvas.height = 3;
        function getAverageColor(x, y, w, h) {
          ctx.drawImage($video2, x, y, w, h, 0, 0, 1, 1);
          const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
          return `rgb(${r}, ${g}, ${b})`;
        }
        let lastUpdateTime = 0;
        return function updateColors2() {
          const now = performance.now();
          if (now - lastUpdateTime < 1e3 / frequency2 || !art.playing) {
            animationFrameId = requestAnimationFrame(updateColors2);
            return;
          }
          lastUpdateTime = now;
          const w = $video2.videoWidth / 3;
          const h = $video2.videoHeight / 3;
          const colors = [
            [0, 0],
            [w, 0],
            [2 * w, 0],
            [0, h],
            [w, h],
            [2 * w, h],
            [0, 2 * h],
            [w, 2 * h],
            [2 * w, 2 * h]
          ].map(([x, y]) => getAverageColor(x, y, w, h));
          gridItems2.forEach(($item, index) => {
            $item.style.backgroundColor = colors[index];
          });
          animationFrameId = requestAnimationFrame(updateColors2);
        };
      }
    };
  }
  return artplayerPluginAmbilight2;
})();
