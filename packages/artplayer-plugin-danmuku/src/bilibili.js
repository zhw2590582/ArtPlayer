function getMode(key) {
    switch (key) {
        case 1:
        case 2:
        case 3:
            return 0;
        case 4:
            return 2;
        case 5:
            return 1;
        default:
            return 0;
    }
}

function bilibiliDanmuParseFromXml(xmlString) {
    if (typeof xmlString !== 'string') return [];
    const reg = new RegExp(/<d (?:.*? )??p="(?<p>.+?)"(?: .*?)?>(?<text>.+?)<\/d>/gs);
    const matches = xmlString.matchAll(reg);
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

function onmessage({ data }) {
    const { xml, id } = data;
    if (!id || !xml) return;
    const danmus = bilibiliDanmuParseFromXml(xml);
    self.postMessage({ danmus, id });
}

function createWorker() {
    const workerText = `
        ${getMode.toString()}
        ${bilibiliDanmuParseFromXml.toString()}
        onmessage = ${onmessage.toString()}
    `;
    const blob = new Blob([workerText], { type: 'application/javascript' });
    return new Worker(URL.createObjectURL(blob));
}

export function bilibiliDanmuParseFromUrl(url) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
        const res = await fetch(url);
        const xml = await res.text();

        try {
            const worker = createWorker();
            worker.onmessage = (event) => {
                const { danmus, id } = event.data;
                if (!id || !danmus) return;
                resolve(danmus);
                worker.terminate();
            };
            worker.postMessage({ xml, id: Date.now() });
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            const danmus = bilibiliDanmuParseFromXml(xml);
            resolve(danmus);
        }
    });
}
