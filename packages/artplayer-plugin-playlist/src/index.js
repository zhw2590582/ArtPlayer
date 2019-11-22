import './index.scss';

function artplayerPluginPlaylist(list) {
    return art => {
        const {
            utils: { append, errorHandle, sleep, inverseClass },
        } = art.constructor;
        const {
            player,
            events: { proxy },
            template: { $player, $video },
        } = art;

        const $playlist = append(
            $player,
            `
            <div class="art-playlist">
                <div class="art-playlist-inner art-backdrop-filter"></div>
            </div>
        `,
        );

        errorHandle(Array.isArray(list), 'Playlist is not an array type');
        errorHandle(list.length > 0, 'Playlist cannot be empty');
        const playlist = list.map(item => {
            errorHandle(item.url, 'Playlist items require url attribute');
            errorHandle(item.title, 'Playlist items require title attribute');
            return item;
        });

        const $playlistInner = $playlist.querySelector('.art-playlist-inner');
        $playlistInner.innerHTML = playlist
            .map((item, index) => {
                return `<div class="art-playlist-item" data-option-index="${index}">${item.title}</div>`;
            })
            .join('');

        function switchUrl(index) {
            const itemOption = playlist[index];
            return player.switchUrl(itemOption.url, itemOption.title).then(() => {
                art.emit('artplayerPluginPlaylist:change', itemOption);
            });
        }

        function prevVideo() {
            const index = playlist.findIndex(item => item.url === $video.src);
            errorHandle(index !== -1, "Can't find Playlist item");
            if (playlist.length === 1) {
                return switchUrl(0);
            }
            const prevIndex = index - 1 === -1 ? playlist.length - 1 : index - 1;
            return switchUrl(prevIndex);
        }

        function nextVideo() {
            const index = playlist.findIndex(item => item.url === $video.src);
            errorHandle(index !== -1, "Can't find Playlist item");
            if (playlist.length === 1) {
                return switchUrl(0);
            }
            const nextIndex = index + 1 === playlist.length ? 0 : index + 1;
            return switchUrl(nextIndex);
        }

        proxy($playlistInner, 'click', e => {
            const { optionIndex } = e.target.dataset;
            if (optionIndex && Number(optionIndex) <= playlist.length - 1) {
                switchUrl(optionIndex);
            }
        });

        proxy($playlist, 'click', e => {
            if (e.target === $playlist) {
                $player.classList.remove('art-playlist-show');
            }
        });

        art.on('video:ended', () => {
            nextVideo().then(() => {
                sleep(1000).then(() => {
                    player.play = true;
                });
            });
        });

        art.on('afterAttachUrl', () => {
            const index = playlist.findIndex(item => item.url === $video.src);
            const $item = Array.from($playlistInner.children)[index];
            if (index !== -1 && $item) {
                inverseClass($item, 'active');
            }
        });

        return {
            name: 'artplayerPluginPlaylist',
            show() {
                $player.classList.add('art-playlist-show');
            },
            hide() {
                $player.classList.remove('art-playlist-show');
            },
            next() {
                nextVideo();
            },
            prev() {
                prevVideo();
            },
        };
    };
}

export default artplayerPluginPlaylist;
