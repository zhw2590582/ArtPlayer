/*!
 * artplayer-plugin-audio-track.js v1.1.0
 * Github: https://github.com/zhw2590582/ArtPlayer
 * (c) 2017-2026 Harvey Zhao
 * Released under the MIT License.
 */
function createAudioTrack(option) {
  let { url, offset = 0, sync = 0.3 } = option;
  const audio = new Audio();
  let closed = false;
  function play() {
    if (closed || !url)
      return;
    audio.play().catch((error) => {
      if (!closed)
        console.warn(error);
    });
  }
  function pause() {
    if (!closed)
      audio.pause();
  }
  function destroy() {
    if (closed)
      return;
    closed = true;
    const failures = [];
    for (const release of [() => audio.pause(), () => audio.removeAttribute("src"), () => audio.load()]) {
      try {
        release();
      } catch (error) {
        failures.push(error);
      }
    }
    if (failures.length)
      throw failures[0];
  }
  try {
    audio.preload = "auto";
    if (url)
      audio.src = url;
  } catch (error) {
    try {
      destroy();
    } catch {
    }
    throw error;
  }
  return {
    audio,
    play,
    pause,
    destroy,
    sync(time) {
      if (closed || !url)
        return;
      const target = time + offset;
      if (Math.abs(audio.currentTime - target) > sync)
        audio.currentTime = target;
    },
    update(newOption, playing) {
      if (closed)
        return;
      if (newOption.url && newOption.url !== url) {
        url = newOption.url;
        audio.src = url;
        if (playing)
          play();
      }
      if (newOption.offset !== void 0)
        offset = newOption.offset;
      if (newOption.sync !== void 0)
        sync = newOption.sync;
    }
  };
}
function artplayerPluginAudioTrack(option) {
  return (art) => {
    const track = createAudioTrack(option);
    const { audio } = track;
    const subscriptions = [];
    let active = true;
    function syncAudio() {
      if (art.video)
        track.sync(art.currentTime);
    }
    function canResumeAudio() {
      const video = art.video;
      if (!video)
        return false;
      if ("playing" in video && typeof video.playing === "boolean")
        return video.playing;
      return art.playing || video.paused === false && !video.ended && video.readyState > 2;
    }
    function listen(event, callback) {
      const listener = () => {
        if (active)
          callback();
      };
      subscriptions.push([event, listener]);
      art.on(event, listener);
    }
    function destroy() {
      if (!active)
        return;
      active = false;
      const failures = [];
      for (const [event, listener] of subscriptions.splice(0)) {
        try {
          art.off(event, listener);
        } catch (error) {
          failures.push(error);
        }
      }
      try {
        track.destroy();
      } catch (error) {
        failures.push(error);
      }
      if (failures.length)
        throw failures[0];
    }
    try {
      listen("play", () => {
        syncAudio();
        track.play();
      });
      for (const event of ["pause", "video:pause", "video:ended", "video:waiting", "video:emptied", "video:seeking"])
        listen(event, track.pause);
      listen("seek", syncAudio);
      listen("video:seeked", () => {
        syncAudio();
        if (canResumeAudio())
          track.play();
      });
      listen("video:timeupdate", () => {
        if (art.playing)
          syncAudio();
      });
      listen("video:ratechange", () => {
        audio.playbackRate = art.video.playbackRate;
      });
      listen("video:volumechange", () => {
        audio.volume = art.volume;
        audio.muted = art.muted;
      });
      listen("video:playing", () => {
        if (canResumeAudio()) {
          syncAudio();
          track.play();
        }
      });
      listen("video:canplay", () => {
        if (audio.paused && canResumeAudio()) {
          syncAudio();
          track.play();
        }
      });
      listen("destroy", destroy);
      audio.volume = art.volume;
      audio.muted = art.muted;
      audio.playbackRate = art.video?.playbackRate || 1;
    } catch (error) {
      try {
        destroy();
      } catch {
      }
      throw error;
    }
    return {
      name: "artplayerPluginAudioTrack",
      audio,
      update(newOption) {
        if (active)
          track.update(newOption, art.playing);
      }
    };
  };
}
export {
  artplayerPluginAudioTrack as default
};
