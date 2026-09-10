import type { Option } from 'artplayer'
import Artplayer from 'artplayer'

// These legal historical declarations expose known runtime mismatches.
// Keep them compiling until a compatible, reviewed resolution exists.
const option: Option = { container: '#player', url: '' }
const requiredUrl: string = option.url
const art = new Artplayer(option)
const registration: Promise<Artplayer['plugins']> = art.plugins.add(() => ({ name: 'legacy' }))
const toggle: void = art.toggle()
const debounced: number = Artplayer.utils.debounce(() => 1, 10, {})()
const throttled: number = Artplayer.utils.throttle(() => 1, 10)()
const descriptor: void = Artplayer.utils.def({}, 'value', { value: 1 })
const updated: Artplayer['setting'] = art.setting.update({ name: 'entry', html: 'Entry' })
const removed: Artplayer['setting'] = art.setting.remove('entry')
art.on('subtitleBeforeUpdate', (cue) => {
  const historicalCue: VTTCue = cue
  void historicalCue
})
void [requiredUrl, registration, toggle, debounced, throttled, descriptor, updated, removed]
