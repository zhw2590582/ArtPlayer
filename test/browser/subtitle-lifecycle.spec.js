import { expect, test } from './fixtures.js'

async function setup(page, core) {
  await page.goto(`/test/player.html?core=${core}&chapter=published`)
  await page.evaluate(() => {
    const container = document.createElement('div')
    Object.assign(container.style, { width: '640px', height: '360px' })
    document.body.append(container)
    window.art = new window.Artplayer({ container, url: '/test/pattern.mp4', muted: true })
    window.subtitleRequests = new Map()
    window.subtitleURLs = []
    window.subtitleRevoked = []
    const fetchOriginal = window.fetch
    const create = URL.createObjectURL.bind(URL)
    const revoke = URL.revokeObjectURL.bind(URL)
    URL.createObjectURL = (blob) => {
      const url = create(blob)
      window.subtitleURLs.push(url)
      return url
    }
    URL.revokeObjectURL = (url) => {
      window.subtitleRevoked.push(url)
      revoke(url)
    }
    window.fetch = (url, options) => {
      if (!String(url).startsWith('/controlled-subtitle/'))
        return fetchOriginal(url, options)
      // Deliberately ignore AbortSignal: generation checks must work with custom fetch adapters.
      return new Promise((resolve, reject) => window.subtitleRequests.set(url, { resolve, reject, signal: options?.signal }))
    }
    window.completeSubtitle = (name, text) => window.subtitleRequests.get(`/controlled-subtitle/${name}.vtt`).resolve(new Response(`WEBVTT\n\n00:00:00.000 --> 00:00:07.000\n${text}\n`))
  })
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
}

