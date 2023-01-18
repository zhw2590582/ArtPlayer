import spawn from 'cross-spawn';

const proc = spawn('npm', ['run', 'build'], {
    cwd: './packages/artplayer-vitepress/',
});

proc.stdout.pipe(process.stdout);
proc.stderr.pipe(process.stderr);
