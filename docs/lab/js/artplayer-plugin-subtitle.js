(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global['artplayer-plugin-subtitle'] = {})));
}(this, (function (exports) { 'use strict';

    function i18nMix(i18n) {
      i18n.update({
        'zh-cn': {
          'Subtitle offset time': '字幕偏移时间'
        },
        'zh-tw': {
          'Subtitle offset time': '字幕偏移時間'
        }
      });
    }

    function settingMix(art) {
      var i18n = art.i18n,
          proxy = art.events.proxy;
      return {
        title: 'Subtitle',
        name: 'subtitle',
        index: 20,
        html: "\n            <div>\n                <div class=\"art-setting-header\">\n                    ".concat(i18n.get('Subtitle offset time'), ": <span class=\"art-subtitle-value\">0</span>s\n                </div>\n                <div class=\"art-setting-body\">\n                    <input style=\"width: 100%;\" class=\"art-subtitle-range\" type=\"range\" min=\"-5\" max=\"5\" step=\"1\">\n                </div>\n            </div>\n        "),
        mounted: function mounted($setting) {
          var $range = $setting.querySelector('.art-subtitle-range');
          var $value = $setting.querySelector('.art-subtitle-value');
          proxy($range, 'change', function () {
            var value = $range.value;
            $value.innerText = value;
            art.plugins.artplayerPluginSubtitle.set(Number(value));
          });
        }
      };
    }

    function artplayerPluginSubtitle(art) {
      var setting = art.setting,
          notice = art.notice,
          refs = art.refs,
          i18n = art.i18n;
      var cuesCache = [];
      i18nMix(i18n);
      setting.add(settingMix);
      var clamp = art.constructor.utils.clamp;
      return {
        set: function set(value) {
          var cues = Array.from(refs.$track.track.cues);
          var time = clamp(value, -5, 5);
          cues.forEach(function (cue, index) {
            if (!cuesCache[index]) {
              cuesCache[index] = {
                startTime: cue.startTime,
                endTime: cue.endTime
              };
            }

            cue.startTime = cuesCache[index].startTime + time;
            cue.endTime = cuesCache[index].endTime + time;
          });
          notice.show("".concat(i18n.get('Subtitle offset time'), ": ").concat(value, "s"));
          art.emit('subtitle:offset', value);
        }
      };
    }

    window.artplayerPluginSubtitle = artplayerPluginSubtitle;

    exports.default = artplayerPluginSubtitle;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=artplayer-plugin-subtitle.js.map
