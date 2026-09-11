export function qualityAdapter(dash) {
  const modern = typeof dash.getRepresentationsByType === 'function'
  return {
    levels: () => modern ? dash.getRepresentationsByType('video') : dash.getBitrateInfoListFor('video'),
    current(levels) {
      if (modern)
        return dash.getCurrentRepresentationForType('video')
      const quality = dash.getQualityFor('video')
      return levels.find(level => level.qualityIndex === quality)
    },
    item(level, index, selected, automatic) {
      return modern
        ? { value: index, id: level.id, default: !automatic && selected != null && level.id === selected.id }
        : { value: level.qualityIndex, default: !automatic && selected != null && level.qualityIndex === selected.qualityIndex }
    },
    select(item, valid) {
      const automatic = item.value === 'auto'
      dash.updateSettings({ streaming: { abr: { autoSwitchBitrate: { video: automatic } } } })
      if (!automatic && valid()) {
        if (modern)
          dash.setRepresentationForTypeById('video', item.id)
        else
          dash.setQualityFor('video', item.value)
      }
    },
  }
}
