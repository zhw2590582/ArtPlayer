import type { ComponentHost } from '../../packages/artplayer/src/component/types'
import type { ControlHost } from '../../packages/artplayer/src/control/types'
import Control from '../../packages/artplayer/src/control'
import Component from '../../packages/artplayer/src/utils/component'

declare const host: ComponentHost & { extra: number }
const component = new Component(host)
const added: HTMLDivElement | undefined = component.add({ html: 42, mounted(element) {
  const extra: number = this.extra
  const div: HTMLDivElement = element
  void [extra, div]
} })
const updated: HTMLDivElement | undefined = component.update({ name: 'entry', html: 'new' })
declare const controlHost: ControlHost
const control = new Control(controlHost)
const empty: undefined = control.add({ position: 'right', html: 'entry' })
const alsoEmpty: undefined = control.update({ name: 'entry', html: 'new' })
// @ts-expect-error Control.add has always returned undefined at runtime.
const invented: HTMLDivElement = control.add({ position: 'left', html: 'entry' })
// @ts-expect-error Component indexes are numbers.
component.add({ index: 'first' })
void [added, updated, empty, alsoEmpty, invented]
