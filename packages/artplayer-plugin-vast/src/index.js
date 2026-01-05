/**
 * ArtPlayer Plugin VAST (Google IMA SDK)
 *
 * Production-ready refactor:
 * - SDK singleton loader (deduped)
 * - Correct user-gesture init for AdDisplayContainer.initialize()
 * - Explicit state machine
 * - Safer content hijack/release (no blind art.play())
 * - Better lifecycle cleanup
 * - Public API: init(), requestAds(), playAdTag(), playAdsResponse(), destroy()
 * - Robust resize handling
 *
 * Notes / constraints (explicit, not hidden):
 * - This plugin is for VAST/IMA linear ads; VMAP/mid-roll scheduling is not implemented here.
 * - On mobile, you MUST call init() from a user gesture OR allow the plugin to auto-init on the first user interaction on the player.
 *
 * @license MIT
 */

const DEFAULT_SDK_URL = 'https://imasdk.googleapis.com/js/sdkloader/ima3.js';

const STATES = Object.freeze({
  IDLE: 'idle',
  SDK_LOADING: 'sdk_loading',
  READY: 'ready',
  REQUESTING: 'requesting',
  AD_PLAYING: 'ad_playing',
  AD_PAUSED: 'ad_paused',
  COMPLETED: 'completed',
  ERROR: 'error',
  DESTROYED: 'destroyed',
});

const EVENTS = Object.freeze({
  READY: 'ready',
  SDK_LOADED: 'sdkLoaded',
  ADS_MANAGER_LOADED: 'adsManagerLoaded',

  AD_LOADED: 'adLoaded',
  AD_STARTED: 'adStarted',
  AD_PAUSED: 'adPaused',
  AD_RESUMED: 'adResumed',
  AD_SKIPPED: 'adSkipped',
  AD_COMPLETE: 'adComplete',
  ALL_ADS_COMPLETED: 'allAdsCompleted',
  AD_ERROR: 'adError',
  AD_CLICK: 'adClick',

  CONTENT_PAUSE_REQUESTED: 'contentPauseRequested',
  CONTENT_RESUME_REQUESTED: 'contentResumeRequested',
});

const globalImaLoaderKey = '__ARTPLAYER_IMA_SDK_PROMISE__';

function getGlobal() {
  // eslint-disable-next-line no-new-func
  return Function('return this')();
}

function once(fn) {
  let called = false;
  let result;
  return function (...args) {
    if (called) return result;
    called = true;
    result = fn.apply(this, args);
    return result;
  };
}

function safeCall(fn) {
  try {
    return fn();
  } catch (e) {
    return undefined;
  }
}

function clampZIndex(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return 150;
  return Math.max(1, Math.min(2147483647, Math.floor(n)));
}

/**
 * SDK loader (deduped globally across plugin instances)
 */
function loadImaSdk(sdkUrl) {
  const g = getGlobal();
  if (g.google && g.google.ima) return Promise.resolve(g.google.ima);

  if (!g[globalImaLoaderKey]) {
    g[globalImaLoaderKey] = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = sdkUrl || DEFAULT_SDK_URL;
      script.async = true;
      script.onload = () => {
        if (g.google && g.google.ima) resolve(g.google.ima);
        else reject(new Error('IMA SDK loaded but window.google.ima is missing'));
      };
      script.onerror = () => reject(new Error('Failed to load IMA SDK script'));
      document.head.appendChild(script);
    });
  }

  return g[globalImaLoaderKey];
}

