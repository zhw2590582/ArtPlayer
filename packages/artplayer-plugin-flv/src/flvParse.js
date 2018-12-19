export default class FlvParse {
    constructor(flv) {
        this.flv = flv;
        this.uint8 = [];
        this.index = 0;
        this.header = {};
        this.tags = [];
        if (typeof flv.options.url === 'string') {
            this.fromNetwork(flv.url);
        } else {
            this.fromLocal(flv.url);
        }
    }

    fromNetwork(url) {
        console.log(this.flv.options.url);
    }

    fromLocal(file) {
        const {
            events: { proxy },
        } = this.flv;
        const reader = new FileReader();
        proxy(reader, 'load', e => {
            const buffer = e.target.result;
            this.uint8 = new Uint8Array(buffer);
            this.parse();
        });
        reader.readAsArrayBuffer(file);
    }

    parse() {
        this.header.signature = this.read(3);
        this.header.version = this.read(1);
        this.header.flags = this.read(1);
        this.header.headersize = this.read(4);
        this.read(4);
        while (this.index < this.uint8.length) {
            const tag = {};
            tag.tagType = this.read(1);
            tag.dataSize = this.read(3);
            tag.Timestamp = this.read(4);
            tag.StreamID = this.read(3);
            tag.body = this.read(FlvParse.getBodySum(tag.dataSize));
            this.tags.push(tag);
            this.read(4);
        }
    }

    read(length) {
        const tempUint8 = [];
        for (let i = 0; i < length; i += 1) {
            tempUint8.push(this.uint8[this.index]);
            this.index += 1;
        }
        return tempUint8;
    }

    static getBodySum(arr) {
        return arr[0] * 256 ** 2 + arr[1] * 256 + arr[2];
    }
}
