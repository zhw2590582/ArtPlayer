import type Artplayer from 'artplayer';

interface Option {
    //
}

interface Result {
    name: 'artplayerProxyMediabunny';
}

declare const artplayerProxyMediabunny: (option: Option) => (art: Artplayer) => Result;

export default artplayerProxyMediabunny