'use strict';

var libmodule = 'resolve/index',
	resolve = requireLib(libmodule),
	expect = require('chai').expect,
	opts = {
		replaceEnv: '%',
		replaceLocal: '@',
		override: 'CONFIGTEST'
	};

describe(libmodule + ' test:', function() {

	describe('should replace config local variables', function() {

		it('with whole value', function() {
			var config = { a: '@{b}', b: 'x' },
				resolved = resolve(config, opts);
			expect(resolved).be.eql({ a: 'x', b: 'x' });
		});

		it('with partial value', function() {
			var config = { a: 'X@{b}X', b: 'x' },
				resolved = resolve(config, opts);
			expect(resolved).be.eql({ a: 'XxX', b: 'x' });
		});

		it('with embedded value', function() {
			var config = { a: '@{b.c}', b: { c: 'x' } },
				resolved = resolve(config, opts);
			expect(resolved).be.eql({ a: 'x', b: { c: 'x' } });
		});

	});

	describe('should replace system variables', function() {

		it('basic example', function() {
			process.env.CONFIG_LOADER_TEST_VAR = 'cofig-loader-test-var';
			var config = { a: '%{CONFIG_LOADER_TEST_VAR}' },
				resolved = resolve(config, opts);
			expect(resolved).be.eql({
				a: 'cofig-loader-test-var'
			});
		});

		it('before replacing local variables', function() {
			process.env.CONFIG_LOADER_TEST_VAR = 'cofig-loader-test-var';
			var config = { a: '%{CONFIG_LOADER_TEST_VAR}', b: '@{a}' },
				resolved = resolve(config, opts);
			expect(resolved).be.eql({
				a: 'cofig-loader-test-var',
				b: 'cofig-loader-test-var'
			});
		});

	});

	describe('should override config with system variables', function() {

		afterEach(function() {
			delete process.env['CONFIGTEST_objProp_prop'];
			delete process.env['CONFIGTEST_a'];
			delete process.env['CONFIGTEST_b'];
		});

		it('basic example', function() {
			process.env['CONFIGTEST_a'] = 'a-overriden';
			process.env['CONFIGTEST_b'] = 'b-overriden';
			var config = { a: 'a' },
				resolved = resolve(config, opts);
			expect(resolved).be.eql({
				a: 'a-overriden',
				b: 'b-overriden'
			});
		});

		it('nested example', function() {
			process.env['CONFIGTEST_objProp_prop'] = 'overriden';
			var config = { objProp: { prop: 'prop' } },
				resolved = resolve(config, opts);
			expect(resolved).be.eql({
				objProp: { prop: 'overriden' }
			});
		});

		it('before replacing local variables', function() {
			process.env['CONFIGTEST_a'] = 'a-overriden';
			var config = { a: 'a', b: '@{a}' },
				resolved = resolve(config, opts);
			expect(resolved).be.eql({
				a: 'a-overriden',
				b: 'a-overriden'
			});
		});

	});

	it('should not resolve env variables by default', function() {
		process.env.CONFIG_LOADER_TEST_VAR = 'cofig-loader-test-var';
		var config = { a: '%{CONFIG_LOADER_TEST_VAR}', b: '@{a}' },
			resolved = resolve(config);
		expect(resolved).be.eql(config);
	});

	it('should throw error on unresolved variable', function() {
		expect(function() {
			resolve({ y: '%{x}' }, opts);
		}).to.throw('Could not resolve environmental variable. Unresolved configuration variable: x');
	});

	it('should not throw error on unresolved variable', function() {
		expect(function() {
			resolve({ y: '%{x}' }, {
				replace: {
					env: '%',
					skipUnresolved: true
				}
			});
		}).to.not.throw();
	});

});
