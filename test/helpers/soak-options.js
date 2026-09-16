import assert from 'node:assert/strict'

export function soakOptions(value) {
  const phaseSeconds = value === undefined ? 90 : Number(value)
  assert(Number.isInteger(phaseSeconds) && phaseSeconds >= 90 && phaseSeconds <= 3600, 'ARTPLAYER_MB_SOAK_SECONDS must be 90..3600 whole seconds per phase')
  return { phaseSeconds, minimumMediaSeconds: Math.max(600, phaseSeconds * 3 + 60), timeoutMs: phaseSeconds * 2000 + 90000 }
}
