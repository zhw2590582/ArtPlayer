import { expect, test } from './fixtures.js'

for (const core of ['published', 'candidate']) {
  test(`${core}: DOM utilities preserve native tree, style and event-path behavior`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    const result = await page.evaluate(() => {
      const utils = window.Artplayer.utils
      const root = document.createElement('div')
      document.body.appendChild(root)
      const child = utils.append(root, '<span class="entry">one</span>')
      const textResult = utils.append(root, 'tail')
      utils.setStyles(child, { color: 'rgb(1, 2, 3)', width: '12.5px', display: 'inline-block' })
      const width = utils.getStyle(child, 'width')
      const selected = utils.query('.entry', root) === child && utils.queryAll('.entry', root).length === 1
      const replacement = document.createElement('b')
      const replaced = utils.replaceElement(replacement, child) === replacement
      let path = false
      root.addEventListener('click', event => path = utils.includeFromEvent(event, replacement))
      replacement.click()
      const result = { selected, textPrecedence: textResult === child, replaced, path, width, detached: child.parentNode === null, returnIdentity: utils.remove(replacement) === replacement }
      root.remove()
      return result
    })
    expect(result).toEqual({ selected: true, textPrecedence: true, replaced: true, path: true, width: 12.5, detached: true, returnIdentity: true })
  })
}

test('candidate: safe-area measurement releases the native probe after failure unlike the previous workspace implementation', async ({ page }) => {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  const results = await page.evaluate(async () => {
    const { getSafeAreaInsets: previous } = await import('/test/legacy-safe-area.js')
    const results = []
    for (const measure of [previous, window.Artplayer.utils.getSafeAreaInsets]) {
      const before = document.body.childElementCount
      const success = measure()
      const successClean = document.body.childElementCount === before
      const original = window.getComputedStyle
      const error = new Error('controlled safe-area style failure')
      let sameError = false
      window.getComputedStyle = () => {
        throw error
      }
      try {
        measure()
      }
      catch (value) {
        sameError = value === error
      }
      finally {
        window.getComputedStyle = original
      }
      const remaining = document.body.childElementCount - before
      while (document.body.childElementCount > before)
        document.body.lastElementChild.remove()
      results.push({ successClean, success, sameError, remaining })
    }
    return results
  })
  for (const result of results) {
    expect(result.successClean).toBe(true)
    expect(result.sameError).toBe(true)
    expect(Object.values(result.success).every(value => Number.isFinite(value) && value >= 0)).toBe(true)
  }
  expect(results.map(result => result.remaining)).toEqual([1, 0])
})
