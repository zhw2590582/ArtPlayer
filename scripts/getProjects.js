const path = require('path');
const glob = require('glob');

module.exports = function getProjects() {
    return glob
        .sync(path.join(process.cwd(), 'packages/*'))
        .filter((item) => {
            return !item.includes('artplayer-document');
        })
        .reduce((result, item) => {
            const name = item.split(path.sep).pop();
            result[name] = item;
            return result;
        }, {});
};
