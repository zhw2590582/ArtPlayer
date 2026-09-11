import type { ControlHost } from '../types'
import type ResourceScope from '../../lifecycle/scope'
import { keyboardSlider } from '../../accessibility/slider'
import { entryScope } from '../../component/resources'
import { isClosing } from '../../lifecycle/instance'
import { captureSource, getSourceScope } from '../../source/operation'
import { positionRestoration } from '../../source/restore-position'
import { secondToTime } from '../../utils'
import { controlEvents } from '../resources'

export function installProgressKeyboard(art: ControlHost, element: HTMLDivElement): void {
  const scope = entryScope(element)
  const { on } = controlEvents(art, element)
  let revision = 0
  let pending: ResourceScope | undefined
  const update = keyboardSlider(scope, element, art.i18n.get('Progress'), () => ({
    min: 0,
    max: art.duration,
    value: art.currentTime,
    step: art.constructor.SEEK_STEP,
    text: value => `${secondToTime(value)} / ${secondToTime(Number.isFinite(art.duration) && art.duration > 0 ? art.duration : 0)}`,
  }), (value) => {
    const action = ++revision
    pending?.dispose()
    const operation = scope.child()
    pending = operation
    const releaseSource = getSourceScope(art).add(() => {
      operation.dispose()
    })
    operation.add(() => {
      releaseSource()
    })
    operation.add(() => {
      if (pending === operation)
        pending = undefined
    })
    const sourceActive = captureSource(art)
    const active = () => action === revision && !operation.closed && !isClosing(art) && sourceActive()
    const position = positionRestoration(art, value, active)
    const settle = () => {
      if (!active()) {
        operation.dispose()
        return
      }
      if (position.ready()) {
        operation.dispose()
        update()
      }
    }
    for (const name of ['video:seeked', 'video:ended'] as const) {
      art.on(name, settle)
      operation.add(() => {
        art.off(name, settle)
      })
    }
    try {
      art.emit('setBar', 'played', value / art.duration)
      if (active()) {
        position.restore(() => {
          art.seek = value
        })
      }
      settle()
    }
    catch (error) {
      operation.dispose()
      throw error
    }
  })
  on('video:loadedmetadata', update)
  on('video:durationchange', update)
  on('video:emptied', update)
  on('video:timeupdate', update)
  on('video:seeking', update)
  on('video:seeked', update)
  on('video:ended', update)
}
