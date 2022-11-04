export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function runPromisesInSeries(ps) {
    return ps.reduce((p, next) => p.then(next), Promise.resolve());
}

export function getFileName(name) {
    const nameArray = name.split('.');
    nameArray.pop();
    return nameArray.join('.');
}

export function clamp(num, a, b) {
    return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
}
