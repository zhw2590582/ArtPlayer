import { fileURLToPath } from 'node:url'
import { hash } from '../../refactor/scripts/releases.mjs'
import { thumbnailCandidate } from '../helpers/thumbnail.js'
import { expect, test } from './fixtures.js'

const implementation = await thumbnailCandidate()
const sample = fileURLToPath(new URL('./media/thumbnail-pattern.mp4', import.meta.url))

test('Thumbnail input ownership replaces real DOM listeners and generated inputs', async ({ page }, testInfo) => {
  await page.goto('/test/player.html?core=published')
  await page.setContent('<!doctype html><div id="first" style="position:sticky"></div><div id="second" style="position:absolute"></div>')
  await page.addScriptTag({ content: implementation.code })
  await page.evaluate(() => {
    window.inputEvents = []
    window.inputTool = new window.ArtplayerToolThumbnail({ fileInput: document.querySelector('#first') })
    window.firstInput = window.inputTool.option.fileInput
    window.inputTool.on('file', file => window.inputEvents.push(file.name))
    window.inputTool.setup({ fileInput: document.querySelector('#first') })
  })
  await expect(page.locator('#first input')).toHaveCount(1)
  await page.locator('#first input').setInputFiles(sample)
  const switched = await page.evaluate(() => {
    const tool = window.inputTool
    const firstInput = window.firstInput
    const value = firstInput.value
    tool.setup({ fileInput: document.querySelector('#second') })
    firstInput.dispatchEvent(new Event('change'))
    firstInput.dispatchEvent(new Event('drop'))
    return { value, events: window.inputEvents.slice(), firstPosition: document.querySelector('#first').style.position, disconnected: !firstInput.isConnected }
  })
  expect(switched).toEqual({ value: '', events: ['thumbnail-pattern.mp4'], firstPosition: 'sticky', disconnected: true })
  await expect(page.locator('#first input')).toHaveCount(0)
  await page.locator('#second input').setInputFiles(sample)
  const result = await page.evaluate(() => {
    const tool = window.inputTool
    const input = tool.option.fileInput
    const error = new Error('expected destroyed callback')
    let notifications = 0
    tool.on('destroy', () => {
      notifications++
      throw error
    })
    let sameError = false
    try {
      tool.destroy()
    }
    catch (thrown) { sameError = thrown === error }
    tool.destroy()
    input.dispatchEvent(new Event('change'))
    input.dispatchEvent(new Event('drop'))
    tool.setup({ fileInput: document.querySelector('#first') })
    return { events: window.inputEvents, sameError, notifications, inputConnected: input.isConnected, videoConnected: tool.video.isConnected, secondPosition: document.querySelector('#second').style.position, inputs: document.querySelectorAll('input').length }
  })
  expect(result).toEqual({ events: ['thumbnail-pattern.mp4', 'thumbnail-pattern.mp4'], sameError: true, notifications: 1, inputConnected: false, videoConnected: false, secondPosition: 'absolute', inputs: 0 })
  await testInfo.attach('thumbnail-input-ownership', { contentType: 'application/json', body: JSON.stringify({ implementation: implementation.name, sha256: hash(implementation.code), scope: 'Native file input/DOM/listeners only; does not claim media decoding.', switched, result }) })
})
