import fs from 'node:fs'
import path from 'node:path'
import { glob } from 'glob'

function ensureDirExists(filePath) {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function parsePluginInfo(path) {
  const file = path.split('/').pop() || ''
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
const artplayerTS = glob.sync('packages/artplayer/types/*.d.ts')
const artplayerTSoutput = path.join('docs/assets/ts/artplayer.d.ts')

let code = ''
for (let index = 0; index < artplayerTS.length; index++) {
  const type = artplayerTS[index]
  code += `${String(fs.readFileSync(type)).replace(reg, '')}\n`
}

code.replace('export default ', '')
code += `export = Artplayer;\nexport as namespace Artplayer;\n`
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
  const allFiles = [...pluginFiles, 'artplayer.d.ts']
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
