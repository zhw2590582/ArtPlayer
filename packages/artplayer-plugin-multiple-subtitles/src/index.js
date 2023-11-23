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

async function loadVtt(option, art) {
    const { getExt, srtToVtt, assToVtt } = art.constructor.utils;
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

function mergeTrees(trees, subtitles) {
    const parser = new WebVTTParser();
    const result = parser.parse('', 'metadata');

    for (let i = 0; i < trees.length; i++) {
        const tree = trees[i];
        const option = subtitles[i];

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

    return result;
}

const all = '_ALL_';
export default function artplayerPluginMultipleSubtitles({ subtitles, onMerge = () => null }) {
    return async (art) => {
        const parser = new WebVTTParser();
        const seri = new WebVTTSerializer();

        const vtts = await Promise.all(subtitles.map((option) => loadVtt(option, art)));
        const trees = vtts.map((vtt) => parser.parse(vtt, 'metadata'));
        const tree = onMerge(trees, subtitles) || mergeTrees(trees, subtitles);

        function setTree(tree) {
            if (!tree?.cues) return;
            const vtt = seri.serialize(tree.cues);
            const url = URL.createObjectURL(new Blob([vtt], { type: 'text/vtt' }));
            art.option.subtitle.escape = false;
            art.subtitle.init({
                ...art.option.subtitle,
                url,
                type: 'vtt',
                onVttLoad: unescape,
            });
        }

        setTree(tree);
        let _track = all;

        return {
            name: 'multipleSubtitles',
            get track() {
                return _track;
            },
            set track(name) {
                if (name === all || name === '') {
                    _track = all;
                    setTree(tree);
                } else {
                    const index = subtitles.findIndex((item) => item.name === name);
                    if (index === -1) {
                        throw new Error(`The subtitle "${name}" is not found`);
                    } else {
                        _track = name;
                        setTree(trees[index]);
                    }
                }
            },
        };
    };
}

artplayerPluginMultipleSubtitles.env = process.env.NODE_ENV;
artplayerPluginMultipleSubtitles.version = process.env.APP_VER;
artplayerPluginMultipleSubtitles.build = process.env.BUILD_DATE;

artplayerPluginMultipleSubtitles.all = all;
artplayerPluginMultipleSubtitles.WebVTTParser = WebVTTParser;
artplayerPluginMultipleSubtitles.WebVTTSerializer = WebVTTSerializer;

if (typeof window !== 'undefined') {
    window['artplayerPluginMultipleSubtitles'] = artplayerPluginMultipleSubtitles;
}
