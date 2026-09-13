export function encodeAudio(samples: Float32Array, sampleRate: number): { pcm: ArrayBuffer, wav: ArrayBuffer } {
  const pcm = new ArrayBuffer(samples.length * 2)
  const pcmView = new DataView(pcm)
  for (let index = 0; index < samples.length; index++) {
    const value = Math.max(-1, Math.min(1, samples[index]!))
    pcmView.setInt16(index * 2, value < 0 ? value * 0x8000 : value * 0x7FFF, true)
  }

  const wav = new ArrayBuffer(44 + pcm.byteLength)
  const header = new DataView(wav)
  function writeString(offset: number, value: string): void {
    for (let index = 0; index < value.length; index++)
      header.setUint8(offset + index, value.charCodeAt(index))
  }

  writeString(0, 'RIFF')
  header.setUint32(4, 36 + pcm.byteLength, true)
  writeString(8, 'WAVE')
  writeString(12, 'fmt ')
  header.setUint32(16, 16, true)
  header.setUint16(20, 1, true)
  header.setUint16(22, 1, true)
  header.setUint32(24, sampleRate, true)
  header.setUint32(28, sampleRate * 2, true)
  header.setUint16(32, 2, true)
  header.setUint16(34, 16, true)
  writeString(36, 'data')
  header.setUint32(40, pcm.byteLength, true)
  new Uint8Array(wav).set(new Uint8Array(pcm), 44)
  return { pcm, wav }
}
