import clickInit from './clickInit';
import hoverInit from './hoverInit';
import mousemoveInit from './mousemoveInit';
import resizeInit from './resizeInit';

export default class Events {
    constructor(art) {
        this.destroyEvents = [];
        this.proxy = this.proxy.bind(this);
        this.hover = this.hover.bind(this);
        this.loadImg = this.loadImg.bind(this);

        if (art.whitelist.state) {
            art.once('video:canplay', () => {
                clickInit(art, this);
                hoverInit(art, this);
                mousemoveInit(art, this);
                resizeInit(art, this);
            });
        }
    }

    proxy(target, name, callback, option = {}) {
        if (Array.isArray(name)) {
            name.forEach(item => this.proxy(target, item, callback, option));
            return;
        }

        target.addEventListener(name, callback, option);
        this.destroyEvents.push(() => {
            target.removeEventListener(name, callback, option);
        });
    }

    hover(target, mouseenter, mouseleave) {
        if (mouseenter) {
            this.proxy(target, 'mouseenter', mouseenter);
        }
        if (mouseleave) {
            this.proxy(target, 'mouseleave', mouseleave);
        }
    }

    loadImg(img) {
        return new Promise((resolve, reject) => {
            let image;

            if (img instanceof HTMLImageElement) {
                image = img;
            } else if (typeof img === 'string') {
                image = new Image();
                image.src = img;
            } else {
                return reject(img);
            }

            if (image.complete) {
                return resolve(image);
            }

            this.proxy(image, 'load', () => resolve(image));
            this.proxy(image, 'error', () => reject(image));

            return img;
        });
    }

    destroy() {
        this.destroyEvents.forEach(event => event());
    }
}
