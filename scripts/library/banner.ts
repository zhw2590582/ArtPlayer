import type { Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

export function getBanner(project: string, name: string, version: string): string {
  const noticeFile = path.join(project, 'THIRD_PARTY_NOTICES')
  const notices = fs.existsSync(noticeFile) ? fs.readFileSync(noticeFile, 'utf8').trim() : ''
  const noticeBlock = notices ? `\n *\n${notices.split(/\r?\n/).map(line => line.trimEnd() ? ` * ${line.trimEnd()}` : ' *').join('\n')}` : ''
  return `/*!
 * ${name}.js v${version}
 * Github: https://github.com/zhw2590582/ArtPlayer
 * (c) 2017-${new Date().getFullYear()} Harvey Zhao
 * Released under the MIT License.${noticeBlock}
 */`
}

export function bannerPlugin(name: string, banner: string): Plugin {
  return {
    name: 'add-banner-and-global',
    generateBundle(outputOptions, bundle) {
      for (const chunk of Object.values(bundle)) {
        if (chunk.type !== 'chunk')
          continue
        let code = chunk.code.replace(/`\/\*![\s\S]*?\*\/\n/g, '`')
        if (!code.startsWith('/*!'))
          code = `${banner}\n${code}`
        if (outputOptions.format === 'umd') {
          const wrapper = code.replace(/^\/\*![\s\S]*?\*\/\s*/, '').match(/^[!(\s]*function\s*\(\s*([\w$]+)\s*,\s*([\w$]+)\s*\)/)
          if (!wrapper)
            throw new Error(`Unrecognized UMD wrapper for ${name}`)
          const global = wrapper[1]
          const amd = /["']function["']\s*===?\s*typeof define\s*&&\s*define\.amd\s*\?\s*define\(([\w$]+)\)\s*:/
          if (!amd.test(code))
            throw new Error(`Unrecognized AMD branch for ${name}`)
          code = code.replace(amd, `"function"==typeof define&&define.amd?(${global}.${name}=$1(),define(function(){return ${global}.${name}})):`)
        }
        chunk.code = code
      }
    },
  }
}

export function workerBannerPlugin(): Plugin {
  return {
    name: 'remove-worker-banner',
    generateBundle(_, bundle) {
      for (const chunk of Object.values(bundle)) {
        if (chunk.type === 'chunk' && chunk.code.startsWith('/*!'))
          chunk.code = chunk.code.replace(/^\/\*![\s\S]*?\*\/\s*/, '')
      }
    },
  }
}
