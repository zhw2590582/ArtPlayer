export function srtToVtt(srtText) {
    return 'WEBVTT \r\n\r\n'.concat(
        srtText
            .replace(/{[\s\S]*?}/g, '')
            .replace(/\{\\([ibu])\}/g, '</$1>')
            .replace(/\{\\([ibu])1\}/g, '<$1>')
            .replace(/\{([ibu])\}/g, '<$1>')
            .replace(/\{\/([ibu])\}/g, '</$1>')
            .replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2')
            .concat('\r\n\r\n'),
    );
}

export function vttToBlob(vttText) {
    return URL.createObjectURL(
        new Blob([vttText], {
            type: 'text/vtt',
        }),
    );
}

export function assToVtt(ass) {
    const reAss = new RegExp(
        'Dialogue:\\s\\d,' +
            '(\\d+:\\d\\d:\\d\\d.\\d\\d),' +
            '(\\d+:\\d\\d:\\d\\d.\\d\\d),' +
            '([^,]*),' +
            '([^,]*),' +
            '(?:[^,]*,){4}' +
            '([\\s\\S]*)$',
        'i',
    );

    function fixTime(time = '') {
        return time
            .split(/[:.]/)
            .map((item, index, arr) => {
                if (index === arr.length - 1) {
                    if (item.length === 1) {
                        return `.${item}00`;
                    }

                    if (item.length === 2) {
                        return `.${item}0`;
                    }
                } else if (item.length === 1) {
                    return (index === 0 ? '0' : ':0') + item;
                }

                // eslint-disable-next-line no-nested-ternary
                return index === 0 ? item : index === arr.length - 1 ? `.${item}` : `:${item}`;
            })
            .join('');
    }

    return `WEBVTT\n\n${ass
        .split(/\r?\n/)
        .map(line => {
            const m = line.match(reAss);
            if (!m) return null;
            return {
                start: fixTime(m[1].trim()),
                end: fixTime(m[2].trim()),
                text: m[5]
                    .replace(/{[\s\S]*?}/g, '')
                    .replace(/(\\N)/g, '\n')
                    .trim()
                    .split(/\r?\n/)
                    .map(item => item.trim())
                    .join('\n'),
            };
        })
        .filter(line => line)
        .map((line, index) => {
            if (line) {
                return `${index + 1}\n${line.start} --> ${line.end}\n${line.text}`;
            }
            return '';
        })
        .filter(line => line.trim())
        .join('\n\n')}`;
}
