import style from 'bundle-text:./style.less'

export default function artplayerPluginLiquidGlass(option) {
  return (art) => {
    const { constructor } = art
    const { addClass, append, createElement } = constructor.utils
    const { $bottom, $progress, $controls, $player } = art.template

    const $liquidGlass = createElement('div')
    addClass($player, 'artplayer-plugin-liquid-glass')
    addClass($liquidGlass, 'art-liquid-glass')
    append($bottom, $liquidGlass)
    append($liquidGlass, $progress)
    append($liquidGlass, $controls)

    return {
      name: 'artplayerPluginLiquidGlass',
    }
  }
}

if (typeof document !== 'undefined') {
  const id = 'artplayer-plugin-liquid-glass'
  let $style = document.getElementById(id)
  if (!$style) {
    $style = document.createElement('style')
    $style.id = id
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        document.head.appendChild($style)
      })
    }
    else {
      (document.head || document.documentElement).appendChild($style)
    }
  }
  $style.textContent = style
}

if (typeof window !== 'undefined') {
  window.artplayerPluginLiquidGlass = artplayerPluginLiquidGlass
}
