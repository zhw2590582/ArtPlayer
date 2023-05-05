describe('Artplayer', function () {
    afterEach(function () {
        [...Artplayer.instances].forEach((art) => art.destroy());
    });

    it('Constructor is a global variable', function () {
        expect(Artplayer).to.be.an('function');
        expect(Artplayer.instances).to.be.an('array');
        expect(Artplayer.instances.length).to.be.equal(0);
    });
});