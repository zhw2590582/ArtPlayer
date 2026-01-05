/**
 * ArtPlayer Plugin VAST
 * Based on Google IMA SDK
 * 
 * @license MIT
 * @author Harvey Zack
 */

// ============================================================================
// 1. Constants & Enums
// ============================================================================

const SDK_URL = '//imasdk.googleapis.com/js/sdkloader/ima3.js';

const STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  PLAYING: 'playing',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  ERROR: 'error',
};

const EVENTS = {
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
};

// ============================================================================
// 2. Modules
// ============================================================================

/**
 * Service to handle Google IMA SDK loading and initialization
 */
class IMAService {
  constructor() {
    this.sdkLoaded = false;
  }

  async load() {
    if (window.google && window.google.ima) {
      this.sdkLoaded = true;
      return window.google.ima;
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = SDK_URL;
      script.async = true;
      script.onload = () => {
        this.sdkLoaded = true;
        resolve(window.google.ima);
      };
      script.onerror = (err) => {
        reject(new Error('Failed to load Google IMA SDK'));
      };
      document.body.appendChild(script);
    });
  }

  configureSettings() {
    if (!this.sdkLoaded) return;
    const ima = window.google.ima;
    // Explicitly disable VPAID as requested
    if (ima.ImaSdkSettings && ima.ImaSdkSettings.VpaidMode) {
        ima.settings.setVpaidMode(ima.ImaSdkSettings.VpaidMode.DISABLED);
    }
    // Disable Companion Ads (we don't handle them)
    ima.settings.setDisableCustomPlaybackForIOS10Plus(true);
  }
}

/**
 * State Machine for Ad Lifecycle
 */
class AdStateMachine {
  constructor() {
    this.current = STATES.IDLE;
  }

  transition(newState) {
    this.current = newState;
  }

  is(state) {
    return this.current === state;
  }

  reset() {
    this.current = STATES.IDLE;
  }
}

/**
 * Manages the DOM container for Ads
 */
class AdContainer {
  constructor(art) {
    this.art = art;
    this.$el = null;
  }

  mount() {
    if (this.$el) return this.$el;

    const { template, constructor } = this.art;
    const { createElement, setStyles } = constructor.utils;

    this.$el = createElement('div');
    this.$el.id = `art-vast-${Date.now()}`;
    
    setStyles(this.$el, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      zIndex: '150', // Above most ArtPlayer layers
      backgroundColor: 'black',
      display: 'none',
      pointerEvents: 'auto',
    });

    template.$player.appendChild(this.$el);
    return this.$el;
  }

  show() {
    if (this.$el) this.$el.style.display = 'block';
  }

  hide() {
    if (this.$el) this.$el.style.display = 'none';
  }

  destroy() {
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
    this.$el = null;
  }
}

/**
 * Bridge to control ArtPlayer behavior during Ads
 */
class ArtPlayerBridge {
  constructor(art) {
    this.art = art;
    this.originalState = {};
    this.isHijacked = false;
  }

  hijack() {
    if (this.isHijacked) return;
    const { art } = this;

    // Save original states
    this.originalState = {
      hotkey: art.option.hotkey,
      scrubbing: art.option.scrubbing,
      controls: art.controls.show,
      contextmenu: art.option.contextmenu,
      lock: art.option.lock,
      autoPlayback: art.option.autoPlayback,
    };

    // Disable user interactions
    art.option.hotkey = false;
    art.option.scrubbing = false;
    art.controls.show = false;
    
    // Pause main video if it's playing
    if (!art.paused) {
      art.pause();
    }

    this.isHijacked = true;
  }

  release() {
    if (!this.isHijacked) return;
    const { art } = this;
    const { originalState } = this;

    // Restore states
    art.option.hotkey = originalState.hotkey;
    art.option.scrubbing = originalState.scrubbing;
    art.controls.show = originalState.controls;
    
    this.isHijacked = false;
  }
}

// ============================================================================
// 3. Main Controller
// ============================================================================

class VastController {
  constructor(art, options) {
    this.art = art;
    this.options = options || {};
    
    this.imaService = new IMAService();
    this.stateMachine = new AdStateMachine();
    this.container = new AdContainer(art);
    this.bridge = new ArtPlayerBridge(art);

    this.adsLoader = null;
    this.adsManager = null;
    this.adDisplayContainer = null;
    this.adDisplayContainerInitialized = false;
    
    // Bind context
    this.onResize = this.onResize.bind(this);
    this.onContentPauseRequested = this.onContentPauseRequested.bind(this);
    this.onContentResumeRequested = this.onContentResumeRequested.bind(this);
    this.onAdError = this.onAdError.bind(this);
    this.onAdEvent = this.onAdEvent.bind(this);

    // Initialize
    this.init();
  }

