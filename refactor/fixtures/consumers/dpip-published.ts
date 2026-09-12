import Artplayer from 'artplayer'
import dpip from 'artplayer-plugin-document-pip'

const options: Parameters<typeof dpip>[0] = { width: 640, height: 360, placeholder: 'Active', fallbackToVideoPiP: true }
const art = new Artplayer({ container: '#player', url: 'video.mp4', plugins: [dpip(options)] })
const result = dpip(options)(art)
const returned: void = result.open()
result.open = () => {}
result.close = () => {}
const fake: ReturnType<ReturnType<typeof dpip>> = { name: 'artplayerPluginDocumentPip', isSupported: true, isActive: false, open() {}, close() {}, toggle() {} }
fake.isActive = true
fake.isSupported = false
const initializer: ReturnType<typeof dpip> = () => fake
const inferredInitializer = dpip(options)
const oldReplacement: typeof inferredInitializer = () => fake
void [returned, initializer, inferredInitializer, oldReplacement]
