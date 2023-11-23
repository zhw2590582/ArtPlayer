import { WebVTTParser, WebVTTSerializer } from './parser';

function unescape(str) {
    const map = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&#39;': "'",
        '&quot;': '"',
    };
    const reg = new RegExp(`(${Object.keys(map).join('|')})`, 'g');
    return str.replace(reg, (tag) => map[tag] || tag);
}

async function loadSubtitleAsVtt(option) {
    const { getExt, srtToVtt, assToVtt } = Artplayer.utils;
    const response = await fetch(option.url);
    const buffer = await response.arrayBuffer();
    const decoder = new TextDecoder(option.encoding || 'utf-8');
    const text = decoder.decode(buffer);
    switch (option.type || getExt(option.url)) {
        case 'srt': {
            return srtToVtt(text);
        }
        case 'ass': {
            return assToVtt(text);
        }
        case 'vtt': {
            return text;
        }
        default:
            return '';
    }
}

function mergeVtts(vtts, subtitles) {
    const parser = new WebVTTParser();
    const seri = new WebVTTSerializer();
    const result = parser.parse('', 'metadata');

    for (let i = 0; i < vtts.length; i++) {
        const option = subtitles[i];
        const tree = parser.parse(vtts[i], 'metadata');

        for (let j = 0; j < tree.cues.length; j++) {
            const cue = tree.cues[j];
            for (let k = 0; k < cue.tree.children.length; k++) {
                const children = cue.tree.children[k];
                children.value = `<div class="art-subtitle-${option.name}">${children.value}</div>`;
            }
        }

        if (result.cues.length === 0) {
            result.cues = tree.cues;
        } else {
            for (let l = 0; l < result.cues.length; l++) {
                result.cues[l].tree.children.push(...(tree.cues[l]?.tree?.children || []));
            }
        }
    }

    return seri.serialize(result.cues);
}

export default function artplayerPluginMultipleSubtitles({ subtitles }) {
    return async (art) => {
        const vtts = await Promise.all(subtitles.map(loadSubtitleAsVtt));
        const vtt = mergeVtts(vtts, subtitles);
        const url = URL.createObjectURL(new Blob([vtt], { type: 'text/vtt' }));

        art.option.subtitle.escape = false;

        art.subtitle.init({
            ...art.option.subtitle,
            url,
            type: 'vtt',
            onVttLoad: unescape,
        });
    };
}
artplayerPluginMultipleSubtitles.env = process.env.NODE_ENV;
artplayerPluginMultipleSubtitles.version = process.env.APP_VER;
artplayerPluginMultipleSubtitles.build = process.env.BUILD_DATE;

if (typeof window !== 'undefined') {
    window['artplayerPluginMultipleSubtitles'] = artplayerPluginMultipleSubtitles;
}
