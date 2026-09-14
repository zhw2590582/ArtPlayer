import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- This fixture exercises the repository's Node test runner.
import { test } from 'node:test'
import { verifyIframeContract } from '../refactor/scripts/iframe-contract.mjs'
import { installedPackages } from '../scripts/browser-validation/scope.ts'
import { checkFiles, checkPackages, historicalDistributionFiles, packageOptions, publishedConsumer } from '../scripts/package-check.mjs'
import { removeConsumer, runtimeConsumer } from '../scripts/package-consumer.mjs'
import { emitterContracts } from './contracts/emitter.js'
import { ambilightCandidate } from './helpers/ambilight.js'
import { autoThumbnailCandidate } from './helpers/auto-thumbnail.js'
import { browserCandidate } from './helpers/browser-candidate.js'
import { canvasCandidate } from './helpers/canvas.js'
import { dpipCandidate } from './helpers/dpip.js'
import { iframeBrowserCandidate, iframeCandidate } from './helpers/iframe.js'
import { mbCandidate } from './helpers/mediabunny.js'
import { multipleSubtitlesCandidate } from './helpers/multiple-subtitles.js'
import { vttThumbnailCandidate } from './helpers/vtt-thumbnail.js'

test('Package CLI keeps legacy defaults and prepares the same roster the browser requires', () => {
  assert.deepEqual(packageOptions([]), { release: false, include: [] })
  assert.deepEqual(packageOptions(['--release']), { release: true, include: [] })
  assert.deepEqual(packageOptions(['--include=artplayer-plugin-asr']), { release: false, include: ['artplayer-plugin-asr'] })
  assert.deepEqual(['artplayer', 'artplayer-plugin-chapter', ...packageOptions(['--browser']).include], installedPackages)
  for (const args of [['--browser', '--release'], ['--browser', '--include=artplayer-plugin-asr'], ['--broser'], ['--include='], ['--include=x,x'], ['--include=x', '--include=y'], ['--browser', '--browser']])
    assert.throws(() => packageOptions(args))
})

test('Additional browser packages cannot be mistaken for full release consumer acceptance', async () => {
  await assert.rejects(checkPackages({ release: true, include: ['artplayer-plugin-ambilight'] }), /not full release acceptance/)
})

test('Iframe installation preserves verified tool paths without inventing a renamed npm archive', async () => {
  const contract = await verifyIframeContract()
  const expected = ['package/dist/artplayer-tool-iframe.js', 'package/dist/artplayer-tool-iframe.legacy.js', 'package/dist/artplayer-tool-iframe.mjs', 'package/types/artplayer-tool-iframe.d.ts']
  assert.deepEqual(historicalDistributionFiles('artplayer-tool-iframe', contract).sort(), expected)
  assert.throws(() => historicalDistributionFiles('artplayer-unreviewed-name', contract), /renamed package/)
  for (const member of expected) {
    const file = member.replace('package/', 'packages/artplayer-tool-iframe/')
    const sources = new Map(contract.sources)
    sources.delete(file)
    assert.throws(() => historicalDistributionFiles('artplayer-tool-iframe', { ...contract, sources }), /Missing verified iframe/)
    const baseline = structuredClone(contract.baseline)
    delete baseline.source[file]
    assert.throws(() => historicalDistributionFiles('artplayer-tool-iframe', { ...contract, baseline }), /Missing .* file/)
  }
  const baseline = structuredClone(contract.baseline)
  baseline.release.name = 'artplayer-tool-iframe'
  assert.throws(() => historicalDistributionFiles('artplayer-tool-iframe', { ...contract, baseline }), /distinct published predecessor/)
})

