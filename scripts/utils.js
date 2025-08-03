import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { glob } from 'glob'

export function getProjects() {
  return glob
    .sync('packages/*')
    .sort()
    .filter(item => !item.endsWith('artplayer-template') && !item.endsWith('artplayer-vitepress'))
    .reduce((result, item) => {
      const name = item.split(/\/|\\/g).pop()
      result[name] = path.resolve(process.cwd(), item)
      return result
    }, {})
}

export function removeDir(dir) {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir)
    files.forEach((file) => {
      const curPath = path.join(dir, file)
      if (fs.statSync(curPath).isDirectory()) {
        removeDir(curPath)
      }
      else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(dir)
  }
}
