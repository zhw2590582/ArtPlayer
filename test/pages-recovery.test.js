import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
// eslint-disable-next-line test/no-import-node-test -- Validate stale bytes and restoration ownership before directory replacement.
import test from 'node:test'
import { consumerDirectory, removeConsumer } from '../scripts/package-consumer.mjs'
import { replaceRehearsalSite, verifyRestoredTree } from '../scripts/pages/recovery.ts'

const contents = 'old'
const expected = { 'index.html': { bytes: contents.length, objectId: createHash('sha1').update(`blob ${contents.length}\0${contents}`).digest('hex') } }
test('site recovery rejects same-size corruption and incomplete preparation before replacing live files', () => {
  const run = consumerDirectory()
  try {
    const site = path.join(run, 'site')
    const prepared = path.join(run, 'prepared')
    fs.mkdirSync(site)
    fs.mkdirSync(prepared)
    fs.writeFileSync(path.join(site, 'index.html'), 'new')
    fs.writeFileSync(path.join(prepared, 'index.html'), 'bad')
    assert.throws(() => verifyRestoredTree(prepared, expected), /Git blob differs/)
    assert.throws(() => replaceRehearsalSite(run, expected), /Git blob differs/)
    assert.equal(fs.readFileSync(path.join(site, 'index.html'), 'utf8'), 'new')
    assert(!fs.existsSync(path.join(run, 'failed-site')))
    fs.writeFileSync(path.join(prepared, 'index.html'), contents)
    fs.writeFileSync(path.join(prepared, 'extra.js'), '')
    assert.throws(() => replaceRehearsalSite(run, expected), /missing or additional/)
    fs.unlinkSync(path.join(prepared, 'extra.js'))
    replaceRehearsalSite(run, expected)
    assert.equal(fs.readFileSync(path.join(site, 'index.html'), 'utf8'), 'old')
    assert.equal(fs.readFileSync(path.join(run, 'failed-site/index.html'), 'utf8'), 'new')
  }
  finally { removeConsumer(run) }
})
