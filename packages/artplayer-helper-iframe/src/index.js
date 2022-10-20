export default class ArtplayerHelperIframe {
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
                    if (data.match(/\bresolve\((.*?)\)/)) {
                        const string = `return new Promise(function(resolve){\n${data}\n})`;
                        const result = await new Function(string)();
                        ArtplayerHelperIframe.postMessage({ type: 'response', data: result, id });
                    } else {
                        const result = new Function(data)();
                        ArtplayerHelperIframe.postMessage({ type: 'response', data: result, id });
                    }
                } catch (error) {
                    ArtplayerHelperIframe.postMessage({ type: 'error', data: error.message, id });
                }
                break;
            default:
                break;
        }
    }

    static inject() {
        ArtplayerHelperIframe.postMessage({ type: 'inject' });
        window.addEventListener('message', ArtplayerHelperIframe.onMessage);
    }

    constructor({ iframe, url }) {
        if (iframe instanceof HTMLIFrameElement === false) {
            throw new Error('option.iframe needs to be a HTMLIFrameElement');
        }

        if (typeof url !== 'string') {
            throw new Error('option.url needs to be a string');
        }

        this.url = url;
        this.$iframe = iframe;
        this.promises = {};
        this.injected = false;
        this.destroyed = false;
        this.messageCallback = () => null;
        this.onMessage = this.onMessage.bind(this);
        window.addEventListener('message', this.onMessage);
        this.$iframe.src = this.url;
    }

    onMessage(event) {
        const { type, data, id } = event.data;

        switch (type) {
            case 'inject':
                this.injected = true;
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
                if (this.destroyed) {
                    reject(new Error('the instance has been destroyed'));
                } else {
                    if (this.injected) {
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
                        setTimeout(loop.bind(this), 200);
                    }
                }
            }.call(this));
        });
    }

    commit(callback) {
        if (typeof callback !== 'function') {
            throw new Error('commit.callback needs to be a function');
        }
        const callbackString = callback.toString();
        const bodyString = callbackString.substring(callbackString.indexOf('{') + 1, callbackString.lastIndexOf('}'));
        return this.postMessage({ type: 'commit', data: bodyString });
    }

    message(callback) {
        if (typeof callback !== 'function') {
            throw new Error('message.callback needs to be a function');
        }
        this.messageCallback = callback;
    }

    destroy() {
        this.destroyed = true;
        window.removeEventListener('message', this.onMessage);
    }
}

if (typeof window !== 'undefined') {
    window['ArtplayerHelperIframe'] = ArtplayerHelperIframe;
}
