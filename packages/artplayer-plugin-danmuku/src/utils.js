export function filter(queue, state, callback) {
    return queue.filter(danmu => danmu.$state === state).map(callback);
}

export function getRect(ref, key) {
    const result = ref.getBoundingClientRect();
    return key ? result[key] : result;
}

export function getDanmuRef(queue) {
    const result = queue.find(danmu => {
        return danmu.$ref && danmu.$state === 'wait';
    });

    if (result) {
        const { $ref } = result;
        result.$ref = null;
        return $ref;
    }

    const $ref = document.createElement('div');
    $ref.style.cssText = `
        user-select: none;
        position: absolute;
        white-space: pre;
        pointer-events: none;
        perspective: 500px;
        display: inline-block;
        will-change: transform;
        font-family: SimHei, "Microsoft JhengHei", Arial, Helvetica, sans-serif;
        font-weight: normal;
        line-height: 1.125;
        text-shadow: rgb(0, 0, 0) 1px 0px 1px, rgb(0, 0, 0) 0px 1px 1px, rgb(0, 0, 0) 0px -1px 1px, rgb(0, 0, 0) -1px 0px 1px;
    `;

    return $ref;
}