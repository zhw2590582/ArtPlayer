import { errorHandle, request } from './utils';
import mimeCodeces from './utils/mimeCodeces';
import mseConfig from './utils/mseConfig';

export default class Mse {
  constructor(art) {
    this.art = art;
    this.setMimeCodec();
    this.init();
    this.eventBind();
    this.eventStart();
  }

  setMimeCodec() {
    const { option } = this.art;
    if (!option.type) {
      const type = option.url.trim().toLowerCase().split('.').pop();
      errorHandle(
        Object.keys(mimeCodeces).includes(type),
        `Can't find video's type '${type}' from '${option.url}'`
      );
      option.type = type;
    }

    if (!option.mimeCodec) {
      const mimeCodec = mimeCodeces[option.type];
      errorHandle(
        mimeCodec,
        `Can't find video's mimeCodec from ${option.type}`
      );
      option.mimeCodec = mimeCodec;
    }
  }

  init() {
    const {
      option,
      refs: { $video }
    } = this.art;
    errorHandle(
      MediaSource.isTypeSupported(option.mimeCodec),
      `Unsupported MIME type or codec: ${option.mimeCodec}`
    );
    this.mediaSource = new MediaSource();
    $video.src = URL.createObjectURL(this.mediaSource);
    this.art.events.destroys.push(() => {
      URL.revokeObjectURL($video.src);
    });
  }

  eventBind() {
    const { proxy } = this.art.events;
    const { instance, sourceBufferList } = mseConfig;

    instance.events.forEach(eventName => {
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
  }

  eventStart() {
    const { option } = this.art;
    const { proxy } = this.art.events;
    const { sourceBuffer } = mseConfig;

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

    request(option.url).then(response => {
      this.sourceBuffer.appendBuffer(response);
    });
  }
}
