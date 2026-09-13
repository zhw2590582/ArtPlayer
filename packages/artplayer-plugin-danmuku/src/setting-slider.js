export default function createSlider({ min, max, container, findIndex, onChange, steps = [] }) {
  const { lifecycle } = this
  if (!lifecycle.active)
    return { reset() {} }
  const { query, clamp, setStyle } = this.utils

  setStyle(container, 'touch-action', 'none')

  container.innerHTML = `
            <div class="apd-slider-line">
                <div class="apd-slider-points">
                    ${steps.map(() => `<div class="apd-slider-point"></div>`).join('')}
                </div>
                <div class="apd-slider-progress"></div>
            </div>
            <div class="apd-slider-dot"></div>
            <div class="apd-slider-steps">
                ${steps.map(step => (step.hide ? '' : `<div class="apd-slider-step">${step.name}</div>`)).join('')}
            </div>
        `

  const $dot = query('.apd-slider-dot', container)
  const $progress = query('.apd-slider-progress', container)

  let isDroging = false

  lifecycle.own(() => isDroging = false)

  function reset(index) {
    if (!lifecycle.active)
      return
    if (index === undefined)
      index = findIndex()
    if (index < min || index > max)
      return
    const percentage = (index - min) / (max - min)
    $dot.style.left = `${percentage * 100}%`
    if (steps.length === 0) {
      $progress.style.width = $dot.style.left
    }
    onChange(index)
  }

  function updateLeft(event) {
    const { top, height, left, width } = container.getBoundingClientRect()
    if (this.art.isRotate) {
      const value = clamp(event.clientY - top, 0, height)
      const index = Math.round((value / height) * (max - min) + min)
      reset(index)
    }
    else {
      const value = clamp(event.clientX - left, 0, width)
      const index = Math.round((value / width) * (max - min) + min)
      reset(index)
    }
  }

  lifecycle.proxy(container, 'click', (event) => {
    updateLeft.call(this, event)
  })

  lifecycle.proxy(container, 'pointerdown', (event) => {
    isDroging = event.button === 0
  })

  lifecycle.on('document:pointermove', (event) => {
    if (isDroging) {
      updateLeft.call(this, event)
    }
  })

  lifecycle.on('document:pointerup', (event) => {
    if (isDroging) {
      isDroging = false
      updateLeft.call(this, event)
    }
  })

  return { reset }
}
