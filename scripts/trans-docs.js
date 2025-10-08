import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import { glob } from 'glob'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../packages/artplayer-vitepress')
const srcDirs = ['docs/advanced', 'docs/component', 'docs/start']
const indexFile = 'docs/index.md'
const outputRoot = path.join(rootDir, 'docs/en')
const API_URL = 'https://api.deepseek.com/v1/chat/completions'
const API_KEY = process.env.DEEPL_API_KEY

if (!API_KEY) {
  console.error('❌ Missing DEEPL_API_KEY in .env file')
  process.exit(1)
}

function splitMarkdown(text, maxLen = 4000) {
  const lines = text.split('\n')
  const chunks = []
  let buffer = ''
  let insideCodeBlock = false

  for (const line of lines) {
    if (line.trim().startsWith('```'))
      insideCodeBlock = !insideCodeBlock
    if ((`${buffer}\n${line}`).length > maxLen && !insideCodeBlock) {
      chunks.push(buffer)
      buffer = ''
    }
    buffer += `\n${line}`
  }

  if (buffer.trim())
    chunks.push(buffer)
  return chunks
}

function cleanTranslation(text) {
  return text
    .replace(/^```(markdown|md)?/gi, '')
    .replace(/```$/g, '')
    .replace(/^(Here('|’)s|Below is|Translation|The English version|Here is)[:：]?\s*/gi, '')
    .replace(/(Translation completed\.?|End of translation\.?)$/gi, '')
    .trim()
}

async function translateText(text) {
  const chunks = splitMarkdown(text, 4000)
  let result = ''

  for (let i = 0; i < chunks.length; i++) {
    console.log(`🔹 Translating chunk ${i + 1}/${chunks.length}`)
    const prompt = `
You are a professional English technical translator for documentation.
Translate the following Markdown content from Simplified Chinese to fluent English.
Keep all Markdown structure, code blocks, and formatting intact.
Return ONLY the translated Markdown content — do NOT add any explanations, prefixes, or summaries.

Text to translate:
${chunks[i]}
        `.trim()

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
      }),
    })

    if (!res.ok) {
      const error = await res.text()
      console.error('API Error:', error)
      throw new Error(`DeepSeek API error: ${res.status}`)
    }

    const data = await res.json()
    const raw = data.choices?.[0]?.message?.content?.trim() || ''
    const translated = cleanTranslation(raw)
    result += `\n\n${translated}`
  }

  return result.trim()
}

async function processFile(inputPath, outputPath) {
  const content = fs.readFileSync(inputPath, 'utf8')
  console.log(`🌍 Translating: ${inputPath}`)
  const translated = await translateText(content)
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, translated, 'utf8')
  console.log(`✅ Saved: ${outputPath}`)
}

async function runWithConcurrency(tasks, limit = 5) {
  const results = []
  const executing = new Set()
  for (const task of tasks) {
    const p = task().finally(() => executing.delete(p))
    results.push(p)
    executing.add(p)
    if (executing.size >= limit) {
      await Promise.race(executing)
    }
  }
  return Promise.all(results)
}

async function main() {
  console.log('🚀 Starting translation...')
  fs.rmSync(outputRoot, { recursive: true, force: true })
  fs.mkdirSync(outputRoot, { recursive: true })

  const indexPath = path.join(rootDir, indexFile)
  const indexOut = path.join(outputRoot, 'index.md')
  await processFile(indexPath, indexOut)

  const tasks = []
  for (const dir of srcDirs) {
    const fullDir = path.join(rootDir, dir)
    const files = await glob(`${fullDir}/**/*.md`)
    for (const file of files) {
      const relative = path.relative(rootDir, file)
      const outputFile = path.join(outputRoot, relative.replace(/^docs[\\/]/, ''))
      tasks.push(() => processFile(file, outputFile))
    }
  }

  console.log(`🧠 Total files: ${tasks.length}, concurrency: 5`)
  await runWithConcurrency(tasks, 5)
  console.log('🎉 Translation complete!')
}

main().catch((err) => {
  console.error('❌ Translation failed:', err)
  process.exit(1)
})
