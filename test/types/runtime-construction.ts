/* eslint-disable ts/no-this-alias -- Assignments verify callback initialization views. */
import type { ContextmenuHost, ControlHost, CustomTypeHost, LayerHost, OptionInput, PluginHost, ProxyHost } from 'artplayer/runtime'
import Artplayer from 'artplayer/runtime'

const option: OptionInput = {
  container: document.createElement('div'),
  proxy(art) {
    const host: ProxyHost = art
    const id: number = host.id
    art.on('ready', () => {})
    // @ts-expect-error Template has not returned during proxy construction.
    void art.template
    // @ts-expect-error Accessing the video getter before Template returns would throw.
    void art.video
    // @ts-expect-error Player descriptors have not been installed yet.
    art.seek = 1
    void id
    return document.createElement('video')
  },
  customType: { custom(video, url, art) {
    const host: CustomTypeHost = art
    host.seek = '1'
    const seek: undefined = host.seek
    // URL assignment defers customType until construction has finished.
    const player: object = art.player
    art.controls.show = true
    void [video, url, seek, player]
  } },
  layers: [art => ({ html: String(art.id), mounted() {
    const host: LayerHost = this
    host.seek = 1
    // @ts-expect-error Layer has not returned when its mounted callback runs.
    host.layers.show = true
  } })],
  controls: [{ position: 'left', mounted() {
    const host: ControlHost = this
    host.layers.show = true
    // @ts-expect-error Control has not returned when its mounted callback runs.
    host.controls.show = true
  } }],
  contextmenu: [{ mounted() {
    const host: ContextmenuHost = this
    host.controls.show = true
    // @ts-expect-error Contextmenu has not returned when its mounted callback runs.
    host.contextmenu.show = true
  } }],
  setting: true,
  settings: [{ html: 'Setting', mounted() {
    // Setting mounted uses a deferred callback after construction completes.
    const host: Artplayer = this
    host.setting.show = true
    host.plugins.add(() => ({ name: 'from-setting' }))
  } }],
  plugins: [function (art) {
    const host: PluginHost = art
    host.setting.show = true
    host.seek = 1
    // @ts-expect-error Registry is assigned only after constructor factories return.
    host.plugins.add(() => ({ name: 'too-early' }))
    return { name: 'construction' }
  }],
}
const art = new Artplayer(option, function (art) {
  art.seek = 2
  this.controls.show = true
  this.plugins.add(() => ({ name: 'ready' }))
})
// @ts-expect-error Only div containers satisfy the runtime element validation.
const invalidContainer: OptionInput = { container: document.createElement('section') }
// @ts-expect-error A configured proxy must return a video or media-like canvas.
const invalidProxy: OptionInput = { container: '#player', proxy: () => undefined }
void [art, invalidContainer, invalidProxy]
