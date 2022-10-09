import Artplayer = require('./artplayer');

type Props = {
    $icon?: HTMLDivElement;
    $html?: HTMLDivElement;
    $tooltip?: HTMLDivElement;
    $switch?: boolean;
    $range?: HTMLInputElement;
    $parentItem?: Setting;
    $parentList?: Setting[];
};

export type Setting = {
    /**
     * Html string or html element of setting name
     */
    html: string | HTMLElement;

    /**
     * Html string or html element of setting icon
     */
    icon?: string | HTMLElement;

    /**
     * The width of setting
     */
    width?: number;

    /**
     * The tooltip of setting
     */
    tooltip?: string | HTMLElement;

    /**
     * Whether the default is selected
     */
    default?: boolean;

    /**
     * Custom selector list
     */
    selector?: Setting[];

    /**
     * Wnen the setting was mounted
     */
    mounted?(this: Artplayer, panel: HTMLDivElement, item: Setting): void;

    /**
     * When selector item click
     */
    onSelect?(this: Artplayer, item: Setting & Props, element: HTMLDivElement, event: Event): void;

    /**
     * Custom switch item
     */
    switch?: boolean;

    /**
     * When switch item click
     */
    onSwitch?(this: Artplayer, item: Setting & Props, element: HTMLDivElement, event: Event): void;

    /**
     * Custom range item
     */
    range?: number[] | number;

    /**
     * When range item change
     */
    onRange?(this: Artplayer, item: Setting & Props, element: HTMLDivElement, event: Event): void;

    /**
     * When range item change in real time
     */
    onChange?(this: Artplayer, item: Setting & Props, element: HTMLDivElement, event: Event): void;
};
