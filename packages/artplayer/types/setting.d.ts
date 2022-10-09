type Setting = {
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
     * When selector item click
     */
    onSelect?(item: Setting, element: HTMLElement, event: Event): void;

    /**
     * Custom switch item
     */
    switch?: boolean;

    /**
     * When switch item click
     */
    onSwitch?(item: Setting, element: HTMLElement, event: Event): void;

    /**
     * Custom range item
     */
    range?: number[] | number;

    /**
     * When range item change
     */
    onRange?(item: Setting, element: HTMLElement, event: Event): void;

    /**
     * When range item change in real time
     */
    onChange?(item: Setting, element: HTMLElement, event: Event): void;

    $icon?: HTMLElement;
    $html?: HTMLElement;
    $tooltip?: HTMLElement;
    $switch?: boolean;
    $range?: HTMLElement;
    $parentItem?: Setting;
    $parentList?: Setting[];
};

export default Setting;
