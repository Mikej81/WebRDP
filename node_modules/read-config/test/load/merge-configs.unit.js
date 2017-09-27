'use strict';

var libmodule = 'load/merge-configs',
	mergeConfigs = requireLib(libmodule),
	expect = require('chai').expect;

describe(libmodule + ' test:', function() {

	describe('should return empty object on empty input', function() {

		it(' - empty array', function() {
			expect(mergeConfigs([])).to.be.eql({});
		});

		it(' - no params', function() {
			expect(mergeConfigs()).to.be.eql({});
		});

	});

	it('should return the same object (deeply equal) on one param', function() {
		var config = { a: 1 };
		expect(mergeConfigs([config])).to.be.eql(config);
	});

	it('should merge two objects', function() {
		var config1 = { a: 1 },
			config2 = { b: 2 };
		expect(mergeConfigs([config1, config2])).to.be.eql({ a: 1, b: 2 });
	});

	it('should merge two objects and override values from first of them', function() {
		var config1 = { a: 1, b: 2 },
			config2 = { b: 22, c: 33 };
		expect(mergeConfigs([config1, config2])).to.be.eql({ a: 1, b: 22, c: 33 });
	});

	it('should merge two objects and pass all values to the last one', function() {
		var config1 = { a: 1, b: 2 },
			config2 = { };
		expect(mergeConfigs([config1, config2])).to.be.eql({ a: 1, b: 2 });
	});

	it('should merge two objects and override whole array from first of them', function() {
		var config1 = { a: 1, b: ['a', 'b', 'c'] },
			config2 = { b: ['a'], c: 3 };
		expect(mergeConfigs([config1, config2])).to.be.eql({ a: 1, b: ['a'], c: 3 });
	});

	it('should merge three objects', function() {
		var config1 = { a: 1, b: 2 },
			config2 = { b: 22, c: 33 },
			config3 = { c: 333, d: 444 };
		expect(mergeConfigs([config1, config2, config3])).to.be.eql({ a: 1, b: 22, c: 333, d: 444 });
	});

});
