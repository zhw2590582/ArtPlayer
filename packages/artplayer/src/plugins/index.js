import { errorHandle, hasOwnProperty } from '../utils';
import subtitle from './subtitle';
import localPreview from './localPreview';
import miniProgressBar from './miniProgressBar';
import autoPip from './autoPip';

export default class Plugins {
    constructor(art) {
        this.art = art;
        this.id = 0;

        const { option } = art;

        if (option.subtitle.url) {
            this.add(subtitle);
        }

        if (!option.isLive && option.miniProgressBar) {
            this.add(miniProgressBar);
        }

        if (option.localPreview) {
            this.add(localPreview);
        }

        if (option.pip && option.autoPip) {
            this.add(autoPip);
        }

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
        errorHandle(
            !hasOwnProperty(this, pluginName),
            `Cannot add a plugin that already has the same name: ${pluginName}`,
        );
        Object.defineProperty(this, pluginName, {
            value: result,
        });
        this.art.emit('plugin:add', plugin);
        return this;
    }
}
