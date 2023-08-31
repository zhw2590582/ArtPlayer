function padEnd(str, targetLength, padString) {
    if (str.length > targetLength) {
        return String(str);
    } else {
        targetLength = targetLength - str.length;
        if (targetLength > padString.length) {
            padString += padString.repeat(targetLength / padString.length);
        }
        return String(str) + padString.slice(0, targetLength);
    }
}

function t2d(time) {
    var arr = time.split('.');
    var left = arr[0].split(':') || [];
    var right = padEnd(arr[1] || '0', 3, '0');
    var ms = Number(right) / 1000;

    var h = Number(left[left.length - 3] || 0) * 3600;
    var m = Number(left[left.length - 2] || 0) * 60;
    var s = Number(left[left.length - 1] || 0);
    return h + m + s + ms;
}

export default async function getVttArray(vttUrl = '') {
    const vttString = await (await fetch(vttUrl)).text();
    const lines = vttString.split(/[\n\r]/gm).filter((item) => item.trim());
    const vttArray = [];

    for (let i = 1; i < lines.length; i += 2) {
        const time = lines[i];
        const text = lines[i + 1];

        if (!text.trim()) continue;

        const timeReg =
            /((?:[0-9]{2}:)?(?:[0-9]{2}:)?[0-9]{2}(?:.[0-9]{3})?)(?: ?--> ?)((?:[0-9]{2}:)?(?:[0-9]{2}:)?[0-9]{2}(?:.[0-9]{3})?)/;
        const timeMatch = time.match(timeReg);

        const textReg = /(.*)#(\w{4})=(.*)/i;
        const textMatch = text.match(textReg);

        const start = Math.floor(t2d(timeMatch[1]));
        const end = Math.floor(t2d(timeMatch[2]));

        let url = textMatch[1];
        const isAbsoluteUrl = /^\/|((https?|ftp|file):\/\/)/i.test(url);
        if (!isAbsoluteUrl) {
            const urlArr = vttUrl.split('/');
            urlArr.pop();
            urlArr.push(url);
            url = urlArr.join('/');
        }

        const result = { start, end, url };

        const keys = textMatch[2].split('');
        const values = textMatch[3].split(',');

        for (let j = 0; j < keys.length; j++) {
            result[keys[j]] = values[j];
        }

        vttArray.push(result);
    }

    return vttArray;
}
