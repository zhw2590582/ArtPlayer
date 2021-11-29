describe('Document', function () {
    afterEach(function () {
        [...Artplayer.instances].forEach((art) => {
            art.destroy(true);
        });
    });

    it('Test0', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('ready', () => {
            var $video = art.template.query('.art-video');
            console.info($video);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test1', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('ready', () => {
            var $video = art.query('.art-video');
            console.info($video);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test2', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.storage.set('your-key', 'your-value');
        art.storage.get('your-key');
        art.storage.del('your-key');
        art.storage.clean();

        expect(art.id).to.be.an('number');
    });

    it('Test3', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('ready', () => {
            console.info(art.i18n.get('Play'));
        });

        expect(art.id).to.be.an('number');
    });

    it('Test4', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            lang: 'jp',
        });
        art.i18n.update({
            'zh-cn': {
                Language: '简体',
            },
            'zh-tw': {
                Language: '繁體',
            },
            en: {
                Language: 'English',
            },
            jp: {
                Language: '日文',
            },
            fr: {
                Language: 'Français',
            },
            ru: {
                Language: 'Russe',
            },
        });

        expect(art.id).to.be.an('number');
    });

    it('Test5', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            subtitle: {
                url: 'https://artplayer.org/assets/sample/subtitle.srt',

                encoding: 'utf-8',

                bilingual: true,

                style: {
                    color: '#03A9F4',

                    'font-size': '30px',
                },
            },
        });
        art.on('ready', () => {
            art.seek = 20;
            setTimeout(() => {
                art.subtitle.style({
                    color: 'red',

                    'font-size': '40px',
                });
            }, 3000);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test6', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            subtitle: {
                url: 'https://artplayer.org/assets/sample/subtitle.srt',

                encoding: 'utf-8',

                bilingual: true,

                style: {
                    color: '#03A9F4',

                    'font-size': '30px',
                },
            },
        });
        art.on('ready', () => {
            art.seek = 20;
            setTimeout(() => {
                art.subtitle.switch('https://artplayer.org/assets/sample/subtitle.srt');
            }, 3000);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test7', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        var img = 'https://artplayer.org/assets/sample/layer.png';
        art.on('ready', () => {
            setTimeout(() => {
                art.layers.add({
                    html: `<img style="width: 100px" src="${img}">`,

                    style: {
                        position: 'absolute',

                        top: '20px',

                        right: '20px',

                        opacity: '.9',
                    },
                });
            }, 3000);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test8', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('ready', () => {
            art.notice.show = '自定义提示信息1';
            art.notice.show = '自定义提示信息2';
        });

        expect(art.id).to.be.an('number');
    });

    it('Test9', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('ready', () => {
            setTimeout(() => {
                art.controls.show = false;
            }, 3000);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test10', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('ready', () => {
            setTimeout(() => {
                art.controls.add({
                    position: 'right',

                    index: 10,

                    html: '自定义按钮',

                    tooltip: '自定义按钮的提示',

                    click: function () {
                        console.log('你点击了自定义按钮');
                    },
                });
            }, 3000);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test11', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('ready', () => {
            art.contextmenu.show = true;
            setTimeout(() => {
                art.contextmenu.show = false;
            }, 3000);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test12', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('ready', () => {
            art.contextmenu.show = true;
            setTimeout(() => {
                art.contextmenu.add({
                    html: '自定义菜单',

                    click: function () {
                        console.info('你点击了自定义菜单');

                        art.contextmenu.show = false;
                    },
                });
            }, 3000);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test13', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('ready', () => {
            art.loading.show = true;
            setTimeout(() => {
                art.loading.show = false;
            }, 3000);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test14', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('ready', () => {
            art.mask.show = true;
            setTimeout(() => {
                art.mask.show = false;
            }, 3000);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test15', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('ready', () => {
            art.hotkey.add(65, () => {
                console.info('你点击了 A 键');
            });
            art.hotkey.add(66, () => {
                console.info('你点击了 B 键');
            });
        });

        expect(art.id).to.be.an('number');
    });

    it('Test16', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            setting: true,
            autoSize: true,
        });
        art.on('ready', () => {
            art.seek = 20;
            art.setting.show = true;
            setTimeout(() => {
                art.setting.show = false;
            }, 3000);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test17', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            setting: true,
            autoSize: true,
        });
        art.on('ready', () => {
            art.seek = 20;
            art.setting.show = true;
            art.setting.add({
                html: '自定义设置',

                click: function () {
                    console.info('你点击了自定义设置');

                    art.setting.show = false;
                },
            });
        });

        expect(art.id).to.be.an('number');
    });

    it('Test18', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('ready', () => {
            console.info(Artplayer.instances.length);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test19', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('video:play', (...args) => {
            console.info(args);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test20', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('ready', (...args) => {
            console.info(args);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test21', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('play', (...args) => {
            console.info(args);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test22', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('pause', (...args) => {
            console.info(args);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test23', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('seek', (...args) => {
            console.info(args);
        });
        art.on('ready', (...args) => {
            art.seek = 5;
        });

        expect(art.id).to.be.an('number');
    });

    it('Test24', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('volume', (...args) => {
            console.info(args);
        });
        art.on('ready', (...args) => {
            art.volume = 0.5;
        });

        expect(art.id).to.be.an('number');
    });

    it('Test25', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('destroy', (...args) => {
            console.info(args);
        });
        art.on('ready', (...args) => {
            art.destroy();
        });

        expect(art.id).to.be.an('number');
    });

    it('Test26', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('focus', (...args) => {
            console.info(args);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test27', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('blur', (...args) => {
            console.info(args);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test28', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('hover', (state) => {
            // state 为true时，鼠标从外面移进播放器
            // state 为false时，鼠标从播放器移出外面
            console.info(state);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test29', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            autoSize: true,
        });
        art.on('resize', (...args) => {
            console.info(args);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test30', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('mousemove', (...args) => {
            console.info(args);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test31', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('url', (...args) => {
            console.info(args);
        });
        art.on('ready', (...args) => {
            art.url = 'https://artplayer.org/assets/sample/video.mp4?t=0';
        });

        expect(art.id).to.be.an('number');
    });

    it('Test32', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            fullscreen: true,
        });
        art.on('fullscreen', (...args) => {
            console.info(args);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test33', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            fullscreenWeb: true,
        });
        art.on('fullscreenWeb', (...args) => {
            console.info(args);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test34', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('hotkey', (...args) => {
            console.info(args);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test35', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });

        expect(art.id).to.be.an('number');
    });

    it('Test36', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            // container: document.querySelector('.artplayer-app'),
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });

        expect(art.id).to.be.an('number');
    });

    it('Test37', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });

        expect(art.id).to.be.an('number');
    });

    it('Test38', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            poster: 'https://artplayer.org/assets/sample/poster.jpg',
        });

        expect(art.id).to.be.an('number');
    });

    it('Test39', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            title: '【新海诚动画】『秒速5センチメートル』',
            screenshot: true,
        });

        expect(art.id).to.be.an('number');
    });

    it('Test40', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            theme: '#ffad00',
        });

        expect(art.id).to.be.an('number');
    });

    it('Test41', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            volume: 0.5,
        });

        expect(art.id).to.be.an('number');
    });

    it('Test42', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            isLive: true,
        });

        expect(art.id).to.be.an('number');
    });

    it('Test43', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            muted: true,
        });

        expect(art.id).to.be.an('number');
    });

    it('Test44', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            autoplay: true,
            muted: true,
        });

        expect(art.id).to.be.an('number');
    });

    it('Test45', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            autoMini: true,
        });

        expect(art.id).to.be.an('number');
    });

    it('Test46', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            loop: true,
        });

        expect(art.id).to.be.an('number');
    });

    it('Test47', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            flip: true,
            setting: true,
        });

        expect(art.id).to.be.an('number');
    });

    it('Test48', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            rotate: true,
            setting: true,
            autoSize: true,
        });

        expect(art.id).to.be.an('number');
    });

    it('Test49', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            playbackRate: true,
            setting: true,
        });

        expect(art.id).to.be.an('number');
    });

    it('Test50', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            aspectRatio: true,
            setting: true,
        });

        expect(art.id).to.be.an('number');
    });

    it('Test51', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            screenshot: true,
            // 可选
            moreVideoAttr: {
                crossOrigin: 'anonymous',
            },
        });

        expect(art.id).to.be.an('number');
    });

    it('Test52', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            setting: true,
        });

        expect(art.id).to.be.an('number');
    });

    it('Test53', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            hotkey: true,
        });

        expect(art.id).to.be.an('number');
    });

    it('Test54', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            pip: true,
        });

        expect(art.id).to.be.an('number');
    });

    it('Test55', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            mutex: true,
        });

        expect(art.id).to.be.an('number');
    });

    it('Test56', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            fullscreen: true,
        });

        expect(art.id).to.be.an('number');
    });

    it('Test57', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            fullscreenWeb: true,
        });

        expect(art.id).to.be.an('number');
    });

    it('Test58', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            subtitle: {
                url: 'https://artplayer.org/assets/sample/subtitle.srt',
            },
            setting: true,
            subtitleOffset: true,
        });

        expect(art.id).to.be.an('number');
    });

    it('Test59', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            miniProgressBar: true,
        });

        expect(art.id).to.be.an('number');
    });

    it('Test60', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            localVideo: true,
            controls: [
                {
                    name: 'preview',

                    position: 'right',

                    html: '打开视频',

                    mounted: ($preview) => {
                        art.plugins.localVideo.attach($preview);
                    },
                },
            ],
        });

        expect(art.id).to.be.an('number');
    });

    it('Test61', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            localSubtitle: true,
            controls: [
                {
                    name: 'preview',

                    position: 'right',

                    html: '打开字幕',

                    mounted: ($preview) => {
                        art.plugins.localSubtitle.attach($preview);
                    },
                },
            ],
        });

        expect(art.id).to.be.an('number');
    });

    it('Test62', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            setting: true,
            settings: [
                {
                    disable: false,

                    name: 'button',

                    index: 10,

                    html: '自定义按钮',

                    tooltip: '自定义按钮的提示1',

                    style: {
                        color: 'red',
                    },

                    click: function () {
                        console.log('你点击了自定义按钮1');
                    },

                    mounted: function () {
                        console.log('自定义按钮挂载完成1');
                    },
                },

                {
                    html: '自定义按钮2',

                    tooltip: '自定义按钮的提示2',

                    style: {
                        color: 'green',
                    },

                    click: function () {
                        console.log('你点击了自定义按钮2');
                    },
                },
            ],
        });

        expect(art.id).to.be.an('number');
    });

    it('Test63', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            contextmenu: [
                {
                    html: '自定义菜单',

                    click: function () {
                        console.info('你点击了自定义菜单');

                        art.contextmenu.show = false;
                    },
                },
            ],
        });
        art.on('ready', () => {
            art.contextmenu.show = true;
        });

        expect(art.id).to.be.an('number');
    });

    it('Test64', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            controls: [
                {
                    disable: false,

                    name: 'button',

                    index: 10,

                    position: 'right',

                    html: '自定义按钮',

                    tooltip: '自定义按钮的提示1',

                    style: {
                        color: 'red',
                    },

                    click: function () {
                        console.log('你点击了自定义按钮1');
                    },

                    mounted: function () {
                        console.log('自定义按钮挂载完成1');
                    },
                },

                {
                    position: 'left',

                    html: '自定义按钮2',

                    tooltip: '自定义按钮的提示2',

                    style: {
                        color: 'green',
                    },

                    click: function () {
                        console.log('你点击了自定义按钮2');
                    },
                },
            ],
        });

        expect(art.id).to.be.an('number');
    });

    it('Test65', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            quality: [
                {
                    default: true,

                    html: 'SD 480P',

                    url: 'https://artplayer.org/assets/sample/video.mp4',
                },

                {
                    html: 'HD 720P',

                    url: 'https://artplayer.org/assets/sample/video.mp4',
                },
            ],
        });

        expect(art.id).to.be.an('number');
    });

    it('Test66', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            highlight: [
                {
                    time: 60,

                    text: 'One more chance',
                },

                {
                    time: 120,

                    text: '谁でもいいはずなのに',
                },

                {
                    time: 180,

                    text: '夏の想い出がまわる',
                },

                {
                    time: 240,

                    text: 'こんなとこにあるはずもないのに',
                },

                {
                    time: 300,

                    text: '－－终わり－－',
                },
            ],
        });

        expect(art.id).to.be.an('number');
    });

    it('Test67', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            whitelist: ['iPhone OS 11'],
            // whitelist: ['*'],
            // whitelist: [(ua) => /iPhone OS 11/gi.test(ua)],
            // whitelist: [/iPhone OS 11/gi],
        });

        expect(art.id).to.be.an('number');
    });

    it('Test68', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            thumbnails: {
                url: 'https://artplayer.org/assets/sample/thumbnails.png',

                number: 100,

                width: 160,

                height: 90,

                column: 10,
            },
        });

        expect(art.id).to.be.an('number');
    });

    it('Test69', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            subtitle: {
                url: 'https://artplayer.org/assets/sample/subtitle.srt',

                encoding: 'utf-8',

                bilingual: true,

                style: {
                    color: '#03A9F4',

                    'font-size': '30px',
                },
            },
        });

        expect(art.id).to.be.an('number');
    });

    it('Test70', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            moreVideoAttr: {
                'webkit-playsinline': true,

                playsInline: true,
            },
        });

        expect(art.id).to.be.an('number');
    });

    it('Test71', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            icons: {
                loading: '<img src="https://artplayer.org/assets/img/ploading.gif">',

                state: '<img src="https://artplayer.org/assets/img/state.png">',

                play: '',

                pause: '',

                volume: '',

                volumeClose: '',

                subtitle: '',

                screenshot: '',

                setting: '',

                fullscreen: '',

                fullscreenWeb: '',

                pip: '',
            },
        });

        expect(art.id).to.be.an('number');
    });

    it('Test72', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.flv',
            type: 'flv',
        });

        expect(art.id).to.be.an('number');
    });

    it('Test73', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.flv',
            customType: {
                flv: function (video, url, art) {
                    // video: 视频dom元素
                    // url: 视频地址
                    // art: 当前实例
                },
            },
        });

        expect(art.id).to.be.an('number');
    });

    it('Test74', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            lang: 'en',
        });

        expect(art.id).to.be.an('number');
    });

    it('Test75', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            autoSize: true,
            setting: true,
            playbackRate: true,
            fullscreenWeb: true,
            plugins: [
                artplayerPluginDanmuku({
                    // 弹幕数组

                    danmuku: [
                        {
                            text: '111', // 弹幕文本

                            time: 1, // 发送时间，单位秒

                            color: '#fff', // 弹幕局部颜色

                            border: false, // 是否显示描边

                            mode: 0, // 弹幕模式: 0表示滚动、1静止
                        },

                        {
                            text: '222',

                            time: 2,

                            color: 'red',

                            border: true,

                            mode: 0,
                        },

                        {
                            text: '333',

                            time: 3,

                            color: 'green',

                            border: false,

                            mode: 1,
                        },
                    ],

                    speed: 5, // 全局持续时间

                    opacity: 1, // 全局透明度

                    color: '#fff', // 全局字体颜色

                    size: 25, // 全局字体大小

                    maxlength: 50, // 全局最大长度

                    margin: [10, 20], // 距离顶部和距离底部的高度值

                    synchronousPlayback: false, // 是否同步到播放速度
                }),
            ],
        });

        expect(art.id).to.be.an('number');
    });

    it('Test76', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            plugins: [
                artplayerPluginDanmuku({
                    // 弹幕 XML 文件，和 Bilibili 网站的弹幕格式一致

                    danmuku: 'https://artplayer.org/assets/sample/danmuku.xml',
                }),
            ],
        });

        expect(art.id).to.be.an('number');
    });

    it('Test77', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            plugins: [
                artplayerPluginDanmuku({
                    // 使用 Promise 异步返回

                    danmuku: function () {
                        return new Promise((resovle) => {
                            return resovle([
                                {
                                    text: '111',

                                    time: 1,
                                },

                                {
                                    text: '222',

                                    time: 2,
                                },

                                {
                                    text: '333',

                                    time: 3,
                                },
                            ]);
                        });
                    },
                }),
            ],
        });

        expect(art.id).to.be.an('number');
    });

    it('Test78', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            plugins: [
                artplayerPluginDanmuku({
                    danmuku: 'https://artplayer.org/assets/sample/danmuku.xml',
                }),
            ],
            controls: [
                {
                    position: 'right',

                    html: '隐藏弹幕',

                    click: function () {
                        art.plugins.artplayerPluginDanmuku.hide();
                    },
                },

                {
                    position: 'right',

                    html: '显示弹幕',

                    click: function () {
                        art.plugins.artplayerPluginDanmuku.show();
                    },
                },
            ],
        });

        expect(art.id).to.be.an('number');
    });

    it('Test79', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            plugins: [
                artplayerPluginDanmuku({
                    danmuku: 'https://artplayer.org/assets/sample/danmuku.xml',
                }),
            ],
            controls: [
                {
                    position: 'right',

                    html: '隐藏弹幕',

                    click: function (_, event) {
                        if (art.plugins.artplayerPluginDanmuku.isHide) {
                            art.plugins.artplayerPluginDanmuku.show();

                            event.target.innerText = '隐藏弹幕';
                        } else {
                            art.plugins.artplayerPluginDanmuku.hide();

                            event.target.innerText = '显示弹幕';
                        }
                    },
                },
            ],
        });

        expect(art.id).to.be.an('number');
    });

    it('Test80', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            plugins: [
                artplayerPluginDanmuku({
                    danmuku: 'https://artplayer.org/assets/sample/danmuku.xml',
                }),
            ],
            controls: [
                {
                    position: 'right',

                    html: '发送弹幕',

                    click: function () {
                        var text = prompt('请输入弹幕文本', '弹幕测试文本');

                        if (!text || !text.trim()) return;

                        var color = '#' + Math.floor(Math.random() * 0xffffff).toString(16);

                        art.plugins.artplayerPluginDanmuku.emit({
                            text: text,

                            color: color,

                            border: true,
                        });
                    },
                },
            ],
        });

        expect(art.id).to.be.an('number');
    });

    it('Test81', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            plugins: [
                artplayerPluginDanmuku({
                    danmuku: 'https://artplayer.org/assets/sample/danmuku.xml',
                }),
            ],
            controls: [
                {
                    position: 'right',

                    html: '弹幕大小：<input type="range" min="12" max="50" step="1" value="25">',

                    style: {
                        display: 'flex',

                        alignItems: 'center',
                    },

                    mounted: function ($setting) {
                        const $range = $setting.querySelector('input[type=range]');

                        $range.addEventListener('change', () => {
                            art.plugins.artplayerPluginDanmuku.config({
                                fontSize: Number($range.value),
                            });
                        });
                    },
                },
            ],
        });

        expect(art.id).to.be.an('number');
    });

    it('Test82', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            muted: true,
        });
        art.on('ready', () => {
            art.play();
        });

        expect(art.id).to.be.an('number');
    });

    it('Test83', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            muted: true,
        });
        art.on('ready', () => {
            art.play();
            setTimeout(() => {
                art.pause();
            }, 3000);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test84', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            muted: true,
        });
        art.on('ready', () => {
            art.toggle();
            setTimeout(() => {
                art.toggle();
            }, 3000);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test85', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('ready', () => {
            art.seek = 5;
        });

        expect(art.id).to.be.an('number');
    });

    it('Test86', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('ready', () => {
            art.forward = 5;
        });

        expect(art.id).to.be.an('number');
    });

    it('Test87', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('ready', () => {
            art.seek = 5;
            setTimeout(() => {
                art.backward = 2;
            }, 3000);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test88', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('ready', () => {
            console.info(art.volume);
            art.volume = 0.5;
            console.info(art.volume);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test89', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('ready', () => {
            console.info(art.url);
            art.url = 'https://artplayer.org/assets/sample/video.mp4?t=0';
            console.info(art.url);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test90', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('ready', () => {
            art.seek = 10;
            setTimeout(() => {
                art.switchUrl('https://artplayer.org/assets/sample/video.mp4?t=0', '新视频名字');
            }, 3000);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test91', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('ready', () => {
            art.seek = 10;
            setTimeout(() => {
                art.switchQuality('https://artplayer.org/assets/sample/video.mp4?t=0', '新视频地址');
            }, 3000);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test92', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('ready', () => {
            console.info(art.muted);
            art.muted = true;
            console.info(art.muted);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test93', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('ready', () => {
            console.info(art.currentTime);
            art.currentTime = 5;
            console.info(art.currentTime);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test94', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('ready', () => {
            console.info(art.duration);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test95', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('ready', () => {
            art.seek = 10;
            art.screenshot();
        });

        expect(art.id).to.be.an('number');
    });

    it('Test96', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('ready', () => {
            art.seek = 10;
            art.getDataURL().then((url) => console.info(url));
        });

        expect(art.id).to.be.an('number');
    });

    it('Test97', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('ready', () => {
            art.seek = 10;
            art.getBlobUrl().then((url) => console.info(url));
        });

        expect(art.id).to.be.an('number');
    });

    it('Test98', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            fullscreen: true,
        });
        art.on('ready', () => {
            art.fullscreen = true;
            setTimeout(() => {
                art.fullscreen = false;
            }, 3000);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test99', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            fullscreenWeb: true,
        });
        art.on('ready', () => {
            art.fullscreenWeb = true;
            setTimeout(() => {
                art.fullscreenWeb = false;
            }, 3000);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test100', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            fullscreenWeb: true,
        });
        art.on('ready', () => {
            art.pip = true;
            setTimeout(() => {
                art.pip = false;
            }, 3000);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test101', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            poster: 'https://artplayer.org/assets/sample/poster.jpg',
        });
        art.on('ready', () => {
            console.info(art.poster);
            art.poster = 'https://artplayer.org/assets/sample/poster.jpg?t=0';
            console.info(art.poster);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test102', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('ready', () => {
            art.mini = true;
            setTimeout(() => {
                art.mini = false;
            }, 3000);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test103', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            muted: true,
        });
        art.on('ready', () => {
            console.info(art.playing);
            art.play();
            console.info(art.playing);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test104', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('ready', () => {
            console.info(art.autoSize);
            art.autoSize = true;
            console.info(art.autoSize);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test105', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('ready', () => {
            console.info(JSON.stringify(art.rect));
        });

        expect(art.id).to.be.an('number');
    });

    it('Test106', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('ready', () => {
            console.info(art.flip);
            art.flip = 'horizontal';
            console.info(art.flip);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test107', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            autoSize: true,
        });
        art.on('ready', () => {
            console.info(art.rotate);
            art.rotate = 90;
            console.info(art.rotate);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test108', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('ready', () => {
            console.info(art.playbackRate);
            art.playbackRate = 2;
            console.info(art.playbackRate);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test109', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('ready', () => {
            console.info(art.aspectRatio);
            art.aspectRatio = '16:9';
            console.info(art.aspectRatio);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test110', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('ready', () => {
            console.info(art.loop);
            art.loop = [5, 10];
            console.info(art.loop);
        });

        expect(art.id).to.be.an('number');
    });

    it('Test111', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
        });
        art.on('ready', () => {
            art.destroy();
        });

        expect(art.id).to.be.an('number');
    });

    it('Test112', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            controls: [
                {
                    position: 'right',

                    html: 'Subtitle 01',

                    selector: [
                        {
                            default: true,

                            html: '<span style="color:red">Subtitle 01</span>',

                            url: 'https://artplayer.org/assets/sample/subtitle.srt?id=1',
                        },

                        {
                            html: '<span style="color:yellow">Subtitle 02</span>',

                            url: 'https://artplayer.org/assets/sample/subtitle.srt?id=2',
                        },
                    ],

                    onSelect: function (item, $dom) {
                        art.subtitle.switch(item.url, {
                            name: $dom.innerText,
                        });

                        return '你点击了 ' + item.html;
                    },
                },
            ],
        });

        expect(art.id).to.be.an('number');
    });

    it('Test113', function () {
        var art = new Artplayer({
            container: '.artplayer-app',
            url: 'https://artplayer.org/assets/sample/video.mp4',
            setting: true,
        });
        art.on('ready', () => {
            art.layers.add({
                name: 'layer1',

                html: 'your-layer',

                mounted: function ($layer1) {
                    //
                },
            });
            art.contextmenu.add({
                name: 'contextmenu1',

                html: 'your-contextmenu',

                mounted: function ($contextmenu1) {
                    //
                },
            });
            art.controls.add({
                name: 'control1',

                html: 'your-control',

                position: 'right',

                mounted: function ($control1) {
                    //
                },
            });
            art.setting.add({
                name: 'setting1',

                html: 'your-setting',

                mounted: function ($setting1) {
                    //
                },
            });
            // 使用查询 query 获取组件的DOM元素
            var $layer1 = art.query('.art-layer-layer1');
            var $contextmenu1 = art.query('.art-contextmenu-contextmenu1');
            var $control1 = art.query('.art-control-control1');
            var $setting1 = art.query('.art-setting-setting1');
            // 推荐使用 name 获取组件的DOM元素
            var $layer1 = art.layers['layer1'];
            var $contextmenu1 = art.contextmenu['contextmenu1'];
            var $control1 = art.controls['control1'];
            var $setting1 = art.setting['setting1'];
        });

        expect(art.id).to.be.an('number');
    });
});
