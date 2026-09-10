// Auto-generated smoke tests from documentation code blocks
// Generated at: 2026-03-07T07:54:41.642Z
// Do not edit manually - run 'node scripts/build-test.js' to regenerate

describe('Documentation Code Examples', function () {
    this.timeout(5000);

    beforeEach(function () {
        // Destroy any existing instances
        [...Artplayer.instances].forEach((art) => art.destroy());
        // Reset container
        const container = document.querySelector('.artplayer-app');
        if (container) {
            container.innerHTML = '';
        }
    });

    afterEach(function () {
        [...Artplayer.instances].forEach((art) => art.destroy());
    });

    describe('advanced > built-in', function () {
        it('Example 1', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                console.info(art.option);
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 2', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                console.info(art.template);
                console.info(art.template.$video);
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 3', function (done) {
            try {
                var container = document.querySelector('.artplayer-app');
                
                var art = new Artplayer({
                    container: container,
                    url: '/assets/sample/video.mp4',
                });
                
                art.events.proxy(container, 'click', event => {
                	console.info('click', event);
                });
                
                art.events.hover(container, (event) => {
                    console.info('mouseenter', event);
                }, (event) => {
                    console.info('mouseleave', event);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 4', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.storage.set('test', { foo: 'bar' });
                const test = art.storage.get('test');
                console.info(test);
                art.storage.del('test');
                art.storage.clear();
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 5', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.storage.name = 'your-storage-key';
                art.storage.set('test', { foo: 'bar' });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 6', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                console.info(art.icons.loading);
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 7', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                console.info(art.i18n.get('Play'));
                
                art.i18n.update({
                    'zh-cn': {
                        Play: 'Your Play'
                    }
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 8', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    art.notice.show = 'Video Ready To Play';
                })
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 9', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    art.layers.add({
                        html: 'Some Text',
                    });
                
                	setTimeout(() => {
                		art.layers.show = false;
                	}, 1000);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 10', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    art.controls.add({
                        html: 'Some Text',
                        position: 'left',
                    });
                
                	setTimeout(() => {
                		art.controls.show = false;
                	}, 1000);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 11', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    art.contextmenu.add({
                        html: 'Some Text',
                    });
                
                    art.contextmenu.show = true;
                	setTimeout(() => {
                		art.contextmenu.show = false;
                	}, 1000);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 12', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    art.subtitle.url = '/assets/sample/subtitle.srt'
                    art.subtitle.style({
                        color: 'red',
                    });
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 13', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    art.info.show = true;
                
                    setTimeout(() => {
                        art.info.show = false;
                    }, 3000);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 14', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    art.loading.show = true;
                	setTimeout(() => {
                		art.loading.show = false;
                	}, 1000);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 15', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                function hotkeyEvent(event) {
                    console.info('click', event);
                }
                
                art.on('ready', () => {
                    art.hotkey.add(32, hotkeyEvent);
                    setTimeout(() => {
                		art.hotkey.remove(32, hotkeyEvent);
                	}, 5000);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 16', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    art.mask.show = false;
                	setTimeout(() => {
                		art.mask.show = true;
                	}, 1000);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 17', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    setting: true,
                    flip: true,
                    playbackRate: true,
                    aspectRatio: true,
                    subtitleOffset: true,
                });
                
                art.on('ready', () => {
                    art.setting.show = true;
                	setTimeout(() => {
                		art.setting.show = false;
                	}, 1000);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 18', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                function myPlugin(art) {
                    console.info(art);
                    return {
                        name: 'myPlugin',
                        something: 'something',
                        doSomething: function () {
                            console.info('doSomething');
                        },
                    };
                }
                
                art.on('ready', () => {
                    art.plugins.add(myPlugin);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

    });

    describe('advanced > class', function () {
        it('Example 1', function (done) {
            try {
                console.info([...Artplayer.instances]);
                
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                console.info([...Artplayer.instances]);
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 2', function (done) {
            try {
                console.info(Artplayer.version);
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 3', function (done) {
            try {
                console.info(Artplayer.env);
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 4', function (done) {
            try {
                console.info(Artplayer.build);
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 5', function (done) {
            try {
                console.info(Artplayer.config);
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 6', function (done) {
            try {
                console.info(Artplayer.utils);
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 7', function (done) {
            try {
                console.info(Artplayer.scheme);
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 8', function (done) {
            try {
                console.info(Artplayer.Emitter);
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 9', function (done) {
            try {
                console.info(Artplayer.validator);
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 10', function (done) {
            try {
                console.info(Artplayer.kindOf);
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 11', function (done) {
            try {
                console.info(Artplayer.html);
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 12', function (done) {
            try {
                console.info(Artplayer.option);
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

    });

    describe('advanced > event', function () {
        it('Example 1', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('video:canplay', () => {
                    console.info('video:canplay');
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 2', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.once('video:canplay', () => {
                    console.info('video:canplay');
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 3', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.emit('focus');
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 4', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                const onReady = () => {
                    console.info('ready');
                    art.off('ready', onReady);
                }
                
                art.on('ready', onReady);
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 5', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    console.info('ready');
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 6', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    art.url = '/assets/sample/video.mp4'
                });
                
                art.on('restart', (url) => {
                    console.info('restart', url);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 7', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('pause', () => {
                    console.info('pause');
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 8', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('play', () => {
                    console.info('play');
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 9', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('hotkey', (event) => {
                    console.info('hotkey', event);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 10', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    art.destroy();
                });
                
                art.on('destroy', () => {
                    console.info('destroy');
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 11', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('focus', (event) => {
                    console.info('focus', event);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 12', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('blur', (event) => {
                    console.info('blur', event);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 13', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('dblclick', (event) => {
                    console.info('dblclick', event);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 14', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('click', (event) => {
                    console.info('click', event);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 15', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/404.mp4',
                });
                
                art.on('error', (error, reconnectTime) => {
                    console.info(error, reconnectTime);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 16', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('hover', (state, event) => {
                    console.info('hover', state, event);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 17', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('mousemove', (event) => {
                    console.info('mousemove', event);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 18', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('resize', () => {
                    console.info('resize');
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 19', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('view', (state) => {
                    console.info('view', state);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 20', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    lock: true,
                });
                
                art.on('lock', (state) => {
                    console.info('lock', state);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 21', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    aspectRatio: true,
                    setting: true,
                });
                
                art.on('aspectRatio', (aspectRatio) => {
                    console.info('aspectRatio', aspectRatio);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 22', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    art.autoHeight();
                });
                
                art.on('autoHeight', (height) => {
                    console.info('autoHeight', height);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 23', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    autoSize: true,
                });
                
                art.on('autoSize', () => {
                    console.info('autoSize');
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 24', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    flip: true,
                    setting: true,
                });
                
                art.on('flip', (flip) => {
                    console.info('flip', flip);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 25', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    fullscreen: true,
                });
                
                art.on('fullscreen', (state) => {
                    console.info('fullscreen', state);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 26', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                	art.fullscreen = true;
                });
                
                art.on('fullscreenError', (event) => {
                    console.info('fullscreenError', event);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 27', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    fullscreenWeb: true,
                });
                
                art.on('fullscreenWeb', (state) => {
                    console.info('fullscreenWeb', state);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 28', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    art.mini = true;
                });
                
                art.on('mini', (state) => {
                    console.info('mini', state);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 29', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    pip: true,
                });
                
                art.on('pip', (state) => {
                    console.info('pip', state);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 30', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    screenshot: true,
                });
                
                art.on('screenshot', (dataUri) => {
                    console.info('screenshot', dataUri);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 31', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('seek', (currentTime) => {
                    console.info('seek', currentTime);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 32', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    subtitleOffset: true,
                    subtitle: {
                        url: '/assets/sample/subtitle.srt',
                    },
                    setting: true,
                });
                
                art.on('subtitleOffset', (offset) => {
                    console.info('subtitleOffset', offset);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 33', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    subtitle: {
                        url: '/assets/sample/subtitle.srt',
                    },
                });
                
                art.on('subtitleBeforeUpdate', (cues) => {
                    console.info('subtitleBeforeUpdate', cues);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 34', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    subtitle: {
                        url: '/assets/sample/subtitle.srt',
                    },
                });
                
                art.on('subtitleAfterUpdate', (cues) => {
                    console.info('subtitleAfterUpdate', cues);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 35', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    subtitle: {
                        url: '/assets/sample/subtitle.srt',
                    },
                });
                
                art.on('subtitleLoad', (option, cues) => {
                    console.info('subtitleLoad', cues, option);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 36', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('info', (state) => {
                    console.log(state);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 37', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('layer', (state) => {
                    console.log(state);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 38', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('loading', (state) => {
                    console.log(state);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 39', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('mask', (state) => {
                    console.log(state);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 40', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('subtitle', (state) => {
                    console.log(state);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 41', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('contextmenu', (state) => {
                    console.log(state);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 42', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('control', (state) => {
                    console.log(state);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 43', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    setting: true,
                });
                
                art.on('setting', (state) => {
                    console.log(state);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 44', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('muted', (state) => {
                    console.log(state);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 45', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('keydown', (event) => {
                    console.log(event.code);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

    });

    describe('advanced > global', function () {
        it('Example 1', function (done) {
            try {
                Artplayer.DEBUG = true;
                
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 2', function (done) {
            try {
                console.log(Artplayer.STYLE);
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 3', function (done) {
            try {
                Artplayer.CONTEXTMENU = false;
                
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 4', function (done) {
            try {
                Artplayer.NOTICE_TIME = 5000;
                
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 5', function (done) {
            try {
                Artplayer.SETTING_WIDTH = 300;
                
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    setting: true,
                    loop: true,
                    flip: true,
                    playbackRate: true,
                    aspectRatio: true,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 6', function (done) {
            try {
                Artplayer.SETTING_ITEM_WIDTH = 300;
                
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    setting: true,
                    loop: true,
                    flip: true,
                    playbackRate: true,
                    aspectRatio: true,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 7', function (done) {
            try {
                Artplayer.SETTING_ITEM_HEIGHT = 40;
                
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    setting: true,
                    loop: true,
                    flip: true,
                    playbackRate: true,
                    aspectRatio: true,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 8', function (done) {
            try {
                Artplayer.RESIZE_TIME = 500;
                
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('resize', () => {
                    console.log('resize');
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 9', function (done) {
            try {
                Artplayer.SCROLL_TIME = 500;
                
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('scroll', () => {
                    console.log('scroll');
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 10', function (done) {
            try {
                Artplayer.SCROLL_GAP = 100;
                
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('scroll', () => {
                    console.log('scroll');
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 11', function (done) {
            try {
                Artplayer.AUTO_PLAYBACK_MAX = 20;
                
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    autoPlayback: true,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 12', function (done) {
            try {
                Artplayer.AUTO_PLAYBACK_MIN = 10;
                
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    autoPlayback: true,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 13', function (done) {
            try {
                Artplayer.AUTO_PLAYBACK_TIMEOUT = 5000;
                
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    autoPlayback: true,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 14', function (done) {
            try {
                Artplayer.RECONNECT_TIME_MAX = 10;
                
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/404.mp4',
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 15', function (done) {
            try {
                Artplayer.RECONNECT_SLEEP_TIME = 3000;
                
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/404.mp4',
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 16', function (done) {
            try {
                Artplayer.CONTROL_HIDE_TIME = 5000;
                
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 17', function (done) {
            try {
                Artplayer.DBCLICK_TIME = 500;
                
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('dblclick', () => {
                    console.log('dblclick');
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 18', function (done) {
            try {
                Artplayer.DBCLICK_FULLSCREEN = false;
                
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 19', function (done) {
            try {
                Artplayer.MOBILE_DBCLICK_PLAY = false;
                
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 20', function (done) {
            try {
                Artplayer.MOBILE_CLICK_PLAY = true;
                
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 21', function (done) {
            try {
                Artplayer.AUTO_ORIENTATION_TIME = 500;
                
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    autoOrientation: true,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 22', function (done) {
            try {
                Artplayer.INFO_LOOP_TIME = 2000;
                
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.info.show = true;
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 23', function (done) {
            try {
                Artplayer.FAST_FORWARD_VALUE = 5;
                
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    fastForward: true,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 24', function (done) {
            try {
                Artplayer.FAST_FORWARD_TIME = 2000;
                
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    fastForward: true,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 25', function (done) {
            try {
                Artplayer.TOUCH_MOVE_RATIO = 1;
                
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 26', function (done) {
            try {
                Artplayer.VOLUME_STEP = 0.2;
                
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 27', function (done) {
            try {
                Artplayer.SEEK_STEP = 10;
                
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 28', function (done) {
            try {
                Artplayer.PLAYBACK_RATE = [0.5, 1, 2, 3, 4, 5];
                
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    setting: true,
                    playbackRate: true,
                });
                
                art.contextmenu.show = true;
                art.setting.show = true;
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 29', function (done) {
            try {
                Artplayer.ASPECT_RATIO = ['default', '1:1', '2:1', '4:3', '6:5'];
                
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    setting: true,
                    aspectRatio: true,
                });
                
                art.contextmenu.show = true;
                art.setting.show = true;
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 30', function (done) {
            try {
                Artplayer.FLIP = ['normal', 'horizontal'];
                
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    setting: true,
                    flip: true,
                });
                
                art.contextmenu.show = true;
                art.setting.show = true;
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 31', function (done) {
            try {
                Artplayer.FULLSCREEN_WEB_IN_BODY = false;
                
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    fullscreenWeb: true,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 32', function (done) {
            try {
                Artplayer.LOG_VERSION = false;
                
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 33', function (done) {
            try {
                Artplayer.USE_RAF = true;
                
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    miniProgressBar: true,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 34', function (done) {
            try {
                Artplayer.REMOVE_SRC_WHEN_DESTROY = false;
                
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                // 只销毁界面，不主动清空 src
                art.destroy();
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

    });

    describe('advanced > plugin', function () {
        it('Example 1', function (done) {
            try {
                function myPlugin(art) {
                    console.info(art);
                    return {
                        name: 'myPlugin',
                        something: 'something',
                        doSomething: function () {
                            console.info('doSomething');
                        },
                    };
                }
                
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    plugins: [myPlugin],
                });
                
                art.on('ready', () => {
                    console.info(art.plugins.myPlugin);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 2', function (done) {
            try {
                function myPlugin(art) {
                    console.info(art);
                    return {
                        name: 'myPlugin',
                        something: 'something',
                        doSomething: function () {
                            console.info('doSomething');
                        },
                    };
                }
                
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.plugins.add(myPlugin);
                
                art.on('ready', () => {
                    console.info(art.plugins.myPlugin);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 3', function (done) {
            try {
                function adsPlugin(option) {
                    return (art) => {
                        art.layers.add({
                            name: 'ads',
                            html: `<img style="width: 100px" src="${option.url}">`,
                            style: {
                                display: 'none',
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                            },
                        });
                
                        function show() {
                            art.layers.ads.style.display = 'block';
                        }
                
                        function hide() {
                            art.layers.ads.style.display = 'none';
                        }
                
                        art.controls.add({
                            name: 'hide-ads',
                            position: 'right',
                            html: 'Hide Ads',
                            tooltip: 'Hide Ads',
                            click: hide,
                            style: {
                                marginRight: '20px'
                            }
                        });
                
                        art.controls.add({
                            name: 'show-ads',
                            position: 'right',
                            html: 'Show Ads',
                            tooltip: 'Show Ads',
                            click: show,
                        });
                
                        art.on('play', hide);
                        art.on('pause', show);
                
                        return {
                            name: 'adsPlugin',
                            show,
                            hide
                        };
                    }
                }
                
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    plugins: [
                        adsPlugin({
                            url: '/assets/sample/layer.png'
                        })
                    ],
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

    });

    describe('advanced > property', function () {
        it('Example 1', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    muted: true,
                });
                
                art.on('ready', () => {
                    art.play();
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 2', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    muted: true,
                });
                
                art.on('ready', () => {
                    art.play();
                
                    setTimeout(() => {
                        art.pause();
                    }, 3000);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 3', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    muted: true,
                });
                
                art.on('ready', () => {
                    art.toggle();
                
                    setTimeout(() => {
                        art.toggle();
                    }, 3000);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 4', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    art.destroy();
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 5', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    // 仅重置 video，不移除界面
                    art.reset();
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 6', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    art.seek = 5;
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 7', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    art.forward = 5;
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 8', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    art.seek = 5;
                
                    setTimeout(() => {
                        art.backward = 2;
                    }, 3000);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 9', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    console.info(art.volume);
                    art.volume = 0.5;
                    console.info(art.volume);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 10', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    art.url = '/assets/sample/video.mp4?t=0';
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 11', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    art.seek = 10;
                    setTimeout(() => {
                        art.switch = '/assets/sample/video.mp4?t=0';
                    }, 3000);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 12', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    art.seek = 10;
                    setTimeout(() => {
                        art.switchUrl('/assets/sample/video.mp4?t=0');
                    }, 3000);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 13', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    art.seek = 10;
                    setTimeout(() => {
                        art.switchQuality('/assets/sample/video.mp4?t=0');
                    }, 3000);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 14', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    console.info(art.muted);
                    art.muted = true;
                    console.info(art.muted);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 15', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    console.info(art.currentTime);
                    art.currentTime = 5;
                    console.info(art.currentTime);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 16', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    console.info(art.duration);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 17', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    art.screenshot('your-name');
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 18', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', async () => {
                    const url = await art.getDataURL();
                	console.info(url)
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 19', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', async () => {
                    const url = await art.getBlobUrl();
                    console.info(url);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 20', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    controls: [
                        {
                            position: 'right',
                            html: 'Fullscreen Switch',
                            click: function () {
                                art.fullscreen = !art.fullscreen;
                            },
                        },
                    ],
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 21', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    fullscreenWeb: true,
                });
                
                art.on('ready', () => {
                    art.fullscreenWeb = true;
                
                    setTimeout(() => {
                        art.fullscreenWeb = false;
                    }, 3000);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 22', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    controls: [
                        {
                            position: 'right',
                            html: 'PIP',
                            click: function () {
                                art.pip = !art.pip;
                            },
                        },
                    ],
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 23', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    poster: '/assets/sample/poster.jpg',
                });
                
                art.on('ready', () => {
                    console.info(art.poster);
                    art.poster = '/assets/sample/poster.jpg?t=0';
                    console.info(art.poster);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 24', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    art.mini = true;
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 25', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    muted: true,
                });
                
                art.on('ready', () => {
                    console.info(art.playing);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 26', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    console.info(art.state); // 默认 standard
                    art.state = 'mini';
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 27', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    art.autoSize();
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 28', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    console.info(JSON.stringify(art.rect));
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 29', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    console.info(art.width, art.height, art.left, art.top);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 30', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    console.info(art.flip);
                    art.flip = 'horizontal';
                    console.info(art.flip);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 31', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    console.info(art.playbackRate);
                    art.playbackRate = 2;
                    console.info(art.playbackRate);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 32', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    console.info(art.aspectRatio);
                    art.aspectRatio = '16:9';
                    console.info(art.aspectRatio);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 33', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    art.autoHeight();
                });
                
                art.on('resize', () => {
                    art.autoHeight();
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 34', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    console.info(art.attr('playsInline'));
                    art.attr('playsInline', true);
                    console.info(art.attr('playsInline'));
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 35', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    console.info(art.type);
                    art.type = 'm3u8';
                    console.info(art.type);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 36', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    console.info(art.theme);
                    art.theme = '#000';
                    console.info(art.theme);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 37', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    controls: [
                        {
                            position: 'right',
                            html: 'AirPlay',
                            click: function () {
                                art.airplay();
                            },
                        },
                    ],
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 38', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('video:timeupdate', () => {
                    console.info(art.loaded);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 39', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('video:timeupdate', () => {
                    console.info(art.loadedTime);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 40', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.on('video:timeupdate', () => {
                    console.info(art.played);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 41', function (done) {
            try {
                var container = document.querySelector('.artplayer-app');
                
                var art = new Artplayer({
                	container: container,
                	url: '/assets/sample/video.mp4',
                });
                
                art.proxy(container, 'click', event => {
                	console.info(event);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 42', function (done) {
            try {
                var art = new Artplayer({
                	container: '.artplayer-app',
                	url: '/assets/sample/video.mp4',
                });
                
                console.info(art.query('.art-video'));
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 43', function (done) {
            try {
                var art = new Artplayer({
                	container: '.artplayer-app',
                	url: '/assets/sample/video.mp4',
                });
                
                console.info(art.video);
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 44', function (done) {
            try {
                var art = new Artplayer({
                	container: '.artplayer-app',
                	url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    console.log(art.cssVar('--art-theme'));
                    art.cssVar('--art-theme', 'green');
                    console.log(art.cssVar('--art-theme'));
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 45', function (done) {
            try {
                var art = new Artplayer({
                	container: '.artplayer-app',
                	url: '/assets/sample/video.mp4',
                	quality: [
                		{
                			default: true,
                			html: 'SD 480P',
                			url: '/assets/sample/video.mp4',
                		},
                		{
                			html: 'HD 720P',
                			url: '/assets/sample/video.mp4',
                		},
                	],
                });
                
                art.on('ready', () => {
                	setTimeout(() => {
                		art.quality = [
                			{
                				default: true,
                				html: '1080P',
                				url: '/assets/sample/video.mp4',
                			},
                			{
                				html: '4K',
                				url: '/assets/sample/video.mp4',
                			},
                		];
                	}, 3000);
                })
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 46', function (done) {
            try {
                var art = new Artplayer({
                	container: '.artplayer-app',
                	url: '/assets/sample/video.mp4',
                });
                
                art.on('ready', () => {
                    art.thumbnails = {
                        url: '/assets/sample/thumbnails.png',
                        number: 60,
                        column: 10,
                    };
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 47', function (done) {
            try {
                var art = new Artplayer({
                	container: '.artplayer-app',
                	url: '/assets/sample/video.mp4',
                    subtitle: {
                        url: '/assets/sample/subtitle.srt',
                    },
                });
                
                art.on('ready', () => {
                    art.subtitleOffset = 1;
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

    });

    describe('component > contextmenu', function () {
        it('Example 1', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    contextmenu: [
                        {
                            name: 'your-menu',
                            html: 'Your Menu',
                            click: function (...args) {
                                console.info(args);
                                art.contextmenu.show = false;
                            },
                        },
                    ],
                });
                
                art.contextmenu.show = true;
                
                // Get the Element of contextmenu by name
                console.info(art.contextmenu['your-menu']);
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 2', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.contextmenu.add({
                    name: 'your-menu',
                    html: 'Your Menu',
                    click: function (...args) {
                        console.info(args);
                        art.contextmenu.show = false;
                    },
                });
                
                art.contextmenu.show = true;
                
                // Get the Element of contextmenu by name
                console.info(art.contextmenu['your-menu']);
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 3', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    contextmenu: [
                        {
                            name: 'your-menu',
                            html: 'Your Menu',
                            click: function (...args) {
                                console.info(args);
                                art.contextmenu.show = false;
                            },
                        },
                    ],
                });
                
                art.contextmenu.show = true;
                
                art.on('ready', () => {
                    setTimeout(() => {
                        // Delete the contextmenu by name
                        art.contextmenu.remove('your-menu')
                    }, 3000);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 4', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    contextmenu: [
                        {
                            name: 'your-menu',
                            html: 'Your Menu',
                            click: function (...args) {
                                console.info(args);
                                art.contextmenu.show = false;
                            },
                        },
                    ],
                });
                
                art.contextmenu.show = true;
                
                art.on('ready', () => {
                    setTimeout(() => {
                        // Update the contextmenu by name
                        art.contextmenu.update({
                            name: 'your-menu',
                            html: 'Your New Menu',
                        })
                    }, 3000);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

    });

    describe('component > controls', function () {
        it('Example 1', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    controls: [
                        {
                            name: 'your-button',
                            index: 10,
                            position: 'left',
                            html: 'Your Button',
                            tooltip: 'Your Button',
                            style: {
                                color: 'red',
                            },
                            click: function (...args) {
                                console.info('click', args);
                            },
                            mounted: function (...args) {
                                console.info('mounted', args);
                            },
                        },
                        {
                            name: 'subtitle',
                            position: 'right',
                            html: 'Subtitle',
                            selector: [
                                {
                                    default: true,
                                    html: '<span style="color:red">subtitle 01</span>',
                                },
                                {
                                    html: '<span style="color:yellow">subtitle 02</span>',
                                },
                            ],
                            onSelect: function (item, $dom) {
                                console.info(item, $dom);
                                return 'Your ' + item.html;
                            },
                        },
                    ],
                });
                
                // Get the Element of control by name
                console.info(art.controls['your-button']);
                console.info(art.controls['subtitle']);
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 2', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.controls.add({
                    name: 'button1',
                    index: 10,
                    position: 'left',
                    html: 'Your Button',
                    tooltip: 'Your Button',
                    style: {
                        color: 'red',
                    },
                    click: function (...args) {
                        console.info('click', args);
                    },
                    mounted: function (...args) {
                        console.info('mounted', args);
                    },
                });
                
                // Get the Element of control by name
                console.info(art.controls['button1']);
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 3', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    controls: [
                        {
                            name: 'button1',
                            index: 10,
                            position: 'right',
                            html: 'Your Button',
                            tooltip: 'Your Button',
                            style: {
                                color: 'red',
                            },
                        }
                    ]
                });
                
                art.on('ready', () => {
                    setTimeout(() => {
                        // Delete the control by name
                        art.controls.remove('button1');
                    }, 3000);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 4', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    controls: [
                        {
                            name: 'button1',
                            index: 10,
                            position: 'right',
                            html: 'Subtitle',
                            selector: [
                                {
                                    default: true,
                                    html: 'subtitle 01',
                                },
                                {
                                    html: 'subtitle 02',
                                },
                            ],
                        }
                    ]
                });
                
                art.on('ready', () => {
                    setTimeout(() => {
                        // Update the control by name
                        art.controls.update({
                            name: 'button1',
                            index: 10,
                            position: 'right',
                            html: 'New Subtitle',
                            selector: [
                                {
                                    default: true,
                                    html: 'new subtitle 01',
                                },
                                {
                                    html: 'new subtitle 02',
                                },
                            ],
                        });
                    }, 3000);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

    });

    describe('component > layers', function () {
        it('Example 1', function (done) {
            try {
                var img = '/assets/sample/layer.png';
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    layers: [
                        {
                            name: 'potser',
                            html: `<img style="width: 100px" src="${img}">`,
                            tooltip: 'Potser Tip',
                            style: {
                                position: 'absolute',
                                top: '50px',
                                right: '50px',
                            },
                            click: function (...args) {
                                console.info('click', args);
                            },
                            mounted: function (...args) {
                                console.info('mounted', args);
                            },
                        },
                    ],
                });
                
                // Get the Element of layer by name
                console.info(art.layers['potser']);
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 2', function (done) {
            try {
                var img = '/assets/sample/layer.png';
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                
                art.layers.add({
                    name: 'potser',
                    html: `<img style="width: 100px" src="${img}">`,
                    tooltip: 'Potser Tip',
                    style: {
                        position: 'absolute',
                        top: '50px',
                        right: '50px',
                    },
                    click: function (...args) {
                        console.info('click', args);
                    },
                    mounted: function (...args) {
                        console.info('mounted', args);
                    },
                });
                
                // Get the Element of layer by name
                console.info(art.layers['potser']);
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 3', function (done) {
            try {
                var img = '/assets/sample/layer.png';
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    layers: [
                        {
                            name: 'potser',
                            html: `<img style="width: 100px" src="${img}">`,
                            style: {
                                position: 'absolute',
                                top: '50px',
                                right: '50px',
                            },
                        },
                    ],
                });
                
                art.on('ready', () => {
                    setTimeout(() => {
                        // Delete the layer by name
                        art.layers.remove('potser');
                    }, 3000);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 4', function (done) {
            try {
                var img = '/assets/sample/layer.png';
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    layers: [
                        {
                            name: 'potser',
                            html: `<img style="width: 100px" src="${img}">`,
                            style: {
                                position: 'absolute',
                                top: '50px',
                                right: '50px',
                            },
                        },
                    ],
                });
                
                art.on('ready', () => {
                    setTimeout(() => {
                        // Update the layer by name
                        art.layers.update({
                            name: 'potser',
                            html: `<img style="width: 200px" src="${img}">`,
                            style: {
                                position: 'absolute',
                                top: '50px',
                                left: '50px',
                            },
                        });
                    }, 3000);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

    });

    describe('component > setting', function () {
        it('Example 1', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                	setting: true,
                    flip: true,
                    playbackRate: true,
                    aspectRatio: true,
                    subtitleOffset: true,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 2', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    setting: true,
                    settings: [
                        {
                            html: 'Button',
                            icon: '<img width="22" height="22" src="/assets/img/state.svg">',
                            tooltip: 'tooltip',
                			onClick(item, $dom, event) {
                                console.info(item, $dom, event);
                				return 'new tooltip'
                			}
                        },
                    ],
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 3', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    setting: true,
                    settings: [
                        {
                            html: 'Subtitle',
                            width: 250,
                            tooltip: 'Subtitle 01',
                            selector: [
                                {
                                    default: true,
                                    html: '<span style="color:red">Subtitle 01</span>',
                                    url: '/assets/sample/subtitle.srt?id=1',
                                },
                                {
                                    html: '<span style="color:yellow">Subtitle 02</span>',
                                    url: '/assets/sample/subtitle.srt?id=2',
                                },
                            ],
                            onSelect: function (item, $dom, event) {
                                console.info(item, $dom, event);
                                art.subtitle.url = item.url;
                                return item.html;
                            },
                        },
                        {
                            html: 'Quality',
                            width: 150,
                            tooltip: '1080P',
                            selector: [
                                {
                                    default: true,
                                    html: '1080P',
                                    url: '/assets/sample/video.mp4?id=1080',
                                },
                                {
                                    html: '720P',
                                    url: '/assets/sample/video.mp4?id=720',
                                },
                                {
                                    html: '360P',
                                    url: '/assets/sample/video.mp4?id=360',
                                },
                            ],
                            onSelect: function (item, $dom, event) {
                                console.info(item, $dom, event);
                                art.switchQuality(item.url, item.html);
                                return item.html;
                            },
                        },
                    ],
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 4', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    setting: true,
                    settings: [
                        {
                            html: 'Multi-level',
                            selector: [
                                {
                                    html: 'Setting 01',
                                    width: 150,
                                    selector: [
                                        {
                                            html: 'Setting 01 - 01',
                                        },
                                        {
                                            html: 'Setting 01 - 02',
                                        },
                                    ],
                                    onSelect: function (item, $dom, event) {
                                        console.info(item, $dom, event);
                                        return item.html;
                                    },
                                },
                                {
                                    html: 'Setting 02',
                                    width: 150,
                                    selector: [
                                        {
                                            html: 'Setting 02 - 01',
                                        },
                                        {
                                            html: 'Setting 02 - 02',
                                        },
                                    ],
                                    onSelect: function (item, $dom, event) {
                                        console.info(item, $dom, event);
                                        return item.html;
                                    },
                                },
                            ],
                        },
                    ],
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 5', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    setting: true,
                    settings: [
                        {
                            html: 'PIP Mode',
                            tooltip: 'Close',
                            icon: '<img width="22" height="22" src="/assets/img/state.svg">',
                            switch: false,
                            onSwitch: function (item, $dom, event) {
                                console.info(item, $dom, event);
                                const nextState = !item.switch;
                                art.pip = nextState;
                                item.tooltip = nextState ? 'Open' : 'Close';
                                return nextState;
                            },
                        },
                    ],
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 6', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    setting: true,
                    settings: [
                        {
                            html: 'Slider',
                            tooltip: '5x',
                            icon: '<img width="22" height="22" src="/assets/img/state.svg">',
                            range: [5, 1, 10, 1],
                            onChange: function (item, $dom, event) {
                                console.info(item, $dom, event);
                                return item.range[0] + 'x';
                            },
                        },
                    ],
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 7', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    setting: true,
                });
                
                art.setting.show = true;
                
                art.setting.add({
                    html: 'Slider',
                    tooltip: '5x',
                    icon: '<img width="22" height="22" src="/assets/img/state.svg">',
                    range: [5, 1, 10, 1],
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 8', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    setting: true,
                    flip: true,
                    settings: [
                        {
                            name: 'slider',
                            html: 'Slider',
                            tooltip: '5x',
                            icon: '<img width="22" height="22" src="/assets/img/state.svg">',
                            range: [5, 1, 10, 1],
                        },
                    ],
                });
                
                art.setting.show = true;
                
                art.on('ready', () => {
                    setTimeout(() => {
                        // Delete the setting by name
                        art.setting.remove('slider');
                    }, 3000);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 9', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    setting: true,
                    settings: [
                        {
                            name: 'slider',
                            html: 'Slider',
                            tooltip: '5x',
                            icon: '<img width="22" height="22" src="/assets/img/state.svg">',
                            range: [5, 1, 10, 1],
                        },
                    ],
                });
                
                art.setting.show = true;
                
                art.on('ready', () => {
                    setTimeout(() => {
                        // Update the setting by name
                        art.setting.update({
                            name: 'slider',
                            html: 'PIP Mode',
                            tooltip: 'Close',
                            icon: '<img width="22" height="22" src="/assets/img/state.svg">',
                            switch: false,
                        });
                    }, 3000);
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

    });

    describe('start > option', function () {
        it('Example 1', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app', 
                    // container: document.querySelector('.artplayer-app'),
                    url: '/assets/sample/video.mp4',
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 2', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 3', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                });
                
                setTimeout(() => {
                    art.url = '/assets/sample/video.mp4';
                }, 1000);
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 4', function (done) {
            try {
                var art = new Artplayer({
                    id: 'your-url-id',
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 5', function (done) {
            try {
                var art = new Artplayer(
                    {
                        container: '.artplayer-app',
                        url: '/assets/sample/video.mp4',
                        muted: true,
                    },
                    function onReady(art) {
                        this.play()
                    },
                );
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 6', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    poster: '/assets/sample/poster.jpg',
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 7', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    theme: '#ffad00',
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 8', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    volume: 0.5,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 9', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    isLive: true,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 10', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    muted: true,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 11', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    autoplay: true,
                    muted: true,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 12', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    autoSize: true,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 13', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    autoMini: true,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 14', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    loop: true,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 15', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    flip: true,
                    setting: true,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 16', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    playbackRate: true,
                    setting: true,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 17', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    aspectRatio: true,
                    setting: true,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 18', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    screenshot: true,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 19', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    setting: true,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 20', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    hotkey: true,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 21', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    pip: true,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 22', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    mutex: true,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 23', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    backdrop: false, // 关闭毛玻璃效果
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 24', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    fullscreen: true,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 25', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    fullscreenWeb: true,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 26', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    subtitleOffset: true,
                    subtitle: {
                        url: '/assets/sample/subtitle.srt',
                    },
                    setting: true,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 27', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    miniProgressBar: true,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 28', function (done) {
            try {
                var $container = document.querySelector('.artplayer-app');
                $container.innerHTML = Artplayer.html;
                
                var art = new Artplayer({
                    container: $container,
                    url: '/assets/sample/video.mp4',
                    useSSR: true,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 29', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    playsInline: true,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 30', function (done) {
            try {
                var img = '/assets/sample/layer.png';
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    layers: [
                        {
                            name: 'potser',
                            html: `<img style="width: 100px" src="${img}">`,
                            style: {
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                opacity: '.9',
                            },
                            click: function (...args) {
                                console.info('click', args);
                                art.layers.show = false;
                            },
                            mounted: function (...args) {
                                console.info('mounted', args);
                            },
                        },
                    ],
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 31', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    setting: true,
                    settings: [
                        {
                            html: 'setting01',
                            selector: [
                                {
                                    html: 'setting01-01',
                                },
                                {
                                    html: 'setting01-02',
                                },
                            ],
                            onSelect: function (...args) {
                                console.info(args);
                            },
                        },
                        {
                            html: 'setting02',
                            selector: [
                                {
                                    html: 'setting02-01',
                                },
                                {
                                    html: 'setting02-02',
                                },
                            ],
                            onSelect: function (...args) {
                                console.info(args);
                            },
                        },
                    ],
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 32', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    contextmenu: [
                        {
                            html: 'your-menu',
                            click: function (...args) {
                                console.info('click', args);
                                art.contextmenu.show = false;
                            },
                        },
                    ],
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 33', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    controls: [
                        {
                            position: 'left',
                            html: 'your-control',
                            tooltip: 'Your Control',
                            style: {
                                color: 'green',
                            },
                            click: function (...args) {
                                console.info('click', args);
                            },
                        },
                    ],
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 34', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    quality: [
                        {
                            default: true,
                            html: 'SD 480P',
                            url: '/assets/sample/video.mp4',
                        },
                        {
                            html: 'HD 720P',
                            url: '/assets/sample/video.mp4',
                        },
                    ],
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 35', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
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
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 36', function (done) {
            try {
                function myPlugin(art) {
                    console.info(art);
                    return {
                        name: 'myPlugin',
                        something: 'something',
                        doSomething: function () {
                            console.info('doSomething');
                        },
                    };
                }
                
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    plugins: [myPlugin],
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 37', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    thumbnails: {
                        url: '/assets/sample/thumbnails.png',
                        number: 60,
                        column: 10,
                    },
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 38', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    subtitle: {
                        url: '/assets/sample/subtitle.srt',
                        type: 'srt',
                        encoding: 'utf-8',
                        escape: true,
                        style: {
                            color: '#03A9F4',
                            'font-size': '30px',
                        },
                    },
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 39', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    moreVideoAttr: {
                        'webkit-playsinline': true,
                        playsInline: true,
                    },
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 40', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    icons: {
                        loading: '<img src="/assets/img/ploading.gif">',
                        state: '<img src="/assets/img/state.png">',
                    },
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 41', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.m3u8',
                    type: 'm3u8',
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 42', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.m3u8',
                    customType: {
                        m3u8: function (video, url, art) {
                            //
                        },
                    },
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 43', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    lang: 'en',
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 44', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    lang: 'your-lang',
                    i18n: {
                        'your-lang': {
                            Play: 'Your Play'
                        },
                    },
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 45', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    i18n: {
                        'zh-cn': {
                            Play: 'Your Play'
                        },
                        'zh-tw': {
                            Play: 'Your Play'
                        },
                    },
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 46', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    lock: true,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 47', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    gesture: false,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 48', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    fastForward: true,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 49', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    id: 'your-url-id',
                    autoPlayback: true,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 50', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    autoOrientation: true,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 51', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    airplay: true,
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 52', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    cssVar: {
                        //
                    },
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

        it('Example 53', function (done) {
            try {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: '/assets/sample/video.mp4',
                    proxy: () => document.createElement('video')
                });
                // Wait a bit for async initialization
                setTimeout(() => done(), 100);
            } catch (err) {
                done(err);
            }
        });

    });

});