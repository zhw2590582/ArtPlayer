import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Run the same public contract against each actual implementation.
import { test } from 'node:test'
import { emitterContracts } from './contracts/emitter.js'
import { loadCoreArtifact, loadPackage, loadPublishedCore } from './helpers/load.js'

const targets = [await loadPublishedCore(), { name: 'workspace', Artplayer: (await loadPackage('artplayer')).default }]
if (process.env.ARTPLAYER_TEST_CORE)
  targets.push(await loadCoreArtifact(process.env.ARTPLAYER_TEST_CORE))

for (const { name, Artplayer } of targets) {
  for (const [id, verify] of Object.entries(emitterContracts))
    test(`${id}: ${name}`, () => verify(Artplayer.Emitter))
}
