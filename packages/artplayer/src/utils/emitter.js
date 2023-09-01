export default class Emitter {
    on(name, fn, ctx) {
        const e = this.e || (this.e = {});
        (e[name] || (e[name] = [])).push({ fn, ctx });
        return this;
    }

    once(name, fn, ctx) {
        const self = this;
        function listener(...args) {
            self.off(name, listener);
            fn.apply(ctx, args);
        }
        listener._ = fn;
        return this.on(name, listener, ctx);
    }

    emit(name, ...data) {
        const evtArr = ((this.e || (this.e = {}))[name] || []).slice();
        for (let i = 0; i < evtArr.length; i += 1) {
            evtArr[i].fn.apply(evtArr[i].ctx, data);
        }
        return this;
    }

    off(name, callback) {
        const e = this.e || (this.e = {});
        const evts = e[name];
        const liveEvents = [];
        if (evts && callback) {
            for (let i = 0, len = evts.length; i < len; i += 1) {
                if (evts[i].fn !== callback && evts[i].fn._ !== callback) liveEvents.push(evts[i]);
            }
        }
        if (liveEvents.length) {
            e[name] = liveEvents;
        } else {
            delete e[name];
        }
        return this;
    }
}
