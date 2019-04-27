// 接口每小时限制 5000 次请求，勿滥用
var github = new ArtplayerToolGithub({
    api: 'zhw2590582/github-issues-api-as-danmuku/issues/1',
    clientID: '749a95aad589f8849abe',
    clientSecret: '7bb6fa67ef6e525e5bd5fda46cd3925ecc4a3760',
});

var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/you-name.mp4',
    autoSize: true,
    controls: [
        {
            name: 'danmuku',
            position: 'right',
            html: '发送弹幕',
            click: () => {
                if (!github.isLogin) {
                    github.login();
                } else {
                    var text = prompt('请输入：', '弹幕内容');
                    if (!text || !text.trim()) return;
                    if (text.length >= 20) {
                        art.notice.show('弹幕字数不能大于20字！！！');
                        return;    
                    }
                    if (github.remaining <= 10) {
                        art.notice.show('接口请求到达上限，请稍后再试！！！');
                        return;
                    }
                    art.notice.show('弹幕发送中...');
                    github
                        .send({
                            text: text,
                            time: art.player.currentTime,
                            color: '#' + Math.floor(Math.random() * 0xffffff).toString(16),
                        })
                        .then(data => {
                            art.notice.show(`发送弹幕成功: ${github.remaining} / ${github.limit}`);
                            art.plugins.artplayerPluginDanmu.emit({
                                ...data,
                                time: art.player.currentTime,
                            });
                        }).catch(() => {
                            art.notice.show(`发送弹幕失败: ${github.remaining} / ${github.limit}`);
                        });
                }
            },
        },
    ],
    plugins: [
        artplayerPluginDanmu({
            danmus: () => github.cache(),
            speed: 5,
            opacity: 1,
            color: '#fff',
            size: 25,
            maxlength: 50,
            margin: [10, 100],
        }),
    ],
});
