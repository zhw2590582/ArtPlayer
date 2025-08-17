import type Artplayer from 'artplayer';

interface Option {
    //
};

interface Result {
    name: '{{export}}';
};

declare const {{export}}: (option: Option) => (art: Artplayer) => Result;

export default {{export}}