'use strict';

const libmodule = 'resolve/index',
    resolve = requireLib(libmodule),
    expect = require('chai').expect,
    opts = {
        replaceEnv: '%',
        replaceLocal: '@',
        override: 'CONFIGTEST'
    };

describe(`${libmodule} test:`, () => {

    describe('should replace config local variables', () => {

        it('with whole value', () => {
            const config = { a: '@{b}', b: 'x' },
                resolved = resolve(config, opts);
            expect(resolved).be.eql({ a: 'x', b: 'x' });
        });

        it('with partial value', () => {
            const config = { a: 'X@{b}X', b: 'x' },
                resolved = resolve(config, opts);
            expect(resolved).be.eql({ a: 'XxX', b: 'x' });
        });

        it('with embedded value', () => {
            const config = { a: '@{b.c}', b: { c: 'x' } },
                resolved = resolve(config, opts);
            expect(resolved).be.eql({ a: 'x', b: { c: 'x' } });
        });

    });

    describe('should replace system variables', () => {

        it('basic example', () => {
            process.env.CONFIG_LOADER_TEST_VAR = 'cofig-loader-test-var';
            const config = { a: '%{CONFIG_LOADER_TEST_VAR}' },
                resolved = resolve(config, opts);
            expect(resolved).be.eql({
                a: 'cofig-loader-test-var'
            });
        });

        it('before replacing local variables', () => {
            process.env.CONFIG_LOADER_TEST_VAR = 'cofig-loader-test-var';
            const config = { a: '%{CONFIG_LOADER_TEST_VAR}', b: '@{a}' },
                resolved = resolve(config, opts);
            expect(resolved).be.eql({
                a: 'cofig-loader-test-var',
                b: 'cofig-loader-test-var'
            });
        });

    });

    describe('should override config with system variables', () => {

        afterEach(() => {
            delete process.env['CONFIGTEST_objProp_prop'];
            delete process.env['CONFIGTEST_a'];
            delete process.env['CONFIGTEST_b'];
        });

        it('basic example', () => {
            process.env['CONFIGTEST_a'] = 'a-overriden';
            process.env['CONFIGTEST_b'] = 'b-overriden';
            const config = { a: 'a' },
                resolved = resolve(config, opts);
            expect(resolved).be.eql({
                a: 'a-overriden',
                b: 'b-overriden'
            });
        });

        it('nested example', () => {
            process.env['CONFIGTEST_objProp_prop'] = 'overriden';
            const config = { objProp: { prop: 'prop' } },
                resolved = resolve(config, opts);
            expect(resolved).be.eql({
                objProp: { prop: 'overriden' }
            });
        });

        it('before replacing local variables', () => {
            process.env['CONFIGTEST_a'] = 'a-overriden';
            const config = { a: 'a', b: '@{a}' },
                resolved = resolve(config, opts);
            expect(resolved).be.eql({
                a: 'a-overriden',
                b: 'a-overriden'
            });
        });

    });

    it('should not resolve env variables by default', () => {
        process.env.CONFIG_LOADER_TEST_VAR = 'cofig-loader-test-var';
        const config = { a: '%{CONFIG_LOADER_TEST_VAR}', b: '@{a}' },
            resolved = resolve(config);
        expect(resolved).be.eql(config);
    });

    it('should throw error on unresolved variable', () => {
        expect(() => {
            resolve({ y: '%{x}' }, opts);
        }).to.throw('Could not resolve environment variable. Unresolved configuration variable: x');
    });

    it('should not throw error on unresolved variable', () => {
        expect(() => {
            resolve({ y: '%{x}' }, {
                replace: {
                    env: '%',
                    skipUnresolved: true
                }
            });
        }).to.not.throw();
    });

});
