import { expect, test } from './fixtures.js'

for (const removeHtml of [true, false]) {
  test(`candidate: proxy-time destroy cleans the mounting template with removeHtml=${removeHtml}`, async ({ page }) => {
    await page.goto('/test/player.html?core=candidate&chapter=published')
    const result = await page.evaluate((removeHtml) => {
      const { Artplayer } = window
      const container = document.createElement('div')
      document.body.append(container)
      let calls = 0
      let visibleTemplate
      let destroyedDOM
      const proxy = document.createElement('video')
      proxy.className = 'owned-by-caller'
      const art = new Artplayer({ container, url: '', proxy(owner) {
        visibleTemplate = Object.hasOwn(owner, 'template')
        owner.on('destroy', () => {
          calls++
          destroyedDOM = { nodes: container.childElementCount, retained: !!container.querySelector('.art-destroy') }
        })
        owner.destroy(removeHtml)
        return proxy
      } })
      art.destroy(!removeHtml)
      const result = {
        visibleTemplate,
        calls,
        destroyed: art.isDestroy,
        registered: Artplayer.instances.includes(art),
        hasEvents: Object.hasOwn(art, 'events'),
        nodes: container.childElementCount,
        retained: !!container.querySelector('.art-destroy'),
        destroyedDOM,
        proxyUntouched: proxy.parentNode === null && proxy.className === 'owned-by-caller',
      }
      const next = new Artplayer({ container, url: '' })
      result.reusable = Artplayer.instances.includes(next)
      next.destroy()
      return result
    }, removeHtml)
    const dom = { nodes: removeHtml ? 0 : 1, retained: !removeHtml }
    expect(result).toEqual({ visibleTemplate: false, calls: 1, destroyed: true, registered: false, hasEvents: false, ...dom, destroyedDOM: dom, proxyUntouched: true, reusable: true })
  })
}

test('candidate: player descriptor order and constructor/static surfaces match the published core', async ({ page }) => {
  const results = []
  for (const core of ['published', 'candidate']) {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    results.push(await page.evaluate(() => {
      const { Artplayer } = window
      const container = document.createElement('div')
      document.body.append(container)
      const art = new Artplayer({ container, url: '', muted: true })
      const describe = (object, names) => names.map((name) => {
        const property = Object.getOwnPropertyDescriptor(object, name)
        return [name, property.enumerable, property.configurable, property.writable ?? null, typeof property.get, typeof property.set, typeof property.value]
      })
      const properties = Object.getOwnPropertyNames(art).filter((name) => {
        const property = Object.getOwnPropertyDescriptor(art, name)
        return !property.configurable && !property.enumerable
      })
      const result = {
        arity: Artplayer.length,
        playerArity: art.player.constructor.length,
        playerKeys: Object.keys(art.player),
        descriptors: describe(art, properties),
        prototype: describe(Artplayer.prototype, Object.getOwnPropertyNames(Artplayer.prototype).filter(name => name !== 'constructor')),
        statics: describe(Artplayer, Object.getOwnPropertyNames(Artplayer).filter(name => !['length', 'name', 'prototype'].includes(name))),
        state: [art.type, art.muted, art.volume, art.currentTime, art.played, art.loaded, art.playing, art.state],
      }
      art.destroy()
      return result
    }))
  }
  expect(results[1]).toEqual(results[0])
  expect(results[1].arity).toBe(2)
  expect(results[1].playerArity).toBe(1)
  expect(results[1].playerKeys).toEqual([])
})

test('candidate: proxy-time destroy listener can mount a replacement without the old constructor overwriting it', async ({ page }) => {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  const result = await page.evaluate(() => {
    const { Artplayer } = window
    const container = document.createElement('div')
    document.body.append(container)
    let replacement
    const unused = document.createElement('video')
    const old = new Artplayer({ container, url: '', proxy(owner) {
      owner.on('destroy', () => {
        replacement = new Artplayer({ container, url: '' })
      })
      owner.destroy()
      return unused
    } })
    const result = {
      oldDestroyed: old.isDestroy,
      registry: Artplayer.instances.length === 1 && Artplayer.instances[0] === replacement,
      player: container.querySelector('.art-video-player') === replacement.template.$player,
      video: container.querySelector('video') === replacement.video,
      artId: container.dataset.artId === String(replacement.id),
      unusedDetached: unused.parentNode === null,
    }
    old.destroy()
    result.stillRegistered = Artplayer.instances.includes(replacement)
    replacement.destroy()
    return result
  })
  expect(result).toEqual({ oldDestroyed: true, registry: true, player: true, video: true, artId: true, unusedDetached: true, stillRegistered: true })
})

