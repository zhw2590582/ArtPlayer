import fs from 'node:fs'
import path from 'node:path'

// 使用中文文档作为源（中文是原始文档，英文是 AI 翻译的）
const docsDir = path.resolve('packages/artplayer-vitepress/docs')
const outputFile = path.resolve('docs/test/test.js')

// 排除的目录
const excludeDirs = ['en', '.vitepress', 'public', 'plugin']

// Regex to match code blocks after "Run Code" markers
// Match until we find a closing ``` that's on its own line
const runCodePattern = /<div className="run-code">.*?<\/div>[\t\v\f\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*\n\s*```js[^\n]*\n([\s\S]*?)\n```(?=\s*\n|$)/g

function extractCodeBlocks(content, filePath) {
  const blocks = []
  let match = runCodePattern.exec(content)

  while (match !== null) {
    const code = match[1].trim()

    // Skip if code contains markdown syntax (unclosed code block issue)
    if (code.includes('\n## ') || code.includes('\n:::') || code.includes('<div className="run-code">')) {
      console.warn(`⚠️  Skipping malformed code block in ${filePath}`)
      continue
    }

    blocks.push({
      code,
      file: filePath,
    })
    match = runCodePattern.exec(content)
  }

  return blocks
}

function processMarkdownFiles(dir, relativePath = '') {
  const results = []
  const items = fs.readdirSync(dir)

  for (const item of items) {
    // 跳过排除的目录
    if (excludeDirs.includes(item)) {
      continue
    }

    const fullPath = path.join(dir, item)
    const relPath = path.join(relativePath, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      results.push(...processMarkdownFiles(fullPath, relPath))
    }
    else if (item.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf-8')
      const blocks = extractCodeBlocks(content, relPath)
      if (blocks.length > 0) {
        results.push({
          file: relPath,
          blocks,
        })
      }
    }
  }

  return results
}

function generateTestCode(fileResults) {
  const lines = []

  lines.push(`// Auto-generated smoke tests from documentation code blocks`)
  lines.push(`// Generated at: ${new Date().toISOString()}`)
  lines.push(`// Do not edit manually - run 'node scripts/build-test.js' to regenerate`)
  lines.push(``)
  lines.push(`describe('Documentation Code Examples', function () {`)
  lines.push(`    this.timeout(5000);`)
  lines.push(``)
  lines.push(`    beforeEach(function () {`)
  lines.push(`        // Destroy any existing instances`)
  lines.push(`        [...Artplayer.instances].forEach((art) => art.destroy());`)
  lines.push(`        // Reset container`)
  lines.push(`        const container = document.querySelector('.artplayer-app');`)
  lines.push(`        if (container) {`)
  lines.push(`            container.innerHTML = '';`)
  lines.push(`        }`)
  lines.push(`    });`)
  lines.push(``)
  lines.push(`    afterEach(function () {`)
  lines.push(`        [...Artplayer.instances].forEach((art) => art.destroy());`)
  lines.push(`    });`)
  lines.push(``)

  for (const { file, blocks } of fileResults) {
    const suiteName = file.replace(/\.md$/, '').replace(/\//g, ' > ')

    lines.push(`    describe('${suiteName}', function () {`)

    blocks.forEach((block, index) => {
      const testName = `Example ${index + 1}`

      lines.push(`        it('${testName}', function (done) {`)
      lines.push(`            try {`)
      lines.push(`                ${block.code.split('\n').join('\n                ')}`)
      lines.push(`                // Wait a bit for async initialization`)
      lines.push(`                setTimeout(() => done(), 100);`)
      lines.push(`            } catch (err) {`)
      lines.push(`                done(err);`)
      lines.push(`            }`)
      lines.push(`        });`)
      lines.push(``)
    })

    lines.push(`    });`)
    lines.push(``)
  }

  lines.push(`});`)

  return lines.join('\n')
}

// Main execution
const fileResults = processMarkdownFiles(docsDir)

let totalBlocks = 0
for (const { file, blocks } of fileResults) {
  console.log(`📄 ${file}: ${blocks.length} code blocks`)
  totalBlocks += blocks.length
}

const testCode = generateTestCode(fileResults)
fs.writeFileSync(outputFile, testCode)

console.log(`\n✅ Generated ${totalBlocks} test cases from ${fileResults.length} files`)
console.log(`📝 Output: ${outputFile}`)
