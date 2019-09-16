export default function analysis() {
    const w = window;
    const n = w.navigator;
    const d = w.document;

    if (!w || w.HELP_IMPROVE_ARTPLAYER === false) return;
    if (n && n.doNotTrack && n.doNotTrack === '1') return;
    if (n && n.msDoNotTrack && n.msDoNotTrack === '1') return;
    if (w.doNotTrack && w.doNotTrack === '1') return;
    if (Math.random() > 0.1) return;

    const url = new URL('https://hm.baidu.com/hm.gif');
    url.searchParams.append('v', '1.2.61');
    url.searchParams.append('tt', d.title);
    url.searchParams.append('su', d.referrer);
    url.searchParams.append('rnd', String(Date.now()).slice(-10));
    url.searchParams.append('si', 'b6c9b8bafbf5fe7225160101dafbbc7d');
    url.searchParams.append('ds', `${w.screen.availWidth}x${w.screen.availHeight}`);
    url.searchParams.append('ln', (n.language || n.userLanguage || '').toLowerCase());
    new Image().src = url.href;
}
