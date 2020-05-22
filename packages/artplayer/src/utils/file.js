export function getExt(url) {
    if (url.includes('?')) {
        return getExt(url.split('?')[0]);
    }

    if (url.includes('#')) {
        return getExt(url.split('#')[0]);
    }

    return url.trim().toLowerCase().split('.').pop();
}

export function download(url, name) {
    const elink = document.createElement('a');
    elink.style.display = 'none';
    elink.href = url;
    elink.download = name;
    document.body.appendChild(elink);
    elink.click();
    document.body.removeChild(elink);
}
