import type Artplayer from 'artplayer';

export = artplayerPluginControl;
export as namespace artplayerPluginControl;

type Option = {};

type Control = {
    name: 'artplayerPluginControl';
    enable: Boolean;
};

declare const artplayerPluginControl: (option?: Option) => (art: Artplayer) => Control;