for (const core of ['published', 'candidate']) {
  for (const format of ['srt', 'ass']) {
    test(`${core}: ${format} conversion reaches native cues with original callback binding`, async ({ page }) => {
      await setup(page, core)
      await page.evaluate(async (format) => {
        const art = window.art
        window.subtitleConversion = []
        const request = art.subtitle.switch('/controlled-subtitle/convert.vtt', { type: format, onVttLoad(vtt) {
          window.subtitleConversion.push({ bound: this === art.subtitle.option, vtt: vtt.startsWith('WEBVTT') })
          return vtt
        } })
        const text = format === 'srt'
          ? '1\n00:00:01,200 --> 00:00:03,400\nConverted\n'
          : '[Events]\nDialogue: 0,0:00:01.20,0:00:03.40,Default,,0,0,0,,Converted\n'
        window.subtitleRequests.get('/controlled-subtitle/convert.vtt').resolve(new Response(text))
        await request
      }, format)
      await expect.poll(() => page.evaluate(() => window.art.subtitle.cues.length)).toBe(1)
      expect(await page.evaluate(() => {
        const cue = window.art.subtitle.cues[0]
        return { text: cue.text, start: cue.startTime, end: cue.endTime, conversion: window.subtitleConversion }
      })).toEqual({ text: 'Converted', start: 1.2, end: 3.4, conversion: [{ bound: true, vtt: true }] })
      await page.evaluate(() => {
        window.art.destroy()
        for (const url of window.subtitleURLs) URL.revokeObjectURL(url)
      })
    })
  }

  test(`${core}: video fullscreen signal rebuilds track kind while retaining its URL`, async ({ page }) => {
    await setup(page, core)
    const result = await page.evaluate(async () => {
      const art = window.art
      const request = art.subtitle.switch('/controlled-subtitle/mobile-fullscreen.vtt')
      window.completeSubtitle('mobile-fullscreen', 'Mobile fullscreen branch')
      const url = await request
      const kinds = []
      // This drives the WebKit-specific signal branch; it does not emulate a physical iOS fullscreen surface.
      Object.defineProperty(art.template.$video, 'webkitDisplayingFullscreen', { configurable: true, value: true })
      art.emit('video:timeupdate')
      kinds.push(art.template.$track.kind)
      const fullscreenTrack = art.template.$track
      art.emit('video:timeupdate')
      const stable = art.template.$track === fullscreenTrack
      Object.defineProperty(art.template.$video, 'webkitDisplayingFullscreen', { configurable: true, value: false })
      art.emit('video:timeupdate')
      kinds.push(art.template.$track.kind)
      const result = { kinds, stable, sameURL: art.subtitle.url === url, notRevoked: !window.subtitleRevoked.includes(url), oldHandlerCleared: fullscreenTrack.onload === null }
      art.destroy()
      for (const item of window.subtitleURLs) URL.revokeObjectURL(item)
      return result
    })
    expect(result).toEqual({ kinds: ['subtitles', 'metadata'], stable: true, sameURL: true, notRevoked: true, oldHandlerCleared: true })
  })

  test(`${core}: subtitle remains visible through real native fullscreen`, async ({ page }, testInfo) => {
    await setup(page, core)
    await page.evaluate(async () => {
      const request = window.art.subtitle.switch('/controlled-subtitle/fullscreen.vtt')
      window.completeSubtitle('fullscreen', 'Fullscreen cue')
      await request
      window.initialSubtitleTrack = window.art.template.$track
      document.querySelector('#play').onclick = () => {
        window.art.fullscreen = true
      }
    })
    await expect.poll(() => page.evaluate(() => window.art.subtitle.cues.length)).toBe(1)
    await page.evaluate(() => {
      window.art.seek = 2
    })
    await expect.poll(() => page.evaluate(() => window.art.template.$subtitle.textContent.trim())).toBe('Fullscreen cue')
    const native = await page.evaluate(() => Boolean(document.fullscreenEnabled || document.webkitFullscreenEnabled))
    await testInfo.attach('subtitle-fullscreen-capability', { contentType: 'application/json', body: JSON.stringify({ native }) })
    expect(native, 'Desktop engine must execute native fullscreen in this test').toBe(true)
    await page.click('#play')
    await expect.poll(() => page.evaluate(() => (document.fullscreenElement || document.webkitFullscreenElement) === window.art.template.$player)).toBe(true)
    expect(await page.evaluate(() => ({ text: window.art.template.$subtitle.textContent.trim(), track: window.art.template.$track === window.initialSubtitleTrack, visible: window.art.subtitle.show }))).toEqual({ text: 'Fullscreen cue', track: true, visible: true })
    await page.evaluate(() => {
      window.art.fullscreen = false
    })
    await expect.poll(() => page.evaluate(() => !window.art.fullscreen)).toBe(true)
    await page.evaluate(() => {
      window.art.destroy()
      for (const url of window.subtitleURLs) URL.revokeObjectURL(url)
    })
  })

  test(`${core}: native subtitle cues, offset, styles and show contracts`, async ({ page }) => {
    await setup(page, core)
    await page.evaluate(async () => {
      const art = window.art
      window.subtitleLoads = []
      art.on('subtitleLoad', (cues, option) => window.subtitleLoads.push({ array: Array.isArray(cues), native: cues[0] instanceof VTTCue, sameOption: option === art.subtitle.option }))
      const request = art.subtitle.switch('/controlled-subtitle/native.vtt', { style: { color: 'red' } })
      window.completeSubtitle('native', '<b>One</b>\nTwo')
      await request
    })
    await expect.poll(() => page.evaluate(() => window.art.subtitle.cues.length)).toBe(1)
    await expect.poll(() => page.evaluate(() => window.subtitleLoads.length)).toBe(1)
    await page.evaluate(() => {
      window.art.seek = 2
    })
    await expect.poll(() => page.evaluate(() => window.art.subtitle.activeCues.length)).toBe(1)
    await page.evaluate(() => {
      window.art.subtitle.cues[0].text = '<b>One</b>\n  \nTwo'
    })
    await expect.poll(() => page.evaluate(() => {
      window.art.subtitle.update()
      return window.art.template.$subtitle.querySelectorAll('.art-subtitle-line').length
    })).toBe(2)
    const result = await page.evaluate(() => {
      const art = window.art
      const before = art.subtitle.cues[0]
      const lines = Array.from(art.template.$subtitle.querySelectorAll('.art-subtitle-line'), element => ({ text: element.textContent.trim(), group: element.dataset.group }))
      const escaped = !art.template.$subtitle.querySelector('b')
      const style = art.subtitle.style('fontSize', '22px') === art.template.$subtitle
      const color = art.template.$subtitle.style.color
      art.option.subtitle.escape = false
      art.subtitle.update()
      const raw = art.template.$subtitle.querySelector('b')?.textContent
      art.subtitleOffset = 1
      const offset = { start: before.startTime, end: before.endTime, value: art.subtitleOffset, original: before.originalStartTime, identity: before === art.subtitle.cues[0] }
      const showEvents = []
      art.on('subtitle', value => showEvents.push(value))
      art.subtitle.show = false
      art.subtitle.toggle()
      const shown = art.subtitle.show
      const result = { lines, escaped, style, color, offset, showEvents, shown, raw, loads: window.subtitleLoads }
      art.destroy()
      for (const url of window.subtitleURLs) URL.revokeObjectURL(url)
      return result
    })
    expect(result).toEqual({ lines: [{ text: '<b>One</b>', group: '0' }, { text: 'Two', group: '0' }], escaped: true, style: true, color: 'red', offset: { start: 1, end: 8, value: 1, original: 0, identity: true }, showEvents: [false, true], shown: true, raw: 'One', loads: [{ array: true, native: true, sameOption: true }] })
  })

  test(`${core}: subtitle latest request wins and cancelled calls settle`, async ({ page }) => {
    await setup(page, core)
    const result = await page.evaluate(async () => {
      const art = window.art
      const first = art.subtitle.switch('/controlled-subtitle/first.vtt', { name: 'First' })
      const second = art.subtitle.switch('/controlled-subtitle/second.vtt', { name: 'Second' })
      window.completeSubtitle('second', 'Second')
      const latest = await second
      window.completeSubtitle('first', 'First')
      const stale = await first
      const result = { winner: art.subtitle.url === latest, cancelled: stale === undefined, notice: art.template.$notice.textContent.trim(), aborted: window.subtitleRequests.get('/controlled-subtitle/first.vtt').signal?.aborted === true }
      art.destroy()
      for (const url of window.subtitleURLs) URL.revokeObjectURL(url)
      return result
    })
    expect(result).toEqual(core === 'candidate'
      ? { winner: true, cancelled: true, notice: 'Switch Subtitle: Second', aborted: true }
      : { winner: false, cancelled: false, notice: 'Switch Subtitle: First', aborted: false })
  })

  test(`${core}: subtitle pending completion cannot replace track after destroy`, async ({ page }) => {
    await setup(page, core)
    const result = await page.evaluate(async () => {
      const art = window.art
      const track = art.template.$track
      const request = art.subtitle.switch('/controlled-subtitle/late.vtt')
      art.destroy(false)
      window.completeSubtitle('late', 'Late')
      const value = await request
      const result = { unchanged: art.template.$track === track, cancelled: value === undefined, created: window.subtitleURLs.length }
      for (const url of window.subtitleURLs) URL.revokeObjectURL(url)
      return result
    })
    expect(result).toEqual(core === 'candidate' ? { unchanged: true, cancelled: true, created: 0 } : { unchanged: false, cancelled: false, created: 1 })
  })

  test(`${core}: subtitle owns generated URLs and leaves caller URLs alive`, async ({ page }) => {
    await setup(page, core)
    const result = await page.evaluate(async () => {
      const art = window.art
      const foreign = URL.createObjectURL(new Blob(['WEBVTT\n\n00:00:00.000 --> 00:00:07.000\nForeign\n'], { type: 'text/vtt' }))
      await art.subtitle.switch(foreign, { type: 'external' })
      const request = art.subtitle.switch('/controlled-subtitle/owned.vtt')
      window.completeSubtitle('owned', 'Owned')
      const owned = await request
      art.destroy()
      const result = { foreignRevoked: window.subtitleRevoked.includes(foreign), ownedRevoked: window.subtitleRevoked.includes(owned) }
      for (const url of window.subtitleURLs) URL.revokeObjectURL(url)
      return result
    })
    expect(result).toEqual(core === 'candidate' ? { foreignRevoked: false, ownedRevoked: true } : { foreignRevoked: true, ownedRevoked: false })
  })
}

