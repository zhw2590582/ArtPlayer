import type { ResumePromptHost } from './auto-playback/prompt'
import type { PlaybackRecordHost } from './auto-playback/records'
import { installResumePrompt } from './auto-playback/prompt'
import { installPlaybackRecords, readTimes } from './auto-playback/records'

export type AutoPlaybackHost = ResumePromptHost & PlaybackRecordHost

export default function autoPlayback(art: AutoPlaybackHost) {
  const { storage } = art
  // Keep time recording before the prompt's first-update timer subscription.
  const installPrompt = installResumePrompt(art)
  installPlaybackRecords(art)
  installPrompt()
  return {
    name: 'auto-playback',
    get times() {
      return readTimes(storage)
    },
    clear() {
      return storage.del('times')
    },
    delete(id: string) {
      const times = readTimes(storage)
      delete times[id]
      storage.set('times', times)
      return times
    },
  }
}
