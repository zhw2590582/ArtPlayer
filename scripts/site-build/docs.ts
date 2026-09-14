import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { ownedPath } from '../documentation/files.ts'
import { stageArtifacts } from './artifacts.ts'

export class BuildExitError extends Error {
  declare readonly code: number
  constructor(code: number) {
    super(`Documentation build exited with code ${code}`)
    this.code = code
  }
}

export function yarnExecutable(): string {
  const executable = process.env.npm_execpath
  assert(
    executable && process.env.npm_config_user_agent?.split(' ')[0] === 'yarn/1.22.22',
    'Run yarn build:docs with Yarn Classic 1.22.22',
  )
  const result = spawnSync(process.execPath, [executable, '--version'], {
    encoding: 'utf8',
    windowsHide: true,
  })
  assert(
    result.status === 0 && result.stdout.trim() === '1.22.22',
    'Expected Yarn Classic 1.22.22',
  )
  return executable
}

export async function buildDocumentation(root: string): Promise<void> {
  const yarn = yarnExecutable()
  await stageArtifacts(root, 'docs', async ([stage]) => {
    assert(stage)
    await new Promise<void>((resolve, reject) => {
      const child = spawn(
        process.execPath,
        [yarn, 'run', 'build', '--outDir', stage],
        {
          cwd: ownedPath(root, 'packages/artplayer-vitepress'),
          stdio: 'inherit',
          windowsHide: true,
        },
      )
      child.once('error', reject)
      child.once('close', code =>
        code === 0 ? resolve() : reject(new BuildExitError(code ?? 1)))
    })
    assert(
      fs.existsSync(path.join(stage, 'index.html')),
      'Documentation build produced no index.html',
    )
  })
}
