import fetchStream from './fetchStream';
import readFile from './readFile';
import getMetaData from './getMetaData';
import { mergeTypedArrays, getUint8Sum, bin2String } from '../utils';

export default class FlvParse {
    constructor(flv) {
        this.flv = flv;
        const { url, debug } = flv.options;
        this.uint8 = new Uint8Array(0);
        this.index = 0;
        this.header = null;
        this.metadata = null;
        this.tags = [];
        this.done = false;

        flv.on('flvFetchStart', () => {
            if (debug) {
                console.log('[flv-fetch-start]', url);
            }
        });

        flv.on('flvFetchCancel', () => {
            if (debug) {
                console.log('[flv-fetch-cancel]');
            }
        });

        flv.on('flvFetching', uint8 => {
            this.uint8 = mergeTypedArrays(this.uint8, uint8);
            this.parse();
        });

        flv.on('flvFetchEnd', uint8 => {
            if (debug) {
                console.log('[flv-fetch-end]');
            }
            this.done = true;
            if (uint8) {
                this.uint8 = uint8;
                this.index = 0;
                this.header = null;
                this.metadata = null;
                this.tags = [];
                this.parse();
            }
            flv.emit('flvParseDone');
            if (debug) {
                console.log('[flv-parse-done]');
            }
        });

        if (typeof url === 'string') {
            fetchStream(flv, url);
        } else {
            readFile(flv, url);
        }
    }

    parse() {
        const { debug } = this.flv.options;
        if (this.uint8.length >= 13 && !this.header) {
            const header = Object.create(null);
            header.signature = bin2String(this.read(3));
            [header.version] = this.read(1);
            [header.flags] = this.read(1);
            header.headersize = getUint8Sum(this.read(4));
            this.header = header;
            this.read(4);
            this.flv.emit('flvParseHeader', this.header);
            if (debug) {
                console.log('[flv-parse-header]', this.header);
            }
        }

        while (this.index < this.uint8.length) {
            const tag = Object.create(null);
            [tag.tagType] = this.read(1);
            tag.dataSize = getUint8Sum(this.read(3));
            tag.timestamp = this.read(4);
            tag.streamID = this.read(3);
            tag.body = this.read(tag.dataSize);
            this.tags.push(tag);
            this.read(4);
            this.flv.emit('flvParseTag', tag);
        }

        if (this.tags.length > 1 && this.tags[0].tagType === 18 && !this.metadata) {
            this.metadata = getMetaData(this.tags[0]);
            this.flv.emit('parseMetadata', this.metadata);
            if (debug) {
                console.log('[flv-parse-metadata]', this.metadata);
            }
        }
    }

    read(length) {
        const tempUint8 = new Uint8Array(length);
        for (let i = 0; i < length; i += 1) {
            tempUint8[i] = this.uint8[this.index];
            this.index += 1;
        }
        return tempUint8;
    }
}
