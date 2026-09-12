import type { Input, InputAudioTrack, InputVideoTrack } from 'mediabunny'

export type TrackMode = 'auto' | 'manual'

export interface PlaybackMedia {
  input: Input
  videoTrack: InputVideoTrack | null
  audioTrack: InputAudioTrack | null
  duration: number
  isLive: boolean
  isHls: boolean
  videoMode: TrackMode
  audioMode: TrackMode
}
