import type { Chapter } from './types'

export function normalizeChapters(chapters: Chapter[] = [], duration: number): Chapter[] {
  if (!Array.isArray(chapters) || !chapters.length || !Number.isFinite(duration) || duration <= 0)
    return []

  // Sorting, Infinity replacement and gap insertion intentionally mutate caller data.
  chapters.sort((a, b) => a.start - b.start)
  for (const [index, chapter] of chapters.entries()) {
    if (!chapter || typeof chapter.start !== 'number' || typeof chapter.end !== 'number' || typeof chapter.title !== 'string')
      throw new TypeError('Illegal chapter data type')

    if (chapter.end === Infinity)
      chapter.end = duration

    const next = chapters[index + 1]
    if (!Number.isFinite(chapter.start) || !Number.isFinite(chapter.end)
      || chapter.start < 0 || chapter.end > duration || chapter.start >= chapter.end
      || (next && chapter.end > next.start)) { throw new Error('Illegal chapter time point') }
  }

  const first = chapters[0]
  const last = chapters[chapters.length - 1]
  if (first && first.start > 0)
    chapters.unshift({ start: 0, end: first.start, title: '' })
  if (last && last.end < duration)
    chapters.push({ start: last.end, end: duration, title: '' })

  for (let index = 0; index < chapters.length - 1; index++) {
    const current = chapters[index]
    const next = chapters[index + 1]
    if (current && next && current.end !== next.start)
      chapters.splice(index + 1, 0, { start: current.end, end: next.start, title: '' })
  }
  return chapters
}
