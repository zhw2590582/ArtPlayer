import artplayerPluginSubtitle from './artplayer-plugin-subtitle';
import artplayerPluginLocalPreview from './artplayer-plugin-localPreview';

export default class Plugins {
    constructor(art) {
        this.art = art;
        this.id = 0;

        this.add(artplayerPluginSubtitle);
        this.add(artplayerPluginLocalPreview);
        art.option.plugins.forEach(plugin => {
            this.add(plugin);
        });
    }

    add(plugin) {
        this.id += 1;
        const result = plugin.call(this, this.art);
        let pluginName = '';
        if (result && result.name) {
            pluginName = result.name;
        } else if (plugin.name) {
            pluginName = plugin.name;
        } else {
            pluginName = `plugin${this.id}`;
        }
        this[pluginName] = result;
        this.art.emit('plugin:add', plugin);
        return this;
    }
}
