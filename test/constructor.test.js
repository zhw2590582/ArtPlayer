describe('Constructor', function () {
    var url = './assets/sample/video.mp4';

    afterEach(function () {
        [...Artplayer.instances].forEach((art) => {
            art.destroy(true);
        });
    });

    it('Constructor is a global variable', function () {
        expect(Artplayer).to.be.an('function');
        expect(Artplayer.instances).to.be.an('array');
        expect(Artplayer.instances.length).to.be.equal(0);
    });

    it('Instance state', function () {
        var sample1 = new Artplayer({ container: '.sample1', url: url });
        expect(sample1.id).to.equal(1);
        var sample2 = new Artplayer({ container: '.sample2', url: url });
        expect(sample2.id).to.equal(2);
        var sample3 = new Artplayer({ container: '.sample3', url: url });
        expect(sample3.id).to.equal(3);
    });
});
