describe('Option', function () {
    var url = './assets/sample/video.mp4';

    afterEach(function () {
        [...Artplayer.instances].forEach((art) => {
            art.destroy(true);
        });
    });

    it('Throw error when multiple instances on the same dom element', function () {
        expect(function () {
            new Artplayer({ container: '.sample1', url: url });
            new Artplayer({ container: '.sample1', url: url });
        }).to.throw(/Cannot mount multiple instances on the same dom element/);
    });

    it('Throw error when container is not a dom element or selector', function () {
        expect(function () {
            new Artplayer({
                container: null,
                url: url,
            });
        }).to.throw(/option.container require \'string\' or \'Element\' type/);
    });
});
