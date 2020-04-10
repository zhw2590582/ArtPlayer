export const userAgent = window.navigator.userAgent;

export function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

export function isSafari() {
    return /^((?!chrome|android).)*safari/i.test(userAgent);
}
