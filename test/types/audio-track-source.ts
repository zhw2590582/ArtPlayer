import type artplayerPluginAudioTrack from 'artplayer-plugin-audio-track'
import type { RuntimeFactory } from 'artplayer-plugin-audio-track'
import factory from '../../packages/artplayer-plugin-audio-track/src/index'

const legacyContract: typeof artplayerPluginAudioTrack = factory
const runtimeContract: RuntimeFactory = factory
void [legacyContract, runtimeContract]
