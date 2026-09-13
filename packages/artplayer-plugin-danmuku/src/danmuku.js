import { defaultOption, normalizeOption, optionChanged, optionScheme } from './config'
import { beginInput, cancelInputs, inputActive, readInput } from './input'
import DanmuWorker from './worker.js?worker&inline'

export default class Danmuku {
  constructor(art, option) {
    const { constructor, template } = art

    this.utils = constructor.utils // 工具库
    this.validator = constructor.validator // 配置校验器
    this.$danmuku = template.$danmuku // 弹幕层容器
    this.$player = template.$player // 播放器容器

    this.art = art
    this.queue = [] // 实际弹幕队列
    this.$refs = [] // 弹幕DOM节点池
    this.isStop = false // 是否停止
    this.isHide = false // 是否隐藏
    this.timer = null // 定时器
    this.index = 0 // 弹幕索引
    this.worker = null

    // 格式化后的配置项
    this.option = Danmuku.option

    // 弹幕状态池
    this.states = { wait: [], ready: [], emit: [], stop: [] }

    // 绑定公用事件
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.reset = this.reset.bind(this)
    this.resize = this.resize.bind(this)
    this.destroy = this.destroy.bind(this)

    // 配置事件可同步销毁播放器，先建立输入和销毁边界。
    inputActive(this)
    art.on('destroy', this.destroy)
    try {
      this.config(option, true)
      if (!inputActive(this))
        return

      // 创建 Web Worker, 用于计算弹幕的 top 值
      this.worker = new DanmuWorker()
    }
    catch (error) {
      art.off('destroy', this.destroy)
      cancelInputs(this)
      throw error
    }
    // 监听事件
    art.on('video:play', this.start)
    art.on('video:playing', this.start)
    art.on('video:pause', this.stop)
    art.on('video:waiting', this.stop)
    art.on('resize', this.resize)

    // 开始加载弹幕
    this.load().catch(error => console.warn('Failed to load initial danmuku:', error))
  }

  // 默认配置
  static get option() {
    return defaultOption()
  }

  // 配置校验
  static get scheme() {
    return optionScheme()
  }

  // 初始弹幕样式
  static get cssText() {
    return `
            user-select: none;
            position: absolute;
            white-space: pre;
            pointer-events: none;
            perspective: 500px;
            display: inline-block;
            will-change: transform;
            font-weight: normal;
            line-height: 1.125;
            visibility: hidden;
            font-family: SimHei, "Microsoft JhengHei", Arial, Helvetica, sans-serif;
            text-shadow: rgb(0, 0, 0) 1px 0px 1px, rgb(0, 0, 0) 0px 1px 1px, rgb(0, 0, 0) 0px -1px 1px, rgb(0, 0, 0) -1px 0px 1px;
        `
  }

  // 是否在移动端使用了自动旋屏，会影响弹幕的left和top值
  get isRotate() {
    return this.art.plugins?.autoOrientation?.state
  }

  // 计算上空白边距
  get marginTop() {
    const { clamp } = this.utils
    const value = this.option.margin[0]
    const { clientHeight } = this.$player

    if (typeof value === 'number') {
      return clamp(value, 0, clientHeight)
    }

    if (typeof value === 'string' && value.endsWith('%')) {
      const ratio = Number.parseFloat(value) / 100
      return clamp(clientHeight * ratio, 0, clientHeight)
    }

    return Danmuku.option.margin[0]
  }

  // 计算下空白边距
  get marginBottom() {
    const { clamp } = this.utils
    const value = this.option.margin[1]
    const { clientHeight } = this.$player

    if (typeof value === 'number') {
      return clamp(value, 0, clientHeight)
    }

    if (typeof value === 'string' && value.endsWith('%')) {
      const ratio = Number.parseFloat(value) / 100
      return clamp(clientHeight * ratio, 0, clientHeight)
    }

    return Danmuku.option.margin[1]
  }

