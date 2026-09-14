import type { InlineConfig } from 'vite'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { globSync } from 'glob'
import { build } from 'vite'
import { ownedPath } from '../documentation/files.ts'
import { stageArtifacts } from './artifacts.ts'

export function languageEntries(root: string): string[] {
  const directory = ownedPath(root, 'packages/artplayer/src/i18n')
  const entries = globSync('*.{js,ts}', {
    cwd: directory,
    ignore: ['index.{js,ts}', 'publish.{js,ts}', 'zh-cn.{js,ts}', '*.d.ts'],
  }).sort()
  assert(entries.length, 'No standalone language entries')
  const names = entries.map(entry =>
    path.basename(entry, path.extname(entry)),
  )
  assert.equal(
    new Set(names).size,
    names.length,
    'Duplicate JS/TS language entries',
  )
  return entries.map(entry => path.join(directory, entry))
}

export function languageConfig(
  entry: string,
  outDir: string,
  format: 'umd' | 'es',
): InlineConfig {
  const name = path.basename(entry, path.extname(entry))
  return {
    configFile: false,
    publicDir: false,
    logLevel: 'warn',
    build: {
      outDir,
      emptyOutDir: false,
      minify: 'esbuild',
      target: 'es2020',
      lib: {
        entry,
        name: `artplayerI18n${name.replace(/(^|-)([a-z])/g, (_match, _prefix: string, char: string) => char.toUpperCase())}`,
        formats: [format],
        fileName: () => `${name}${format === 'umd' ? '.js' : '.mjs'}`,
      },
      rollupOptions: { output: { exports: 'default' } },
    },
    define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  }
}

export async function buildLanguages(
  root: string,
  compile: (config: InlineConfig) => Promise<unknown> = build,
): Promise<void> {
  const entries = languageEntries(root)
  await stageArtifacts(root, 'i18n', async ([dist, compiled]) => {
    assert(dist && compiled)
    for (const entry of entries) {
      for (const format of ['umd', 'es'] as const)
        await compile(languageConfig(entry, dist, format))
    }
    const expected = entries
      .flatMap(entry =>
        ['.js', '.mjs'].map(
          ext => path.basename(entry, path.extname(entry)) + ext,
        ),
      )
      .sort()
    assert.deepEqual(
      fs.readdirSync(dist).sort(),
      expected,
      'Unexpected language artifact set',
    )
    for (const name of expected)
      fs.copyFileSync(path.join(dist, name), path.join(compiled, name))
  })
  console.log(
    `Built ${entries.length} standalone languages in UMD/ESM; both output directories replaced`,
  )
}
