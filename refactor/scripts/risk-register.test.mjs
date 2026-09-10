import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { renderRisks, validateRisks, validateThirdParty } from './risk-register.mjs'
import { refactorDir } from './releases.mjs'

const read = name => JSON.parse(fs.readFileSync(path.join(refactorDir, name), 'utf8'))
test('Risk register rejects omitted findings, missing owners and unsupported closure', () => {
  const register = read('risks.json')
  validateRisks(register)
  assert.equal(fs.readFileSync(path.join(refactorDir, 'risk-table.md'), 'utf8').replaceAll('\r\n', '\n'), renderRisks(register))
  for (const mutate of [
    value => value.items = value.items.filter(item => item.id !== 'BASE-LIFE-04'),
    value => value.items[0].owners = ['NO-SUCH-TASK'],
    value => value.items[0].status = 'resolved',
    value => value.items[0].evidence = ['../outside-workspace'],
  ]) {
    const changed = structuredClone(register)
    mutate(changed)
    assert.throws(() => validateRisks(changed))
  }
})
test('Third-party provenance cannot silently omit copied assets, SDKs or change fingerprints', () => {
  const register = read('risks.json')
  const inventory = read('third-party.json')
  validateThirdParty(inventory, register)
  for (const mutate of [
    value => value.packages.pop(),
    value => value.vendored.pop(),
    value => value.integrations.pop(),
    value => value.vendored[0].fingerprints[0].sha256 = 'incorrect',
    value => value.packages.find(pkg => pkg.resolvedRuntimeDependencies.length).resolvedRuntimeDependencies[0].lockedVersion = '0.0.0',
  ]) {
    const changed = structuredClone(inventory)
    mutate(changed)
    assert.throws(() => validateThirdParty(changed, register))
  }
})
