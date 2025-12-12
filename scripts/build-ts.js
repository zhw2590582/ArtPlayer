import fs from 'node:fs'
import path from 'node:path'
import { glob } from 'glob'

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
fs.writeFileSync(artplayerTSoutput, code.trim())
console.log(`✨ Built ${artplayerTSoutput}`);

(async function () {
  const pluginsTS = glob.sync('packages/artplayer-*-*/types/*.d.ts')
  for (let index = 0; index < pluginsTS.length; index++) {
    const type = pluginsTS[index]
    const { name, file } = parsePluginInfo(type)
    const code = `${String(fs.readFileSync(type)).replace(reg, '')}\nexport = ${name};\nexport as namespace ${name};\n`
    const output = path.join('docs/assets/ts', file)
    fs.writeFileSync(output, code.trim())
    console.log(`✨ Built ${output}`)
  }
})()