export default function artplayerPluginVast(userOption = {}) {
  return (art) => {
    const {
      template: { $player, $video },
      constructor: {
        utils: { setStyle, setStyles, append, remove },
      },
    } = art;

    const option = {
      sdkUrl: DEFAULT_SDK_URL,
      url: '',
      adsResponse: '',
      // UI
      zIndex: 150,
      showBigPlayOnPause: true,
      // IMA settings
      disableVpaid: true,
      disableCustomPlaybackForIOS10Plus: true,
      restoreCustomPlaybackStateOnAdBreakComplete: true,
      // behavior
      autoInit: true, // attach user-gesture listeners to init automatically
      debug: false,
      ...userOption,
    };

    let state = STATES.IDLE;

    let ima = null;

    let adDisplayContainer = null;
    let adsLoader = null;
    let adsManager = null;

    let adContainerEl = null;
    let bigPlayEl = null;

    let initializedByUserGesture = false;
    let destroyed = false;

    // Track content state to restore safely
    let contentWasPlayingBeforeAd = false;
    let contentTimeBeforeAd = 0;

    // ===== helpers =====
    function log(...args) {
      if (option.debug) console.log('[artplayer-plugin-vast]', ...args);
    }

    function emit(name, payload) {
      art.emit(`vast:${name}`, payload);
    }

    function setState(next) {
      state = next;
    }

    function getPlayerRect() {
      const rect = $player.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      return { width, height };
    }

    function ensureUi() {
      if (adContainerEl) return;

      adContainerEl = document.createElement('div');
      adContainerEl.className = 'artplayer-ima-ad-container';
      setStyles(adContainerEl, {
        position: 'absolute',
        inset: '0',
        width: '100%',
        height: '100%',
        display: 'none',
        pointerEvents: 'auto',
        zIndex: String(clampZIndex(option.zIndex)),
      });
      append($player, adContainerEl);

      bigPlayEl = document.createElement('button');
      bigPlayEl.type = 'button';
      bigPlayEl.className = 'artplayer-ima-bigplay';
      bigPlayEl.setAttribute('aria-label', 'Play Ad');
      setStyles(bigPlayEl, {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '72px',
        height: '72px',
        border: '0',
        padding: '0',
        borderRadius: '50%',
        background: 'rgba(0,0,0,0.35)',
        cursor: 'pointer',
        display: 'none',
        zIndex: String(clampZIndex(option.zIndex) + 1),
      });
      bigPlayEl.innerHTML = `
                <svg viewBox="0 0 24 24" width="42" height="42" fill="rgba(255,255,255,0.92)" style="margin-left:3px;">
                    <path d="M8 5v14l11-7z"></path>
                </svg>
            `;
      append($player, bigPlayEl);

      bigPlayEl.addEventListener('click', () => {
        if (destroyed) return;
        // Resume ad if paused; also counts as user gesture for initialize()
        initializedByUserGesture = true;
        if (!adDisplayContainer) safeCall(() => init()); // best effort
        if (adsManager) safeCall(() => adsManager.resume());
      });
    }

    function showAdLayer(show) {
      if (!adContainerEl) return;
      setStyle(adContainerEl, 'display', show ? 'block' : 'none');
    }

    function showBigPlay(show) {
      if (!bigPlayEl) return;
      setStyle(bigPlayEl, 'display', show ? 'block' : 'none');
    }

    function lockContentForAd() {
      // do not blindly mutate art.option (runtime may not fully apply)
      // Use operational safety: pause content and block click-to-toggle by overlaying ad layer.
      contentWasPlayingBeforeAd = !art.paused;
      contentTimeBeforeAd = $video.currentTime || 0;

      if (!art.paused) art.pause();

      showAdLayer(true);
      if (option.showBigPlayOnPause) showBigPlay(false);
    }

    function releaseContentAfterAd() {
      showAdLayer(false);
      showBigPlay(false);

      // restore to previous content behavior safely:
      // - if user was watching (playing) before the ad, resume
      // - if user was paused, stay paused
      if (contentWasPlayingBeforeAd) {
        // Some integrations prefer not to auto-resume after ad errors; we only resume if we paused for the ad.
        art.play();
      }
    }

    function cleanupAdsObjects() {
      if (adsManager) {
        safeCall(() => adsManager.destroy());
        adsManager = null;
      }
      if (adsLoader) {
        // AdsLoader has no destroy in some IMA builds; safe-call anyway
        safeCall(() => adsLoader.destroy && adsLoader.destroy());
        adsLoader = null;
      }
      if (adDisplayContainer) {
        safeCall(() => adDisplayContainer.destroy());
        adDisplayContainer = null;
      }
    }

    // ===== IMA event handlers =====
    function onAdError(event) {
      const err = event && event.getError ? event.getError() : event;
      setState(STATES.ERROR);
      emit(EVENTS.AD_ERROR, err);
      log('Ad error:', err);

      cleanupAdsObjects();
      // Only release to content; do not force seek.
      releaseContentAfterAd();
    }

    function onContentPauseRequested() {
      emit(EVENTS.CONTENT_PAUSE_REQUESTED);
      lockContentForAd();
    }

    function onContentResumeRequested() {
      emit(EVENTS.CONTENT_RESUME_REQUESTED);
      // Do not auto-seek back; IMA handles it if restoreCustomPlaybackStateOnAdBreakComplete is true
      releaseContentAfterAd();
    }

    function onAdEvent(e) {
      if (!ima || !ima.AdEvent || !ima.AdEvent.Type) return;

      const t = e.type;

      switch (t) {
        case ima.AdEvent.Type.LOADED:
          emit(EVENTS.AD_LOADED, e);
          break;

        case ima.AdEvent.Type.STARTED:
          setState(STATES.AD_PLAYING);
          emit(EVENTS.AD_STARTED, e);
          showBigPlay(false);
          break;

        case ima.AdEvent.Type.PAUSED:
          setState(STATES.AD_PAUSED);
          emit(EVENTS.AD_PAUSED, e);
          if (option.showBigPlayOnPause) showBigPlay(true);
          break;

        case ima.AdEvent.Type.RESUMED:
          setState(STATES.AD_PLAYING);
          emit(EVENTS.AD_RESUMED, e);
          showBigPlay(false);
          break;

        case ima.AdEvent.Type.COMPLETE:
          emit(EVENTS.AD_COMPLETE, e);
          break;

        case ima.AdEvent.Type.SKIPPED:
          emit(EVENTS.AD_SKIPPED, e);
          break;

        case ima.AdEvent.Type.CLICK:
          emit(EVENTS.AD_CLICK, e);
          break;

        case ima.AdEvent.Type.ALL_ADS_COMPLETED:
          setState(STATES.COMPLETED);
          emit(EVENTS.ALL_ADS_COMPLETED, e);
          // Do NOT call release here unconditionally; CONTENT_RESUME_REQUESTED is the right signal.
          break;

        default:
          break;
      }
    }

    function initAdsManager(adsManagerLoadedEvent) {
      if (destroyed) return;

      emit(EVENTS.ADS_MANAGER_LOADED, adsManagerLoadedEvent);

      const adsRenderingSettings = new ima.AdsRenderingSettings();
      adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete =
        !!option.restoreCustomPlaybackStateOnAdBreakComplete;

      if (adsManager) safeCall(() => adsManager.destroy());

      // Bind ads to the content video element
      adsManager = adsManagerLoadedEvent.getAdsManager($video, adsRenderingSettings);

      adsManager.addEventListener(ima.AdErrorEvent.Type.AD_ERROR, onAdError);
      adsManager.addEventListener(ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, onContentPauseRequested);
      adsManager.addEventListener(ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, onContentResumeRequested);

      const adEvents = [
        ima.AdEvent.Type.LOADED,
        ima.AdEvent.Type.STARTED,
        ima.AdEvent.Type.PAUSED,
        ima.AdEvent.Type.RESUMED,
        ima.AdEvent.Type.COMPLETE,
        ima.AdEvent.Type.SKIPPED,
        ima.AdEvent.Type.CLICK,
        ima.AdEvent.Type.ALL_ADS_COMPLETED,
      ];

      adEvents.forEach((type) => adsManager.addEventListener(type, onAdEvent));

      try {
        const { width, height } = getPlayerRect();
        adsManager.init(width, height, ima.ViewMode.NORMAL);
        adsManager.start();
      } catch (e) {
        onAdError({ getError: () => e });
      }
    }

    // ===== public core =====

    const init = once(() => {
      if (destroyed) return Promise.reject(new Error('Plugin destroyed'));

      ensureUi();

      setState(STATES.SDK_LOADING);

      return loadImaSdk(option.sdkUrl)
        .then((loadedIma) => {
          if (destroyed) return;
          ima = loadedIma;

          emit(EVENTS.SDK_LOADED);
          log('IMA SDK loaded');

          // Global IMA settings (optional)
          if (option.disableVpaid && ima.ImaSdkSettings && ima.ImaSdkSettings.VpaidMode) {
            safeCall(() => ima.settings.setVpaidMode(ima.ImaSdkSettings.VpaidMode.DISABLED));
          }
          if (option.disableCustomPlaybackForIOS10Plus) {
            safeCall(() => ima.settings.setDisableCustomPlaybackForIOS10Plus(true));
          }

          // Create AdDisplayContainer / AdsLoader once
          if (!adDisplayContainer) {
            adDisplayContainer = new ima.AdDisplayContainer(adContainerEl, $video);
          }
          if (!adsLoader) {
            adsLoader = new ima.AdsLoader(adDisplayContainer);
            adsLoader.addEventListener(
              ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
              initAdsManager,
              false,
            );
            adsLoader.addEventListener(ima.AdErrorEvent.Type.AD_ERROR, onAdError, false);
          }

          setState(STATES.READY);
          emit(EVENTS.READY);
        })
        .catch((e) => {
          setState(STATES.ERROR);
          emit(EVENTS.AD_ERROR, e);
          throw e;
        });
    });

    function initializeAdDisplayContainerFromUserGesture() {
      if (destroyed) return;
      if (!ima || !adDisplayContainer) return;

      if (initializedByUserGesture) return;
      initializedByUserGesture = true;

      // MUST be called in a user gesture handler on mobile browsers.
      safeCall(() => adDisplayContainer.initialize());
      log('AdDisplayContainer.initialize() called (user gesture)');
    }

    function requestAds(adsRequest) {
      if (destroyed) return Promise.reject(new Error('Plugin destroyed'));

      return init().then(() => {
        if (destroyed) return;

        setState(STATES.REQUESTING);
        ensureUi();

        // If not initialized via user gesture yet, we still request;
        // On mobile, playback may fail until initialize() happens via gesture.
        // We set up auto-init hooks to call it as soon as possible.
        safeCall(() => adsLoader.requestAds(adsRequest));
      });
    }

    function playAdTag(url) {
      if (!url) return Promise.reject(new Error('Missing adTagUrl'));
      return init().then(() => {
        const req = new ima.AdsRequest();
        req.adTagUrl = url;
        return requestAds(req);
      });
    }

    function playAdsResponse(response) {
      if (!response) return Promise.reject(new Error('Missing adsResponse'));
      return init().then(() => {
        const req = new ima.AdsRequest();
        req.adsResponse = response;
        return requestAds(req);
      });
    }

    function resize() {
      if (!adsManager || destroyed) return;
      const { width, height } = getPlayerRect();
      safeCall(() => adsManager.resize(width, height, ima.ViewMode.NORMAL));
    }

    function destroy() {
      if (destroyed) return;
      destroyed = true;
      setState(STATES.DESTROYED);

      cleanupAdsObjects();

      if (adContainerEl) remove(adContainerEl);
      if (bigPlayEl) remove(bigPlayEl);

      adContainerEl = null;
      bigPlayEl = null;
    }

    // ===== user gesture init hooks =====
    const onUserGesture = (e) => {
      if (destroyed) return;

      // Ensure core objects exist
      // init() loads SDK & creates AdDisplayContainer; we need initialize() inside this handler.
      init()
        .then(() => {
          initializeAdDisplayContainerFromUserGesture();
        })
        .catch(() => {
          // ignore
        });

      // Only need once; remove listeners
      detachUserGestureHooks();
    };

    function attachUserGestureHooks() {
      // Capture phase increases chance to run before other handlers stopPropagation
      $player.addEventListener('pointerdown', onUserGesture, { capture: true, passive: true });
      $player.addEventListener('touchend', onUserGesture, { capture: true, passive: true });
      $player.addEventListener('click', onUserGesture, { capture: true, passive: true });
    }

    function detachUserGestureHooks() {
      $player.removeEventListener('pointerdown', onUserGesture, { capture: true });
      $player.removeEventListener('touchend', onUserGesture, { capture: true });
      $player.removeEventListener('click', onUserGesture, { capture: true });
    }

    // ===== ArtPlayer lifecycle =====
    art.on('resize', resize);
    // Defensive: some layouts don't trigger art.resize reliably
    window.addEventListener('resize', resize, { passive: true });

    art.on('destroy', () => {
      window.removeEventListener('resize', resize);
      detachUserGestureHooks();
      destroy();
    });

    // ===== auto behavior =====
    ensureUi();

    if (option.autoInit) attachUserGestureHooks();

    // Auto play initial ad if provided
    if (option.url) {
      // Do not force initialize(); request may succeed on desktop, and on mobile will wait for gesture.
      playAdTag(option.url).catch((e) => log('playAdTag failed:', e));
    } else if (option.adsResponse) {
      playAdsResponse(option.adsResponse).catch((e) => log('playAdsResponse failed:', e));
    }

    // ===== Public API =====
    return {
      name: 'artplayerPluginVast',

      // state
      get state() {
        return state;
      },
      get isAdPlaying() {
        return state === STATES.AD_PLAYING || state === STATES.AD_PAUSED;
      },

      // raw IMA objects
      get ima() {
        return ima;
      },
      get adsLoader() {
        return adsLoader;
      },
      get adsManager() {
        return adsManager;
      },
      get adDisplayContainer() {
        return adDisplayContainer;
      },

      // methods
      init,
      requestAds,
      playAdTag,
      playAdsResponse,
      resize,
      destroy,

      // manually mark/perform user-gesture init (if you want explicit control)
      initializeFromUserGesture() {
        init()
          .then(() => initializeAdDisplayContainerFromUserGesture())
          .catch(() => { });
      },

      EVENTS,
      STATES,
    };
  };
}

if (typeof window !== 'undefined') {
  window.artplayerPluginVast = artplayerPluginVast;
}