  // 计算弹幕字体大小
  get fontSize() {
    const { clamp } = this.utils
    const { clientHeight } = this.$player

    const fontSize = this.option.fontSize

    if (typeof fontSize === 'number') {
      return Math.round(clamp(fontSize, 12, clientHeight))
    }

    if (typeof fontSize === 'string' && fontSize.endsWith('%')) {
      const ratio = Number.parseFloat(fontSize) / 100
      return Math.round(clamp(clientHeight * ratio, 12, clientHeight))
    }

    return Danmuku.option.fontSize
  }

  // 获取弹幕DOM节点
  get $ref() {
    const $ref = this.$refs.pop() || document.createElement('div')
    $ref.style.cssText = Danmuku.cssText
    $ref.dataset.mode = ''
    $ref.dataset.id = ''
    $ref.className = ''
    return $ref
  }

  // 获取准备好发送的弹幕
  get readys() {
    const { currentTime } = this.art

    const result = []

    // 有的是ready状态：之前因为弹幕太多而暂停发送的弹幕
    this.filter('ready', danmu => result.push(danmu))

    // 有的是wait状态：符合时间范围的弹幕
    this.filter('wait', (danmu) => {
      if (currentTime + 0.1 >= danmu.time && danmu.time >= currentTime - 0.1) {
        result.push(danmu)
      }
    })

    return result
  }

  // 可见的弹幕的数据，用于计算下一个弹幕的top值
  get visibles() {
    const result = []
    const { clientWidth } = this.$player
    const clientLeft = this.getLeft(this.$player)

    this.filter('emit', (danmu) => {
      const top = danmu.$ref.offsetTop
      const left = this.getLeft(danmu.$ref) - clientLeft
      const height = danmu.$ref.clientHeight
      const width = danmu.$ref.clientWidth
      const distance = left + width
      const right = clientWidth - distance
      const speed = distance / danmu.$restTime

      const emit = {}
      emit.top = top
      emit.left = left
      emit.height = height
      emit.width = width
      emit.right = right
      emit.speed = speed
      emit.distance = distance
      emit.time = danmu.$restTime
      emit.mode = danmu.mode

      result.push(emit)
    })

    return result
  }

  // 计算弹幕速度
  get speed() {
    return this.option.synchronousPlayback && this.art.playbackRate
      ? this.option.speed / Number(this.art.playbackRate)
      : this.option.speed
  }

  // 加载弹幕
  async load(danmuku) {
    const { errorHandle } = this.utils
    const task = beginInput(this, danmuku === undefined)

    try {
      if (!task.active())
        return this
      const target = danmuku || this.option.danmuku
      const input = readInput(target, task)
      // 数组在第一次 await 前提交，空数组的 loaded 保持同步。
      const danmus = input.asynchronous ? await task.wait(input.value) : input.value
      if (!task.active())
        return this

      errorHandle(Array.isArray(danmus), 'Danmuku need return an array as result')

      // 假如没有传入弹幕参数，则清空弹幕，否则追加弹幕
      if (danmuku === undefined) {
        this.reset() // 重置弹幕
        if (!task.active())
          return this
        this.queue = [] // 清空弹幕队列
        this.states = { wait: [], ready: [], emit: [], stop: [] } // 清空弹幕状态池
        this.$refs = [] // 清空弹幕DOM节点池
        this.$danmuku.textContent = '' // 清空弹幕层
      }

      // 逐个验证原始弹幕并转换到弹幕队列
      for (let index = 0; index < danmus.length; index++) {
        if (!task.active())
          return this
        const danmu = danmus[index]
        await task.emit(danmu)
      }

      if (task.active())
        this.art.emit('artplayerPluginDanmuku:loaded', this.queue)
    }
    catch (error) {
      if (!task.active())
        return this
      this.art.emit('artplayerPluginDanmuku:error', error)
      throw error
    }
    finally {
      task.finish()
    }

    return this
  }

