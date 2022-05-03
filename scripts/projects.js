import path from 'path';
import glob from 'glob';

export default glob
    .sync(path.join(process.cwd(), 'packages/*'))
    .filter((item) => !item.endsWith('artplayer-document') && !item.endsWith('artplayer-template'))
    .reduce((result, item) => {
        const name = item.split(path.sep).pop();
        result[name] = item;
        return result;
    }, {});
