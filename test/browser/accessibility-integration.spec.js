import { expect, test } from './fixtures.js'

async function setup(page) {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  await page.evaluate(() => {
    window.modeEvents = []
    window.art = new window.Artplayer({ container: '.player', url: '/test/pattern.mp4', muted: true, fullscreen: true, fullscreenWeb: true, pip: true })
    window.art.on('fullscreen', value => window.modeEvents.push(['fullscreen', value]))
    window.art.on('pip', value => window.modeEvents.push(['pip', value]))
  })
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
}

test('candidate: native fullscreen keyboard activation retains focus through entry and exit', async ({ page }) => {
  await setup(page)
  const trigger = page.locator('.art-control-fullscreen')
  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect.poll(() => page.evaluate(() => window.art.fullscreen)).toBe(true)
  await expect(trigger).toBeFocused()
  await expect(trigger).toHaveAttribute('aria-label', 'Exit Fullscreen')
  await page.keyboard.press('Space')
  await expect.poll(() => page.evaluate(() => window.art.fullscreen)).toBe(false)
  await expect(trigger).toBeFocused()
  await expect(trigger).toHaveAttribute('aria-label', 'Fullscreen')
  expect(await page.evaluate(() => ({ events: window.modeEvents, playing: window.art.playing }))).toEqual({ events: [['fullscreen', true], ['fullscreen', false]], playing: false })
})

test('candidate: native fullscreen external exit preserves the current in-player focus', async ({ page }) => {
  await setup(page)
  await page.locator('.art-control-fullscreen').focus()
  await page.keyboard.press('Enter')
  await expect.poll(() => page.evaluate(() => window.art.fullscreen)).toBe(true)
  const play = page.locator('.art-control-playAndPause')
  await play.focus()
  await page.evaluate(async () => {
    const exit = ['exitFullscreen', 'webkitExitFullscreen', 'webkitCancelFullScreen', 'mozCancelFullScreen', 'msExitFullscreen'].find(name => name in document)
    await document[exit]()
  })
  await expect.poll(() => page.evaluate(() => window.art.fullscreen)).toBe(false)
  await expect(play).toBeFocused()
  await page.keyboard.press('Space')
  await expect.poll(() => page.evaluate(() => window.art.playing)).toBe(true)
})

test('candidate: PiP keyboard control follows real native capability without a second playback action', async ({ page }, testInfo) => {
  await setup(page)
  const capability = await page.evaluate(() => ({
    standard: !!document.pictureInPictureEnabled && typeof window.art.video.requestPictureInPicture === 'function',
    webkit: typeof window.art.video.webkitSetPresentationMode === 'function',
  }))
  await testInfo.attach('native-pip-capability', { contentType: 'application/json', body: JSON.stringify(capability) })
  const trigger = page.locator('.art-control-pip')
  await trigger.focus()
  await page.keyboard.press('Enter')
  if (capability.standard || capability.webkit) {
    await expect.poll(() => page.evaluate(() => !!window.art.pip)).toBe(true)
    await expect(trigger).toBeFocused()
    await expect(trigger).toHaveAttribute('aria-label', 'Exit PIP Mode')
    await page.keyboard.press('Space')
    await expect.poll(() => page.evaluate(() => !!window.art.pip)).toBe(false)
    await expect(trigger).toBeFocused()
    await expect(trigger).toHaveAttribute('aria-label', 'PIP Mode')
    expect(await page.evaluate(() => window.modeEvents)).toEqual([['pip', true], ['pip', false]])
  }
  else {
    await expect(page.locator('.art-notice')).toBeVisible()
    await expect(trigger).toBeFocused()
    expect(await page.evaluate(() => !!window.art.pip)).toBe(false)
    expect(await page.evaluate(() => window.modeEvents)).toEqual([])
  }
  expect(await page.evaluate(() => window.art.playing)).toBe(false)
})

test('candidate: SSR retains native nodes while keyboard controls toggle real subtitle cues and survive fullscreen', async ({ page }, testInfo) => {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  await page.evaluate(() => {
    const container = document.querySelector('.player')
    container.innerHTML = window.Artplayer.html
    window.ssrPlayer = container.querySelector('.art-video-player')
    window.ssrVideo = container.querySelector('video')
    window.ssrSubtitle = container.querySelector('.art-subtitle')
    window.art = new window.Artplayer({
      container,
      useSSR: true,
      url: '/test/pattern.mp4',
      muted: true,
      fullscreenWeb: true,
      subtitle: { url: '/test/declaration-cues.vtt', name: 'English captions' },
      controls: [{ name: 'captions', position: 'left', html: 'Captions', click() {
        this.subtitle.show = !this.subtitle.show
      } }],
    })
  })
  await expect.poll(() => page.evaluate(() => window.art.isReady && window.art.subtitle.cues.length === 1)).toBe(true)
  const play = page.locator('.art-control-playAndPause')
  await play.focus()
  await page.keyboard.press('Space')
  await expect(page.locator('.art-subtitle-line')).toHaveText('Declaration cue')
  await page.keyboard.press('Space')
  await expect.poll(() => page.evaluate(() => window.art.playing)).toBe(false)
  const captions = page.locator('.art-control-captions')
  await captions.focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('.art-subtitle')).toBeHidden()
  await expect(captions).toBeFocused()
  await page.keyboard.press('Space')
  await expect(page.locator('.art-subtitle-line')).toBeVisible()
  await expect(captions).toBeFocused()
  const fullscreen = page.locator('.art-control-fullscreenWeb')
  await fullscreen.focus()
  await page.keyboard.press('Enter')
  await expect.poll(() => page.evaluate(() => window.art.fullscreenWeb)).toBe(true)
  await expect(fullscreen).toBeFocused()
  await expect(page.locator('.art-subtitle-line')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect.poll(() => page.evaluate(() => window.art.fullscreenWeb)).toBe(false)
  await expect(fullscreen).toBeFocused()
  expect(await page.evaluate(() => ({
    player: window.ssrPlayer === window.art.template.$player,
    video: window.ssrVideo === window.art.video,
    subtitle: window.ssrSubtitle === window.art.template.$subtitle,
    label: window.art.template.$track.label,
    focusInSubtitle: !!window.ssrSubtitle.querySelector('[tabindex],button,input'),
    live: window.ssrSubtitle.hasAttribute('aria-live'),
  }))).toEqual({ player: true, video: true, subtitle: true, label: 'English captions', focusInSubtitle: false, live: false })
  await page.locator('.art-video-player').screenshot({ path: `refactor/.cache/core23-ssr-subtitle-${testInfo.project.name}.png` })
  await page.evaluate(() => window.art.destroy(false))
  expect(await page.evaluate(() => window.ssrVideo.isConnected && window.ssrPlayer.classList.contains('art-destroy'))).toBe(true)
})
