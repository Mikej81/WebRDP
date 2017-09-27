'use strict';

var libmodule = 'resolve/replace-variables',
	replaceVariables = requireLib(libmodule).bind(null, '%'),
	expect = require('chai').expect;

describe(libmodule + ' test:', function() {

	describe('should replace variable with correct type', function() {

		it('with string', function() {
			var input = { x: '%{y}' },
				replaced = replaceVariables(input, { y: 'z' });
			expect(replaced).to.be.eql({ x: 'z' });
		});

		it('with string default', function() {
			var input = { x: '%{y|z}' },
			replaced = replaceVariables(input, {});
			expect(replaced).to.be.eql({ x: 'z' });
		});

		it('with number', function() {
			var input = { x: '%{y}' },
			replaced = replaceVariables(input, { y: 999 });
			expect(replaced).to.be.eql({ x: 999 });
		});

		it('with number default', function() {
			var input = { x: '%{y|999}' },
			replaced = replaceVariables(input, {});
			expect(replaced).to.be.eql({ x: 999 });
		});

		it('with boolean', function() {
			var input = { x: '%{y}' },
			replaced = replaceVariables(input, { y: true });
			expect(replaced).to.be.eql({ x: true });
		});

		it('with true boolean default', function() {
			var input = { x: '%{y|true}' },
			replaced = replaceVariables(input, {});
			expect(replaced).to.be.eql({ x: true });
		});

		it('with false boolean default', function() {
			var input = { x: '%{y|false}' },
			replaced = replaceVariables(input, {});
			expect(replaced).to.be.eql({ x: false });
		});

		it('with object', function() {
			var input = { x: '%{y}' },
			replaced = replaceVariables(input, { y: { a: 2 } });
			expect(replaced).to.be.eql({ x: { a: 2 } });
		});

		it('with object default as string', function() {
			var input = { x: '%{y|{ \"a\": 2 }}' },
			replaced = replaceVariables(input, { y: { a: 2 } });
			expect(replaced).to.be.eql({ x: "{\"a\":2}}" });
		});

		it('with null', function() {
			var input = { x: '%{y}' },
			replaced = replaceVariables(input, { y: null });
			expect(replaced).to.be.eql({ x: null });
		});

		it('with null default', function() {
			var input = { x: '%{y|null}' },
			replaced = replaceVariables(input, {});
			expect(replaced).to.be.eql({ x: null });
		});

		it('with undefined default', function() {
			var input = { x: '%{y|undefined}' },
			replaced = replaceVariables(input, {});
			expect(replaced).to.be.eql({ x: undefined });
		});

	});

	describe('should replace partial variable', function() {

		it('with string', function() {
			var input = { x: 'X%{y}X' },
				replaced = replaceVariables(input, { y: 'z' });
			expect(replaced).to.be.eql({ x: 'XzX' });
		});

		it('with number', function() {
			var input = { x: 'X%{y}X' },
				replaced = replaceVariables(input, { y: 999 });
			expect(replaced).to.be.eql({ x: 'X999X' });
		});

		it('with boolean', function() {
			var input = { x: 'X%{y}X' },
				replaced = replaceVariables(input, { y: true });
			expect(replaced).to.be.eql({ x: 'XtrueX' });
		});

		it('with boolean default', function() {
			var input = { x: 'X%{y|true}X' },
			replaced = replaceVariables(input, { y: true });
			expect(replaced).to.be.eql({ x: 'XtrueX' });
		});

		it('with object', function() {
			var input = { x: 'X%{y}X' },
				replaced = replaceVariables(input, { y: { a: 2 } });
			expect(replaced).to.be.eql({ x: 'X{\"a\":2}X' });
		});

		it('with object default', function() {
			var input = { x: 'X%{y|{"a":2}}X' },
			replaced = replaceVariables(input, {});
			expect(replaced).to.be.eql({ x: 'X{\"a\":2}X' });
		});

		it('with null', function() {
			var input = { x: 'X%{y}X' },
				replaced = replaceVariables(input, { y: null });
			expect(replaced).to.be.eql({ x: 'XnullX' });
		});

		it('with null default', function() {
			var input = { x: 'X%{y|null}X' },
			replaced = replaceVariables(input, {});
			expect(replaced).to.be.eql({ x: 'XnullX' });
		});

	});

	it('should replace both variables', function() {
		var input = { x: '%{a}', y: '%{a}' },
		replaced = replaceVariables(input, { a: 999 });
		expect(replaced).to.be.eql({ x: 999, y: 999 });
	});

	it('should replace both partial variables', function() {
		var input = { x: 'x%{a}x', y: 'x%{a}x' },
		replaced = replaceVariables(input, { a: 999 });
		expect(replaced).to.be.eql({ x: 'x999x', y: 'x999x' });
	});

	it('should replace both concatenated variables', function() {
		var input = { x: '%{a}%{b}', y: '%{b}%{a}' },
		replaced = replaceVariables(input, { a: 999, b: 888 });
		expect(replaced).to.be.eql({ x: '999888', y: '888999' });
	});

	it('should not replace variables with ather variables', function() {
		var input = { x: '%{a}' },
		replaced = replaceVariables(input, { a: "%{b}", b: 999 });
		expect(replaced).to.be.eql({ x: "%{b}" });
	});

	it('should replace deeply nested variable', function() {
		var input = { x: '%{a.b.c}' },
		replaced = replaceVariables(input, { a: { b: { c: 999 } } });
		expect(replaced).to.be.eql({ x: 999 });
	});

	it('should replace array variable', function() {
		var input = { x: '%{a.1.c}' },
		replaced = replaceVariables(input, { a: ['x', { c: 999 }] });
		expect(replaced).to.be.eql({ x: 999 });
	});

	it('should not replace variable', function() {
		var input = { x: '%{y}' },
			replaced = replaceVariables(input, {}, { skipUnresolved: true });
		expect(replaced).to.be.eql({ x: 'NOTFOUND:y' });
	});

	it('should not replace variable with undefined', function() {
		var input = { x: '%{y}' },
		replaced = replaceVariables(input, { y: undefined }, { skipUnresolved: true });
		expect(replaced).to.be.eql({ x: 'NOTFOUND:y' });
	});

	it('should replace with default variable', function() {
		var input = { x: '%{y|abc}' },
		replaced = replaceVariables(input, { });
		expect(replaced).to.be.eql({ x: 'abc' });
	});

	it('should not replace with default variable', function() {
		var input = { x: '%{y|def}' },
		replaced = replaceVariables(input, { y: 'abc' });
		expect(replaced).to.be.eql({ x: 'abc' });
	});

	it('should throw error on unresolved variable by default', function() {
		expect(function() {
			replaceVariables({ y: '%{x}' }, { });
		}).to.throw('Unresolved configuration variable: x');
	});

	it('should throw error on unresolved variable by \'skipUnresolved\' parameter', function() {
		expect(function() {
			replaceVariables({ y: '%{x}' }, { }, { skipUnresolved: false });
		}).to.throw('Unresolved configuration variable: x');
	});

	it('should not throw error on unresolved variable', function() {
		expect(function() {
			replaceVariables({ y: '%{x}' }, { }, { skipUnresolved: true });
		}).to.not.throw();
	});

});
