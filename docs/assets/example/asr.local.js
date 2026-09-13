/* global Artplayer, artplayerPluginAsr */
// Local audio capture demo. The subtitles below are simulated, not recognized speech.
// No audio is uploaded; only the sample media is loaded from this local site.
const statistics = document.createElement('div')
statistics.textContent = 'Local ASR demo: press play. No recognition service is used.'
let chunks = 0
let pcmBytes = 0
let wavBytes = 0

const art = new Artplayer({
  container: '.artplayer-app',
  url: '/assets/sample/steve-jobs.mp4',
  autoSize: true,
  fullscreen: true,
  fullscreenWeb: true,
  layers: [{
    name: 'asr-local-statistics',
    html: statistics,
    style: {
      position: 'absolute',
      top: '12px',
      left: '12px',
      right: '12px',
      padding: '8px 12px',
      background: 'rgba(0, 0, 0, 0.65)',
      color: '#fff',
      fontSize: '12px',
      whiteSpace: 'pre-line',
      pointerEvents: 'none',
    },
  }],
  controls: [{
    name: 'asr-local-stop',
    position: 'right',
    html: 'Stop ASR',
    tooltip: 'Stop capture; pause and play to restart',
    async click() {
      await art.plugins.artplayerPluginAsr.stop()
      if (!art.isDestroy)
        statistics.textContent = 'Local capture stopped. Pause and play to restart. Nothing was uploaded.'
    },
  }],
  plugins: [artplayerPluginAsr({
    length: 2,
    interval: 250,
    sampleRate: 16000,
    autoHideTimeout: 5000,
    onAudioChunk({ pcm, wav }) {
      if (art.isDestroy)
        return
      chunks++
      pcmBytes += pcm.byteLength
      wavBytes += wav.byteLength
      const sampleRate = new DataView(wav).getUint32(24, true)
      const samples = new DataView(pcm)
      let peak = 0
      for (let offset = 0; offset < pcm.byteLength; offset += 2)
        peak = Math.max(peak, Math.abs(samples.getInt16(offset, true)))
      const duration = (pcmBytes / 2 / sampleRate).toFixed(2)
      statistics.textContent = [
        'Local capture only - simulated subtitles, no speech recognition',
        `Chunks: ${chunks} | ${sampleRate} Hz mono PCM16 | ${duration} seconds captured`,
        `PCM: ${pcmBytes} bytes | WAV: ${wavBytes} bytes | Current peak: ${peak}`,
      ].join('\n')
      return `Simulated local subtitle: audio chunk ${chunks} received.`
    },
  })],
})
