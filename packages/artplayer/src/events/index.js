import clickInit from './clickInit';
import hoverInit from './hoverInit';
import moveInit from './moveInit';
import resizeInit from './resizeInit';
import gestureInit from './gestureInit';
import viewInit from './viewInit';
import documentInit from './documentInit';
import updateInit from './updateInit';
import restoreInit from './restoreInit';

export default class Events {
    constructor(art) {
        this.destroyEvents = [];
        this.proxy = this.proxy.bind(this);
        this.hover = this.hover.bind(this);

        clickInit(art, this);
        hoverInit(art, this);
        moveInit(art, this);
        resizeInit(art, this);
        gestureInit(art, this);
        viewInit(art, this);
        documentInit(art, this);
        updateInit(art, this);
        restoreInit(art, this);
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

    remove(destroyEvent) {
        const index = this.destroyEvents.indexOf(destroyEvent);
        if (index > -1) {
            destroyEvent();
            this.destroyEvents.splice(index, 1);
        }
    }

    destroy() {
        for (let index = 0; index < this.destroyEvents.length; index++) {
            this.destroyEvents[index]();
        }
    }
}
