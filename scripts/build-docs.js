import process from 'node:process'
import spawn from 'cross-spawn'

const proc = spawn('npm', ['run', 'build'], {
  cwd: './packages/artplayer-vitepress/',
  stdio: 'inherit',
})

// Propagate the vitepress build result: swallowing the exit code let CI stay
// green while the docs build was actually broken.
proc.on('exit', (code) => {
  if (code !== 0) {
    process.exitCode = code ?? 1
  }
})
