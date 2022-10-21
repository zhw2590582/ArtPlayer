import ArtplayerPluginIframe from '..';

const iframe = new ArtplayerPluginIframe({
    iframe: document.getElementById('iframe') as HTMLIFrameElement,
    url: 'iframe.html',
});
