(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global['artplayer-plugin-playlist'] = factory());
}(this, function () { 'use strict';

    function artplayerPluginPlaylist(art) {
      var _art$constructor$util = art.constructor.utils,
          append = _art$constructor$util.append,
          errorHandle = _art$constructor$util.errorHandle,
          sleep = _art$constructor$util.sleep;
      var player = art.player,
          proxy = art.events.proxy,
          _art$template = art.template,
          $player = _art$template.$player,
          $video = _art$template.$video;
      var $playlist = append($player, "\n        <div class=\"artplay-playlist\">\n            <div class=\"artplay-playlist-inner\"></div>\n        </div>\n    ");
      var $playlistInner = $playlist.querySelector('.artplay-playlist-inner');
      var playlist = [];

      function switchUrl(index) {
        var itemOption = playlist[index];
        return player.switchUrl(itemOption.url, itemOption.title).then(function () {
          art.emit('artplayerPluginPlaylist:change', itemOption);
        });
      }

      function prevVideo() {
        var index = playlist.findIndex(function (item) {
          return item.url === $video.src;
        });
        errorHandle(index !== -1, "Can't find Playlist item");

        if (playlist.length === 1) {
          return switchUrl(0);
        }

        var prevIndex = index - 1 === -1 ? playlist.length - 1 : index - 1;
        return switchUrl(prevIndex);
      }

      function nextVideo() {
        var index = playlist.findIndex(function (item) {
          return item.url === $video.src;
        });
        errorHandle(index !== -1, "Can't find Playlist item");

        if (playlist.length === 1) {
          return switchUrl(0);
        }

        var nextIndex = index + 1 === playlist.length ? 0 : index + 1;
        return switchUrl(nextIndex);
      }

      proxy($playlistInner, 'click', function (e) {
        var optionIndex = e.target.dataset.optionIndex;

        if (optionIndex && Number(optionIndex) <= playlist.length - 1) {
          switchUrl(optionIndex);
        }
      });
      proxy($playlist, 'click', function (e) {
        if (e.target === $playlist) {
          $playlist.style.display = 'none';
        }
      });
      art.on('video:ended', function () {
        nextVideo().then(function () {
          sleep(1000).then(player.play);
        });
      });
      art.on('afterAttachUrl', function () {
        var index = playlist.findIndex(function (item) {
          return item.url === $video.src;
        });
        var $children = Array.from($playlistInner.children);
        var $item = $children[index];

        if (index !== -1 && $item) {
          $children.forEach(function (item) {
            return item.classList.remove('active');
          });
          $item.classList.add('active');
        }
      });
      return {
        name: 'artplayerPluginPlaylist',
        load: function load(list) {
          errorHandle(Array.isArray(list), 'Playlist is not an array type');
          errorHandle(list.length > 0, 'Playlist cannot be empty');
          playlist = list.map(function (item) {
            errorHandle(item.url, 'Playlist items require url attribute');
            errorHandle(item.title, 'Playlist items require title attribute');
            return item;
          });
          $playlistInner.innerHTML = playlist.map(function (item, index) {
            return "<div class=\"artplay-playlist-item\" data-option-index=\"".concat(index, "\">").concat(item.title, "</div>");
          }).join('');
        },
        show: function show() {
          $playlist.style.display = 'flex';
        },
        hide: function hide() {
          $playlist.style.display = 'none';
        },
        next: function next() {
          nextVideo();
        },
        prev: function prev() {
          prevVideo();
        }
      };
    }

    window.artplayerPluginPlaylist = artplayerPluginPlaylist;

    return artplayerPluginPlaylist;

}));
//# sourceMappingURL=artplayer-plugin-playlist.js.map
