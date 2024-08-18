export default class Extension {
    constructor(canvas) {
        this.canvas = canvas;
        this.methods = {};
        this.listeners = {};
        this.properties = {};

        const handler = {
            get: (target, prop) => {
                if (prop in target.properties) {
                    return target.properties[prop];
                }
                if (prop in target.methods) {
                    return target.methods[prop];
                }
                if (prop === 'addEventListener') {
                    return target.addEventListener.bind(target);
                }
                if (prop === 'removeEventListener') {
                    return target.removeEventListener.bind(target);
                }
                if (prop === 'getOriginalCanvas') {
                    return () => target.canvas;
                }
                return target.canvas[prop];
            },
            set: (target, prop, value) => {
                if (prop in target.canvas) {
                    target.canvas[prop] = value;
                } else {
                    target.properties[prop] = value;
                }
                return true;
            },
        };

        handler[Symbol.hasInstance] = (instance) => {
            return instance instanceof HTMLCanvasElement || instance === this.proxy;
        };

        this.proxy = new Proxy(this, handler);

        return this.proxy;
    }

    addEventListener(type, listener, options) {
        if (!this.listeners[type]) {
            this.listeners[type] = [];
            this.canvas.addEventListener(
                type,
                (event) => {
                    this.listeners[type].forEach((l) => l(event));
                },
                options,
            );
        }
        this.listeners[type].push(listener);
    }

    removeEventListener(type, listener) {
        if (this.listeners[type]) {
            this.listeners[type] = this.listeners[type].filter((l) => l !== listener);
        }
    }
}
