import { WebVTTParser, WebVTTSerializer } from './parser';

async function loadVtt(option, { getExt, srtToVtt, assToVtt }) {
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

function mergeTrees(trees) {
    const parser = new WebVTTParser();
    const result = parser.parse('', 'metadata');

    for (let i = 0; i < trees.length; i++) {
        const tree = trees[i];

        if (!tree.updated) {
            tree.updated = true;
            for (let j = 0; j < tree.cues.length; j++) {
                const cue = tree.cues[j];
                for (let k = 0; k < cue.tree.children.length; k++) {
                    const children = cue.tree.children[k];
                    children.value = `<div class="art-subtitle-${tree.name}">${children.value}</div>`;
                }
            }
        }

        result.cues.push(...tree.cues);
    }

    return result;
}

export default function artplayerPluginMultipleSubtitles({ subtitles = [] }) {
    return async (art) => {
        const { unescape, getExt, srtToVtt, assToVtt } = art.constructor.utils;

        const parser = new WebVTTParser();
        const seri = new WebVTTSerializer();

        const vtts = await Promise.all(
            subtitles.map((option) => {
                return loadVtt(option, { getExt, srtToVtt, assToVtt });
            }),
        );

        const trees = vtts.map((vtt, index) => {
            const tree = parser.parse(vtt, 'metadata');
            tree.url = subtitles[index].url;
            tree.name = subtitles[index].name;
            return tree;
        });

        let lastUrl = '';
        function setTracks(trees = []) {
            const tree = mergeTrees(trees);
            const vtt = seri.serialize(tree.cues);
            URL.revokeObjectURL(lastUrl);
            const url = URL.createObjectURL(new Blob([vtt], { type: 'text/vtt' }));
            lastUrl = url;
            art.option.subtitle.escape = false;
            art.subtitle.init({
                ...art.option.subtitle,
                url,
                type: 'vtt',
                onVttLoad: unescape,
            });
        }

        setTracks(trees);

        return {
            name: 'multipleSubtitles',
            tracks(names = []) {
                return setTracks(names.map((name) => trees.find((tree) => tree.name === name)));
            },
            reset() {
                return setTracks(trees);
            },
        };
    };
}

if (typeof window !== 'undefined') {
    window['artplayerPluginMultipleSubtitles'] = artplayerPluginMultipleSubtitles;
}
