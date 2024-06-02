import type Artplayer from 'artplayer';

export = {{export}};
export as namespace {{export}};

type Option = {
    //
};

type Result = {
    name: '{{export}}';
};

declare const {{export}}: (option: Option) => (art: Artplayer) => Result;
