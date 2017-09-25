'use strict';

const libmodule = 'resolve/replace-variables',
    replaceVariables = requireLib(libmodule).bind(null, '%'),
    expect = require('chai').expect,
    resolve = (config) => {
        return replaceVariables(config, config);
    };

describe(`${libmodule} test:`, () => {

    describe('should replace relative variables', () => {

        it('with relative value', () => {
            const config = { a: { x: '%{./y}', y: 'Y' }, y: 'Z' },
                resolved = resolve(config);
            expect(resolved).be.eql({ a: { x: 'Y', y: 'Y' }, y: 'Z' });
        });

        it('with relative array value', () => {
            const config = { a: ['%{./1}', 'X'] },
                resolved = resolve(config);
            expect(resolved).be.eql({ a: ['X', 'X'] });
        });

        it('with parent relative value', () => {
            const config = { a: { x: '%{../y}', y: 'Y' }, y: 'Z' },
                resolved = resolve(config);
            expect(resolved).be.eql({ a: { x: 'Z', y: 'Y' }, y: 'Z' });
        });

        it('with grandparent relative value', () => {
            const config = { a: { x: { x: '%{../../y}', y: 'Y' }, y: 'Z' }, y: 'W' },
                resolved = resolve(config);
            expect(resolved).be.eql({ a: { x: { x: 'W', y: 'Y' }, y: 'Z' }, y: 'W' });
        });
    });

});
