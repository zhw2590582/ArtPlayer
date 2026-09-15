import assert from 'node:assert/strict'
import fs from 'node:fs'
import process from 'node:process'
import { verifyConsoleNoticeSources } from './site-vendor/console/notices.ts'
import { verifyMonacoCoreNotices } from './site-vendor/monaco/core-origins.ts'
import { verifyMonacoDomNotices } from './site-vendor/monaco/dom-origins.ts'
import { verifyMonacoPathNotices } from './site-vendor/monaco/node-path.ts'
import { verifyMonacoLanguageNotices } from './site-vendor/monaco/notices.ts'
import { writeOrCheckNotices } from './site-vendor/notices.ts'

assert(process.argv.slice(2).every(arg => arg === '--check'), 'Use yarn build:site-notices [--check]')
/** @type {import('./site-vendor/notices.ts').VendorManifest} */
const manifest = JSON.parse(fs.readFileSync('scripts/site-vendor/manifest.json', 'utf8'))
assert.deepEqual(manifest.groups.map(group => group.name).sort(), ['console', 'monaco-editor', 'vconsole'], 'Do not silently drop a verified site component')
assert.deepEqual(manifest.groups.filter(group => group.name !== 'console').flatMap(group => (group.components || []).map(component => component.name)).sort(), [
  '@babel/runtime',
  '@vscode/codicons',
  'WinJS-derived DOM helpers (Monaco core)',
  'copy-text-to-clipboard',
  'core-js',
  'css-loader',
  'dompurify (Monaco core)',
  'glob-to-regexp (Monaco JSON fork)',
  'js-beautify (Monaco HTML embedded)',
  'jsonc-parser',
  'marked (Monaco core)',
  'mutation-observer',
  'nodejs path (Monaco core)',
  'regenerator-runtime',
  'style-loader',
  'svelte',
  'typescript (Monaco worker)',
  'vscode-css-languageservice',
  'vscode-html-languageservice',
  'vscode-json-languageservice',
  'vscode-languageserver-textdocument',
  'vscode-languageserver-types',
  'vscode-uri',
  'webpack',
], 'Do not silently drop verified bundled component attribution')
const consoleGroup = manifest.groups.find(group => group.name === 'console')
assert.deepEqual(consoleGroup?.components?.map(component => component.name).sort(), [
  '@babel/runtime',
  '@babel/runtime (react-inspector embedded)',
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
  'murmurhash-js (Gary Court)',
  'murmurhash2 (Austin Appleby)',
  'object-assign',
  'parcel-bundler',
  'process',
  'prop-types',
  'react',
  'react-dom',
  'react-inspector',
  'react-is',
  'react-pure-render (shallowequal origin)',
  'regenerator-runtime',
  'replicator (console-feed fork)',
  'scheduler',
  'shallowequal',
  'simple-html-tokenizer',
  'stackoverflow-custom-stringify',
  'styled-components',
  'stylis (Emotion fork)',
  'stylis-rule-sheet',
], 'Do not silently drop verified console component attribution')
assert.equal(consoleGroup?.notices.length, 47, 'Missing reviewed console notice')
const vconsoleNotices = manifest.groups.find(group => group.name === 'vconsole')?.notices.map(notice => notice.target)
const typeScriptNotices = manifest.groups.find(group => group.name === 'monaco-editor')?.components?.find(component => component.name === 'typescript (Monaco worker)')?.notices
assert.deepEqual(typeScriptNotices?.map(target => target.split('/').pop()).sort(), ['ATTRIBUTION.md', 'CopyrightNotice.txt', 'LICENSE.txt', 'ThirdPartyNoticeText.txt'], 'Missing TypeScript component notice')
for (const name of ['LICENSE', 'MIT-LICENSE', 'ATTRIBUTION.md'])
  assert(vconsoleNotices?.includes(`docs/licenses/vconsole/${name}`), `Missing vConsole notice: ${name}`)
verifyConsoleNoticeSources(process.cwd(), manifest)
verifyMonacoCoreNotices(process.cwd(), manifest)
verifyMonacoDomNotices(process.cwd(), manifest)
verifyMonacoPathNotices(process.cwd(), manifest)
verifyMonacoLanguageNotices(process.cwd(), manifest)
const count = writeOrCheckNotices(process.cwd(), manifest, process.argv.includes('--check'))
console.log(`Verified site notices: ${count} outputs; Monaco/vConsole/console inventories, embedded and other provenance gates remain open.`)
