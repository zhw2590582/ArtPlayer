export const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : '';
export const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
export const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
export const isWechat = /MicroMessenger/i.test(userAgent);
export const isIE = /MSIE|Trident/i.test(userAgent);
