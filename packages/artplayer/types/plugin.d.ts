type Plugin = (art: Artplayer) => unknown | ((option: unknown) => (art: Artplayer) => unknown);
export default Plugin;
