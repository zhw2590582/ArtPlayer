export default function checkSupport(art) {
    const {
        utils: { errorHandle },
        config: { mimeCodec },
    } = art.constructor;

    const {
        template: { $video },
    } = art;

    const canPlay = $video.canPlayType(mimeCodec.mp4);
    errorHandle(
        window.MediaSource &&
            window.MediaSource.isTypeSupported(mimeCodec.mp4) &&
            (canPlay === 'probably' || canPlay === 'maybe'),
        `Unsupported MIME type or codec: ${mimeCodec.mp4}`,
    );
}
