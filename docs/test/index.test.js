var artBaseOption = {
    container: '.artplayer-app',
    url: 'https://blog.zhw-island.com/assets-cdn/video/one-more-time-one-more-chance-480p.mp4'
}

describe('Detect registration status', function() {
    it('Constructor is a global variable', function() {
        expect(window.Artplayer).to.be.an('function');
        expect(window.Artplayer.version).to.be.an('string');
        expect(window.Artplayer.env).to.be.an('string');
        expect(window.Artplayer.config).to.be.an('object');
        expect(window.Artplayer.utils).to.be.an('object');
        expect(window.Artplayer.DEFAULTS).to.be.an('object');
        expect(window.Artplayer.instances).to.be.an('array');
    });

    it('Instantiation state', function() {
        var art = new Artplayer(artBaseOption);
        expect(art).to.be.an('object');
    });

    it('Throw error when multiple instances on the same dom element', function() {
        expect(function () {
            new Artplayer(artBaseOption);
        }).to.throw(/Cannot mount multiple instances on the same dom element/)
    });
});
