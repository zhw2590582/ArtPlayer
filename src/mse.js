import { errorHandle, request } from './utils';
import mimeCodeces from './utils/mimeCodeces';
import mseConfig from './utils/mseConfig';

export default class Mse {
  constructor(art) {
    this.art = art;
    this.setMimeCodec();
    this.mediaSourceEventFn = this.mediaSourceEventFn.bind(this);
    this.sourceBufferEventFn = this.sourceBufferEventFn.bind(this);
    this.sourceBuffersEventFn = this.sourceBuffersEventFn.bind(this);
    this.activeSourceBuffersEventFn = this.activeSourceBuffersEventFn.bind(this);
    this.init();
    this.eventBind();
    this.eventStart();
  }

  setMimeCodec() {
    const { option } = this.art;
    if (!option.type) {
      const urlArr = option.url
        .trim()
        .toLowerCase()
        .split('.');
      const type = urlArr[urlArr.length - 1];
      errorHandle(
        Object.keys(mimeCodeces).includes(type),
        `Can't find video's type from ${option.url}`
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
    this.art.destroyEvents.push(() => {
      URL.revokeObjectURL($video.src);
    });
  }

  eventBind() {
    const { instance, sourceBufferList } = mseConfig;

    instance.events.forEach(eventName => {
      this.mediaSource.addEventListener(eventName, this.mediaSourceEventFn);
      this.art.destroyEvents.push(() => {
        this.mediaSource.removeEventListener(eventName, this.mediaSourceEventFn);
      });
    });

    sourceBufferList.events.forEach(eventName => {
      this.mediaSource.sourceBuffers.addEventListener(eventName, this.sourceBuffersEventFn);
      this.art.destroyEvents.push(() => {
        this.mediaSource.sourceBuffers.removeEventListener(eventName, this.sourceBuffersEventFn);
      });

      this.mediaSource.activeSourceBuffers.addEventListener(eventName, this.activeSourceBuffersEventFn);
      this.art.destroyEvents.push(() => {
        this.mediaSource.activeSourceBuffers.removeEventListener(eventName, this.activeSourceBuffersEventFn);
      });
    });
  }

  eventStart() {
    const { option } = this.art;
    const { sourceBuffer } = mseConfig;

    this.art.on('mediaSource:sourceopen', () => {
      this.sourceBuffer = this.mediaSource.addSourceBuffer(option.mimeCodec);
      sourceBuffer.events.forEach(eventName => {
        this.sourceBuffer.addEventListener(eventName, this.sourceBufferEventFn);
        this.art.destroyEvents.push(() => {
          this.sourceBuffer.removeEventListener(eventName, this.sourceBufferEventFn);
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

  mediaSourceEventFn(event) {
    this.art.emit(`mediaSource:${event.type}`, event);
  }

  sourceBufferEventFn(event) {
    this.art.emit(`sourceBuffer:${event.type}`, event);
  }

  sourceBuffersEventFn(event) {
    this.art.emit(`sourceBuffers:${event.type}`, event);
  }

  activeSourceBuffersEventFn(event) {
    this.art.emit(`activeSourceBuffers:${event.type}`, event);
  }
}
