var controlMap = {};
function creatCodeMirror(id, value) {
    var mirror = CodeMirror(document.querySelector(`[data-control="${id}"]`), {
        lineNumbers: true,
        mode: 'javascript',
        matchBrackets: true,
        value: value.trim()
    });
    controlMap[Number(id)] = mirror;
    return mirror;
}

function initApp(app) {
    console.log(app);
}

var $error = document.querySelector('.error-tip');
Array.from(document.querySelectorAll('.run')).forEach(function (item) {
    item.addEventListener('click', function (e) {
        try {
            Artplayer.instances.forEach(ins => {
                ins.destroy(true)
            });;
            var id = Number(e.target.dataset.id);
            eval(controlMap[id].getValue());
            initApp(Artplayer.instances[0]);
            $error.innerHTML = '';
        } catch (error) {
            var msg = error.message.trim();
            $error.innerHTML = '请打开控制台：' + msg;
            console.error(msg);
        }
    });
});

creatCodeMirror(1, `
new Artplayer({
    container: '.artplayer-app',
    url: 'https://blog.zhw-island.com/assets-cdn/video/one-more-time-one-more-chance-480p.mp4'
});
`);