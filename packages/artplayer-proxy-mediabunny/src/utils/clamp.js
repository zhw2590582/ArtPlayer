export default function clamp(v, min, max) {
  return Math.max(min, Math.min(max, Number(v) || 0))
}
