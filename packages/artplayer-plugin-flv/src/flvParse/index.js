import fetchStream from './fetchStream';
import readFile from './readFile';
import getMetaData from './getMetaData';
import { mergeTypedArrays, getUint8Sum } from '../utils';

export default class FlvParse {
    constructor(flv) {
        this.flv = flv;
        const { url } = flv.options;
        this.uint8 = new Uint8Array(0);
        this.index = 0;
        this.header = null;
        this.metadata = null;
        this.tags = [];
        this.done = false;

        flv.on('flvFetchStart', () => {
            console.log('[flv-fetch-start]');
        });

        flv.on('flvFetchCancel', () => {
            console.log('[flv-fetch-cancel]');
        });

        flv.on('flvFetchError', error => {
            console.log('[flv-fetch-error]', error);
        });

        flv.on('flvFetching', uint8 => {
            this.uint8 = mergeTypedArrays(this.uint8, uint8);
            this.parse();
        });

        flv.on('flvFetchEnd', uint8 => {
            console.log('[flv-fetch-end]');
            this.done = true;
            if (uint8) {
                this.uint8 = uint8;
                this.index = 0;
                this.header = null;
                this.metadata = null;
                this.tags = [];
                this.parse();
            }
            flv.emit('parseDone');
        });

        if (typeof url === 'string') {
            fetchStream(flv, url);
        } else {
            readFile(flv, url);
        }
    }

    parse() {
        if (this.uint8.length >= 13 && !this.header) {
            const header = Object.create(null);
            header.signature = this.read(3);
            header.version = this.read(1);
            header.flags = this.read(1);
            header.headersize = this.read(4);
            this.header = header;
            this.read(4);
            this.flv.emit('parseHeader', this.header);
            console.log(this.header);
        }

        while (this.index < this.uint8.length) {
            const tag = Object.create(null);
            tag.tagType = this.read(1);
            tag.dataSize = this.read(3);
            tag.timestamp = this.read(4);
            tag.streamID = this.read(3);
            tag.body = this.read(getUint8Sum(tag.dataSize));
            this.tags.push(tag);
            this.read(4);
            this.flv.emit('parseTag', tag);
        }

        if (this.tags.length > 1 && this.tags[0].tagType[0] === 18 && !this.metadata) {
            this.metadata = getMetaData(this.tags[0]);
            this.flv.emit('parseMetadata', this.metadata);
            console.log(this.metadata);
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
}
