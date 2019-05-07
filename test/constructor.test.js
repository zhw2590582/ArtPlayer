describe('Constructor', function() {
    it('Constructor is a global variable', function() {
        expect(Artplayer).to.be.an('function');
        expect(Artplayer.instances).to.be.an('array');
        expect(Artplayer.instances.length).to.be.equal(0);
    });

    it('Instance state', function() {
        var sample1 = new Artplayer({ ...artBaseOption, container: '.sample1' });
        expect(sample1.id).to.equal(1);
        var sample2 = new Artplayer({ ...artBaseOption, container: '.sample2' });
        expect(sample2.id).to.equal(2);
        var sample3 = new Artplayer({ ...artBaseOption, container: '.sample3' });
        expect(sample3.id).to.equal(3);
    });

    it('Throw error when multiple instances on the same dom element', function() {
        expect(function() {
            new Artplayer({ ...artBaseOption, container: '.sample1' });
        }).to.throw(/Cannot mount multiple instances on the same dom element/);
    });

    it('Throw error when container is not a dom element or selector', function() {
        expect(function() {
            new Artplayer(
                Object.assign({}, artBaseOption, {
                    container: null,
                }),
            );
        }).to.throw(/option.container require \'string\' or \'Element\' type'/);
    });

    it('Destroy all instances', function() {
        expect(Artplayer.instances.length).to.equal(3);
        [...Artplayer.instances].forEach(art => {
            art.destroy(true);
        });
        expect(Artplayer.instances.length).to.equal(0);
    });
});
