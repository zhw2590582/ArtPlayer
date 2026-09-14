import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { ensureArchive, readMember } from './releases.mjs'

const root = fileURLToPath(new URL('../../', import.meta.url))
assert(['--write', '--check'].includes(process.argv[2]) && process.argv.length === 3, 'Use --write or --check')
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'))
const ledger = read('refactor/release-ledger.json')
const rows = []
for (const pkg of ledger.packages) {
  const baseline = read(pkg.history.file)
  const release = pkg.history.selector?.split('.').reduce((value, key) => value?.[key], baseline)
  const current = read(`packages/${pkg.name}/package.json`)
  const row = { name: pkg.name, targetVersion: pkg.targetVersion, distribution: pkg.distribution, history: pkg.history, currentDependencies: current.dependencies || {}, currentPeers: current.peerDependencies || {}, currentOptionalDependencies: current.optionalDependencies || {} }
  if (pkg.distribution === 'site') {
    const recovery = read('refactor/baselines/pages-recovery-validation.json')
    assert.equal(recovery.localRestorationPassed, true)
    assert.equal(recovery.remoteRestorationVerified, false)
    rows.push({ ...row, restore: 'Preserve the canonical old Pages ZIP and its Git-blob report; local recovery verified, remote deployment restoration still requires its own gate. npm rollback does not apply.', status: 'local-restore-verified-remote-gate-open', evidence: 'refactor/baselines/pages-recovery-validation.json', localRecovery: { commit: recovery.archive.commit, archiveSha256: recovery.archive.sha256, files: recovery.files.count } })
    continue
  }
  if (pkg.distribution === 'recovered-npm') {
    assert(release, 'Missing recovered history')
    rows.push({ ...row, restore: 'No intact historical npm tarball. Preserve a complete pre-upgrade application/artifact snapshot and verify it before any candidate deployment.', status: 'complete-rollback-artifact-required', evidence: pkg.history.file })
    continue
  }
  assert(release?.integrity && release.sha256 && release.files, `Missing frozen rollback archive: ${pkg.name}`)
  const archive = await ensureArchive(release)
  const manifest = JSON.parse(readMember(archive, 'package/package.json'))
  assert.equal(manifest.name, release.name)
  assert.equal(manifest.version, release.version)
  rows.push({
    ...row,
    previous: { name: release.name, version: release.version, tarball: release.tarball, integrity: release.integrity, sha256: release.sha256, memberCount: Object.keys(release.files).length, dependencies: manifest.dependencies || {}, peerDependencies: manifest.peerDependencies || {}, optionalDependencies: manifest.optionalDependencies || {} },
    exactDependency: { [release.name]: release.version },
    restore: pkg.distribution === 'renamed-npm'
      ? 'Restore application import code, old package name and saved lock together; npm alias alone does not restore the old export/helper surface.'
      : 'Restore the saved application manifest/lock and matching artifacts, then frozen-install the previous exact version with its tested core/plugin combination.',
    status: 'archive-verified-batch-rehearsal-required',
  })
}
assert.equal(rows.length, 22)
const result = { task: 'REL-04', source: 'refactor/release-ledger.json and frozen historical archives', registryAvailabilityRefreshed: false, mutableTagPolicy: 'Use exact versions and saved lock/artifact hashes. No latest/next/rollback tag is assumed or changed.', packages: rows }
const json = `${JSON.stringify(result, null, 2)}\n`
const dependencies = value => Object.entries(value).map(([name, version]) => `${name}@${version}`).join(', ') || '无声明'
const lines = [
  '# 逐包回退清单',
  '',
  '由 `node refactor/scripts/rollback-inventory.mjs --write` 生成；`--check` 校验同步并复核冻结 tarball 完整性。',
  '',
  '本表核对 20 份完整历史 archive 的 SHA-512/SHA-256 和 manifest。它不表示当前 registry 可用，',
  '也不表示全部包的实际回退已验收。机器清单同时保存旧/新 dependencies、peerDependencies 与精确 integrity。',
  '',
  '| 当前包 | 目标版本 | 恢复版本/对象 | 旧包运行依赖 | 恢复状态 |',
  '| --- | --- | --- | --- | --- |',
  ...rows.map(row => `| ${row.name} | ${row.targetVersion} | ${row.previous ? `${row.previous.name}@${row.previous.version}` : row.distribution === 'site' ? '已验证 Pages 产物' : '完整旧产物尚缺'} | ${row.previous ? dependencies(row.previous.dependencies) : '见原有门槛'} | ${row.status} |`),
  '',
  '每包优先恢复升级前已验证的应用代码、package.json 和 yarn.lock，再执行 `yarn install --frozen-lockfile`；',
  '离线恢复还需保存所需 tarball/依赖缓存。单独把版本改回去并重新解析依赖，不能替代已测试锁文件。',
  '外部播放器 SDK、worker/WASM、远端媒体和平台能力也要恢复对应配置，npm 依赖表不覆盖它们。',
  '',
  'iframe 必须同步恢复旧包名、CommonJS `.default`、helper 路径和应用代码；不将 npm alias 当作兼容门面。',
  'Thumbnail 完整原包缺失以及站点部署恢复仍是发布门槛。正式每批重新绑定候选和回退内容，不能直接复用早期演练结果。',
  '',
  '来源：[机器清单](baselines/rollback-inventory.json)、[维护入口](rollback-rehearsal.md)、[发布台账](release-ledger.md)。',
  '',
]
const markdown = lines.join('\n')
for (const [file, contents] of [['refactor/baselines/rollback-inventory.json', json], ['refactor/rollback-inventory.md', markdown]]) {
  if (process.argv[2] === '--write')
    fs.writeFileSync(path.join(root, file), contents)
  else
    assert.equal(fs.readFileSync(path.join(root, file), 'utf8').replaceAll('\r\n', '\n'), contents, `Stale rollback inventory: ${file}`)
}
console.log(`Rollback inventory: ${rows.length} packages, ${rows.filter(row => row.previous).length} verified historical archives, remaining batch gates retained`)
