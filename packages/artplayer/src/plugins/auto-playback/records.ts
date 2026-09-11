import type { SubscriptionHost } from '../../component/resources'
import { eventSubscriptions } from '../../events/subscriptions'
import { isClosing } from '../../lifecycle/instance'

export type PlaybackTimes = Record<string, number>

export interface PlaybackStorage {
  get: (key: 'times') => PlaybackTimes | null | undefined
  set: (key: 'times', value: PlaybackTimes) => void
  del: (key: 'times') => void
}

export interface PlaybackRecordHost extends SubscriptionHost<{ 'video:timeupdate': [Event] }> {
  storage: PlaybackStorage
  constructor: { AUTO_PLAYBACK_MAX: number }
  option: { id?: string, url: string }
  playing: boolean
  currentTime: number
}

export function readTimes(storage: PlaybackStorage): PlaybackTimes {
  return storage.get('times') || {}
}

export function installPlaybackRecords(art: PlaybackRecordHost): void {
  const { storage, constructor } = art
  eventSubscriptions<{ 'video:timeupdate': [Event] }>(art)('video:timeupdate', () => {
    if (!art.playing)
      return
    const times = readTimes(storage)
    const keys = Object.keys(times)
    const max = constructor.AUTO_PLAYBACK_MAX
    const key = art.option.id || art.option.url
    const time = art.currentTime
    if (isClosing(art))
      return
    // Preserve the historical strict threshold and one-oldest-entry pruning.
    if (keys.length > max)
      delete times[keys[0]!]
    times[key] = time
    if (!isClosing(art))
      storage.set('times', times)
  })
}
