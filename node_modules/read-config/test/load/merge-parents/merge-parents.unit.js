'use strict';

const libmodule = 'load/merge-parents',
    mergeParents = requireLib(libmodule),
    path = require('path'),
    expect = require('chai').expect,
    config1 = path.resolve(__dirname, 'configs/config1.json'),
    config2 = path.resolve(__dirname, 'configs/config2.json'),
    config3 = path.resolve(__dirname, 'configs/subfolder/config.json'),
    config4 = path.resolve(__dirname, 'configs/config-basedir-parent.json');

cases(`${libmodule} async test:`, mergeParents.async);
cases(`${libmodule} sync test:`, (path, opts, callback) => {
    let result;
    callback = callback || opts;
    opts = typeof opts === 'object' ? opts : null;
    try {
        result = mergeParents.sync(path, opts);
    } catch (e) {
        return callback(e);
    }
    callback(null, result);
});

function cases(name, mergeParents) {

    describe(name, () => {

        it('should load simple config file - no parents', (done) => {
            mergeParents(config1, (err, config) => {
                expect(err).to.not.exist;
                expect(config).to.be.eql({
                    a: 1,
                    b: 2
                });
                done();
            });
        });

        it('should load config file - one parent', (done) => {
            mergeParents(config2, { parentField: '__parent' }, (err, config) => {
                expect(err).to.not.exist;
                expect(config).to.be.eql({
                    a: 1,
                    b: 22,
                    c: 33
                });
                done();
            });
        });

        it('should load config file from subfolder - two parents', (done) => {
            mergeParents(config3, { parentField: '__parent' }, (err, config) => {
                expect(err).to.not.exist;
                expect(config).to.be.eql({
                    a: 1,
                    b: 22,
                    c: 333,
                    d: 444
                });
                done();
            });
        });

        it('should load config file with a parent from basedir', (done) => {
            const opts = {
                parentField: '__parent',
                basedir: path.resolve(__dirname, 'configs', 'basedir')
            };
            mergeParents(config4, opts, (err, config) => {
                expect(err).to.not.exist;
                expect(config).to.be.eql({
                    a: 1,
                    b: 22,
                    c: 33
                });
                done();
            });
        });

        it('should return error on not existing parent', (done) => {
            const configPath = path.resolve(__dirname, 'configs', 'config-error.json'),
                opts = {
                    parentField: '__parent',
                    basedir: path.resolve(__dirname, 'configs', 'basedir')
                };
            mergeParents(configPath, opts, (err) => {
                expect(err).to.exist;
                expect(err.message).to.be.equal(`Parent config file not found \'xxx\' for ${configPath}`);
                done();
            });
        });

        it('should not return an error on not existing optional parent', (done) => {
            const configPath = path.resolve(__dirname, 'configs', 'config-error.json'),
                opts = {
                    parentField: '__parent',
                    optional: 'xxx',
                    basedir: path.resolve(__dirname, 'configs', 'basedir')
                };
            mergeParents(configPath, opts, (err, config) => {
                expect(err).to.not.exist;
                expect(config).to.be.eql({
                    b: 22,
                    c: 33
                });
                done();
            });
        });

        it('should not return an error on not existing optional parent - defined with regex', (done) => {
            const configPath = path.resolve(__dirname, 'configs', 'config-error.json'),
                opts = {
                    parentField: '__parent',
                    optional: '*',
                    basedir: path.resolve(__dirname, 'configs', 'basedir')
                };
            mergeParents(configPath, opts, (err, config) => {
                expect(err).to.not.exist;
                expect(config).to.be.eql({
                    b: 22,
                    c: 33
                });
                done();
            });
        });

        it('should not return error on optional not existing parent', (done) => {
            const configPath = path.resolve(__dirname, 'configs', 'config-error.json'),
                opts = {
                    parentField: '__parent',
                    optional: ['xxx'],
                    basedir: path.resolve(__dirname, 'configs', 'basedir')
                };
            mergeParents(configPath, opts, (err, config) => {
                expect(err).to.not.exist;
                expect(config).to.eql({
                    b: 22,
                    c: 33
                });
                done();
            });
        });

        it('should not return error on optional not existing config', (done) => {
            const configPath = path.resolve(__dirname, 'configs', 'xxx.json'),
                opts = {
                    parentField: '__parent',
                    optional: [configPath],
                    basedir: path.resolve(__dirname, 'configs', 'basedir')
                };
            mergeParents(configPath, opts, (err, config) => {
                expect(err).to.not.exist;
                expect(config).to.be.eql({});
                done();
            });
        });

    });

}
