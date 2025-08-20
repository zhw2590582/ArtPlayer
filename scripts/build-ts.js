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

/**
 * Process TypeScript definition files to create optimized output
 */
function processTypeDefinitions() {
  const importRegex = /^import.*$/gim
  const artplayerTS = glob.sync('packages/artplayer/types/*.d.ts')
  const artplayerTSoutput = path.join('docs/assets/ts/artplayer.d.ts')

  // Define the order of files for better organization
  const fileOrder = [
    'utils.d.ts',
    'events.d.ts', 
    'icons.d.ts',
    'i18n.d.ts',
    'config.d.ts',
    'cssVar.d.ts',
    'component.d.ts',
    'template.d.ts',
    'subtitle.d.ts',
    'setting.d.ts',
    'quality.d.ts',
    'player.d.ts',
    'option.d.ts',
    'constants.d.ts',
    'artplayer.d.ts'
  ]

  let code = ''
  
  // Process files in defined order
  for (const filename of fileOrder) {
    const filePath = artplayerTS.find(file => file.endsWith(filename))
    if (filePath) {
      const content = String(fs.readFileSync(filePath))
      // Remove imports and add content
      code += `${content.replace(importRegex, '').trim()}\n\n`
    }
  }

  // Add any remaining files not in the order
  for (const type of artplayerTS) {
    const filename = path.basename(type)
    if (!fileOrder.includes(filename)) {
      code += `${String(fs.readFileSync(type)).replace(importRegex, '').trim()}\n\n`
    }
  }

  // Add namespace exports
  code += `export = Artplayer;\nexport as namespace Artplayer;\n`
  
  // Clean up extra whitespace
  code = code.replace(/\n{3,}/g, '\n\n').trim()
  
  fs.writeFileSync(artplayerTSoutput, code)
  console.log(`✨ Built ${artplayerTSoutput}`)
}

// Build main artplayer definitions
processTypeDefinitions()

// Build plugin definitions
;(async function () {
  const pluginsTS = glob.sync('packages/artplayer-plugin-*/types/*.d.ts')
  for (let index = 0; index < pluginsTS.length; index++) {
    const type = pluginsTS[index]
    const { name, file } = parsePluginInfo(type)
    const code = `${String(fs.readFileSync(type)).replace(/^import.*$/gim, '')}\nexport = ${name};\nexport as namespace ${name};\n`
    const output = path.join('docs/assets/ts', file)
    fs.writeFileSync(output, code.trim())
    console.log(`✨ Built ${output}`)
  }
})()