test('Explicit installed plugin maps never fall back to source or frozen workspace', async () => {
  const keys = ['ARTPLAYER_BROWSER_ARTIFACTS', 'ARTPLAYER_AMBILIGHT_BASELINE', 'ARTPLAYER_CANVAS_BASELINE', 'ARTPLAYER_DPIP_BASELINE', 'ARTPLAYER_DPIP_ARTIFACT', 'ARTPLAYER_VTT_THUMBNAIL_BASELINE', 'ARTPLAYER_VTT_THUMBNAIL_ARTIFACT', 'ARTPLAYER_MULTIPLE_SUBTITLES_ARTIFACT']
  keys.push('ARTPLAYER_AUTO_THUMBNAIL_BASELINE', 'ARTPLAYER_AUTO_THUMBNAIL_ARTIFACT')
  keys.push('ARTPLAYER_MB_BASELINE', 'ARTPLAYER_MB_ARTIFACT')
  keys.push('ARTPLAYER_IFRAME_BASELINE', 'ARTPLAYER_IFRAME_ARTIFACT')
  const previous = Object.fromEntries(keys.map(key => [key, process.env[key]]))
  try {
    process.env.ARTPLAYER_BROWSER_ARTIFACTS = path.resolve('refactor/.cache/absent-installed-plugin-map.json')
    assert(!fs.existsSync(process.env.ARTPLAYER_BROWSER_ARTIFACTS))
    delete process.env.ARTPLAYER_AMBILIGHT_BASELINE
    delete process.env.ARTPLAYER_CANVAS_BASELINE
    delete process.env.ARTPLAYER_DPIP_BASELINE
    delete process.env.ARTPLAYER_DPIP_ARTIFACT
    delete process.env.ARTPLAYER_VTT_THUMBNAIL_BASELINE
    delete process.env.ARTPLAYER_VTT_THUMBNAIL_ARTIFACT
    delete process.env.ARTPLAYER_MULTIPLE_SUBTITLES_ARTIFACT
    delete process.env.ARTPLAYER_AUTO_THUMBNAIL_BASELINE
    delete process.env.ARTPLAYER_AUTO_THUMBNAIL_ARTIFACT
    delete process.env.ARTPLAYER_MB_BASELINE
    delete process.env.ARTPLAYER_MB_ARTIFACT
    delete process.env.ARTPLAYER_IFRAME_BASELINE
    delete process.env.ARTPLAYER_IFRAME_ARTIFACT
    await assert.rejects(iframeBrowserCandidate(), { code: 'ENOENT' })
    assert.equal((await iframeCandidate()).provenance.kind, 'source-build', 'Existing unit/history helpers do not consume the core-only map as a tool artifact')
    process.env.ARTPLAYER_IFRAME_BASELINE = '1'
    await assert.rejects(iframeBrowserCandidate(), /cannot use the frozen workspace/)
    delete process.env.ARTPLAYER_IFRAME_BASELINE
    process.env.ARTPLAYER_IFRAME_ARTIFACT = 'override.js'
    await assert.rejects(iframeBrowserCandidate(), /cannot override artplayer-tool-iframe artifact/)
    await assert.rejects(mbCandidate(), { code: 'ENOENT' })
    process.env.ARTPLAYER_MB_BASELINE = '1'
    await assert.rejects(mbCandidate(), /cannot use the frozen workspace/)
    delete process.env.ARTPLAYER_MB_BASELINE
    process.env.ARTPLAYER_MB_ARTIFACT = 'override.js'
    await assert.rejects(mbCandidate(), /cannot override artplayer-proxy-mediabunny artifact/)
    await assert.rejects(autoThumbnailCandidate(), { code: 'ENOENT' })
    process.env.ARTPLAYER_AUTO_THUMBNAIL_BASELINE = '1'
    await assert.rejects(autoThumbnailCandidate(), /cannot use the frozen workspace/)
    delete process.env.ARTPLAYER_AUTO_THUMBNAIL_BASELINE
    process.env.ARTPLAYER_AUTO_THUMBNAIL_ARTIFACT = 'override.js'
    await assert.rejects(autoThumbnailCandidate(), /cannot override artplayer-plugin-auto-thumbnail artifact/)
    for (const name of ['artplayer-plugin-hls-control', 'artplayer-plugin-dash-control', 'artplayer-plugin-asr', 'artplayer-plugin-chromecast', 'artplayer-plugin-jassub', 'artplayer-plugin-danmuku', 'artplayer-plugin-danmuku-mask']) {
      await assert.rejects(browserCandidate(name), { code: 'ENOENT' })
      await assert.rejects(browserCandidate(name, 'override.js'), new RegExp(`cannot override ${name} artifact`))
    }
    await assert.rejects(ambilightCandidate(), { code: 'ENOENT' })
    await assert.rejects(canvasCandidate(), { code: 'ENOENT' })
    await assert.rejects(dpipCandidate(), { code: 'ENOENT' })
    await assert.rejects(browserCandidate('artplayer-plugin-ads'), { code: 'ENOENT' })
    await assert.rejects(browserCandidate('artplayer-plugin-ads', 'override.js'), /cannot override artplayer-plugin-ads artifact/)
    await assert.rejects(browserCandidate('artplayer-plugin-audio-track'), { code: 'ENOENT' })
    await assert.rejects(browserCandidate('artplayer-plugin-audio-track', 'override.js'), /cannot override artplayer-plugin-audio-track artifact/)
    await assert.rejects(vttThumbnailCandidate(), { code: 'ENOENT' })
    await assert.rejects(multipleSubtitlesCandidate(), { code: 'ENOENT' })
    process.env.ARTPLAYER_VTT_THUMBNAIL_BASELINE = '1'
    await assert.rejects(vttThumbnailCandidate(), /cannot use the frozen workspace/)
    delete process.env.ARTPLAYER_VTT_THUMBNAIL_BASELINE
    process.env.ARTPLAYER_VTT_THUMBNAIL_ARTIFACT = 'override.js'
    process.env.ARTPLAYER_MULTIPLE_SUBTITLES_ARTIFACT = 'override.js'
    await assert.rejects(vttThumbnailCandidate(), /cannot override artplayer-plugin-vtt-thumbnail artifact/)
    await assert.rejects(multipleSubtitlesCandidate(), /cannot override artplayer-plugin-multiple-subtitles artifact/)
    process.env.ARTPLAYER_AMBILIGHT_BASELINE = '1'
    process.env.ARTPLAYER_CANVAS_BASELINE = '1'
    process.env.ARTPLAYER_DPIP_BASELINE = '1'
    await assert.rejects(ambilightCandidate(), /cannot use the frozen workspace/)
    await assert.rejects(canvasCandidate(), /cannot use the frozen workspace/)
    await assert.rejects(dpipCandidate(), /cannot use the frozen workspace/)
    delete process.env.ARTPLAYER_DPIP_BASELINE
    process.env.ARTPLAYER_DPIP_ARTIFACT = 'override.js'
    await assert.rejects(dpipCandidate(), /cannot override Document PiP artifact/)
  }
  finally {
    for (const key of keys) {
      if (previous[key] === undefined)
        delete process.env[key]
      else process.env[key] = previous[key]
    }
  }
})

