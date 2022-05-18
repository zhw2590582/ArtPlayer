import { ArtPlayerError } from '../utils/error';
import clickInit from './clickInit';
import hoverInit from './hoverInit';
import mousemoveInit from './mousemoveInit';
import resizeInit from './resizeInit';
import gestureInit from './gestureInit';
import viewInit from './viewInit';

export default class Events {
    constructor(art) {
        this.destroyEvents = [];
        this.proxy = this.proxy.bind(this);
        this.hover = this.hover.bind(this);
        this.loadImg = this.loadImg.bind(this);

        if (art.whitelist.state) {
            clickInit(art, this);
            hoverInit(art, this);
            mousemoveInit(art, this);
            resizeInit(art, this);
            gestureInit(art, this);
            viewInit(art, this);
        }
    }

    proxy(target, name, callback, option = {}) {
        if (Array.isArray(name)) {
            return name.map((item) => this.proxy(target, item, callback, option));
        }

        target.addEventListener(name, callback, option);
        const destroy = () => target.removeEventListener(name, callback, option);
        this.destroyEvents.push(destroy);
        return destroy;
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
                return reject(new ArtPlayerError('Unable to get Image'));
            }

            if (image.complete) {
                return resolve(image);
            }

            this.proxy(image, 'load', () => resolve(image));
            this.proxy(image, 'error', () => reject(new ArtPlayerError(`Failed to load Image: ${image.src}`)));
        });
    }

    destroy() {
        for (let index = 0; index < this.destroyEvents.length; index++) {
            this.destroyEvents[index]();
        }
    }
}
