export function bilibiliDanmuParseFromXml(xmlString) {
    if (typeof xmlString !== 'string') return [];
    const regSrt = '<d p="(.+)">(.+)</d>';
    const listReg = new RegExp(regSrt, 'gi');
    const itemReg = new RegExp(regSrt, 'i');
    const srtList = xmlString.match(listReg);
    return srtList.length
        ? srtList.map(item => {
            const [, attrStr, text] = item.match(itemReg);
            const attr = attrStr.split(',').map(Number);
            return attr.length === 8 && text.trim()
                ? {
                    text,
                    time: attr[0],
                    mode: attr[1],
                    size: attr[2],
                    color: `#${attr[3].toString(16)}`,
                    timestamp: attr[4],
                    pool: attr[5],
                    userID: attr[6],
                    rowID: attr[7],
                }
                : null;
        })
        : [];
}

export function bilibiliDanmuParseFromAv(av) {
    const corsUrl = 'https://cors-anywhere.herokuapp.com/';
    return fetch(`${corsUrl}https://api.bilibili.com/x/web-interface/view?aid=${av}`)
        .then(res => res.json())
        .then(res => {
            if (res.code === 0 && res.data && res.data.cid) {
                return fetch(`${corsUrl}https://api.bilibili.com/x/v1/dm/list.so?oid=${res.data.cid}`)
                    .then(res => res.text())
                    .then(xmlString => {
                        return bilibiliDanmuParseFromXml(xmlString);
                    });
            }
            throw new Error(`Unable to get data: ${JSON.stringify(res)}`);
        });
}