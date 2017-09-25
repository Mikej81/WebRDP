'use strict';

const libmodule = 'load/merge-configs',
    mergeConfigs = requireLib(libmodule),
    expect = require('chai').expect;

describe(`${libmodule} test:`, () => {

    describe('should return empty object on empty input', () => {

        it(' - empty array', () => {
            expect(mergeConfigs([])).to.be.eql({});
        });

        it(' - no params', () => {
            expect(mergeConfigs()).to.be.eql({});
        });

    });

    it('should return the same object (deeply equal) on one param', () => {
        const config = { a: 1 };
        expect(mergeConfigs([config])).to.be.eql(config);
    });

    it('should merge two objects', () => {
        const config1 = { a: 1 },
            config2 = { b: 2 };
        expect(mergeConfigs([config1, config2])).to.be.eql({ a: 1, b: 2 });
    });

    it('should merge two objects and override values from first of them', () => {
        const config1 = { a: 1, b: 2 },
            config2 = { b: 22, c: 33 };
        expect(mergeConfigs([config1, config2])).to.be.eql({ a: 1, b: 22, c: 33 });
    });

    it('should merge two objects and pass all values to the last one', () => {
        const config1 = { a: 1, b: 2 },
            config2 = { };
        expect(mergeConfigs([config1, config2])).to.be.eql({ a: 1, b: 2 });
    });

    it('should merge two objects and override whole array from first of them', () => {
        const config1 = { a: 1, b: ['a', 'b', 'c'] },
            config2 = { b: ['a'], c: 3 };
        expect(mergeConfigs([config1, config2])).to.be.eql({ a: 1, b: ['a'], c: 3 });
    });

    it('should merge three objects', () => {
        const config1 = { a: 1, b: 2 },
            config2 = { b: 22, c: 33 },
            config3 = { c: 333, d: 444 };
        expect(mergeConfigs([config1, config2, config3])).to.be.eql({ a: 1, b: 22, c: 333, d: 444 });
    });

});
