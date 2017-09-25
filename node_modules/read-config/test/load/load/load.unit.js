'use strict';

const libmodule = 'load/index',
    load = requireLib(libmodule),
    path = require('path'),
    expect = require('chai').expect;

cases(`${libmodule} async test:`, load.async);
cases(`${libmodule} sync test:`, (filepath, basedirs, callback) => {
    let result;
    callback = callback || basedirs;
    basedirs = typeof basedirs === 'function' ? null : basedirs;
    try {
        result = load.sync(filepath, basedirs);
    } catch (e) {
        return callback(e);
    }
    callback(null, result);
});

function cases(name, load) {

    function absolute(filepath) {
        return path.resolve(__dirname, filepath);
    }

    describe(name, () => {

        it('should load config file by absolute filepath', (done) => {
            load(absolute('configs/config1'), (err, config) => {
                expect(err).to.not.exist;
                expect(config).to.exist;
                expect(config).to.be.eql({
                    a: 1,
                    b: 2
                });
                done();
            });
        });

        it('should load config file by relative filepath', (done) => {
            load('configs/config1', { basedir: __dirname }, (err, config) => {
                expect(err).to.not.exist;
                expect(config).to.exist;
                expect(config).to.be.eql({
                    a: 1,
                    b: 2
                });
                done();
            });
        });

        it('should load and merge 2 config files with parents', (done) => {
            load(['config2', 'config4'], {
                basedir: absolute('configs'),
                parentField: '__parent'
            }, (err, config) => {
                expect(err).to.not.exist;
                expect(config).to.exist;
                expect(config).to.be.eql({
                    a: 1,
                    b: 22,
                    c: 333,
                    d: 4444,
                    e: 5555
                });
                done();
            });
        });

        it('should load config file relative to child configuration file', (done) => {
            load(absolute('configs/config2'), { parentField: '__parent' }, (err, config) => {
                expect(err).to.not.exist;
                expect(config).to.exist;
                expect(config).to.be.eql({
                    a: 1,
                    b: 22,
                    c: 33
                });
                done();
            });
        });

        it('should load config file relative to process CWD', (done) => {
            load(absolute('configs/config5'), { parentField: '__parent' }, (err, config) => {
                expect(err).to.not.exist;
                expect(config).to.exist;
                expect(config).to.be.eql({
                    a: 1,
                    b: 22,
                    c: 33
                });
                done();
            });
        });

    });
}
