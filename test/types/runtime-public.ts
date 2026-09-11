/* eslint-disable ts/no-this-alias -- Assignments prove contextual callback receiver types. */
import type { PluginFactory as LegacyPluginFactory } from 'artplayer'
import type { CustomTypeHost, Events, OptionInput, PluginFactory, PluginHost, Plugins } from 'artplayer/runtime'
import chapter from 'artplayer-plugin-chapter'
import Artplayer from 'artplayer/runtime'
import LegacyRuntime from 'artplayer/runtime/legacy'

declare module 'artplayer/types' {
  interface Plugins {
    legacyRuntimeExtension?: { set: (count: number) => void }
  }
  interface Events {
    'legacy-runtime:update': [count: number]
  }
}

declare module 'artplayer/runtime/types' {
  interface Plugins {
    runtimeExtension?: { update: (count: number) => void }
  }
  interface Events {
    'runtime-extension:update': [count: number]
  }
}

const factory: PluginFactory<{ name: string, update: (count: number) => void }> = function (art) {
  const seek: undefined = this.seek
  void seek
  // @ts-expect-error A constructor factory cannot assume the registry has been assigned.
  void art.plugins.art
  return { name: 'runtimeExtension', update(count) {
    art.emit('runtime-extension:update', count)
  } }
}

const option: OptionInput = {
  container: document.createElement('div'),
  plugins: [factory, function (art) {
    const receiver: PluginHost = this
    const value: undefined = art.seek
    void [receiver, value]
    return { name: 'inline' }
  }],
  controls: [{ name: 'test', position: 'left', mounted(element) {
    const value: undefined = this.seek
    element.textContent = String(value)
  } }],
  settings: [{ html: 'Custom', onClick(item) {
    const visible: boolean = this.notice.show
    return `${item.html}: ${visible}`
  } }],
  customType: { hls(video, url, art) {
    const receiver: CustomTypeHost = this
    const value: undefined = art.forward
    void [receiver, value, video, url]
  } },
}
const art = new Artplayer(option, function (instance) {
  const receiver: Artplayer = this
  instance.plugins.runtimeExtension?.update(1)
  void receiver
})
const sync: Plugins = art.plugins.add(factory)
const async: Promise<Plugins> = art.plugins.add(async () => ({ name: 'async' }))
const inline = art.plugins.add(function (instance) {
  const receiver: Artplayer = this
  const value: undefined = instance.backward
  void [receiver, value]
  return { name: 'inlineAdd' }
})
const same: Plugins = inline
const seek: undefined = art.seek
art.seek = 2
art.seek = '2'
art.notice.show = 'Message'
const shown: boolean = art.notice.show
const pip: Element | null | boolean = art.pip
art.pip = true
const icon: HTMLElement = art.icons.play
const customIcon: HTMLElement | undefined = art.icons.customIcon
const queried: HTMLDivElement | null = art.template.query<HTMLDivElement>('.optional')
const settingItem = { name: 'precise-item', html: 'Item', marker: 1 }
const added: typeof settingItem = art.setting.add(settingItem)
const removed: void = art.setting.remove(settingItem.name)
const subtitleStyle: HTMLDivElement = art.subtitle.style({ color: 'red' })
const target = { count: 1 }
const defined: typeof target = Artplayer.utils.def(target, Symbol('count'), {
  get() { return this.count },
})
const debounced = Artplayer.utils.debounce((value: number) => value + 1, 10)
const throttled = Artplayer.utils.throttle((value: number) => value + 1, 10)
const delayed: void = debounced(1)
const limited: void = throttled(1)
const missing = art.setting.find('missing')
if (missing)
  missing.html = 'Found'
art.on('runtime-extension:update', count => count.toFixed())
art.on('subtitleAfterUpdate', cues => cues.map(cue => cue.text))
art.plugins.runtimeExtension?.update(2)
const payload: Events['runtime-extension:update'] = [1]
Artplayer.config.events.push('custom-event')
Artplayer.DEBUG = false
// @ts-expect-error defineProperty requires an object target in an installed consumer too.
Artplayer.utils.def(123, 'value', { value: 1 })

declare const legacyFactory: LegacyPluginFactory
const legacyResult: Plugins | Promise<Plugins> = art.plugins.add(legacyFactory)
art.plugins.add(chapter())
art.plugins.legacyRuntimeExtension?.set(2)
art.on('legacy-runtime:update', count => count.toFixed())
const legacyRuntime: Artplayer = new LegacyRuntime(option)
const legacyOptions = new Artplayer({ container: '#legacy', plugins: [legacyFactory] }, function (instance) {
  const value: undefined = this.seek
  const other: undefined = instance.seek
  void [value, other]
})

class Derived extends Artplayer {
  marker = true
}
const derived = new Derived(option)
const chained: Derived = derived.on('ready', () => {})

// @ts-expect-error Command properties have no getter value.
const falseSeek: number = art.seek
// @ts-expect-error New control entries require one of the three supported positions.
art.controls.add({ html: 'Missing position' })
// @ts-expect-error Unknown control positions fail runtime validation.
art.controls.add({ html: 'Wrong position', position: 'middle' })
// @ts-expect-error Synchronous registration is not a Promise.
const falsePromise: Promise<Plugins> = sync
// @ts-expect-error Getter visibility is boolean.
const falseNotice: string = art.notice.show
// @ts-expect-error Native PiP returns an element or null, while WebKit returns boolean.
const falsePip: boolean = pip
// @ts-expect-error The PiP setter takes a boolean, not the native getter's element.
art.pip = document.createElement('video')
// @ts-expect-error Icons expose wrapper elements, not their SVG input strings.
const falseIcon: string = art.icons.play
// @ts-expect-error SSR and custom query results may be absent.
const falseQuery: HTMLDivElement = art.template.query<HTMLDivElement>('.optional')
// @ts-expect-error A delayed wrapper does not return the callback's number.
const falseDelayed: number = debounced(1)
// @ts-expect-error A throttled wrapper does not return the callback's number.
const falseLimited: number = throttled(1)
// @ts-expect-error defineProperty returns its target, not a descriptor.
const falseDescriptor: PropertyDescriptor = defined
// @ts-expect-error Precise built-in events reject scalar subtitle payloads.
art.emit('subtitleAfterUpdate', 'bad')
// @ts-expect-error Augmented payloads stay checked.
art.emit('runtime-extension:update', 'bad')
// @ts-expect-error Augmented plugin methods stay checked.
art.plugins.runtimeExtension?.update('bad')
// @ts-expect-error Legacy plugin augmentation keeps its method types on the precise view.
art.plugins.legacyRuntimeExtension?.set('bad')
// @ts-expect-error Legacy event augmentation keeps its payload type on the precise view.
art.emit('legacy-runtime:update', 'bad')
// @ts-expect-error Static env was never exposed by the runtime.
void Artplayer.env
// @ts-expect-error Template html belongs to the constructor.
void art.template.html
// @ts-expect-error Missing setting entries are null, not undefined.
const falseMissing: undefined = art.setting.find('missing')
void [sync, async, same, seek, shown, payload, legacyResult, legacyRuntime, legacyOptions, chained, falseSeek, falsePromise, falseNotice, falseMissing]
void [pip, icon, customIcon, queried, added, removed, subtitleStyle, defined, delayed, limited, falsePip, falseIcon, falseQuery, falseDelayed, falseLimited, falseDescriptor]
