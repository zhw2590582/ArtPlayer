import type { PlaybackNotice } from '../media/playback'
import type { Size } from './sizing'

interface MediaDimensions {
  readonly videoWidth: number
  readonly videoHeight: number
}

export interface AutoSizeHost {
  template: { $container: HTMLElement, $player: HTMLElement, $video: MediaDimensions }
  readonly width: number
  readonly height: number
  emit: (name: 'autoSize', size: Size) => unknown
}

export interface AutoHeightHost {
  template: { $container: HTMLElement, $video: MediaDimensions }
  emit: (name: 'autoHeight', height: number) => unknown
}

export interface AspectRatioHost extends PlaybackNotice {
  template: { $player: HTMLElement, $video: HTMLElement }
  emit: (name: 'aspectRatio', ratio: string) => unknown
}

export interface FlipHost extends PlaybackNotice {
  template: { $player: HTMLElement }
  emit: (name: 'flip', flip: string) => unknown
}
