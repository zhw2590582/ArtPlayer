import type { google, ImaSdk } from '@alugha/ima'
import type { Player, PlayerOptions } from '@glomex/vast-ima-player'
import type Artplayer from 'artplayer'
import type { ArtplayerPluginVastInstance, ArtplayerPluginVastOption, CompatibilityOptions, PublishedContext, RuntimeFactory, RuntimeResult, WorkspaceContext } from 'artplayer-plugin-vast/runtime'
import vast from 'artplayer-plugin-vast/runtime'

declare const art: Artplayer
declare const options: CompatibilityOptions

const registration = vast((context) => {
  const player: Player = context.imaPlayer
  const container: HTMLDivElement = context.$container
  const id: string = context.id
  const sdk: ImaSdk = context.ima
  const settings: google.ima.AdsRenderingSettings = context.adsRenderingSettings
  const playerOptions: PlayerOptions = context.playerOptions
  const self: PublishedContext = context
  context.id = id
  context.$container = container
  context.imaPlayer = player
  context.init()?.addEventListener('AdStarted', () => {})
  const urlResult: void = context.playUrl('/ad.xml', { adTagUrl: '/override.xml', custom: true })
  const responseResult: void = context.playRes('<VAST/>')
  // @ts-expect-error SDK methods retain actual vendor signatures.
  context.imaPlayer.playAds(42)
  // @ts-expect-error SDK settings are typed.
  context.adsRenderingSettings.enablePreloading = 'yes'
  // @ts-expect-error The original media element must remain an element.
  context.$container = 'container'
  // @ts-expect-error Live container is read-only in both modes.
  context.container = container
  // @ts-expect-error Terminal core destruction makes init return null.
  const initialized: Player = context.init()
  void [player, container, id, sdk, settings, playerOptions, self, urlResult, responseResult, initialized]
})

const pending: Promise<RuntimeResult> = registration(art)
// @ts-expect-error Registration is asynchronous.
const synchronous: RuntimeResult = registration(art)
pending.then((result) => {
  const name: 'artplayerPluginVast' = result.name
  const disposed: void = result.destroy()
  const migrated: ArtplayerPluginVastInstance = result
  void [name, disposed, migrated]
})
vast()
vast.default()
vast(undefined, { compatibility: 'workspace-1.2' })

vast(async (context) => {
  const self: WorkspaceContext = context
  const player: Player | null = context.imaPlayer
  const container: HTMLDivElement | null = context.$container
  const id: string | null = context.id
  context.playerOptions.autoResize = false
  context.init()?.addEventListener('AdStarted', () => {})
  // @ts-expect-error Workspace resource getters may be null.
  const nonNull: Player = context.imaPlayer
  // @ts-expect-error Workspace fields are getters without setters.
  context.imaPlayer = player
  // @ts-expect-error Workspace identifiers are getters without setters.
  context.id = 'new-id'
  // @ts-expect-error Request input remains a string.
  context.playUrl(123)
  void [self, player, container, id, nonNull]
}, { compatibility: 'workspace-1.2' })

vast((context) => {
  const player: Player | null = context.imaPlayer
  // @ts-expect-error Dynamic mode cannot promise eager allocation.
  const eager: Player = context.imaPlayer
  void [player, eager]
}, options)
const callback: ArtplayerPluginVastOption = context => context.init()
vast(callback, { compatibility: 'workspace-1.2' })
const factory: RuntimeFactory = vast.default
// @ts-expect-error Unknown compatibility mode is rejected at runtime.
vast(undefined, { compatibility: 'wrong' })
// @ts-expect-error Callback must be callable when supplied.
vast(1)
// @ts-expect-error A known workspace option cannot provide eager-only context.
vast((context: PublishedContext) => context.id, { compatibility: 'workspace-1.2' })
void [factory, synchronous]
