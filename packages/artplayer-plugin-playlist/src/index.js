import './index.scss';

function artplayerPluginPlaylist(art) {
    const {
        utils: { append, errorHandle, sleep },
    } = art.constructor;
    const {
        player,
        events: { proxy },
        template: { $player, $video },
    } = art;

    const $playlist = append(
        $player,
        `
        <div class="artplay-playlist">
            <div class="artplay-playlist-inner"></div>
        </div>
    `,
    );

    const $playlistInner = $playlist.querySelector('.artplay-playlist-inner');
    let playlist = [];

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
            $playlist.style.display = 'none';
        }
    });

    art.on('video:ended', () => {
        nextVideo().then(() => {
            sleep(1000).then(player.play);
        });
    });
    art.on('afterAttachUrl', () => {
        const index = playlist.findIndex(item => item.url === $video.src);
        const $children = Array.from($playlistInner.children);
        const $item = $children[index];
        if (index !== -1 && $item) {
            $children.forEach(item => item.classList.remove('active'));
            $item.classList.add('active');
        }
    });

    return {
        name: 'artplayerPluginPlaylist',
        load(list) {
            errorHandle(Array.isArray(list), 'Playlist is not an array type');
            errorHandle(list.length > 0, 'Playlist cannot be empty');
            playlist = list.map(item => {
                errorHandle(item.url, 'Playlist items require url attribute');
                errorHandle(item.title, 'Playlist items require title attribute');
                return item;
            });
            $playlistInner.innerHTML = playlist
                .map((item, index) => {
                    return `<div class="artplay-playlist-item" data-option-index="${index}">${item.title}</div>`;
                })
                .join('');
        },
        show() {
            $playlist.style.display = 'flex';
        },
        hide() {
            $playlist.style.display = 'none';
        },
        next() {
            nextVideo();
        },
        prev() {
            prevVideo();
        },
    };
}

window.artplayerPluginPlaylist = artplayerPluginPlaylist;
export default artplayerPluginPlaylist;