test('candidate: subtitle cancellation settles before an ignored request or body finishes', async ({ page }) => {
  await setup(page, 'candidate')
  await page.evaluate(() => {
    const art = window.art
    window.cancelledSubtitles = []
    art.subtitle.switch('/controlled-subtitle/never.vtt').then(value => window.cancelledSubtitles.push(value === undefined))
    const second = art.subtitle.switch('/controlled-subtitle/body.vtt')
    second.then(value => window.cancelledSubtitles.push(value === undefined))
    window.subtitleRequests.get('/controlled-subtitle/body.vtt').resolve({ ok: true, arrayBuffer: () => new Promise((resolve) => {
      window.finishSubtitleBody = resolve
    }) })
  })
  await expect.poll(() => page.evaluate(() => typeof window.finishSubtitleBody)).toBe('function')
  await page.evaluate(() => window.art.subtitle.switch(''))
  await expect.poll(() => page.evaluate(() => window.cancelledSubtitles)).toEqual([true, true])
  expect(await page.evaluate(async () => {
    window.finishSubtitleBody(new TextEncoder().encode('WEBVTT').buffer)
    window.subtitleRequests.get('/controlled-subtitle/never.vtt').reject(new Error('obsolete transport'))
    await new Promise(resolve => setTimeout(resolve, 0))
    const count = window.subtitleURLs.length
    window.art.destroy()
    return count
  })).toBe(0)
})

