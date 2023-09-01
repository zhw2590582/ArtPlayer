import { errorHandle, isMobile, has, def } from '../utils';
import miniProgressBar from './miniProgressBar';
import autoOrientation from './autoOrientation';
import autoPlayback from './autoPlayback';
import fastForward from './fastForward';
import lock from './lock';

export default class Plugins {
    constructor(art) {
        this.art = art;
        this.id = 0;

        const { option } = art;

        if (option.miniProgressBar && !option.isLive) {
            this.add(miniProgressBar);
        }

        if (option.lock && isMobile) {
            this.add(lock);
        }

        if (option.autoPlayback && !option.isLive) {
            this.add(autoPlayback);
        }

        if (option.autoOrientation && isMobile) {
            this.add(autoOrientation);
        }

        if (option.fastForward && isMobile && !option.isLive) {
            this.add(fastForward);
        }

        for (let index = 0; index < option.plugins.length; index++) {
            this.add(option.plugins[index]);
        }
    }

    add(plugin) {
        this.id += 1;
        const result = plugin.call(this.art, this.art);
        const pluginName = (result && result.name) || plugin.name || `plugin${this.id}`;
        errorHandle(!has(this, pluginName), `Cannot add a plugin that already has the same name: ${pluginName}`);
        def(this, pluginName, {
            value: result,
        });
        return this;
    }
}
