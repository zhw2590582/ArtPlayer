export default async function* contractReporter(events) {
  for await (const event of events) {
    if (['test:pass', 'test:fail', 'test:summary'].includes(event.type)) {
      const { name, file, nesting, skip, todo, counts, success, details } = event.data
      yield `${JSON.stringify({ type: event.type, name, file, nesting, skip, todo, counts, success, kind: details?.type, error: details?.error?.message })}\n`
    }
  }
}