test('candidate: subtitle conversion reentry preserves the newer operation and notice', async ({ page }) => {
  await setup(page, 'candidate')
  const result = await page.evaluate(async () => {
    const art = window.art
    let second
    const first = art.subtitle.switch('/controlled-subtitle/first.vtt', { name: 'Obsolete', onVttLoad(vtt) {
      second = art.subtitle.switch('/controlled-subtitle/second.vtt', { name: 'Winner' })
      window.completeSubtitle('second', 'Winner')
      return vtt
    } })
    window.completeSubtitle('first', 'Obsolete')
    const cancelled = await first
    const winner = await second
    const result = { cancelled: cancelled === undefined, winner: art.subtitle.url === winner, notice: art.template.$notice.textContent.trim(), generated: window.subtitleURLs.length }
    art.destroy()
    return result
  })
  expect(result).toEqual({ cancelled: true, winner: true, notice: 'Switch Subtitle: Winner', generated: 1 })
})

test('candidate: active subtitle errors reject, preserve track and allow a later retry', async ({ page }) => {
  await setup(page, 'candidate')
  const result = await page.evaluate(async () => {
    const art = window.art
    const initial = art.template.$track
    const error = new Error('controlled subtitle failure')
    const promise = art.subtitle.switch('/controlled-subtitle/fail.vtt')
    const failure = promise.catch(caught => caught === error)
    window.subtitleRequests.get('/controlled-subtitle/fail.vtt').reject(error)
    const rejected = await failure
    const sameTrack = art.template.$track === initial
    const notice = art.template.$notice.textContent.trim()
    const retry = art.subtitle.switch('/controlled-subtitle/retry.vtt')
    window.completeSubtitle('retry', 'Retry')
    const url = await retry
    const success = art.subtitle.url === url
    art.destroy()
    return { rejected, sameTrack, notice, success }
  })
  expect(result).toEqual({ rejected: true, sameTrack: true, notice: 'controlled subtitle failure', success: true })
})

