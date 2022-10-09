type Selector = {
    /**
     * Whether the default is selected
     */
    default?: boolean;

    /**
     * Html string of selector
     */
    html: string | HTMLElement;
};

type Component = {
    /**
     * Component self-increasing id
     */
    readonly id: number;

    /**
     * Component parent name
     */
    readonly name: string | void;

    /**
     * Component parent element
     */
    readonly $parent: HTMLElement | void;

    /**
     * Whether to show component parent
     */
    get show(): boolean;

    /**
     * Whether to show component parent
     */
    set show(state: boolean);

    /**
     * Toggle the component parent
     */
    set toggle(state: boolean);

    /**
     * Dynamic add a component
     */
    add(option: ComponentOption): HTMLElement;
};

type ComponentOption = {
    /**
     * Html string or html element of component
     */
    html: string | HTMLElement;

    /**
     * Whether to disable component
     */
    disable?: boolean;

    /**
     * Unique name for component
     */
    name?: string;

    /**
     * Component sort index
     */
    index?: number;

    /**
     * Component style object
     */
    style?: CSSStyleDeclaration;

    /**
     * Component click event
     */
    click?(component: Component, event: Event): void;

    /**
     * Wnen the component was mounted
     */
    mounted?(element: HTMLElement): void;

    /**
     * Component tooltip, use in controls
     */
    tooltip?: string;

    /**
     * Component position, use in controls
     */
    position?: 'top' | 'left' | 'right' | (string & Record<never, never>);

    /**
     * Custom selector list, use in controls
     */
    selector?: Selector[];

    /**
     * When selector item click, use in controls
     */
    onSelect?(selector: Selector, element: HTMLElement, event: Event): void;
};
