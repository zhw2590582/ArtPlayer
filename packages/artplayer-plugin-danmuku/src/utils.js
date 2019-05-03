export function filter(queue, state, callback) {
    return queue.filter(danmu => danmu.$state === state).map(callback);
}

export function getRect(ref, key) {
    const result = ref.getBoundingClientRect();
    return key ? result[key] : result;
}