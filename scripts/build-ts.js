import fs from 'fs';
import cpy from 'cpy';
import path from 'path';
import { glob } from 'glob';

const reg = /^import.*;$/gim;
const artplayerTS = glob.sync('packages/artplayer/types/*.d.ts');
const artplayerTSoutput = path.join('docs/assets/ts/artplayer.d.ts');

let code = '';
for (let index = 0; index < artplayerTS.length; index++) {
    const type = artplayerTS[index];
    code += String(fs.readFileSync(type)).replace(reg, '') + '\n';
}

fs.writeFileSync(artplayerTSoutput, code.trim());
console.log(`✨ Built ${artplayerTSoutput}`);

(async function () {
    const pluginsTS = glob.sync('packages/artplayer-plugin-*/types/*.d.ts');
    for (let index = 0; index < pluginsTS.length; index++) {
        const type = pluginsTS[index];
        await cpy(type, 'docs/assets/ts/', { flat: true });
        console.log(`✨ Copy ${type}`);
    }
})();
