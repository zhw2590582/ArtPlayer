import type { Page } from '@playwright/test'
import assert from 'node:assert/strict'
import process from 'node:process'

export async function hoverProgress(page: Page, percentage: number) {
  const inner = page.locator('.art-control-progress-inner')
  if (process.env.ARTPLAYER_CHAPTER_HOVER_BASELINE !== '1')
    await inner.hover({ trial: true })
  const box = await inner.boundingBox()
  assert(box, 'Chapter progress must have a visible box')
  const x = Math.round(box.x + box.width * percentage)
  const y = box.y + box.height / 2
  await page.mouse.move(x, y)
  return { box, x, y }
}
