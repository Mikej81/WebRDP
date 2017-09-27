'use strict';

var libmodule = 'resolve/replace-variables',
	replaceVariables = requireLib(libmodule).bind(null, '%'),
	expect = require('chai').expect,
	resolve = function(config) {
		return replaceVariables(config, config);
	};

describe(libmodule + ' test:', function() {

	describe('should replace relative variables', function() {

		it('with relative value', function() {
			var config = { a: { x: '%{./y}', y: 'Y' }, y: 'Z' },
				resolved = resolve(config);
			expect(resolved).be.eql({ a: { x: 'Y', y: 'Y' }, y: 'Z' });
		});

		it('with relative array value', function() {
			var config = { a: ['%{./1}', 'X'] },
				resolved = resolve(config);
			expect(resolved).be.eql({ a: ['X', 'X'] });
		});

		it('with parent relative value', function() {
			var config = { a: { x: '%{../y}', y: 'Y' }, y: 'Z' },
				resolved = resolve(config);
			expect(resolved).be.eql({ a: { x: 'Z', y: 'Y' }, y: 'Z' });
		});

		it('with grandparent relative value', function() {
			var config = { a: { x: { x: '%{../../y}', y: 'Y' }, y: 'Z' }, y: 'W' },
				resolved = resolve(config);
			expect(resolved).be.eql({ a: { x: { x: 'W', y: 'Y' }, y: 'Z' }, y: 'W' });
		});
	});

});
