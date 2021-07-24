import { errorHandle, has, def } from '../utils';
import subtitleOffset from './subtitleOffset';
import localVideo from './localVideo';
import localSubtitle from './localSubtitle';
import miniProgressBar from './miniProgressBar';
import networkMonitor from './networkMonitor';
import log from './log';

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

        if (option.log) {
            this.add(log);
        }

        art.option.plugins.forEach((plugin) => {
            this.add(plugin);
        });
    }

    add(plugin) {
        this.id += 1;
        const result = plugin.call(this, this.art);
        const pluginName = (result && result.name) || plugin.name || `plugin${this.id}`;
        errorHandle(!has(this, pluginName), `Cannot add a plugin that already has the same name: ${pluginName}`);
        def(this, pluginName, {
            value: result,
        });
        return this;
    }
}
