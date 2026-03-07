var artplayerPluginVttThumbnail = (function() {
  "use strict";
  function padEnd(str, targetLength, padString) {
    if (str.length > targetLength) {
      return String(str);
    } else {
      targetLength = targetLength - str.length;
      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength / padString.length);
      }
      return String(str) + padString.slice(0, targetLength);
    }
  }
  function t2d(time) {
    const arr = time.split(".");
    const left = arr[0].split(":") || [];
    const right = padEnd(arr[1] || "0", 3, "0");
    const ms = Number(right) / 1e3;
    const h = Number(left[left.length - 3] || 0) * 3600;
    const m = Number(left[left.length - 2] || 0) * 60;
    const s = Number(left[left.length - 1] || 0);
    return h + m + s + ms;
  }
  async function getVttArray(vttUrl = "") {
    const vttString = await (await fetch(vttUrl)).text();
    const lines = vttString.split(/[\n\r]/g).filter((item) => item.trim());
    const vttArray = [];
    for (let i = 1; i < lines.length; i += 2) {
      const time = lines[i];
      const text = lines[i + 1];
      if (!text.trim())
        continue;
      const timeReg = /((?:\d{2}:)?(?:\d{2}:)?\d{2}(?:.\d{3})?) ?--> ?((?:\d{2}:)?(?:\d{2}:)?\d{2}(?:.\d{3})?)/;
      const timeMatch = time.match(timeReg);
      const textReg = /(.*)#(\w{4})=(.*)/;
      const textMatch = text.match(textReg);
      const start = Math.floor(t2d(timeMatch[1]));
      const end = Math.floor(t2d(timeMatch[2]));
      let url = textMatch[1];
      const isAbsoluteUrl = /^\/|(?:https?|ftp|file):\/\//i.test(url);
      if (!isAbsoluteUrl) {
        const urlArr = vttUrl.split("/");
        urlArr.pop();
        urlArr.push(url);
        url = urlArr.join("/");
      }
      const result = { start, end, url };
      const keys = textMatch[2].split("");
      const values = textMatch[3].split(",");
      for (let j = 0; j < keys.length; j++) {
        result[keys[j]] = values[j];
      }
      vttArray.push(result);
    }
    return vttArray;
  }
  function artplayerPluginVttThumbnail2(option) {
    return async (art) => {
      const {
        constructor: {
          utils: { setStyle, isMobile, addClass }
        },
        template: { $progress }
      } = art;
      let timer = null;
      const thumbnails = await getVttArray(option.vtt);
      function showThumbnails($control, find, width) {
        setStyle($control, "backgroundImage", `url(${find.url})`);
        setStyle($control, "height", `${find.h}px`);
        setStyle($control, "width", `${find.w}px`);
        setStyle($control, "backgroundPosition", `-${find.x}px -${find.y}px`);
        if (width <= find.w / 2) {
          setStyle($control, "left", 0);
        } else if (width > $progress.clientWidth - find.w / 2) {
          setStyle($control, "left", `${$progress.clientWidth - find.w}px`);
        } else {
          setStyle($control, "left", `${width - find.w / 2}px`);
        }
      }
      art.controls.add({
        name: "vtt-thumbnail",
        position: "top",
        index: 20,
        style: option.style || {},
        mounted($control) {
          addClass($control, "art-control-thumbnails");
          art.on("setBar", async (type, percentage, event) => {
            const isMobileDroging = type === "played" && event && isMobile;
            if (type === "hover" || isMobileDroging) {
              const width = $progress.clientWidth * percentage;
              const second = percentage * art.duration;
              setStyle($control, "display", "flex");
              const find = thumbnails.find((item) => second >= item.start && second <= item.end);
              if (!find)
                return setStyle($control, "display", "none");
              if (width > 0 && width < $progress.clientWidth) {
                showThumbnails($control, find, width);
              } else {
                if (!isMobile) {
                  setStyle($control, "display", "none");
                }
              }
              if (isMobileDroging) {
                clearTimeout(timer);
                timer = setTimeout(() => {
                  setStyle($control, "display", "none");
                }, 500);
              }
            }
          });
        }
      });
      return {
        name: "artplayerPluginVttThumbnail"
      };
    };
  }
  return artplayerPluginVttThumbnail2;
})();
