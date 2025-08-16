export const userAgent = globalThis?.CUSTOM_USER_AGENT ?? (typeof navigator !== 'undefined' ? navigator.userAgent : '')
export const isSafari = /^(?:(?!chrome|android).)*safari/i.test(userAgent)
export const isIOS = /iPad|iPhone|iPod/i.test(userAgent) && !window.MSStream
export const isIOS13 = isIOS || (userAgent.includes('Macintosh') && navigator.maxTouchPoints >= 1)
export const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) || isIOS13
export const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'
