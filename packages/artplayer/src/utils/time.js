export function sleep(ms = 0) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function debounce(func, duration) {
    let timeout;

    return function (...args) {
        const effect = () => {
            timeout = null;
            return func.apply(this, args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(effect, duration);
    };
}

export function throttle(func, duration) {
    let shouldWait = false;

    return function (...args) {
        if (!shouldWait) {
            func.apply(this, args);
            shouldWait = true;

            setTimeout(function () {
                shouldWait = false;
            }, duration);
        }
    };
}
