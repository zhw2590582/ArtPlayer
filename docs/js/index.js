var $code = document.querySelector('.code');
var $run = document.querySelector('.run');
var $textarea = document.querySelector('.textarea');

var mirror = CodeMirror($code, {
    lineNumbers: true,
    mode: 'javascript',
    matchBrackets: true,
    value: ''
});;

function setCode(value) {
    mirror.setValue(value.trim());
}

function log(msg) {
    msg = typeof msg === 'string' ? msg : JSON.stringify(msg);
    $textarea.value = $textarea.value + '\n' + msg;
    $textarea.scrollTop = $textarea.scrollHeight;
}

function initApp(app) {
    Artplayer.config.video.events.forEach(item => {
        app.on('video:' + item, event => {
            log('video: ' + event.type);
        });
    });
}

function runCode() {
    try {
        Artplayer.instances.forEach(ins => {
            ins.destroy(true)
        });;
        eval(mirror.getValue());
        initApp(Artplayer.instances[0]);
    } catch (error) {
        var msg = error.message.trim();
        log('运行错误：' + msg);
    }
}

$run.addEventListener('click', function (e) {
    runCode();
});

setCode(`
var url = 'https://blog.zhw-island.com/assets-cdn';
var app = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
    poster: url + '/image/one-more-time-one-more-chance-poster.jpg',
    pip: true,
    theme: '#ffad00',
    quality: [
        {
            default: true,
            name: '标清 480P',
            url: url + '/video/one-more-time-one-more-chance-480p.mp4'
        },
        {
            name: '高清 720P',
            url: url + '/video/one-more-time-one-more-chance-720p.mp4'
        }
    ],
    thumbnails: {
        url: url + '/image/one-more-time-one-more-chance-thumbnails.png',
        width: 190,
        height: 107
    },
    subtitle: {
        url: url + '/subtitle/one-more-time-one-more-chance.srt',
        style: {
            color: '#03A9F4'
        }
    },
    highlight: [
        {
            time: 60,
            text: 'One more chance'
        },
        {
            time: 120,
            text: '谁でもいいはずなのに'
        },
        {
            time: 180,
            text: '夏の想い出がまわる'
        },
        {
            time: 240,
            text: 'こんなとこにあるはずもないのに'
        },
        {
            time: 300,
            text: '－－终わり－－'
        }
    ]
});
`);

runCode();