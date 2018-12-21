export default class CreatWorker {
    constructor() {
        this.workers = new Map();
    }

    static fnToStr(fn) {
        return `
           self.onmessage = event => {
               return self.postMessage((${fn}).apply(null, event.data));
           }
         `;
    }

    static create(fn) {
        const blob = new Blob([CreatWorker.fnToStr(fn)], {
            type: 'application/javascript',
        });
        const objectURL = window.URL.createObjectURL(blob);
        const worker = new Worker(objectURL);
        worker.kill = () => {
            URL.revokeObjectURL(objectURL);
            worker.terminate();
        };
        worker.post = args =>
            new Promise((resolve, reject) => {
                worker.onmessage = event => {
                    resolve(event.data);
                };
                worker.onerror = error => {
                    reject(error);
                };
                worker.postMessage(args);
            });
        return worker;
    }

    add(name, fn) {
        if (!this.workers.has(name)) {
            this.workers.set(name, CreatWorker.create(fn));
        }
    }

    run(name, ...args) {
        const worker = this.workers.get(name);
        return worker.post(args);
    }

    kill(name) {
        const worker = this.workers.get(name);
        worker.kill();
    }

    killAll() {
        this.workers.forEach(worker => {
            worker.kill();
        });
    }
}
