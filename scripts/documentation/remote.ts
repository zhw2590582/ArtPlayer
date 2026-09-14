import assert from 'node:assert/strict'
import { setTimeout as delay } from 'node:timers/promises'

interface RemoteOptions {
  key: string
  request?: typeof fetch
  signal?: AbortSignal
  timeoutMs?: number
  retries?: number
  wait?: (ms: number) => Promise<unknown>
}

function object(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : {}
}

export async function translateChunk(
  content: string,
  options: RemoteOptions,
): Promise<string> {
  assert(options.key, 'Missing DEEPSEEK_API_KEY')
  const retries = options.retries ?? 3
  assert(
    Number.isInteger(retries) && retries > 0 && retries <= 5,
    'Invalid retry limit',
  )
  const timeoutMs = options.timeoutMs ?? 60000
  assert(
    Number.isFinite(timeoutMs) && timeoutMs > 0,
    'Invalid request timeout',
  )
  for (let attempt = 1; attempt <= retries; attempt++) {
    options.signal?.throwIfAborted()
    const controller = new AbortController()
    const timeout = setTimeout(
      () => controller.abort(new Error('Translation request timed out')),
      timeoutMs,
    )
    const signal = options.signal
      ? AbortSignal.any([controller.signal, options.signal])
      : controller.signal
    let retry = false
    try {
      const response = await (options.request ?? fetch)(
        'https://api.deepseek.com/v1/chat/completions',
        {
          method: 'POST',
          signal,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${options.key}`,
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            temperature: 0.2,
            messages: [
              {
                role: 'user',
                content: `Translate this Chinese technical Markdown to English. Preserve structure, inline code, URLs and every ARTPLAYER_KEEP marker exactly once. Return only Markdown, without an outer code fence or explanations.\n\n${content}`,
              },
            ],
          }),
        },
      )
      retry = response.status === 429 || response.status >= 500
      if (!response.ok)
        await response.body?.cancel()
      assert(response.ok, `Translation HTTP ${response.status}`)
      const data: unknown = await response.json().catch((error: unknown) => {
        if (signal.aborted)
          throw error
        assert.fail('Invalid translation JSON response')
      })
      const choices = object(data).choices
      const text = object(
        object(Array.isArray(choices) ? choices[0] : undefined).message,
      ).content
      assert(
        typeof text === 'string' && text.trim(),
        'Invalid or empty translation response',
      )
      return text.trim()
    }
    catch (error) {
      if (options.signal?.aborted)
        throw error
      if (!(error instanceof assert.AssertionError))
        retry = true
      if (!retry || attempt === retries)
        throw error
    }
    finally {
      clearTimeout(timeout)
    }
    await (options.wait ?? delay)(500 * attempt)
  }
  throw new Error('Translation retries exhausted')
}
