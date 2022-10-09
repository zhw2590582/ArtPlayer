import fs from 'fs';
import path from 'path';
import glob from 'glob';

const reg = /^import.*;$/gim;
const types = glob.sync(path.join(process.cwd(), 'packages/artplayer/types/*'));
const output = path.join(path.join(process.cwd(), `docs/assets/ts/artplayer.d.ts`));

let code = '';
for (let index = 0; index < types.length; index++) {
    const type = types[index];
    code += String(fs.readFileSync(type)).replace(reg, '') + '\n';
}

fs.writeFileSync(output, code.trim());
console.log(`✨ Built artplayer.d.ts`);
