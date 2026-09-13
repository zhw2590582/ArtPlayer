import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

export function ciContext(root, env = process.env) {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
  const node = fs.readFileSync(path.join(root, '.node-version'), 'utf8').trim()
  const yarn = manifest.packageManager?.replace(/^yarn@/, '')
  const playwright = manifest.devDependencies['@playwright/test']
  for (const version of [node, yarn, playwright]) assert(/^\d+\.\d+\.\d+$/.test(version), 'CI cache inputs must use exact versions')
  assert.equal(manifest.packageManager, `yarn@${yarn}`)
  const source = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim()
  const downloads = path.resolve(env.RUNNER_TEMP || path.join(root, 'refactor/.cache/downloads'))
  return {
    schemaVersion: 1,
    source,
    workflowSource: env.GITHUB_SHA || null,
    ref: env.GITHUB_REF || null,
    event: env.GITHUB_EVENT_NAME || 'local',
    run: env.GITHUB_RUN_ID || null,
    attempt: env.GITHUB_RUN_ATTEMPT || null,
    runUrl: env.GITHUB_SERVER_URL && env.GITHUB_REPOSITORY && env.GITHUB_RUN_ID ? `${env.GITHUB_SERVER_URL}/${env.GITHUB_REPOSITORY}/actions/runs/${env.GITHUB_RUN_ID}` : null,
    os: process.platform,
    arch: process.arch,
    node,
    actualNode: process.versions.node,
    yarn,
    playwright,
    yarnCache: path.join(downloads, 'artplayer-yarn-cache'),
    browserCache: path.join(downloads, 'artplayer-playwright'),
    lockSha256: createHash('sha256').update(fs.readFileSync(path.join(root, 'yarn.lock'))).digest('hex'),
  }
}

export function writeContext(root, env = process.env) {
  const context = ciContext(root, env)
  const directory = path.join(root, 'refactor/.cache/ci')
  fs.mkdirSync(directory, { recursive: true })
  fs.writeFileSync(path.join(directory, 'context.json'), `${JSON.stringify(context, null, 2)}\n`)
  for (const value of [context.yarnCache, context.browserCache]) assert(!/[\r\n]/.test(value), 'CI paths must fit one environment-file line')
  if (env.GITHUB_OUTPUT)
    fs.appendFileSync(env.GITHUB_OUTPUT, `node=${context.node}\nyarn=${context.yarn}\nplaywright=${context.playwright}\nyarn_cache=${context.yarnCache}\nbrowser_cache=${context.browserCache}\n`)
  if (env.GITHUB_ENV)
    fs.appendFileSync(env.GITHUB_ENV, `YARN_CACHE_FOLDER=${context.yarnCache}\nPLAYWRIGHT_BROWSERS_PATH=${context.browserCache}\n`)
  return context
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  console.log(JSON.stringify(writeContext(process.cwd())))
