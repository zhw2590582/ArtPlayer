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
const API_KEY = process.env.DEEPSEEK_API_KEY

// 配置常量
const MAX_CONCURRENT_REQUESTS = 5 // 并发请求数
const REQUEST_TIMEOUT = 60000 // 请求超时时间 60秒
const MAX_RETRIES = 3 // 最大重试次数
const CHUNK_SIZE = 4000 // 分块大小

if (!API_KEY) {
  console.error('❌ Missing DEEPSEEK_API_KEY in .env file')
  process.exit(1)
}

// ==================== Markdown 修复功能 ====================

/**
 * 修复 Markdown 代码块闭合问题
 * - 遇到 ## 标题时补上遗漏的 ```
 * - 遇到 ::: 时补上遗漏的 ```
 * - 文件末尾检查是否需要补上
 */
function fixMarkdownCodeBlocks(content) {
  const lines = content.split('\n')
  const fixedLines = []
  let inCodeBlock = false
  let fixes = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // 检查是否进入代码块
    if (line.startsWith('```') && !inCodeBlock) {
      inCodeBlock = true
      fixedLines.push(line)
      continue
    }

    // 检查是否正常退出代码块
    if (line.startsWith('```') && inCodeBlock) {
      inCodeBlock = false
      fixedLines.push(line)
      continue
    }

    // 在代码块中遇到标题（缺少 ```）
    if (inCodeBlock && line.startsWith('## ')) {
      fixedLines.push('```')
      fixedLines.push('')
      inCodeBlock = false
      fixes++
    }

    // 在代码块中遇到 :::（admonition）
    if (inCodeBlock && line.startsWith(':::')) {
      fixedLines.push('```')
      fixedLines.push('')
      inCodeBlock = false
      fixes++
    }

    fixedLines.push(line)
  }

  // 文件末尾仍在代码块中
  if (inCodeBlock) {
    fixedLines.push('```')
    fixes++
  }

  return { content: fixedLines.join('\n'), fixes }
}

// ==================== 翻译功能 ====================

function splitMarkdown(text, maxLen = CHUNK_SIZE) {
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
    .replace(/^(Here('|')s|Below is|Translation|The English version|Here is)[:：]?\s*/gi, '')
    .replace(/(Translation completed\.?|End of translation\.?)$/gi, '')
    .trim()
}

async function callDeepSeekAPI(prompt, tag, chunkId) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`🔹 [${tag}] Translating chunk ${chunkId} (attempt ${attempt}/${MAX_RETRIES})`)
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

      const res = await fetch(API_URL, {
        method: 'POST',
        signal: controller.signal,
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
      clearTimeout(timeout)

      // 处理限流情况
      if (res.status === 429) {
        const delay = Math.pow(2, attempt) * 1000
        console.log(`⏳ [${tag}] Rate limited, waiting ${delay}ms...`)
        await new Promise(r => setTimeout(r, delay))
        continue
      }

      if (!res.ok) {
        const error = await res.text()
        console.error(`[${tag}] API Error:`, error)
        throw new Error(`DeepSeek API error: ${res.status}`)
      }

      const data = await res.json()
      if (!data.choices || !data.choices[0]) {
        throw new Error('Invalid API response: missing choices')
      }
      return data.choices[0].message?.content?.trim() || ''
    }
    catch (err) {
      if (err.name === 'AbortError') {
        console.error(`[${tag}] Request timeout for chunk ${chunkId}`)
      }
      if (attempt === MAX_RETRIES) {
        throw err
      }
      const delay = 1000 * attempt
      console.log(`⚠️ [${tag}] Retry ${attempt}/${MAX_RETRIES} after ${delay}ms...`)
      await new Promise(r => setTimeout(r, delay))
    }
  }
}

async function translateText(text, fileName) {
  const chunks = splitMarkdown(text, CHUNK_SIZE)
  let result = ''

  for (let i = 0; i < chunks.length; i++) {
    const prompt = `
You are a professional English technical translator for documentation.
Translate the following Markdown content from Simplified Chinese to fluent English.
Keep all Markdown structure, code blocks, and formatting intact.
Return ONLY the translated Markdown content — do NOT add any explanations, prefixes, or summaries.

Text to translate:
${chunks[i]}
    `.trim()

    const raw = await callDeepSeekAPI(prompt, fileName, `${i + 1}/${chunks.length}`)
    const translated = cleanTranslation(raw)
    result += `\n\n${translated}`
  }

  return result.trim()
}

async function processFile(inputPath, outputPath) {
  const content = fs.readFileSync(inputPath, 'utf8')
  const fileName = path.basename(inputPath)
  console.log(`🌍 Translating: ${inputPath}`)

  // 1. 翻译
  let translated = await translateText(content, fileName)

  // 2. 修复 Markdown 语法
  const { content: fixed, fixes } = fixMarkdownCodeBlocks(translated)
  if (fixes > 0) {
    console.log(`🔧 [${fileName}] Fixed ${fixes} unclosed code blocks`)
    translated = fixed
  }

  // 3. 保存
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, translated, 'utf8')
  console.log(`✅ Saved: ${outputPath}`)
}

async function runWithConcurrency(tasks, limit = MAX_CONCURRENT_REQUESTS) {
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

  console.log(`🧠 Total files: ${tasks.length}, concurrency: ${MAX_CONCURRENT_REQUESTS}`)
  await runWithConcurrency(tasks, MAX_CONCURRENT_REQUESTS)
  console.log('🎉 Translation complete!')
}

main().catch((err) => {
  console.error('❌ Translation failed:', err)
  process.exit(1)
})
