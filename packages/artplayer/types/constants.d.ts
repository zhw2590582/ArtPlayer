/**
 * Time-related constants for various operations
 */
export interface TimeConstants {
  /** Notice display time in milliseconds */
  NOTICE_TIME: number
  /** Resize operation timeout in milliseconds */
  RESIZE_TIME: number
  /** Scroll operation timeout in milliseconds */
  SCROLL_TIME: number
  /** Auto playback timeout in milliseconds */
  AUTO_PLAYBACK_TIMEOUT: number
  /** Reconnect sleep time in milliseconds */
  RECONNECT_SLEEP_TIME: number
  /** Control hide timeout in milliseconds */
  CONTROL_HIDE_TIME: number
  /** Double click detection time in milliseconds */
  DBCLICK_TIME: number
  /** Auto orientation timeout in milliseconds */
  AUTO_ORIENTATION_TIME: number
  /** Info loop update time in milliseconds */
  INFO_LOOP_TIME: number
  /** Fast forward operation time in milliseconds */
  FAST_FORWARD_TIME: number
}

/**
 * UI dimensions and layout constants
 */
export interface UIConstants {
  /** Setting panel width in pixels */
  SETTING_WIDTH: number
  /** Setting item width in pixels */
  SETTING_ITEM_WIDTH: number
  /** Setting item height in pixels */
  SETTING_ITEM_HEIGHT: number
  /** Scroll gap for navigation in pixels */
  SCROLL_GAP: number
}

/**
 * Playback and media control constants
 */
export interface PlaybackConstants {
  /** Maximum auto playback duration */
  AUTO_PLAYBACK_MAX: number
  /** Minimum auto playback duration */
  AUTO_PLAYBACK_MIN: number
  /** Maximum reconnection attempts */
  RECONNECT_TIME_MAX: number
  /** Fast forward speed multiplier */
  FAST_FORWARD_VALUE: number
  /** Touch move ratio for gesture controls */
  TOUCH_MOVE_RATIO: number
  /** Volume adjustment step */
  VOLUME_STEP: number
  /** Seek step in seconds */
  SEEK_STEP: number
  /** Available playback rates */
  PLAYBACK_RATE: number[]
  /** Available aspect ratios */
  ASPECT_RATIO: string[]
  /** Available flip options */
  FLIP: string[]
}

/**
 * Feature flags and behavior controls
 */
export interface FeatureFlags {
  /** Enable debug mode */
  DEBUG: boolean
  /** Enable context menu */
  CONTEXTMENU: boolean
  /** Enable double click fullscreen */
  DBCLICK_FULLSCREEN: boolean
  /** Enable mobile double click play */
  MOBILE_DBCLICK_PLAY: boolean
  /** Enable mobile click play */
  MOBILE_CLICK_PLAY: boolean
  /** Use fullscreen web in body */
  FULLSCREEN_WEB_IN_BODY: boolean
  /** Show version in console */
  LOG_VERSION: boolean
  /** Use requestAnimationFrame */
  USE_RAF: boolean
}

/**
 * Combined constants interface
 */
export interface ArtplayerConstants
  extends TimeConstants,
  UIConstants,
  PlaybackConstants,
  FeatureFlags {
  /** Player style CSS */
  STYLE: string
}
