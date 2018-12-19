import fetchStream from './fetchStream';
import readFile from './readFile';
import { mergeTypedArrays } from '../utils';

export default class FlvParse {
    constructor(flv) {
        this.flv = flv;
        this.uint8 = new Uint8Array(0);
        this.index = 0;
        this.header = null;
        this.tags = [];

        flv.on('flvFetchStart', () => {
            console.log('flvFetchStart');
        });

        flv.on('flvFetchCancel', () => {
            console.log('flvFetchCancel');
        });

        flv.on('flvFetchError', error => {
            console.log('flvFetchError', error);
        });

        flv.on('flvFetching', value => {
            this.uint8 = mergeTypedArrays(this.uint8, new Uint8Array(value));
            console.log(this.uint8.length);
            this.parseHeader();
        });

        flv.on('flvFetchEnd', value => {
            console.log('flvFetchEnd');
            if (value) {
                this.uint8 = value;
                this.index = 0;
                this.header = null;
                this.tags = [];
                this.parseHeader();
                // this.parseTags();
            }
        });

        const { url } = flv.options;
        if (typeof url === 'string') {
            fetchStream(flv, url);
        } else {
            readFile(flv, url);
        }
    }

    parseHeader() {
        if (this.uint8.length >= 13 && !this.header) {
            const header = {};
            header.signature = this.read(3);
            header.version = this.read(1);
            header.flags = this.read(1);
            header.headersize = this.read(4);
            this.header = header;
            this.read(4);
            console.log(this.header);
        }
    }

    parseTags() {
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

    verifyTags() {
        const state = this.tags.some(item => {
            const tagType = item.tagType[0];
            return ![18, 9, 8].includes(tagType);
        });

        console.log(state ? '验证不通过' : '验证通过');
    }

    static getBodySum(arr) {
        return arr[0] * 256 ** 2 + arr[1] * 256 + arr[2];
    }
}
