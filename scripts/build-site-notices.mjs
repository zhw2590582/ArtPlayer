import assert from 'node:assert/strict'
import fs from 'node:fs'
import process from 'node:process'
import { writeOrCheckNotices } from './site-vendor/notices.ts'

assert(process.argv.slice(2).every(arg => arg === '--check'), 'Use yarn build:site-notices [--check]')
/** @type {import('./site-vendor/notices.ts').VendorManifest} */
const manifest = JSON.parse(fs.readFileSync('scripts/site-vendor/manifest.json', 'utf8'))
assert.deepEqual(manifest.groups.map(group => group.name).sort(), ['console', 'monaco-editor', 'vconsole'], 'Do not silently drop a verified site component')
assert.deepEqual(manifest.groups.filter(group => group.name !== 'console').flatMap(group => (group.components || []).map(component => component.name)).sort(), [
  '@babel/runtime',
  '@vscode/codicons',
  'copy-text-to-clipboard',
  'core-js',
  'css-loader',
  'mutation-observer',
  'regenerator-runtime',
  'style-loader',
  'svelte',
  'webpack',
], 'Do not silently drop verified bundled component attribution')
const consoleGroup = manifest.groups.find(group => group.name === 'console')
assert.deepEqual(consoleGroup?.components?.map(component => component.name).sort(), [
  '@babel/runtime',
  '@emotion/cache',
  '@emotion/core',
  '@emotion/css',
  '@emotion/hash',
  '@emotion/is-prop-valid',
  '@emotion/memoize',
  '@emotion/serialize',
  '@emotion/sheet',
  '@emotion/styled',
  '@emotion/styled-base',
  '@emotion/stylis',
  '@emotion/unitless',
  '@emotion/utils',
  '@emotion/weak-memoize',
  'chromium-string-utils',
  'console-feed',
  'emotion-theming',
  'hoist-non-react-statics',
  'is-dom',
  'is-object',
  'is-window',
  'linkifyjs',
  'object-assign',
  'parcel-bundler',
  'process',
  'prop-types',
  'react',
  'react-dom',
  'react-inspector',
  'react-is',
  'scheduler',
  'shallowequal',
  'styled-components',
  'stylis-rule-sheet',
], 'Do not silently drop verified console component attribution')
assert.equal(consoleGroup?.notices.length, 35, 'Missing reviewed console notice')
const vconsoleNotices = manifest.groups.find(group => group.name === 'vconsole')?.notices.map(notice => notice.target)
for (const name of ['LICENSE', 'MIT-LICENSE', 'ATTRIBUTION.md'])
  assert(vconsoleNotices?.includes(`docs/licenses/vconsole/${name}`), `Missing vConsole notice: ${name}`)
const count = writeOrCheckNotices(process.cwd(), manifest, process.argv.includes('--check'))
console.log(`Verified site notices: ${count} outputs; Monaco/vConsole/console inventories, embedded and other provenance gates remain open.`)