  // 把原始弹幕转换到弹幕队列
  async emit(danmu) {
    const { clamp } = this.utils
    if (!inputActive(this))
      return this

    this.validator(danmu, {
      id: '?string', // 弹幕唯一标识
      text: 'string', // 弹幕文本
      mode: '?number', // 弹幕模式: 0: 滚动，1: 顶部，2: 底部
      color: '?string', // 弹幕颜色
      time: '?number', // 弹幕时间
      border: '?boolean', // 弹幕是否有边框
      style: '?object', // 弹幕额外样式
    })

    // 弹幕文本为空则直接忽略
    if (!danmu.text.trim())
      return this

    // 设置弹幕时间，如果没有则默认为当前时间加 0.5 秒
    if (danmu.time !== undefined) {
      danmu.time = clamp(danmu.time, 0, Infinity)
    }
    else {
      danmu.time = this.art.currentTime + 0.5
    }

    // 设置弹幕模式，如果没有则默认为全局配置
    if (danmu.mode === undefined) {
      danmu.mode = this.option.mode
    }

    // 设置弹幕单独样式，如果没有则默认为空对象
    if (danmu.style === undefined) {
      danmu.style = {}
    }

    // 设置弹幕颜色，如果没有则默认为全局配置
    if (danmu.color === undefined) {
      danmu.color = this.option.color
    }

    // 弹幕模式只能是 0, 1, 2
    if (![0, 1, 2].includes(danmu.mode))
      return this

    // 自定义弹幕过滤函数
    if (!this.option.filter(danmu))
      return this
    if (!inputActive(this))
      return this

    // 添加自定义属性
    const item = {
      ...danmu,
      $state: 'wait', // 弹幕初始状态
      $index: this.index++, // 弹幕索引
      $ref: null, // 弹幕 DOM 节点
      $restTime: 0, // 弹幕剩余时间
      $lastStartTime: 0, // 弹幕上次开始时间
    }

    // 转换为wait状态
    this.setState(item, 'wait')

    // 添加到实际弹幕队列
    this.queue.push(item)

    // 弹幕有四个状态：
    // - wait: 弹幕还未开始显示，没有被添加到 DOM 中
    // - ready: 弹幕准备好显示，没有被添加到 DOM 中
    // - emit: 弹幕正在显示，已经被添加到 DOM 中
    // - stop: 弹幕正在停止显示，已经被添加到 DOM 中

    return this
  }

  // 动态配置
  config(option, isInit = false) {
    const { clamp } = this.utils
    const { $controlsCenter } = this.art.template

    // 判断配置项是否有变化
    const changed = optionChanged(this.option, option)

    // 没有变化则直接返回
    if (!changed && !isInit)
      return this

    // 更新配置项
    const next = normalizeOption(this.option, option, {
      defaults: Danmuku.option,
      validate: value => this.validator(value, Danmuku.scheme),
      clamp,
      mount: $controlsCenter,
    })
    if (!inputActive(this))
      return this
    this.option = next

    // 动态配置有字体大小，需要重新渲染
    if (option.fontSize) {
      this.reset()
      if (!inputActive(this))
        return this
    }

    // 通过配置项控制弹幕的显示和隐藏
    if (this.option.visible) {
      this.show()
    }
    else {
      this.hide()
    }

    if (inputActive(this))
      this.art.emit('artplayerPluginDanmuku:config', this.option)

    return this
  }

  // 计算DOM的left值，受到旋屏影响
  getLeft($ref) {
    const rect = $ref.getBoundingClientRect()
    return this.isRotate ? rect.top : rect.left
  }

  // 复杂运算交给 Web Worker 处理
  postMessage(message = {}) {
    return new Promise((resolve) => {
      message.id = Date.now() // 生成唯一标识
      this.worker.postMessage(message)
      this.worker.onmessage = (event) => {
        const { data } = event
        // 判断是否是当前的消息
        if (data.id === message.id) {
          resolve(data)
        }
      }
    })
  }

  // 根据状态获取弹幕
  filter(state, callback) {
    const danmus = this.states[state] || []
    for (let index = 0; index < danmus.length; index++) {
      callback(danmus[index])
    }
    return danmus
  }

  // 设置弹幕状态
  setState(danmu, state) {
    // 从原状态池中删除
    this.states[danmu.$state] = this.states[danmu.$state].filter(item => item !== danmu)

    // 设置新状态
    danmu.$state = state

    // 设置DOM节点状态
    if (danmu.$ref) {
      danmu.$ref.dataset.state = state
    }

    // 添加到新状态池中
    this.states[state].push(danmu)
  }

