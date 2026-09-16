import assert from 'node:assert/strict'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Verify the installed VitePress renderer, not a substitute implementation.
import test from 'node:test'
import { compileScript, compileTemplate, parse } from '@vue/compiler-sfc'
import { parseHTML } from 'linkedom'
import { createMarkdownRenderer } from 'vitepress'
import { stableCodeGroups } from '../packages/artplayer-vitepress/build/markdown.ts'
import { patchSearchComponent } from '../packages/artplayer-vitepress/build/search.ts'

const group
  = '::: code-group\n\n```js [One]\nconsole.log(1)\n```\n\n```js [Two]\nconsole.log(2)\n```\n\n:::\n'

test('pinned search adapter compiles against the installed Vue component and rejects source drift', () => {
  const source = fs.readFileSync(new URL(import.meta.resolve('vitepress-plugin-search/Search.vue')), 'utf8')
  const patched = patchSearchComponent(source)
  const { descriptor, errors } = parse(patched)
  assert.deepEqual(errors, [])
  const script = compileScript(descriptor, { id: 'search-adapter' })
  const template = compileTemplate({
    source: descriptor.template.content,
    filename: 'Search.vue',
    id: 'search-adapter',
    compilerOptions: { bindingMetadata: script.bindings },
  })
  assert.deepEqual(template.errors, [])
  assert.throws(() => patchSearchComponent(`${source}\n`), /Review the search interaction adapter/)
})

test('installed VitePress random code-group IDs become stable, distinct and label-associated', async () => {
  const original = await createMarkdownRenderer(process.cwd())
  const before = original.render(group, { relativePath: 'start/i18n.md' })
  assert.notEqual(
    before,
    original.render(group, { relativePath: 'start/i18n.md' }),
  )
  stableCodeGroups(original)
  const source = `${group}\n${group}`
  const first = original.render(source, { relativePath: 'start/i18n.md' })
  assert.equal(
    first,
    original.render(source, { relativePath: 'start/i18n.md' }),
  )
  assert.notEqual(
    first,
    original.render(source, { relativePath: 'en/start/i18n.md' }),
  )
  const { document } = parseHTML(first)
  const inputs = [...document.querySelectorAll('input[type="radio"]')]
  assert.equal(inputs.length, 4)
  assert.equal(new Set(inputs.map(input => input.id)).size, 4)
  assert.equal(
    new Set(inputs.map(input => input.getAttribute('name'))).size,
    2,
  )
  for (const input of inputs)
    assert(document.querySelector(`label[for="${input.id}"]`))
  assert.equal(document.querySelectorAll('input[checked]').length, 2)
  assert.equal(document.querySelectorAll('.blocks > .active').length, 2)
})
