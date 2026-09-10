export function getExt(url: string): string {
  const end = url.search(/[?#]/)
  const clean = (end < 0 ? url : url.slice(0, end)).trim().toLowerCase()
  return clean.slice(clean.lastIndexOf('.') + 1)
}

export function download(url: string, name: string): void {
  const elink = document.createElement('a')
  elink.style.display = 'none'
  elink.href = url
  elink.download = name
  document.body.appendChild(elink)
  try {
    elink.click()
  }
  finally {
    elink.remove()
  }
}
