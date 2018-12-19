export default function readFile(flv, file) {
    flv.emit('flvFetchStart');
    const { proxy } = flv.events;
    const reader = new FileReader();
    proxy(reader, 'load', e => {
        const buffer = e.target.result;
        const uint8 = new Uint8Array(buffer);
        flv.emit('flvFetchEnd', uint8);
    });
    reader.readAsArrayBuffer(file);
}