test('candidate: subtitle HTTP failures do not become usable tracks', async ({ page }) => {
  await setup(page, 'candidate')
  const result = await page.evaluate(async () => {
    const art = window.art
    const track = art.template.$track
    const request = art.subtitle.switch('/controlled-subtitle/http.vtt').catch(error => error.message)
    window.subtitleRequests.get('/controlled-subtitle/http.vtt').resolve(new Response('not subtitles', { status: 503, statusText: 'Unavailable' }))
    const error = await request
    const result = { error, sameTrack: track === art.template.$track, created: window.subtitleURLs.length }
    art.destroy()
    return result
  })
  expect(result).toEqual({ error: 'Failed to load subtitle: 503 Unavailable', sameTrack: true, created: 0 })
})

test('candidate: disabled native tracks expose empty cue arrays without throwing', async ({ page }) => {
  await setup(page, 'candidate')
  expect(await page.evaluate(() => {
    const art = window.art
    art.subtitle.textTrack.mode = 'disabled'
    const result = [art.subtitle.cues.length, art.subtitle.activeCues.length]
    art.subtitle.update()
    art.destroy()
    return result
  })).toEqual([0, 0])
})

test('candidate: native subtitle track failure is reported and obsolete callbacks are removed', async ({ page }) => {
  await setup(page, 'candidate')
  await page.evaluate(async () => {
    const request = window.art.subtitle.switch('/controlled-subtitle/track-error.vtt', { type: 'external' })
    window.completeSubtitle('track-error', 'Not served to track')
    await request
  })
  await expect.poll(() => page.evaluate(() => window.art.template.$notice.textContent.trim())).toBe('Failed to load subtitle track')
  const result = await page.evaluate(async () => {
    const art = window.art
    const previous = art.template.$track
    const oldError = previous.onerror
    const request = art.subtitle.switch('/controlled-subtitle/recovered.vtt', { name: 'Recovered' })
    window.completeSubtitle('recovered', 'Recovered')
    await request
    oldError(new Event('error'))
    const result = { notice: art.template.$notice.textContent.trim(), callbacksCleared: previous.onload === null && previous.onerror === null }
    const current = art.template.$track
    art.destroy()
    result.destroyCleared = current.onload === null && current.onerror === null
    return result
  })
  expect(result).toEqual({ notice: 'Switch Subtitle: Recovered', callbacksCleared: true, destroyCleared: true })
})

test('candidate: constructor and URL setter failures notify without unhandled promises', async ({ page }) => {
  await setup(page, 'candidate')
  await page.evaluate(() => {
    const container = window.art.option.container
    window.art.destroy()
    const art = window.art = new window.Artplayer({ container, url: '/test/pattern.mp4', muted: true, subtitle: { url: '/controlled-subtitle/constructor.vtt' } })
    window.subtitleNoticeWrites = []
    const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(art.notice), 'show')
    Object.defineProperty(art.notice, 'show', { get: descriptor.get, set(value) {
      descriptor.set.call(this, value)
      window.subtitleNoticeWrites.push(art.template.$notice.textContent.trim())
    } })
    window.subtitleRequests.get('/controlled-subtitle/constructor.vtt').reject(new Error('constructor subtitle error'))
    window.subtitleRetry = () => {
      art.subtitle.url = '/controlled-subtitle/setter.vtt'
      window.subtitleRequests.get('/controlled-subtitle/setter.vtt').reject(new Error('setter subtitle error'))
    }
  })
  await expect.poll(() => page.evaluate(() => window.subtitleNoticeWrites)).toContain('constructor subtitle error')
  await page.evaluate(() => window.subtitleRetry())
  await expect.poll(() => page.evaluate(() => window.subtitleNoticeWrites)).toContain('setter subtitle error')
  await page.evaluate(() => window.art.destroy())
})

