export default function bilibiliDanmuParse(xmlString) {
    if (typeof xmlString !== 'string') return [];
    const regSrt = '<d p="(.+)">(.+)</d>';
    const listReg = new RegExp(regSrt, 'gi');
    const itemReg = new RegExp(regSrt, 'i');
    const srtList = xmlString.match(listReg);
    return srtList.length
        ? srtList.map(item => {
            const [, attrStr, text] = item.match(itemReg);
            const attr = attrStr.split(',');
            return attr.length === 8 && text.trim()
                ? {
                    text,
                    time: Number(attr[0]),
                    mode: Number(attr[1]),
                    size: Number(attr[2]),
                    color: `#${Number(attr[3]).toString(16)}`,
                    timestamp: Number(attr[4]),
                    pool: Number(attr[5]),
                    userID: Number(attr[6]),
                    rowID: Number(attr[7]),
                }
                : null;
        })
        : [];
}