for (const core of ['published', 'candidate']) {
  test(`${core}: subclasses retain receiver identity, initialization timing and static inheritance`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    const result = await page.evaluate(() => {
      const { Artplayer } = window
      const container = document.createElement('div')
      document.body.append(container)
      let subclassDefaults = 0
      class Extended extends Artplayer {
        static get option() {
          subclassDefaults++
          return super.option
        }

        constructor(option, ready) {
          super(option, ready)
          this.extension = 'after-super'
        }
      }
      Extended.NOTICE_TIME = 321
      let pluginShape
      let readyShape
      const art = new Extended({ container, url: '', plugins: [function (owner) {
        pluginShape = this === owner && owner instanceof Extended && !Object.hasOwn(owner, 'extension')
        return { name: 'subclass-plugin' }
      }] }, function (owner) {
        readyShape = this === owner && owner instanceof Extended && owner.extension === 'after-super'
      })
      const chained = art.emit('ready') === art
      const result = { pluginShape, readyShape, chained, subclassDefaults, registry: Artplayer.instances.includes(art), prototype: Object.getPrototypeOf(art) === Extended.prototype, constant: art.notice.art.constructor.NOTICE_TIME, inheritedInstances: Extended.instances === Artplayer.instances }
      art.destroy()
      return result
    })
    expect(result).toEqual({ pluginShape: true, readyShape: true, chained: true, subclassDefaults: 0, registry: true, prototype: true, constant: 321, inheritedInstances: true })
  })

  test(`${core}: omitted unused SSR nodes stay nullable without an eager template rejection`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    const result = await page.evaluate(() => {
      const { Artplayer } = window
      const container = document.createElement('div')
      container.innerHTML = Artplayer.html
      container.querySelector('.art-danmuku').remove()
      document.body.append(container)
      const art = new Artplayer({ container, url: '', useSSR: true })
      const result = { missing: art.template.$danmuku === null, query: art.query('.missing-node') === null, mounted: container.querySelector('.art-video-player') === art.template.$player }
      art.destroy()
      return result
    })
    expect(result).toEqual({ missing: true, query: true, mounted: true })
  })

  test(`${core}: teardown during capability detection stops remaining player installers`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    const result = await page.evaluate(() => {
      const { Artplayer } = window
      const key = 'WebKitPlaybackTargetAvailabilityEvent'
      const previous = Object.getOwnPropertyDescriptor(window, key)
      const container = document.createElement('div')
      document.body.append(container)
      let captured
      let reads = 0
      Object.defineProperty(window, key, { configurable: true, get() {
        reads++
        if (captured && !captured.isDestroy)
          captured.destroy()
        return undefined
      } })
      try {
        const art = new Artplayer({ container, url: '', proxy(owner) {
          captured = owner
          return document.createElement('video')
        } })
        return {
          reads,
          returned: captured === art,
          destroyed: art.isDestroy,
          registered: Artplayer.instances.includes(art),
          airplay: Object.hasOwn(art, 'airplay'),
          quality: Object.hasOwn(art, 'quality'),
          thumbnails: Object.hasOwn(art, 'thumbnails'),
          controls: Object.hasOwn(art, 'controls'),
          nodes: container.childElementCount,
        }
      }
      finally {
        if (previous)
          Object.defineProperty(window, key, previous)
        else
          delete window[key]
      }
    })
    expect(result).toEqual({ reads: 1, returned: true, destroyed: true, registered: core === 'published', airplay: core === 'published', quality: core === 'published', thumbnails: core === 'published', controls: core === 'published', nodes: 0 })
  })

  test(`${core}: destroy during initial native volume assignment stops later construction`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    const result = await page.evaluate(async () => {
      const { Artplayer } = window
      const container = document.createElement('div')
      document.body.append(container)
      const calls = []
      let captured
      let thrown
      let returned
      try {
        returned = new Artplayer({
          container,
          url: '',
          proxy(art) {
            captured = art
            const video = document.createElement('video')
            const volume = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'volume')
            Object.defineProperty(video, 'volume', {
              get() { return volume.get.call(this) },
              set(value) {
                calls.push('volume')
                volume.set.call(this, value)
                if (!art.isDestroy) {
                  art.destroy()
                  calls.push('destroyed')
                }
              },
            })
            return video
          },
          layers: [{ name: 'later', html: 'later' }],
          plugins: [(art) => {
            calls.push(`plugin:${art.isDestroy}`)
            return { name: 'later' }
          }],
        })
      }
      catch (error) { thrown = error.message }
      if (!captured)
        throw new Error(`Initialization fixture did not reach proxy: ${thrown}`)
      await new Promise(resolve => setTimeout(resolve, 0))
      return {
        calls,
        thrown: thrown ?? null,
        returned: returned === captured,
        destroyed: captured.isDestroy,
        registered: Artplayer.instances.includes(captured),
        hasLayers: Object.hasOwn(captured, 'layers'),
        hasPlugins: Object.hasOwn(captured, 'plugins'),
        nodes: container.childElementCount,
        listeners: captured.events.destroyEvents.size,
      }
    })
    if (core === 'candidate') {
      expect(result).toEqual({ calls: ['volume', 'destroyed'], thrown: null, returned: true, destroyed: true, registered: false, hasLayers: false, hasPlugins: false, nodes: 0, listeners: 0 })
    }
    else {
      expect(result.calls).toContain('plugin:true')
      expect(result.registered).toBe(true)
      expect(result.hasLayers).toBe(true)
      expect(result.hasPlugins).toBe(true)
    }
  })
}
