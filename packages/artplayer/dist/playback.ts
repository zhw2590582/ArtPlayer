/** Accurate playback method view; assign an existing player without a runtime wrapper. */
export interface PlaybackControls {
  play: () => Promise<void>
  pause: () => void
  toggle: () => Promise<void> | void
}
