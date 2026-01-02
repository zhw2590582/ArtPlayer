import type Artplayer from 'artplayer';

interface Option {
    //
}

interface Result {
    name: 'artplayerPluginJassub';
}

declare const artplayerPluginJassub: (option: Option) => (art: Artplayer) => Result;

export default artplayerPluginJassub