for (const fail of [false, true]) {
  test(`candidate: reentrant track replacement keeps the winner when outer throws=${fail}`, async ({ page }) => {
    await setup(page, 'candidate')
    const result = await page.evaluate(async (fail) => {
      const art = window.art
      const proxy = art.events.proxy
      let winner
      const failure = new Error('outer track registration failure')
      art.events.proxy = (...args) => {
        art.events.proxy = proxy
        art.subtitle.createTrack('subtitles', art.subtitle.url)
        winner = art.template.$track
        if (fail)
          throw failure
        return proxy(...args)
      }
      const promise = art.subtitle.switch('/controlled-subtitle/reentry.vtt').catch(error => error === failure)
      window.completeSubtitle('reentry', 'Reentry')
      const settled = await promise
      let updates = 0
      art.subtitle.update = () => updates++
      winner.track.dispatchEvent(new Event('cuechange'))
      const result = { winner: art.template.$track === winner, kind: winner.kind, updates, settled: fail ? settled === true : settled === undefined, live: !window.subtitleRevoked.includes(winner.src) }
      art.destroy()
      result.released = window.subtitleRevoked.includes(winner.src)
      return result
    }, fail)
    expect(result).toEqual({ winner: true, kind: 'subtitles', updates: 1, settled: true, live: true, released: true })
  })
}

test('candidate: failed track insertion restores the old live track and releases the attempted URL', async ({ page }) => {
  await setup(page, 'candidate')
  const result = await page.evaluate(async () => {
    const art = window.art
    const first = art.subtitle.switch('/controlled-subtitle/old.vtt')
    window.completeSubtitle('old', 'Old')
    const oldURL = await first
    const track = art.template.$track
    const video = art.template.$video
    const append = video.appendChild
    const failure = new Error('insert failure')
    video.appendChild = () => {
      throw failure
    }
    const attempt = art.subtitle.switch('/controlled-subtitle/failed.vtt').catch(error => error === failure)
    window.completeSubtitle('failed', 'Failed')
    const rejected = await attempt
    video.appendChild = append
    let updates = 0
    art.subtitle.update = () => updates++
    track.track.dispatchEvent(new Event('cuechange'))
    const result = { rejected, same: art.template.$track === track, attached: track.parentNode === video, updates, oldLive: !window.subtitleRevoked.includes(oldURL), newReleased: window.subtitleRevoked.includes(window.subtitleURLs[1]) }
    art.destroy()
    return result
  })
  expect(result).toEqual({ rejected: true, same: true, attached: true, updates: 1, oldLive: true, newReleased: true })
})

test('candidate: cleanup failure after track commit does not revoke the committed URL', async ({ page }) => {
  await setup(page, 'candidate')
  const result = await page.evaluate(async () => {
    const art = window.art
    const first = art.subtitle.switch('/controlled-subtitle/old.vtt')
    window.completeSubtitle('old', 'Old')
    const oldURL = await first
    const oldCleanup = art.subtitle.destroyEvent
    const remove = art.events.remove.bind(art.events)
    art.events.remove = (cleanup) => {
      remove(cleanup)
      if (cleanup === oldCleanup)
        throw new Error('old cleanup failed')
    }
    const attempt = art.subtitle.switch('/controlled-subtitle/committed.vtt').then(() => false, () => true)
    window.completeSubtitle('committed', 'Committed')
    const rejected = await attempt
    art.events.remove = remove
    const url = art.subtitle.url
    let updates = 0
    art.subtitle.update = () => updates++
    art.subtitle.textTrack.dispatchEvent(new Event('cuechange'))
    const result = { rejected, replaced: url !== oldURL, updates, oldReleased: window.subtitleRevoked.includes(oldURL), currentLive: !window.subtitleRevoked.includes(url) }
    art.destroy()
    result.released = window.subtitleRevoked.includes(url)
    return result
  })
  expect(result).toEqual({ rejected: true, replaced: true, updates: 1, oldReleased: true, currentLive: true, released: true })
})
