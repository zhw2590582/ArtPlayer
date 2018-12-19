import config from './config';

export default class CreatMediaSource {
    constructor(flv) {
        this.flv = flv;
        this.creatUrl();
        this.eventBind();
    }

    creatUrl() {
        const {
            options: { mediaElement },
            events: { destroyEvents },
        } = this.flv;
        this.mediaSource = new MediaSource();
        const url = URL.createObjectURL(this.mediaSource);
        destroyEvents.push(() => {
            URL.revokeObjectURL(url);
        });
        mediaElement.src = url;
    }

    eventBind() {
        const {
            events: { proxy },
        } = this.flv;

        config.mediaSource.events.forEach(eventName => {
            proxy(this.mediaSource, eventName, event => {
                this.flv.emit(`mediaSource:${event.type}`, event);
            });
        });

        config.sourceBufferList.events.forEach(eventName => {
            proxy(this.mediaSource.sourceBuffers, eventName, event => {
                this.flv.emit(`sourceBuffers:${event.type}`, event);
            });
            proxy(this.mediaSource.activeSourceBuffers, eventName, event => {
                this.flv.emit(`activeSourceBuffers:${event.type}`, event);
            });
        });
    }
}
