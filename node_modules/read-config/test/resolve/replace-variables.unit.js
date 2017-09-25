'use strict';

const libmodule = 'resolve/replace-variables',
    replaceVariables = requireLib(libmodule).bind(null, '%'),
    expect = require('chai').expect;

describe(`${libmodule} test:`, () => {

    describe('should replace variable with correct type', () => {

        it('with string', () => {
            const input = { x: '%{y}' },
                replaced = replaceVariables(input, { y: 'z' });
            expect(replaced).to.be.eql({ x: 'z' });
        });

        it('with string default', () => {
            const input = { x: '%{y|z}' },
                replaced = replaceVariables(input, {});
            expect(replaced).to.be.eql({ x: 'z' });
        });

        it('with number', () => {
            const input = { x: '%{y}' },
                replaced = replaceVariables(input, { y: 999 });
            expect(replaced).to.be.eql({ x: 999 });
        });

        it('with number default', () => {
            const input = { x: '%{y|999}' },
                replaced = replaceVariables(input, {});
            expect(replaced).to.be.eql({ x: 999 });
        });

        it('with boolean', () => {
            const input = { x: '%{y}' },
                replaced = replaceVariables(input, { y: true });
            expect(replaced).to.be.eql({ x: true });
        });

        it('with true boolean default', () => {
            const input = { x: '%{y|true}' },
                replaced = replaceVariables(input, {});
            expect(replaced).to.be.eql({ x: true });
        });

        it('with false boolean default', () => {
            const input = { x: '%{y|false}' },
                replaced = replaceVariables(input, {});
            expect(replaced).to.be.eql({ x: false });
        });

        it('with object', () => {
            const input = { x: '%{y}' },
                replaced = replaceVariables(input, { y: { a: 2 } });
            expect(replaced).to.be.eql({ x: { a: 2 } });
        });

        it('with object default as string', () => {
            const input = { x: '%{y|{ \"a\": 2 }}' },
                replaced = replaceVariables(input, { y: { a: 2 } });
            expect(replaced).to.be.eql({ x: '{"a":2}}' });
        });

        it('with null', () => {
            const input = { x: '%{y}' },
                replaced = replaceVariables(input, { y: null });
            expect(replaced).to.be.eql({ x: null });
        });

        it('with null default', () => {
            const input = { x: '%{y|null}' },
                replaced = replaceVariables(input, {});
            expect(replaced).to.be.eql({ x: null });
        });

        it('with undefined default', () => {
            const input = { x: '%{y|undefined}' },
                replaced = replaceVariables(input, {});
            expect(replaced).to.be.eql({ x: undefined });
        });

    });

    describe('should replace partial variable', () => {

        it('with string', () => {
            const input = { x: 'X%{y}X' },
                replaced = replaceVariables(input, { y: 'z' });
            expect(replaced).to.be.eql({ x: 'XzX' });
        });

        it('with number', () => {
            const input = { x: 'X%{y}X' },
                replaced = replaceVariables(input, { y: 999 });
            expect(replaced).to.be.eql({ x: 'X999X' });
        });

        it('with boolean', () => {
            const input = { x: 'X%{y}X' },
                replaced = replaceVariables(input, { y: true });
            expect(replaced).to.be.eql({ x: 'XtrueX' });
        });

        it('with boolean default', () => {
            const input = { x: 'X%{y|true}X' },
                replaced = replaceVariables(input, { y: true });
            expect(replaced).to.be.eql({ x: 'XtrueX' });
        });

        it('with object', () => {
            const input = { x: 'X%{y}X' },
                replaced = replaceVariables(input, { y: { a: 2 } });
            expect(replaced).to.be.eql({ x: 'X{\"a\":2}X' });
        });

        it('with object default', () => {
            const input = { x: 'X%{y|{"a":2}}X' },
                replaced = replaceVariables(input, {});
            expect(replaced).to.be.eql({ x: 'X{\"a\":2}X' });
        });

        it('with null', () => {
            const input = { x: 'X%{y}X' },
                replaced = replaceVariables(input, { y: null });
            expect(replaced).to.be.eql({ x: 'XnullX' });
        });

        it('with null default', () => {
            const input = { x: 'X%{y|null}X' },
                replaced = replaceVariables(input, {});
            expect(replaced).to.be.eql({ x: 'XnullX' });
        });

    });

    it('should replace both variables', () => {
        const input = { x: '%{a}', y: '%{a}' },
            replaced = replaceVariables(input, { a: 999 });
        expect(replaced).to.be.eql({ x: 999, y: 999 });
    });

    it('should replace both partial variables', () => {
        const input = { x: 'x%{a}x', y: 'x%{a}x' },
            replaced = replaceVariables(input, { a: 999 });
        expect(replaced).to.be.eql({ x: 'x999x', y: 'x999x' });
    });

    it('should replace both concatenated variables', () => {
        const input = { x: '%{a}%{b}', y: '%{b}%{a}' },
            replaced = replaceVariables(input, { a: 999, b: 888 });
        expect(replaced).to.be.eql({ x: '999888', y: '888999' });
    });

    it('should not replace variables with ather variables', () => {
        const input = { x: '%{a}' },
            replaced = replaceVariables(input, { a: '%{b}', b: 999 });
        expect(replaced).to.be.eql({ x: '%{b}' });
    });

    it('should replace deeply nested variable', () => {
        const input = { x: '%{a.b.c}' },
            replaced = replaceVariables(input, { a: { b: { c: 999 } } });
        expect(replaced).to.be.eql({ x: 999 });
    });

    it('should replace array variable', () => {
        const input = { x: '%{a.1.c}' },
            replaced = replaceVariables(input, { a: ['x', { c: 999 }] });
        expect(replaced).to.be.eql({ x: 999 });
    });

    it('should not replace variable', () => {
        const input = { x: '%{y}' },
            replaced = replaceVariables(input, {}, { skipUnresolved: true });
        expect(replaced).to.be.eql({ x: 'NOTFOUND: y' });
    });

    it('should not replace variable with undefined', () => {
        const input = { x: '%{y}' },
            replaced = replaceVariables(input, { y: undefined }, { skipUnresolved: true });
        expect(replaced).to.be.eql({ x: 'NOTFOUND: y' });
    });

    it('should replace with default variable', () => {
        const input = { x: '%{y|abc}' },
            replaced = replaceVariables(input, { });
        expect(replaced).to.be.eql({ x: 'abc' });
    });

    it('should not replace with default variable', () => {
        const input = { x: '%{y|def}' },
            replaced = replaceVariables(input, { y: 'abc' });
        expect(replaced).to.be.eql({ x: 'abc' });
    });

    it('should throw error on unresolved variable by default', () => {
        expect(() => {
            replaceVariables({ y: '%{x}' }, { });
        }).to.throw('Unresolved configuration variable: x');
    });

    it('should throw error on unresolved variable by \'skipUnresolved\' parameter', () => {
        expect(() => {
            replaceVariables({ y: '%{x}' }, { }, { skipUnresolved: false });
        }).to.throw('Unresolved configuration variable: x');
    });

    it('should not throw error on unresolved variable', () => {
        expect(() => {
            replaceVariables({ y: '%{x}' }, { }, { skipUnresolved: true });
        }).to.not.throw();
    });

});
