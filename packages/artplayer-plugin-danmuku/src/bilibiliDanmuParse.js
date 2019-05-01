export function bilibiliDanmuParseFromXml(xmlString) {
    if (typeof xmlString !== 'string') return [];
    const srtList = xmlString.match(/<d([\S ]*?>[\S ]*?)<\/d>/gi);
    return srtList.length
        ? srtList.map(item => {
            const [, attrStr, text] = item.match(/<d p="(.+)">(.+)<\/d>/);
            const attr = attrStr.split(',');
            return attr.length === 8 && text.trim()
                ? {
                    text,
                    time: Number(attr[0]),
                    mode: Number(attr[1]),
                    fontSize: Number(attr[2]),
                    color: `#${Number(attr[3]).toString(16)}`,
                    timestamp: Number(attr[4]),
                    pool: Number(attr[5]),
                    userID: attr[6],
                    rowID: Number(attr[7]),
                }
                : null;
        })
        : [];
}

export function bilibiliDanmuParseFromUrl(url) {
    return fetch(url)
        .then(res => res.text())
        .then(xmlString => {
            return bilibiliDanmuParseFromXml(xmlString);
        });
}

export function bilibiliDanmuParseFromAv(av) {
    const corsUrl = 'https://cors-anywhere.herokuapp.com/';
    return fetch(`${corsUrl}https://api.bilibili.com/x/web-interface/view?aid=${av}`)
        .then(res => res.json())
        .then(res => {
            if (res.code === 0 && res.data && res.data.cid) {
                return bilibiliDanmuParseFromUrl(`${corsUrl}https://api.bilibili.com/x/v1/dm/list.so?oid=${res.data.cid}`);
            }
            throw new Error(`Unable to get data: ${JSON.stringify(res)}`);
        });
}