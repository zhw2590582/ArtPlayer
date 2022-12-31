import fs from 'fs';
import path from 'path';
import glob from 'glob';

const reg = /^import.*;$/gim;
const types = glob.sync('packages/artplayer/types/*');
const output = path.join('docs/assets/ts/artplayer.d.ts');

let code = '';
for (let index = 0; index < types.length; index++) {
    const type = types[index];
    code += String(fs.readFileSync(type)).replace(reg, '') + '\n';
}

fs.writeFileSync(output, code.trim());
console.log(`✨ Built artplayer.d.ts`);
