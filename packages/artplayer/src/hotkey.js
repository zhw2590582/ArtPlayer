import { isMobile } from './utils'

export default class Hotkey {
  constructor(art) {
    this.art = art
    this.keys = {}

    if (!isMobile) {
      this.init()
    }
  }

  init() {
    const { constructor } = this.art

    if (this.art.option.hotkey) {
      this.add('Escape', () => {
        if (this.art.fullscreenWeb) {
          this.art.fullscreenWeb = false
        }
      })

      this.add('Space', () => {
        this.art.toggle()
      })

      this.add('ArrowLeft', () => {
        this.art.backward = constructor.SEEK_STEP
      })

      this.add('ArrowUp', () => {
        this.art.volume += constructor.VOLUME_STEP
      })

      this.add('ArrowRight', () => {
        this.art.forward = constructor.SEEK_STEP
      })

      this.add('ArrowDown', () => {
        this.art.volume -= constructor.VOLUME_STEP
      })
    }

    this.art.on('document:keydown', (event) => {
      if (this.art.isFocus) {
        const tag = document.activeElement.tagName.toUpperCase()
        const editable = document.activeElement.getAttribute('contenteditable')
        if (
          tag !== 'INPUT'
          && tag !== 'TEXTAREA'
          && editable !== ''
          && editable !== 'true'
          && !event.altKey
          && !event.ctrlKey
          && !event.metaKey
          && !event.shiftKey
        ) {
          const events = this.keys[event.code]
          if (events) {
            event.preventDefault()
            for (let index = 0; index < events.length; index++) {
              events[index].call(this.art, event)
            }
            this.art.emit('hotkey', event)
          }
        }
      }
      this.art.emit('keydown', event)
    })
  }

  add(key, event) {
    if (this.keys[key]) {
      if (!this.keys[key].includes(event)) {
        this.keys[key].push(event)
      }
    }
    else {
      this.keys[key] = [event]
    }
    return this
  }

  remove(key, event) {
    if (this.keys[key]) {
      const index = this.keys[key].indexOf(event)
      if (index !== -1) {
        this.keys[key].splice(index, 1)
      }
      if (this.keys[key].length === 0) {
        delete this.keys[key]
      }
    }
    return this
  }
}
