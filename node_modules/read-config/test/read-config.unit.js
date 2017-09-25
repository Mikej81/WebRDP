'use strict';

const libmodule = '../index',
    loadConfig = requireLib(libmodule),
    path = require('path'),
    expect = require('chai').expect;

function convertSync2Async(sync) {
    return (paths, opts, callback) => {
        let result;
        callback = callback || opts;
        opts = typeof opts === 'function' ? null : opts;
        try {
            result = sync(paths, opts);
        } catch (e) {
            return callback(e);
        }
        callback(null, result);
    };
}

cases(`${libmodule} deafult mode test:`, convertSync2Async(loadConfig));
cases(`${libmodule} async test:`, loadConfig.async);
cases(`${libmodule} sync test:`, convertSync2Async(loadConfig.sync));

function cases(name, loadConfig) {
    function absolute(filepath) {
        return path.resolve(__dirname, filepath);
    }

    describe(name, () => {

        describe('should throw error on', () => {

            it('basedir not found', (done) => {
                loadConfig('xxx', { basedir: absolute('xxx') }, (err) => {
                    expect(err).to.exist;
                    done();
                });
            });

            it('paths of incorrect type', (done) => {
                loadConfig(123, (err) => {
                    expect(err).to.exist;
                    done();
                });
            });

            it('opts of incorrect type', (done) => {
                loadConfig('xxx', 123, (err) => {
                    expect(err).to.exist;
                    done();
                });
            });

            it('the same replace markers', (done) => {
                loadConfig('xxx', { replace: { env: 'x', local: 'x' } }, (err) => {
                    expect(err).to.exist;
                    done();
                });
            });

        });

        it('should load complex config definition', (done) => {
            process.env['CONFIG_LOADER_TEST_VAR_B'] = 'config-loader-test-var-b';
            loadConfig([
                absolute('configs/other/config-default.json'),
                absolute('configs/config-a2.json'),
                '../subfolder/config-b3.json'
            ], {
                basedir: absolute('configs/basedir')
            }, (err, config) => {
                delete process.env['CONFIG_LOADER_TEST_VAR_B'];
                expect(err).to.not.exist;
                expect(config).to.exist;
                expect(config).to.be.eql({
                    'default': true,
                    'a1': 'a1',
                    'a2': 'a2',
                    'b1': 'b1',
                    'b2': 'b2',
                    'b3': 'b3',
                    'empty': null,
                    'env-var': 'config-loader-test-var-b',
                    'local-var': 'a1',
                    'env-var-with-default': 999
                });
                done();
            });
        });

        it('should load config with files in different format', (done) => {
            process.env['CONFIG_LOADER_TEST_VAR_DEF'] = 'config-loader-test-var-def';
            loadConfig([
                absolute('configs/other/config-default.yaml'),
                absolute('configs/config-simple.json')
            ], {
                basedir: absolute('configs/basedir')
            }, (err, config) => {
                delete process.env['CONFIG_LOADER_TEST_VAR_DEF'];
                expect(err).to.not.exist;
                expect(config).to.exist;
                expect(config).to.be.eql({
                    'default': true,
                    'default2': true,
                    'a': 1,
                    'env-var': 'config-loader-test-var-def'
                });
                done();
            });
        });

        describe('skipping unresolved variables', () => {
            const config = absolute('configs/config-simple-var.json');

            it('should be enabled by parameter', (done) => {
                loadConfig(config, { skipUnresolved: true }, (err, config) => {
                    expect(err).to.not.exist;
                    expect(config).to.exist;
                    done();
                });
            });

            it('should be disabled by parameter', (done) => {
                loadConfig(config, { skipUnresolved: false }, (err, config) => {
                    expect(err).to.exist;
                    expect(config).to.not.exist;
                    done();
                });
            });

            it('should be disabled by default', (done) => {
                loadConfig(config, (err, config) => {
                    expect(err).to.exist;
                    expect(config).to.not.exist;
                    done();
                });
            });
        });

    });
}
