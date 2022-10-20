class IframeHelper {
    static postMessage({ type, data, id = 0 }) {
        window.parent.postMessage(
            {
                type: type,
                data: data,
                id: id,
            },
            '*',
        );
    }

    static async onMessage(event) {
        const { type, data, id } = event.data;
        switch (type) {
            case 'commit':
                try {
                    if (data.match(/resolve\((.*?)\)/)) {
                        const string = `return new Promise(function(resolve){\n${data}\n})`;
                        const result = await new Function(string)();
                        IframeHelper.postMessage({ type: 'response', data: result, id });
                    } else {
                        const result = new Function(data)();
                        IframeHelper.postMessage({ type: 'response', data: result, id });
                    }
                } catch (error) {
                    IframeHelper.postMessage({ type: 'error', data: error.message, id });
                }
                break;
            case 'destroy':
                if (!IframeHelper.isDestroy) {
                    IframeHelper.destroy();
                }
                break;
            default:
                break;
        }
    }

    static inject() {
        IframeHelper.isInject = true;
        IframeHelper.isDestroy = false;
        IframeHelper.postMessage({ type: 'inject' });
        window.addEventListener('message', IframeHelper.onMessage);
    }

    static destroy() {
        IframeHelper.isInject = false;
        IframeHelper.isDestroy = true;
        IframeHelper.postMessage({ type: 'destroy' });
        window.removeEventListener('message', IframeHelper.onMessage);
    }

    constructor({ iframe, url }) {
        this.promises = {};
        this.isInject = false;
        this.isDestroy = false;
        this.$iframe = iframe;
        this.messageCallback = null;
        this.onMessage = this.onMessage.bind(this);
        window.addEventListener('message', this.onMessage);
        this.$iframe.src = url;
    }

    onMessage(event) {
        const { type, data, id } = event.data;

        switch (type) {
            case 'inject':
                this.isInject = true;
                break;
            case 'destroy':
                this.isInject = false;
                if (!this.isDestroy) {
                    this.destroy();
                }
                break;
            default:
                break;
        }

        if (this.promises[id]) {
            if (type === 'error') {
                this.promises[id].reject(new Error(data));
            } else {
                this.promises[id].resove(data);
            }
            delete this.promises[id];
        }

        if (this.messageCallback) {
            this.messageCallback({ type, data });
        }
    }

    postMessage({ type, data }) {
        return new Promise((resove, reject) => {
            (function loop() {
                if (this.isInject) {
                    const id = Date.now();
                    this.promises[id] = { resove, reject };
                    this.$iframe.contentWindow.postMessage(
                        {
                            type: type,
                            data: data,
                            id: id,
                        },
                        '*',
                    );
                } else {
                    if (!this.isDestroy) {
                        setTimeout(loop.bind(this), 200);
                    }
                }
            }.call(this));
        });
    }

    commit(callback) {
        const callbackString = callback.toString();
        const bodyString = callbackString.substring(callbackString.indexOf('{') + 1, callbackString.lastIndexOf('}'));
        return this.postMessage({ type: 'commit', data: bodyString });
    }

    message(callback) {
        this.messageCallback = callback;
    }

    destroy() {
        this.isDestroy = true;
        window.removeEventListener('message', this.onMessage);
    }
}

window['IframeHelper'] = IframeHelper;