  // 重置弹幕到wait状态，回收弹幕DOM节点
  makeWait(danmu) {
    this.setState(danmu, 'wait')
    if (danmu.$ref) {
      danmu.$ref.style.cssText = Danmuku.cssText
      danmu.$ref.style.visibility = 'hidden'
      danmu.$ref.style.marginLeft = '0px'
      danmu.$ref.style.transform = 'translateX(0px)'
      danmu.$ref.style.transition = 'transform 0s linear 0s'
      this.$refs.push(danmu.$ref)
      danmu.$ref = null
    }
  }

  // 实时更新弹幕
  update() {
    const { setStyles } = this.utils

    this.timer = window.requestAnimationFrame(async () => {
      if (this.art.playing && !this.isHide) {
        // 实时计算弹幕的剩余显示时间
        this.filter('emit', (danmu) => {
          const emitTime = (Date.now() - danmu.$lastStartTime) / 1000
          danmu.$restTime -= emitTime
          danmu.$lastStartTime = Date.now()
          // 超过时间即重置弹幕
          if (danmu.$restTime <= 0) {
            this.makeWait(danmu)
          }
        })

        // 获取准备好发送的弹幕，可能包含ready和wait状态的弹幕
        const readys = this.readys

        for (let index = 0; index < readys.length; index++) {
          const danmu = readys[index]

          // 弹幕发送前的过滤器
          const state = await this.option.beforeVisible(danmu)

          if (state) {
            const { clientWidth, clientHeight } = this.$player
            danmu.$ref = this.$ref // 获取弹幕DOM节点
            danmu.$ref.textContent = danmu.text // 设置弹幕文本

            // 提前添加到弹幕层中，用于计算top值
            this.$danmuku.appendChild(danmu.$ref)

            // 设置初始弹幕样式
            danmu.$ref.style.opacity = this.option.opacity
            danmu.$ref.style.fontSize = `${this.fontSize}px`
            danmu.$ref.style.color = danmu.color
            danmu.$ref.style.border = danmu.border ? `1px solid ${danmu.color}` : null
            danmu.$ref.style.backgroundColor = danmu.border ? 'rgb(0 0 0 / 50%)' : null

            // 设置单独弹幕样式
            setStyles(danmu.$ref, danmu.style)

            // 记录弹幕时间戳
            danmu.$lastStartTime = Date.now()

            // 计算弹幕剩余时间
            danmu.$restTime = this.speed

            // 计算弹幕滚动的距离
            const distance = clientWidth + danmu.$ref.clientWidth

            // 计算弹幕的top值
            const { result: top } = await this.postMessage({
              type: 'getDanmuTop',
              target: {
                mode: danmu.mode,
                height: danmu.$ref.clientHeight,
                speed: distance / danmu.$restTime,
              }, // 当前弹幕信息
              visibles: this.visibles, // 可见的弹幕的数据
              antiOverlap: this.option.antiOverlap,
              clientWidth,
              clientHeight,
              marginBottom: this.marginBottom,
              marginTop: this.marginTop,
            })

            if (danmu.$ref) {
              if (!this.isStop && top !== undefined) {
                this.setState(danmu, 'emit') // 转换为emit状态
                danmu.$ref.style.top = `${top}px`
                danmu.$ref.style.visibility = 'visible'
                danmu.$ref.dataset.mode = danmu.mode // CSS控制模式的显示和隐藏
                danmu.$ref.dataset.id = danmu.id || '' // 用于悬停的唯一标识

                switch (danmu.mode) {
                  // 滚动的弹幕
                  case 0: {
                    danmu.$ref.style.left = `${clientWidth}px`
                    danmu.$ref.style.marginLeft = '0px'
                    danmu.$ref.style.transform = `translateX(${-distance}px)`
                    danmu.$ref.style.transition = `transform ${danmu.$restTime}s linear 0s`
                    break
                  }
                  case 1:
                    // falls through
                  case 2:
                    danmu.$ref.style.left = '50%'
                    danmu.$ref.style.marginLeft = `-${danmu.$ref.clientWidth / 2}px`
                    break
                  default:
                    break
                }

                this.art.emit('artplayerPluginDanmuku:visible', danmu)
              }
              else {
                // 假如弹幕已经停止或者没有 top 值，则重置弹幕为ready状态，回收弹幕DOM节点，等待下次发送
                this.setState(danmu, 'ready')
                this.$refs.push(danmu.$ref)
                danmu.$ref = null
              }
            }
          }
        }
      }

      // 递归调用
      if (!this.isStop) {
        this.update()
      }
    })
    return this
  }

