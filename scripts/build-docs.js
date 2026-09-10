import process from 'node:process'
import spawn from 'cross-spawn'

const proc = spawn('npm', ['run', 'build'], {
  cwd: './packages/artplayer-vitepress/',
  stdio: 'inherit',
})

proc.on('error', (error) => {
  console.error(error.message)
  process.exitCode = 1
})
proc.on('close', (code) => {
  process.exitCode = code ?? 1
})
