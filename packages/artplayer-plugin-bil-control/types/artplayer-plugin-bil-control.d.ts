import type Artplayer from 'artplayer';

interface Option {
    //
};

interface Result {
    name: 'artplayerPluginBilControl';
};

declare const artplayerPluginBilControl: (option: Option) => (art: Artplayer) => Result;

export default artplayerPluginBilControl