  // 重置正在显示的弹幕: stop/emit 状态的弹幕
  resize() {
    const { clientWidth } = this.$player

    this.filter('stop', (danmu) => {
      switch (danmu.mode) {
        // 滚动的弹幕
        case 0:
          danmu.$ref.style.left = `${clientWidth}px`
          break
        default:
          break
      }
    })

    this.filter('emit', (danmu) => {
      danmu.$lastStartTime = Date.now()
      switch (danmu.mode) {
        // 滚动的弹幕
        case 0: {
          const distance = clientWidth + danmu.$ref.clientWidth
          danmu.$ref.style.left = `${clientWidth}px`
          danmu.$ref.style.transform = `translateX(${-distance}px)`
          danmu.$ref.style.transition = `transform ${danmu.$restTime}s linear 0s`
          break
        }
        default:
          break
      }
    })
  }

  // 继续弹幕
  continue() {
    const { clientWidth } = this.$player
    this.filter('stop', (danmu) => {
      this.setState(danmu, 'emit') // 转换为emit状态
      danmu.$lastStartTime = Date.now()
      switch (danmu.mode) {
        // 继续滚动的弹幕
        case 0: {
          const distance = clientWidth + danmu.$ref.clientWidth
          danmu.$ref.style.transform = `translateX(${-distance}px)`
          danmu.$ref.style.transition = `transform ${danmu.$restTime}s linear 0s`
          break
        }
        default:
          break
      }
    })

    return this
  }

  // 暂停弹幕
  suspend() {
    const { clientWidth } = this.$player
    this.filter('emit', (danmu) => {
      this.setState(danmu, 'stop') // 转换为stop状态
      switch (danmu.mode) {
        // 停止滚动的弹幕
        case 0: {
          const translateX = clientWidth - (this.getLeft(danmu.$ref) - this.getLeft(this.$player))
          danmu.$ref.style.transform = `translateX(${-translateX}px)`
          danmu.$ref.style.transition = 'transform 0s linear 0s'
          break
        }
        default:
          break
      }
    })

    return this
  }

  stop() {
    this.isStop = true
    this.suspend()
    window.cancelAnimationFrame(this.timer)
    this.art.emit('artplayerPluginDanmuku:stop')
    return this
  }

  start() {
    this.isStop = false
    this.continue()
    this.update()
    this.art.emit('artplayerPluginDanmuku:start')
    return this
  }

  reset() {
    this.queue.forEach(danmu => this.makeWait(danmu))
    this.art.emit('artplayerPluginDanmuku:reset')
    return this
  }

  show() {
    this.isHide = false
    this.$danmuku.style.opacity = 1
    this.option.visible = true
    this.art.emit('artplayerPluginDanmuku:show')
    return this
  }

  hide() {
    this.isHide = true
    this.$danmuku.style.opacity = 0
    this.option.visible = false
    this.art.emit('artplayerPluginDanmuku:hide')
    return this
  }

  destroy() {
    cancelInputs(this)
    this.stop()
    this.worker?.terminate()
    this.art.off('video:play', this.start)
    this.art.off('video:playing', this.start)
    this.art.off('video:pause', this.stop)
    this.art.off('video:waiting', this.stop)
    this.art.off('resize', this.resize)
    this.art.off('destroy', this.destroy)
    this.art.emit('artplayerPluginDanmuku:destroy')
  }
}
