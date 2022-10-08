import path from 'path';
import glob from 'glob';

export function formatDate(date) {
    var date = new Date(Number(date));
    var YY = date.getFullYear() + '-';
    var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return YY + MM + DD + ' ' + hh + mm + ss;
}

export function getProjects() {
    return glob
        .sync(path.join(process.cwd(), 'packages/*'))
        .filter((item) => !item.endsWith('artplayer-document') && !item.endsWith('artplayer-template'))
        .reduce((result, item) => {
            const name = item.split(path.sep).pop();
            result[name] = item;
            return result;
        }, {});
}
