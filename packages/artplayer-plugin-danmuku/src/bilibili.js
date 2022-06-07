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
    try {
        let parsedXml = (new DOMParser()).parseFromString(xmlString, 'text/xml');
        return Array.from(parsedXml.querySelectorAll('d')).map((d) => {
            let attr = d.attributes.p.value.split(',');
            return {
                text: d.textContent,
                time: Number(attr[0]),
                mode: getMode(Number(attr[1])),
                fontSize: Number(attr[2]),
                color: `#${Number(attr[3]).toString(16)}`,
                timestamp: Number(attr[4]),
                pool: Number(attr[5]),
                userID: attr[6],
                rowID: Number(attr[7])
            }
        }
        )
    } catch (error) {
        return [];
    }
}

export function bilibiliDanmuParseFromUrl(url) {
    return fetch(url)
        .then((res) => res.text())
        .then((xmlString) => bilibiliDanmuParseFromXml(xmlString));
}
