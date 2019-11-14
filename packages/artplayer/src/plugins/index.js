import { errorHandle, hasOwnProperty } from '../utils';
import subtitleOffset from './subtitleOffset';
import localVideo from './localVideo';
import localSubtitle from './localSubtitle';
import miniProgressBar from './miniProgressBar';
import networkMonitor from './networkMonitor';
import autoPip from './autoPip';

export default class Plugins {
    constructor(art) {
        this.art = art;
        this.id = 0;

        const { option } = art;

        if (option.subtitle.url && option.subtitleOffset) {
            this.add(subtitleOffset);
        }

        if (!option.isLive && option.miniProgressBar) {
            this.add(miniProgressBar);
        }

        if (option.localVideo) {
            this.add(localVideo);
        }

        if (option.localSubtitle) {
            this.add(localSubtitle);
        }

        if (option.networkMonitor) {
            this.add(networkMonitor);
        }

        if (option.autoPip) {
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
