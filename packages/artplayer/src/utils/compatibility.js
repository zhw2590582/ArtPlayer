export const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
export const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
export const isWechat = /MicroMessenger/i.test(userAgent);
export const isIE = /MSIE|Trident/i.test(userAgent);
export const isAndroid = /android/i.test(userAgent);
export const isIOS = /iPad|iPhone|iPod/i.test(userAgent) && !window.MSStream;
export const isIOS13 = isIOS || (userAgent.includes('Macintosh') && navigator.maxTouchPoints >= 1);
export const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) || isIOS13;
