import config from './config';

export default class CreatMediaSource {
    constructor(flv) {
        this.flv = flv;
        this.mediaSource = new MediaSource();
        const url = URL.createObjectURL(this.mediaSource);
        flv.events.destroyEvents.push(() => {
            URL.revokeObjectURL(url);
        });
        flv.mediaElement.src = url;
    }

    eventBind() {
        const {
            events: { proxy },
        } = this.flv;

        config.mediaSource.events.forEach(eventName => {
            proxy(this.mediaSource, eventName, event => {
                this.art.emit(`mediaSource:${event.type}`, event);
            });
        });

        config.sourceBufferList.events.forEach(eventName => {
            proxy(this.mediaSource.sourceBuffers, eventName, event => {
                this.art.emit(`sourceBuffers:${event.type}`, event);
            });
            proxy(this.mediaSource.activeSourceBuffers, eventName, event => {
                this.art.emit(`activeSourceBuffers:${event.type}`, event);
            });
        });
    }
}