  async init() {
    try {
      const ima = await this.imaService.load();
      this.imaService.configureSettings();
      
      // Listen to ArtPlayer resize to resize AdsManager
      this.art.on('resize', this.onResize);
      this.art.on('fullscreen', this.onResize);
      this.art.on('destroy', () => this.destroy());

    } catch (error) {
      console.error('[ArtPlayer VAST] Failed to load IMA SDK:', error);
      this.stateMachine.transition(STATES.ERROR);
    }
  }

  createAdsLoader() {
    if (this.adsLoader) return;

    const ima = window.google.ima;
    const $container = this.container.mount();
    const $video = this.art.template.$video;

    this.adDisplayContainer = new ima.AdDisplayContainer($container, $video);
    // NOTE: Do NOT call initialize() here. It must be called as the result of a user action.
    
    this.adsLoader = new ima.AdsLoader(this.adDisplayContainer);
    
    // Set up event listeners
    this.adsLoader.addEventListener(
      ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
      (e) => this.onAdsManagerLoaded(e),
      false
    );

    this.adsLoader.addEventListener(
      ima.AdErrorEvent.Type.AD_ERROR,
      this.onAdError,
      false
    );
  }

  requestAds(adsRequest) {
    // Requirement 1: Prevent re-entry if not IDLE
    if (!this.stateMachine.is(STATES.IDLE)) {
      console.warn('[ArtPlayer VAST] Cannot request ads while state is not IDLE');
      return;
    }

    if (!this.adsLoader) {
      this.createAdsLoader();
    }
    
    // Requirement 2: Initialize AdDisplayContainer on first request (user interaction)
    if (!this.adDisplayContainerInitialized && this.adDisplayContainer) {
      this.adDisplayContainer.initialize();
      this.adDisplayContainerInitialized = true;
    }
    
    // Reset state
    this.stateMachine.transition(STATES.LOADING);
    
    // Request ads
    try {
      this.adsLoader.requestAds(adsRequest);
    } catch (e) {
      this.onAdError({ getError: () => e });
    }
  }

  playAdTag(url, options = {}) {
    if (!window.google || !window.google.ima) {
      console.warn('[ArtPlayer VAST] SDK not loaded yet. Queueing request...');
      this.imaService.load().then(() => this.playAdTag(url, options));
      return;
    }

    // Requirement 1: Check state before creating request
    if (!this.stateMachine.is(STATES.IDLE)) {
      console.warn('[ArtPlayer VAST] Cannot request ads while state is not IDLE');
      return;
    }

    const ima = window.google.ima;
    const adsRequest = new ima.AdsRequest();
    adsRequest.adTagUrl = url;
    
    // Apply options
    Object.assign(adsRequest, options);

    this.requestAds(adsRequest);
  }

  playAdsResponse(adsResponse, options = {}) {
    if (!window.google || !window.google.ima) {
      this.imaService.load().then(() => this.playAdsResponse(adsResponse, options));
      return;
    }

    // Requirement 1: Check state before creating request
    if (!this.stateMachine.is(STATES.IDLE)) {
      console.warn('[ArtPlayer VAST] Cannot request ads while state is not IDLE');
      return;
    }

    const ima = window.google.ima;
    const adsRequest = new ima.AdsRequest();
    adsRequest.adsResponse = adsResponse;
    
    Object.assign(adsRequest, options);

    this.requestAds(adsRequest);
  }

  onAdsManagerLoaded(adsManagerLoadedEvent) {
    const ima = window.google.ima;
    
    // Requirement 4: Ensure single instance of AdsManager
    if (this.adsManager) {
      this.adsManager.destroy();
      this.adsManager = null;
    }

    const adsRenderingSettings = new ima.AdsRenderingSettings();
    adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
    adsRenderingSettings.enablePreloading = true;

    this.adsManager = adsManagerLoadedEvent.getAdsManager(
      this.art.template.$video,
      adsRenderingSettings
    );

    this.adsManager.addEventListener(ima.AdErrorEvent.Type.AD_ERROR, this.onAdError);
    
    // Lifecycle events
    this.adsManager.addEventListener(ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, this.onContentPauseRequested);
    this.adsManager.addEventListener(ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, this.onContentResumeRequested);
    
    // Ad events
    const events = [
      ima.AdEvent.Type.ALL_ADS_COMPLETED,
      ima.AdEvent.Type.LOADED,
      ima.AdEvent.Type.STARTED,
      ima.AdEvent.Type.COMPLETE,
      ima.AdEvent.Type.SKIPPED,
      ima.AdEvent.Type.CLICK,
      ima.AdEvent.Type.PAUSED,
      ima.AdEvent.Type.RESUMED,
    ];

    events.forEach(eventType => {
      this.adsManager.addEventListener(eventType, this.onAdEvent);
    });

    try {
      const { width, height } = this.art.template.$player.getBoundingClientRect();
      this.adsManager.init(width, height, ima.ViewMode.NORMAL);
      this.adsManager.start();
    } catch (adError) {
      this.onAdError({ getError: () => adError });
    }
  }

