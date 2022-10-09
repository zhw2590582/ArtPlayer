type Plugin = (art: Artplayer) => any | ((option: any) => (art: Artplayer) => any);
export default Plugin;
