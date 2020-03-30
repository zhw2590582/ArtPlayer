export function getMode(key) {
    switch (key) {
        case 1:
        case 2:
        case 3:
            return 0;
        case 4:
        case 5:
            return 1;
        default:
            return 0;
    }
}

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
                        mode: getMode(Number(attr[1])),
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
        .then(xmlString => bilibiliDanmuParseFromXml(xmlString));
}
