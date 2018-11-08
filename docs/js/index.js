var mirror = CodeMirror(document.querySelector(`.code`), {
    lineNumbers: true,
    mode: 'javascript',
    matchBrackets: true,
    value: ''
});;

function creatCodeMirror(value) {
    mirror.setValue(value.trim());
}

function initApp(app) {
    Artplayer.config.video.events.forEach(item => {
        app.on('video:' + item, event => {
            console.log('video: ' + event.type);
        });
    });
}

function timeTaken(callback) {
    console.time('timeTaken');
    const r = callback();
    console.timeEnd('timeTaken');
    return r;
}

var $error = document.querySelector('.error-tip');
document.querySelector('.run').addEventListener('click', function (e) {
    try {
        Artplayer.instances.forEach(ins => {
            ins.destroy(true)
        });;
        timeTaken(function () {
            eval(mirror.getValue());
        });
        initApp(Artplayer.instances[0]);
        $error.innerHTML = '';
    } catch (error) {
        var msg = error.message.trim();
        $error.innerHTML = '请打开控制台：' + msg;
        console.error(msg);
    }
});

creatCodeMirror(`
new Artplayer({
    container: '.artplayer-app',
    url: 'https://blog.zhw-island.com/assets-cdn/video/one-more-time-one-more-chance-480p.mp4'
});
`);