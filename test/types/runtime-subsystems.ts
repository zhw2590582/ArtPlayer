import type { PluginFactory, Plugins } from '../../packages/artplayer/public/runtime/plugin'
import type { IconName, Icons, Template } from '../../packages/artplayer/public/runtime/template'
import type Artplayer from '../../packages/artplayer/src'
import type iconDefaults from '../../packages/artplayer/src/icons/defaults'

declare const source: Artplayer
const plugins: Plugins<Artplayer> = source.plugins
const sync: Plugins<Artplayer> = plugins.add(function (art) {
  // eslint-disable-next-line ts/no-this-alias -- Check the public factory's inferred receiver against the actual source instance.
  const same: Artplayer = this
  return { name: 'sync', same, art }
})
const asyncRegistry: Promise<Plugins<Artplayer>> = plugins.add(async () => ({ name: 'async' }))
declare const unknownFactory: PluginFactory<Artplayer>
const uncertain: Plugins<Artplayer> | Promise<Plugins<Artplayer>> = plugins.add(unknownFactory)
const template: Template<Artplayer> = source.template
const icons: Icons = source.icons
const icon: HTMLElement = icons.play
const customIcon: HTMLElement | undefined = icons.custom
const subtitle: HTMLDivElement | null = template.$subtitle
const query: HTMLVideoElement | null = template.query<HTMLVideoElement>('video')
// @ts-expect-error Sync registration is not a Promise.
const syncPromise: Promise<Plugins<Artplayer>> = plugins.add(() => ({ name: 'plain' }))
// @ts-expect-error Template.html belongs to the constructor, not its instance.
const instanceHtml = template.html
// @ts-expect-error Icon wrappers are not promised to be div elements.
const div: HTMLDivElement = icons.play
// @ts-expect-error Missing custom icon keys require a presence guard.
const present: HTMLElement = icons.custom
type Assert<Condition extends true> = Condition
type AllIcons = Assert<Exclude<keyof typeof iconDefaults, IconName> extends never ? true : false>
type NoInventedIcons = Assert<Exclude<IconName, keyof typeof iconDefaults> extends never ? true : false>
export type { AllIcons, NoInventedIcons }
export { asyncRegistry, customIcon, div, icon, instanceHtml, present, query, subtitle, sync, syncPromise, uncertain }
