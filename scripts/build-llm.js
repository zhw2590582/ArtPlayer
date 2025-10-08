import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import { glob } from 'glob'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../packages/artplayer-vitepress')
const dostDir = path.resolve(__dirname, '../docs')
const outputFile = path.resolve(__dirname, '../docs/llms.txt')
const API_URL = 'https://api.deepseek.com/v1/chat/completions'
const API_KEY = process.env.DEEPL_API_KEY
const MAX_CONCURRENT_REQUESTS = 3 // 每类并发请求数

if (!API_KEY) {
  console.error('❌ Missing DEEPL_API_KEY in .env file')
  process.exit(1)
}

async function getFiles(pattern) {
  const files = await glob(pattern.replace(/\\/g, '/'), { nodir: true })
  return files.sort()
}

function readFiles(files) {
  let content = ''
  for (const f of files) {
    console.log(`📄 Reading: ${f}`)
    content += `\n\n===== ${path.basename(f)} =====\n\n`
    content += fs.readFileSync(f, 'utf8')
  }
  return content
}

function splitText(text, maxLen = 5000) {
  const paragraphs = text.split(/\n{2,}/)
  const chunks = []
  let buffer = ''
  for (const p of paragraphs) {
    if ((`${buffer}\n\n${p}`).length > maxLen) {
      chunks.push(buffer)
      buffer = ''
    }
    buffer += `\n\n${p}`
  }
  if (buffer.trim())
    chunks.push(buffer)
  return chunks
}

async function askDeepSeek(prompt, text, tag, id) {
  console.log(`🧠 [${tag}] Sending chunk ${id}`)
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'You are a professional technical writer.' },
        { role: 'user', content: `${prompt}\n\n${text}` },
      ],
      temperature: 0.3,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error(`[${tag}] API Error:`, err)
    throw new Error(`DeepSeek API error: ${res.status}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content?.trim() || ''
}

async function runConcurrent(tasks, limit = MAX_CONCURRENT_REQUESTS) {
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

async function summarizeSection(title, files, type) {
  if (files.length === 0)
    return ''
  const text = readFiles(files)
  const chunks = splitText(text, 8000)

  let prompt = ''
  if (type === 'docs') {
    prompt = `
You are preparing documentation content for an AI model to learn ArtPlayer.
Reorganize the following documentation into a clean, readable plain text format.
Keep all code blocks, examples, and configuration options fully intact.
Add minimal explanations or clarifications in natural English before or after each block if helpful.
Do not use Markdown syntax (no #, **, or lists). Preserve indentation for code.`
  }
  else if (type === 'ts') {
    prompt = `
You are analyzing TypeScript declaration files that define the APIs of ArtPlayer.
Your goal is to produce a developer-oriented plain text output that preserves the actual type definitions,
interfaces, classes, and comments exactly as they are, while adding concise explanations
above or below them when necessary to clarify their purpose or usage.
Keep all code in the output, formatted as plain text (no Markdown).`
  }
  else if (type === 'js') {
    prompt = `
You are analyzing example JavaScript files demonstrating how to use ArtPlayer and its plugins.
Produce a plain text output that includes the full example code and short inline explanations
describing what each example shows, which APIs it uses, and what feature it demonstrates.
Keep all code exactly as-is, formatted as plain text, without Markdown syntax.`
  }

  const tasks = chunks.map((chunk, i) => () => askDeepSeek(prompt, chunk, type, i + 1))
  const results = await runConcurrent(tasks, MAX_CONCURRENT_REQUESTS)
  const merged = results.join('\n\n')
  return `\n\n===== ${title} =====\n\n${merged}`
}

async function main() {
  console.log('🚀 Building llms.txt using DeepSeek...')

  const [mdFiles, tsFiles, jsFiles] = await Promise.all([
    getFiles(`${rootDir}/docs/en/**/*.md`),
    getFiles(`${dostDir}/assets/ts/*.d.ts`),
    getFiles(`${dostDir}/assets/example/*.js`),
  ])

  // 并行执行三个大类任务
  const [docs, ts, js] = await Promise.all([
    summarizeSection('Documentation Summary', mdFiles, 'docs'),
    summarizeSection('Type Definitions Overview', tsFiles, 'ts'),
    summarizeSection('Examples Summary', jsFiles, 'js'),
  ])

  const finalText = [docs, ts, js].filter(Boolean).join('\n\n')
  fs.mkdirSync(path.dirname(outputFile), { recursive: true })
  fs.writeFileSync(outputFile, finalText, 'utf8')
  console.log(`✅ LLMs text built successfully at ${outputFile}`)
}

main().catch((err) => {
  console.error('❌ Build failed:', err)
  process.exit(1)
})
