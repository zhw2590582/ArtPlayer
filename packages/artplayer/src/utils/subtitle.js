export function srtToVtt(srtText) {
    return 'WEBVTT \r\n\r\n'.concat(
        srtText
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
