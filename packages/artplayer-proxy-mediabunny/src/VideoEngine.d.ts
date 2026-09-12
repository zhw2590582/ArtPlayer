import type { VideoOptions, VideoPort } from './engine-ports'

// Exact coordinator-facing port; implementation migration and frame ownership are MB-05.
declare const VideoEngine: new (options: VideoOptions) => VideoPort
export default VideoEngine