  onContentPauseRequested() {
    // Requirement 3: Semantics - Just hijack and show container, state is LOADING
    this.stateMachine.transition(STATES.LOADING);
    this.bridge.hijack();
    this.container.show();
    
    // Ensure video is paused
    this.art.pause();
    
    // NOTE: Do NOT emit adStarted here. Wait for actual AdEvent.STARTED.
  }

  onContentResumeRequested() {
    // Requirement 6: Idempotent check
    // If we are not in an active ad state (LOADING or PLAYING), ignore.
    // This prevents double resume calls from VMAP or error handlers.
    if (this.stateMachine.is(STATES.IDLE) || this.stateMachine.is(STATES.COMPLETED)) {
      return;
    }

    // Requirement 4: Clean up AdsManager to prevent leaks in VMAP
    if (this.adsManager) {
      this.adsManager.destroy();
      this.adsManager = null;
    }

    this.stateMachine.transition(STATES.COMPLETED);
    this.bridge.release();
    this.container.hide();
    
    // Resume video
    this.art.play();
    
    this.art.emit(`vast:${EVENTS.ALL_ADS_COMPLETED}`);
    
    // Reset to IDLE for next ad request
    this.stateMachine.reset();
  }

  onAdEvent(adEvent) {
    const ima = window.google.ima;
    const type = adEvent.type;
    const ad = adEvent.getAd();

    // Map IMA events to plugin events
    switch (type) {
      case ima.AdEvent.Type.LOADED:
        this.art.emit(`vast:${EVENTS.AD_LOADED}`, adEvent);
        break;
        
      case ima.AdEvent.Type.STARTED:
        // Requirement 3: Transition to PLAYING only here
        this.stateMachine.transition(STATES.PLAYING);
        this.art.emit(`vast:${EVENTS.AD_STARTED}`, adEvent);
        break;

      case ima.AdEvent.Type.COMPLETE:
        this.art.emit(`vast:${EVENTS.AD_COMPLETE}`, adEvent);
        break;

      case ima.AdEvent.Type.SKIPPED:
        this.art.emit(`vast:${EVENTS.AD_SKIPPED}`, adEvent);
        break;
        
      case ima.AdEvent.Type.CLICK:
        this.art.emit(`vast:${EVENTS.AD_CLICK}`, adEvent);
        break;
    }
  }

  onAdError(adErrorEvent) {
    const error = adErrorEvent.getError();
    console.error('[ArtPlayer VAST] Ad Error:', error);
    
    // Requirement 4: Clean up AdsManager on error
    if (this.adsManager) {
      this.adsManager.destroy();
      this.adsManager = null;
    }
    
    this.stateMachine.transition(STATES.ERROR);
    this.art.emit(`vast:${EVENTS.AD_ERROR}`, error);
    
    // Recovery
    this.bridge.release();
    this.container.hide();
    this.art.play();
    
    // Reset state
    this.stateMachine.reset();
  }

  onResize() {
    // Requirement 7: Null check for adsManager
    if (this.adsManager && this.adDisplayContainer) {
      const { width, height } = this.art.template.$player.getBoundingClientRect();
      const ima = window.google.ima;
      this.adsManager.resize(width, height, ima.ViewMode.NORMAL);
    }
  }

  destroy() {
    // Requirement 8: Strict destroy order
    
    // 1. Reset state
    this.stateMachine.reset();
    
    // 2. Destroy adsManager
    if (this.adsManager) {
      this.adsManager.destroy();
      this.adsManager = null;
    }
    
    // 3. Hide + destroy container
    this.container.destroy();
    
    // 4. Release ArtPlayerBridge
    this.bridge.release();
    
    // 5. Clean up adsLoader / adDisplayContainer
    // Requirement 5: Do NOT call adsLoader.destroy()
    this.adsLoader = null;
    
    if (this.adDisplayContainer) {
      this.adDisplayContainer.destroy();
      this.adDisplayContainer = null;
    }
    
    // 6. Off events
    this.art.off('resize', this.onResize);
    this.art.off('fullscreen', this.onResize);
  }
}

// ============================================================================
// 4. Plugin Entry
// ============================================================================

export default function artplayerPluginVast(options) {
  return (art) => {
    const controller = new VastController(art, options);

    return {
      name: 'artplayerPluginVast',
      
      // Public API
      playAdTag: (url, config) => controller.playAdTag(url, config),
      playAdsResponse: (res, config) => controller.playAdsResponse(res, config),
      init: () => controller.init(),
      destroy: () => controller.destroy(),
      
      // Getters for debugging/advanced usage
      get adsLoader() { return controller.adsLoader; },
      get adsManager() { return controller.adsManager; },
    };
  };
}

if (typeof window !== 'undefined') {
  window.artplayerPluginVast = artplayerPluginVast;
}
