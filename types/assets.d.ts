declare module '*.less?inline' {
  const css: string
  export default css
}

declare module '*.svg' {
  const svg: string
  export default svg
}

declare module '*.svg?raw' {
  const svg: string
  export default svg
}
