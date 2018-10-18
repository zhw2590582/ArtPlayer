import { errorHandle, request, getExt } from './utils';
import config from './config';

export default class Mse {
  constructor(art) {
    this.art = art;
    this.setMimeCodec();
    this.init();
    this.eventBind();
    this.eventStart();
    this.repeat = 0;
    this.maxRepeat = 5;
  }

  setMimeCodec() {
    const { option } = this.art;
    if (!option.type) {
      const type = getExt(option.url);
      errorHandle(
        Object.keys(config.mimeCodec).includes(type),
        `Can't find video's type '${type}' from '${option.url}'`
      );
      option.type = type;
    }

    if (!option.mimeCodec) {
      const mimeCodec = config.mimeCodec[option.type];
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
    this.art.events.destroyEvents.push(() => {
      URL.revokeObjectURL($video.src);
    });
  }

  eventBind() {
    const { proxy } = this.art.events;
    const { mediaSource, sourceBufferList } = config.mse;

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
  }

  eventStart() {
    const { option } = this.art;
    const { proxy } = this.art.events;
    const { sourceBuffer } = config.mse;

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

    this.fetchUrl();
  }

  fetchUrl() {
    const { option: { url }, notice, i18n, loading } = this.art;
    this.art.emit('player:fetch:start', url);
    request(url)
      .then(response => {
        this.sourceBuffer.appendBuffer(response);
        this.art.emit('player:fetch:success', url);
      })
      .catch(err => {
        if (this.repeat++ < this.maxRepeat) {
          this.fetchUrl();
        } else {
          notice.show(i18n.get('Video load failed'));
          console.warn(err);
          loading.hide();
          this.art.emit('player:fetch:failure', url);
        }
      });
  }
}
