'use strict';

const libmodule = 'load/resolve-path',
    resolvePath = requireLib(libmodule),
    path = require('path'),
    expect = require('chai').expect;

cases(`${libmodule} async test:`, resolvePath.async);
cases(`${libmodule} sync test:`, (filepath, basedirs, callback) => {
    callback = callback || basedirs;
    basedirs = typeof basedirs === 'function' ? null : basedirs;
    callback(resolvePath.sync(filepath, basedirs));
});

function cases(name, resolvePath) {

    function absolute(filepath) {
        if (Array.isArray(filepath)) {
            return filepath.map(absolute);
        } else {
            return path.resolve(__dirname, filepath);
        }
    }

    describe(name, () => {

        describe('should resolve existing config file ', () => {

            it('defined by absolute filepath', (done) => {
                resolvePath(absolute('configs/config1.json'), (resolved) => {
                    expect(resolved).to.exist;
                    expect(resolved).to.be.eql(absolute('configs/config1.json'));
                    done();
                });
            });

            it('defined by absolute filepath without extension', (done) => {
                resolvePath(absolute('configs/config1'), (resolved) => {
                    expect(resolved).to.exist;
                    expect(resolved).to.be.eql(absolute('configs/config1.json'));
                    done();
                });
            });

            it('defined by relative filepath', (done) => {
                resolvePath('configs/config1.json', absolute(['./']), (resolved) => {
                    expect(resolved).to.exist;
                    expect(resolved).to.be.eql(absolute('configs/config1.json'));
                    done();
                });
            });

            it('defined by relative filepath without extension', (done) => {
                resolvePath('configs/config1', absolute(['./']), (resolved) => {
                    expect(resolved).to.exist;
                    expect(resolved).to.be.eql(absolute('configs/config1.json'));
                    done();
                });
            });

            it('defined in subfolder of relative filepath', (done) => {
                resolvePath('config3', absolute(['./', './configs']), (resolved) => {
                    expect(resolved).to.exist;
                    expect(resolved).to.be.eql(absolute('configs/config3.json'));
                    done();
                });
            });

            it('defined in first of basedirs', (done) => {
                resolvePath('config3', absolute(['./', './configs', './configs/subfolder']), (resolved) => {
                    expect(resolved).to.exist;
                    expect(resolved).to.be.eql(absolute('configs/config3.json'));
                    done();
                });
            });

            it('defined in second of basedirs', (done) => {
                resolvePath('config3', absolute(['./', './configs/subfolder']), (resolved) => {
                    expect(resolved).to.exist;
                    expect(resolved).to.be.eql(absolute('configs/subfolder/config3.json'));
                    done();
                });
            });

        });

        describe('should not resolve a filepath ', () => {

            it('defined by absolute filepath', (done) => {
                resolvePath(absolute('configs/configX.json'), (resolved) => {
                    expect(resolved).to.not.exist;
                    done();
                });
            });

            it('defined by relative filepath', (done) => {
                resolvePath('configs/configX.json', absolute(['./']), (resolved) => {
                    expect(resolved).to.not.exist;
                    done();
                });
            });

            it('defined by relative filepath without basedir', (done) => {
                resolvePath('configs/config1', (resolved) => {
                    expect(resolved).to.not.exist;
                    done();
                });
            });

        });

    });
}
