export function getMode(key) {
    switch (key) {
        case 1:
        case 2:
        case 3:
            return 0; // 滚动
        case 4:
            return 2; // 底部
        case 5:
            return 1; // 顶部
        default:
            return 0;
    }
}

export function bilibiliDanmuParseFromXml(xmlString) {
    if (typeof xmlString !== 'string') return [];
    const matches = xmlString.matchAll(/<d (?:.*? )??p="(?<p>.+?)"(?: .*?)?>(?<text>.+?)<\/d>/gs);
    return Array.from(matches)
        .map((match) => {
            const attr = match.groups.p.split(',');
            if (attr.length >= 8) {
                const text = match.groups.text
                    .trim()
                    .replaceAll('&quot;', '"')
                    .replaceAll('&apos;', "'")
                    .replaceAll('&lt;', '<')
                    .replaceAll('&gt;', '>')
                    .replaceAll('&amp;', '&');

                return {
                    text,
                    time: Number(attr[0]),
                    mode: getMode(Number(attr[1])),
                    fontSize: Number(attr[2]),
                    color: `#${Number(attr[3]).toString(16)}`,
                    timestamp: Number(attr[4]),
                    pool: Number(attr[5]),
                    userID: attr[6],
                    rowID: Number(attr[7]),
                };
            } else {
                return null;
            }
        })
        .filter(Boolean);
}

export async function bilibiliDanmuParseFromUrl(url) {
    const res = await fetch(url);
    const xmlString = await res.text();
    return bilibiliDanmuParseFromXml(xmlString);
}
