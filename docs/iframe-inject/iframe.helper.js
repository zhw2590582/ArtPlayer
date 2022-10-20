class IframeHelper {
    static postMessage(id, type, data) {
        window.parent.postMessage(
            {
                id: id,
                type: type,
                data: data,
            },
            '*',
        );
    }

    static onMessage(event) {
        const { id, type, data } = event.data;
        switch (type) {
            case 'commit':
                try {
                    IframeHelper.postMessage(id, 'response', new Function(data)());
                } catch (error) {
                    IframeHelper.postMessage(id, 'error', error.message);
                }
                break;
            default:
                break;
        }
    }

    static inject() {
        IframeHelper.postMessage(0, 'inject');
        window.addEventListener('message', IframeHelper.onMessage);
    }

    static destroy() {
        window.removeEventListener('message', IframeHelper.onMessage);
    }

    constructor({ iframe, url }) {
        this.promises = {};
        this.isInject = false;
        this.$iframe = iframe;
        this.onMessage = this.onMessage.bind(this);
        window.addEventListener('message', this.onMessage);
        this.$iframe.src = url;
    }

    onMessage(event) {
        const { id, type, data } = event.data;

        switch (type) {
            case 'inject':
                this.isInject = true;
                break;
            case 'destroy':
                this.isInject = false;
                break;
            default:
                break;
        }

        if (this.promises[id]) {
            if (type === 'error') {
                this.promises[id].reject(data);
            } else {
                this.promises[id].resove(data);
            }

            delete this.promises[id];
        }
    }

    postMessage(type, data) {
        return new Promise((resove, reject) => {
            (function loop() {
                if (this.isInject) {
                    const id = Date.now();
                    this.promises[id] = { resove, reject };
                    this.$iframe.contentWindow.postMessage(
                        {
                            id: id,
                            type: type,
                            data: data,
                        },
                        '*',
                    );
                } else {
                    setTimeout(loop.bind(this), 200);
                }
            }.call(this));
        });
    }

    commit(callback) {
        const callbackString = callback.toString();
        const bodyString = callbackString
            .substring(callbackString.indexOf('{') + 1, callbackString.lastIndexOf('}'))
            .trim();
        return this.postMessage('commit', bodyString);
    }

    destroy() {
        window.removeEventListener('message', this.onMessage);
    }
}

window['IframeHelper'] = IframeHelper;
