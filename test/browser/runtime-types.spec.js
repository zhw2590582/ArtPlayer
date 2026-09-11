import { expect, test } from './fixtures.js'

for (const core of ['published', 'candidate']) {
  test(`${core}: constructor callback hosts expose only initialized components`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    const result = await page.evaluate(async () => {
      const observations = []
      const receivers = []
      const names = ['template', 'events', 'storage', 'icons', 'i18n', 'notice', 'player', 'layers', 'controls', 'contextmenu', 'subtitle', 'info', 'loading', 'hotkey', 'mask', 'setting', 'plugins']
      const record = (phase, receiver, instance) => {
        receivers.push(receiver)
        observations.push({ phase, receiver: receiver === instance, fields: names.filter(name => Object.hasOwn(instance, name)) })
      }
      let mounted
      const settingMounted = new Promise(resolve => mounted = resolve)
      let ready
      const loaded = new Promise(resolve => ready = resolve)
      const art = new window.Artplayer({
        container: '.player',
        url: '/test/pattern.mp4',
        type: 'fixture',
        muted: true,
        setting: true,
        proxy(instance) {
          record('proxy', this, instance)
          return document.createElement('video')
        },
        layers: [{ html: 'Layer', mounted() { record('layer', this, this) } }],
        controls: [{ html: 'Control', position: 'left', mounted() { record('control', this, this) } }],
        contextmenu: [{ html: 'Menu', mounted() { record('contextmenu', this, this) } }],
        settings: [{ html: 'Setting', mounted() {
          record('setting', this, this)
          mounted()
        } }],
        plugins: [function (instance) {
          record('plugin', this, instance)
          return { name: 'phases' }
        }],
        customType: { fixture(video, url, instance) {
          record('customType', this, instance)
          video.src = url
        } },
      }, function (instance) {
        record('ready', this, instance)
        ready()
      })
      try {
        await Promise.all([settingMounted, loaded])
        return { names, observations, complete: window.Artplayer.instances.includes(art), receivers: receivers.every(receiver => receiver === art) }
      }
      finally {
        art.destroy()
      }
    })
    expect(result.complete).toBe(true)
    expect(result.receivers).toBe(true)
    const expected = { proxy: 0, layer: 7, control: 8, contextmenu: 9, plugin: 16, setting: 17, customType: 17, ready: 17 }
    expect(result.observations.map(item => item.phase).sort()).toEqual(Object.keys(expected).sort())
    for (const item of result.observations) {
      expect(item.receiver).toBe(true)
      expect(item.fields, item.phase).toEqual(result.names.slice(0, expected[item.phase]))
    }
  })

  test(`${core}: container validation rejects non-div elements`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    const result = await page.evaluate(() => {
      const container = document.createElement('section')
      document.body.append(container)
      try {
        const player = new window.Artplayer({ container, url: '' })
        player.destroy()
        return 'accepted'
      }
      catch (error) {
        return error.message
      }
      finally {
        container.remove()
      }
    })
    expect(result).toBe('Unsupported container element type, only support \'div\' but got \'section\'')
  })
}

test('precise declarations: actual return values and callback receivers agree with the installed view', async ({ page }) => {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  const result = await page.evaluate(async () => {
    const Player = window.Artplayer
    const container = document.querySelector('.player')
    const callbacks = []
    let ready
    const loaded = new Promise(resolve => ready = resolve)
    const factory = function (instance) {
      callbacks.push({ same: this === instance, registryAbsent: this.plugins === undefined })
      return { name: 'precise', update(value) {
        return value
      } }
    }
    const art = new Player({
      container,
      url: '/test/pattern.mp4',
      muted: true,
      plugins: [factory, window.artplayerPluginChapter({ chapters: [{ start: 0, end: Infinity, title: 'Existing plugin' }] })],
    }, function (instance) {
      ready({ same: this === instance, inInstances: Player.instances.includes(instance) })
    })
    try {
      const readyResult = await loaded
      const sync = art.plugins.add(function (instance) {
        callbacks.push({ same: this === instance, registry: this.plugins.art === instance })
        return { name: 'sync' }
      })
      const pending = art.plugins.add(async function (instance) {
        callbacks.push({ same: this === instance, registry: this.plugins.art === instance })
        return { name: 'async' }
      })
      const asyncResult = await pending
      const item = { name: 'typed-setting', html: 'Setting' }
      const added = art.setting.add(item)
      const updated = art.setting.update({ name: item.name, html: 'Updated' })
      const control = art.controls.add({ name: 'typed-control', html: 'Control', position: 'left' })
      const style = art.subtitle.style({ color: 'white' })
      art.notice.show = 'Visible'
      const notice = art.notice.show
      art.notice.show = false
      const hidden = art.notice.show
      const pause = art.pause()
      const removed = art.setting.remove(item.name)
      return {
        ready: readyResult,
        callbacks,
        constructor: art.constructor === Player,
        optionFactory: art.option.plugins[0] === factory,
        registry: sync === art.plugins && asyncResult === art.plugins,
        promiseBranch: pending instanceof Promise && !(sync instanceof Promise),
        commandReads: ['seek', 'forward', 'backward', 'switch', 'quality'].every(name => art[name] === undefined),
        setting: added === item && updated === item && removed === undefined && art.setting.find(item.name) === null,
        control: control === undefined,
        subtitle: style === art.template.$subtitle && Array.isArray(art.subtitle.cues) && Array.isArray(art.subtitle.activeCues),
        notice: notice === true && hidden === false,
        template: art.template.$container === container && !('html' in art.template) && typeof Player.html === 'string',
        pause: pause === undefined,
        absentStatics: !('env' in Player) && !('build' in Player),
        chapter: typeof art.plugins.artplayerPluginChapter?.update === 'function',
      }
    }
    finally {
      art.destroy()
    }
  })
  expect(result).toEqual({
    ready: { same: true, inInstances: true },
    callbacks: [{ same: true, registryAbsent: true }, { same: true, registry: true }, { same: true, registry: true }],
    constructor: true,
    optionFactory: true,
    registry: true,
    promiseBranch: true,
    commandReads: true,
    setting: true,
    control: true,
    subtitle: true,
    notice: true,
    template: true,
    pause: true,
    absentStatics: true,
    chapter: true,
  })
})
