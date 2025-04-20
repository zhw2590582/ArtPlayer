import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

export function getProjects() {
    return glob
        .sync('packages/*')
        .sort()
        .filter((item) => !item.endsWith('artplayer-template') && !item.endsWith('artplayer-vitepress'))
        .reduce((result, item) => {
            const name = item.split(/\/|\\/g).pop();
            result[name] = path.resolve(process.cwd(), item);
            return result;
        }, {});
}

export function removeDir(dir) {
    if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        files.forEach((file) => {
            const curPath = path.join(dir, file);
            if (fs.statSync(curPath).isDirectory()) {
                removeDir(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(dir);
    }
}

export function injectPlaceholders(filePath, placeholders) {
    const original = fs.readFileSync(filePath, 'utf-8');
    let modified = original;

    for (const [key, value] of Object.entries(placeholders)) {
        const pattern = new RegExp(key, 'g');
        modified = modified.replace(pattern, value);
    }

    fs.writeFileSync(filePath, modified);
    return () => fs.writeFileSync(filePath, original); // 构建完还原
}
