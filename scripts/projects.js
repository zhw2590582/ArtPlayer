import path from 'path';
import glob from 'glob';

export default glob.sync(path.join(process.cwd(), 'packages/*')).reduce((result, item) => {
    const name = item.split(path.sep).pop();
    result[name] = item;
    return result;
}, {});