test('Package checks reject missing files, missing wildcard exports and internal configuration', () => {
  const manifest = { name: 'fixture', main: './dist/main.js', module: './dist/main.mjs', types: './types/main.d.ts', legacy: './dist/legacy.js', exports: { '.': './dist/main.js', './lang/*': './dist/lang/*.js' } }
  const files = ['package/dist/main.js', 'package/dist/main.mjs', 'package/types/main.d.ts', 'package/dist/legacy.js', 'package/dist/lang/fr.js']
  checkFiles(manifest, files)
  for (const missing of files)
    assert.throws(() => checkFiles(manifest, files.filter(file => file !== missing)), /Missing/)
  assert.throws(() => checkFiles(manifest, [...files, 'package/tsconfig.json']), /tsconfig/)
  for (const source of ['src/internal.ts', 'public/artplayer.ts', 'node_modules/private/index.js'])
    assert.throws(() => checkFiles(manifest, [...files, `package/${source}`]), /Source\/dependencies/)
  for (const source of ['dist/internal.ts', 'dist/internal.cts', 'dist/internal.mts'])
    assert.throws(() => checkFiles(manifest, [...files, `package/${source}`]), /Authored TypeScript/)
  checkFiles(manifest, [...files, 'package/types/entry.d.cts', 'package/types/entry.d.mts'])
  assert.throws(() => checkFiles(manifest, files, ['package/dist/old.js']), /Historical/)
})

test('Actual isolated runtime rejects removed default exports and required files', async () => {
  const { dir } = await publishedConsumer()
  try {
    assert.equal(runtimeConsumer(dir, { baseline: true }).checks.length, 22 + Object.keys(emitterContracts).length)
    assert.throws(() => runtimeConsumer(dir), /Command failed/)
    const esm = path.join(dir, 'node_modules/artplayer-plugin-chapter/dist/artplayer-plugin-chapter.mjs')
    const original = fs.readFileSync(esm)
    fs.writeFileSync(esm, 'export const removedDefault = true\n')
    assert.throws(() => runtimeConsumer(dir, { baseline: true }), /Command failed/)
    fs.writeFileSync(esm, original)
    const entry = path.join(dir, 'node_modules/artplayer-plugin-chapter/dist/artplayer-plugin-chapter.js')
    fs.unlinkSync(entry)
    assert.throws(() => runtimeConsumer(dir, { baseline: true }), /Command failed/)
  }
  finally {
    removeConsumer(dir)
  }
})
