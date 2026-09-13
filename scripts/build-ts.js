import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { ESLint } from 'eslint'
import { glob } from 'glob'
import compat from 'typescript-compat'
import { generateCoreEditorDeclaration } from './editor-types.mjs'
import { checkPluginEditorDeclaration, generatePluginEditorDeclaration } from './plugin-editor-types.mjs'

function ensureDirExists(filePath) {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function parsePluginInfo(pluginPath) {
  // Use path.basename to handle both Unix and Windows paths correctly
  const file = path.basename(pluginPath)
  const baseName = file.replace('.d.ts', '')

  const classNames = { 'artplayer-tool-iframe': 'ArtplayerToolIframe', 'artplayer-tool-thumbnail': 'ArtplayerToolThumbnail' }
  const name = classNames[baseName]
    ? classNames[baseName]
    : baseName
        .split('-')
        .map((word, index) =>
          index === 0 ? word : word[0].toUpperCase() + word.slice(1),
        )
        .join('')

  return { name, file }
}

const reg = /^import.*$/gim
const artplayerTSoutput = path.join('docs/assets/ts/artplayer.d.ts')
const code = generateCoreEditorDeclaration()
ensureDirExists(artplayerTSoutput)
fs.writeFileSync(artplayerTSoutput, code.trim())
console.log(`✨ Built ${artplayerTSoutput}`);

(async function () {
  const packageOf = file => path.basename(path.dirname(path.dirname(file)))
  const available = glob.sync('packages/artplayer-*-*/types/*.d.ts').filter(file => path.basename(file) === `${packageOf(file)}.d.ts`)
  const selected = process.argv.slice(2)
  for (const name of selected)
    assert(available.some(file => packageOf(file) === name), `Unknown declaration package: ${name}`)
  const pluginsTS = selected.length ? available.filter(file => selected.includes(packageOf(file))) : available
  const pluginFiles = []

  for (let index = 0; index < pluginsTS.length; index++) {
    const type = pluginsTS[index]
    const { name, file } = parsePluginInfo(type)
    const source = String(fs.readFileSync(type))
    const semanticPlugin = ['artplayerPluginVttThumbnail', 'artplayerPluginHlsControl', 'artplayerPluginAudioTrack', 'artplayerPluginDashControl', 'artplayerPluginAds', 'artplayerPluginAmbilight', 'artplayerProxyCanvas', 'artplayerProxyMediabunny', 'artplayerPluginDocumentPip', 'ArtplayerToolIframe', 'ArtplayerToolThumbnail'].includes(name)
    const localTypes = name === 'artplayerProxyMediabunny' ? { './media': fs.readFileSync(path.join(path.dirname(type), 'media.d.ts'), 'utf8') } : {}
    const code = semanticPlugin
      ? generatePluginEditorDeclaration(source, name, localTypes)
      : `${source.replace(reg, '')}\nexport = ${name};\nexport as namespace ${name};\n`
    if (semanticPlugin) {
      const core = fs.readFileSync(artplayerTSoutput, 'utf8')
      const diagnostics = [...checkPluginEditorDeclaration(code, core), ...checkPluginEditorDeclaration(code, core, '', compat)]
      if (diagnostics.length)
        throw new Error(`Invalid ${name} editor declaration: ${JSON.stringify(diagnostics)}`)
    }
    const output = path.join('docs/assets/ts', file)
    ensureDirExists(output)
    fs.writeFileSync(output, code.trim())
    console.log(`✨ Built ${output}`)
    pluginFiles.push(file)
  }

  pluginFiles.sort()
  const languageFile = 'artplayer-i18n.d.ts'
  fs.writeFileSync(path.join('docs/assets/ts', languageFile), `declare module 'artplayer/i18n/*' {\n  const language: NonNullable<Artplayer.I18n['en']>\n  export default language\n}\n`)
  const allFiles = [...pluginFiles, 'artplayer.d.ts', languageFile]
  const eslint = new ESLint({ fix: true, fixTypes: ['layout'] })
  const results = await eslint.lintFiles(allFiles.map(file => path.join('docs/assets/ts', file)))
  await ESLint.outputFixes(results)
  if (results.some(result => result.errorCount)) {
    const formatter = await eslint.loadFormatter('stylish')
    throw new Error(formatter.format(results))
  }
  if (selected.length)
    return
  const commonJsPath = path.join('docs/assets/js/common.js')
  const commonJsContent = fs.readFileSync(commonJsPath, 'utf-8')
  const newLibUris = allFiles.map(file => `'./assets/ts/${file}'`).join(',\n      ')
  const newContent = commonJsContent.replace(
    /let libUris = \[([\s\S]*?)\]/,
    `let libUris = [\n      ${newLibUris},\n    ]`,
  )
  ensureDirExists(commonJsPath)
  fs.writeFileSync(commonJsPath, newContent)
  console.log(`✨ Updated libUris in ${commonJsPath}`)
})()
