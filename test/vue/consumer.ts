import type Artplayer from 'artplayer'
import type { Option } from 'artplayer'
import type Player from './src/Player.vue'

type Props = InstanceType<typeof Player>['$props']
const option: Partial<Option> = { url: '/pattern.mp4' }
export const valid: Props = { option, onGetInstance: (art: Artplayer) => art.pause() }
export const optional: Props = { option: {} }
// Preserve the historical array-form emits type; do not silently narrow its listener shape.
export const oldListener: Props = { option, onGetInstance: (...args: unknown[]) => args.length }
// @ts-expect-error Option fields retain the original public types.
export const wrongOption: Props = { option: { url: 123 } }
// @ts-expect-error The wrapper requires an option object.
export const missingOption: Props = {}
declare const component: InstanceType<typeof Player>
export const publicProps: Props = component.$props
// @ts-expect-error Script setup does not expose its private player ref.
export const privateRef = component.art
