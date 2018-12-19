import { errorHandle } from '.';

export default function checkSupport(options) {
    const { mediaElement, url } = options;
    errorHandle(mediaElement instanceof HTMLVideoElement, 'The first parameter is not a video tag element');
    errorHandle(
        typeof url === 'string' || (url instanceof File && url.type === 'video/x-flv'),
        'The second parameter is not a string type or flv file',
    );

    const MP4H264MimeCodec = 'video/mp4; codecs="avc1.42001E, mp4a.40.2"';
    const canPlay = mediaElement.canPlayType(MP4H264MimeCodec);
    errorHandle(
        window.MediaSource &&
            window.MediaSource.isTypeSupported(MP4H264MimeCodec) &&
            (canPlay === 'probably' || canPlay === 'maybe'),
        `Unsupported MIME type or codec: ${MP4H264MimeCodec}`,
    );

    errorHandle(typeof window.Promise === 'function', "Unsupported 'Promise' method");
    errorHandle(typeof window.fetch === 'function', "Unsupported 'fetch' method");
}
