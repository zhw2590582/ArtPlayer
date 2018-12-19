import { errorHandle } from '../utils';

export default function fetchStream(flv, url) {
    flv.emit('flvFetchStart');
    fetch(url).then(response => {
        errorHandle(
            response.ok && response.status >= 200 && response.status <= 299,
            `${response.status} ${response.statusText}`,
        );
        const contentType = response.headers.get('content-type');
        errorHandle(contentType.includes('x-flv'), 'The resource does not seem to be a flv file');
        return new Response(
            new ReadableStream({
                start(controller) {
                    const reader = response.body.getReader();

                    flv.on('destroy', () => {
                        reader.cancel();
                    });

                    flv.on('readerCancel', () => {
                        reader.cancel();
                    });

                    (function read() {
                        reader
                            .read()
                            .then(({ done, value }) => {
                                if (done) {
                                    flv.emit('flvFetchEnd');
                                    controller.close();
                                    return;
                                }
                                flv.emit('flvFetching', value);
                                controller.enqueue(value);
                                read();
                            })
                            .catch(error => {
                                flv.emit('flvFetchError', error);
                            });
                    })();
                },
                cancel() {
                    flv.emit('flvFetchCancel');
                },
            }),
        );
    });
}
