import { errorHandle, getExt } from './utils';
import config from './config';

export default class Mse {
    constructor(art) {
        this.art = art;
        if (art.option.mse) {
            this.setMimeCodec();
            this.setVideoSrc();
            this.eventBind();
        }
    }

    setMimeCodec() {
        const { option } = this.art;
        if (!option.type) {
            const type = getExt(option.url);
            errorHandle(
                Object.keys(config.mimeCodec).includes(type),
                `Can't find video's type '${type}' from '${option.url}'`,
            );
            option.type = type;
        }

        if (!option.mimeCodec) {
            const mimeCodec = config.mimeCodec[option.type];
            errorHandle(mimeCodec, `Can't find video's mimeCodec from ${option.type}`);
            option.mimeCodec = mimeCodec;
        }
    }

    setVideoSrc() {
        const { option, player, events } = this.art;
        errorHandle(
            'MediaSource' in window && MediaSource.isTypeSupported(option.mimeCodec),
            `Unsupported MIME type or codec: ${option.mimeCodec}`,
        );
        this.mediaSource = new MediaSource();
        Object.defineProperty(player, 'mountUrl', {
            value: () => {
                this.url = URL.createObjectURL(this.mediaSource);
                events.destroyEvents.push(() => {
                    URL.revokeObjectURL(this.url);
                });
                return this.url;
            },
        });
    }

    eventBind() {
        const {
            option,
            events: { proxy },
        } = this.art;
        const { mediaSource, sourceBufferList, sourceBuffer } = config.mse;
        mediaSource.events.forEach(eventName => {
            proxy(this.mediaSource, eventName, event => {
                this.art.emit(`mediaSource:${event.type}`, event);
            });
        });

        sourceBufferList.events.forEach(eventName => {
            proxy(this.mediaSource.sourceBuffers, eventName, event => {
                this.art.emit(`sourceBuffers:${event.type}`, event);
            });
            proxy(this.mediaSource.activeSourceBuffers, eventName, event => {
                this.art.emit(`activeSourceBuffers:${event.type}`, event);
            });
        });

        this.art.on('mediaSource:sourceopen', () => {
            this.sourceBuffer = this.mediaSource.addSourceBuffer(option.mimeCodec);
            sourceBuffer.events.forEach(eventName => {
                proxy(this.sourceBuffer, eventName, event => {
                    this.art.emit(`sourceBuffer:${event.type}`, event);
                });
            });
        });

        this.art.on('sourceBuffer:updateend', () => {
            this.mediaSource.endOfStream();
        });
    }
}
