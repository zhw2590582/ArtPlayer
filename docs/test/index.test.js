var artBaseOption = {
    container: '.artplayer-app',
    url: 'https://blog.zhw-island.com/assets-cdn/video/one-more-time-one-more-chance-480p.mp4',
};

describe('Detect registration status', function() {
    it('Constructor is a global variable', function() {
        expect(Artplayer).to.be.an('function');
        expect(Artplayer.instances).to.be.an('array');
    });

    it('Instance state', function() {
        var art = new Artplayer(artBaseOption);
        expect(art).to.be.an('object');
        expect(art.id).to.equal(1);
    });

    it('Throw error when multiple instances on the same dom element', function() {
        expect(function() {
            new Artplayer(artBaseOption);
        }).to.throw(/Cannot mount multiple instances on the same dom element/);
    });

    it('Destroy all instances', function() {
        expect(Artplayer.instances.length).to.equal(1);
        Artplayer.instances.forEach(art => {
            art.destroy(true);
        });
        expect(Artplayer.instances.length).to.equal(0);
    });
});
