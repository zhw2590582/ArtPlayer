import fs from 'node:fs'
import path from 'node:path'
import { glob } from 'glob'

const docsDir = path.resolve('packages/artplayer-vitepress/docs')

function fixMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')
  const fixedLines = []
  let inCodeBlock = false
  let fixes = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Check if entering a code block
    if (line.startsWith('```') && !inCodeBlock) {
      inCodeBlock = true
      fixedLines.push(line)
      continue
    }

    // Check if properly exiting a code block
    if (line.startsWith('```') && inCodeBlock) {
      inCodeBlock = false
      fixedLines.push(line)
      continue
    }

    // Check if we hit a heading while still in a code block (missing ```)
    if (inCodeBlock && line.startsWith('## ')) {
      // Add the missing closing ```
      fixedLines.push('```')
      fixedLines.push('')
      inCodeBlock = false
      fixes++
    }

    // Check if we hit ::: (admonition) while still in a code block
    if (inCodeBlock && line.startsWith(':::')) {
      fixedLines.push('```')
      fixedLines.push('')
      inCodeBlock = false
      fixes++
    }

    fixedLines.push(line)
  }

  // If file ended while still in code block
  if (inCodeBlock) {
    fixedLines.push('```')
    fixes++
  }

  if (fixes > 0) {
    fs.writeFileSync(filePath, fixedLines.join('\n'))
    console.log(`✅ Fixed ${fixes} code blocks in ${path.relative(docsDir, filePath)}`)
  }

  return fixes
}

// Find all markdown files
const files = glob.sync('**/*.md', { cwd: docsDir, absolute: true })

let totalFixes = 0
for (const file of files) {
  totalFixes += fixMarkdownFile(file)
}

console.log(`\n✨ Total: Fixed ${totalFixes} code blocks in ${files.length} files`)
