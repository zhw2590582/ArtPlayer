// 使用 Github Issues Api 做弹幕接口
// 接口每小时限制 5000 次请求，勿滥用
var danmuku = new ArtplayerToolGithub({
    api: 'zhw2590582/github-issues-api-as-danmuku/issues/1',
    clientID: '749a95aad589f8849abe',
    clientSecret: '7bb6fa67ef6e525e5bd5fda46cd3925ecc4a3760',
});

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoSize: true,
    controls: [
        {
            name: 'danmuku',
            position: 'right',
            html: '发送弹幕',
            click: () => {
                if (window.location.href.includes('code=')) {
                    art.notice.show = '正在登陆中，请稍等！！！';
                } else if (!danmuku.isLogin) {
                    danmuku.login();
                } else {
                    var text = prompt('请输入：', '弹幕内容');
                    if (!text || !text.trim()) return;
                    if (text.length >= 20) {
                        art.notice.show = '弹幕字数不能大于20字！！！';
                        return;
                    }
                    if (danmuku.remaining <= 10) {
                        art.notice.show = '接口请求到达上限，请稍后再试！！！';
                        return;
                    }
                    art.notice.show = '弹幕发送中...';
                    danmuku
                        .send({
                            text: text,
                            time: art.player.currentTime,
                            color: '#' + Math.floor(Math.random() * 0xffffff).toString(16),
                        })
                        .then(data => {
                            art.notice.show = `发送弹幕成功: ${danmuku.remaining} / ${danmuku.limit}`;
                            art.plugins.artplayerPluginDanmuku.emit({
                                ...data,
                                mode: 0,
                                time: art.player.currentTime + 0.2,
                                border: true,
                            });
                        })
                        .catch(() => {
                            art.notice.show = `发送弹幕失败: ${danmuku.remaining} / ${danmuku.limit}`;
                        });
                }
            },
        },
    ],
    plugins: [
        artplayerPluginDanmuku({
            danmuku: () => danmuku.load(),
            speed: 5,
            opacity: 1,
            color: '#fff',
            size: 25,
            maxlength: 50,
            margin: [10, 100],
        }),
    ],
});
