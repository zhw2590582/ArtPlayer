import fs from 'node:fs'
import path from 'node:path'
import { ESLint } from 'eslint'
import { glob } from 'glob'
import { generateCoreEditorDeclaration } from './editor-types.mjs'

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

  const name = baseName
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
  const pluginsTS = glob.sync('packages/artplayer-*-*/types/*.d.ts')
  const pluginFiles = []

  for (let index = 0; index < pluginsTS.length; index++) {
    const type = pluginsTS[index]
    const { name, file } = parsePluginInfo(type)
    const code = `${String(fs.readFileSync(type)).replace(reg, '')}\nexport = ${name};\nexport as namespace ${name};\n`
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
