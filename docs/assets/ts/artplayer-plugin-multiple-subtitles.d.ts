declare const artplayerPluginMultipleSubtitles: (option: {
  subtitles: {
    url?: string
    name?: string
    type?: 'vtt' | 'srt' | 'ass'
    encoding?: string
    onParser?: (...args: object[]) => object
  }[]
}) => (art: Artplayer) => {
  name: 'multipleSubtitles'
}

export default artplayerPluginMultipleSubtitles

export = artplayerPluginMultipleSubtitles;
export as namespace artplayerPluginMultipleSubtitles;