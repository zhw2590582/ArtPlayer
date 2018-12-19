import { errorHandle } from '../utils';

export default function fetchStream(flv, url) {
    flv.emit('flvFetchStart');
    fetch(url).then(response => {
        errorHandle(
            response.ok && response.status >= 200 && response.status <= 299,
            `${response.status} ${response.statusText}`,
        );
        const contentLength = response.headers.get('content-length');
        const contentType = response.headers.get('content-type');
        // errorHandle(contentLength, 'Content-Length response header unavailable');
        errorHandle(contentType.includes('x-flv'), 'The resource does not seem to be a flv file');
        flv.emit('flvFetchInfo', {
            type: contentType,
            length: contentLength,
        });
        return new Response(
            new ReadableStream({
                start(controller) {
                    const reader = response.body.getReader();
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
