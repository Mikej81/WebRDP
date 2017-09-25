'use strict';

const expect = require('chai').expect,
    json5 = requireLib('load/parse/json5');

describe('Json5.parse module test:', () => {

    const validJson = { x: 'a' },
        validJsonText = "{ x: 'a' }",
        invalidJsonText = "{ x: 'a' y: 'b' }";

    describe('should parseSync json5 document', () => {

        it('and return object', () => {
            const result = json5.parseSync(validJsonText);
            expect(result).to.exist;
            expect(result).to.be.eql(validJson);
        });

        it('and return error', () => {
            expect(() => {
                json5.parseSync(invalidJsonText);
            }).to.throw();
        });

    });

    describe('should parse json5 document', () => {

        it('and return object', (done) => {
            json5.parse(validJsonText, (err, result) => {
                if (err) return done(err);
                expect(result).to.exist;
                expect(result).to.be.eql(validJson);
                done();
            });
        });

        it('and return empty object on empty json', (done) => {
            json5.parse('', (err, result) => {
                if (err) return done(err);
                expect(result).to.exist;
                expect(result).to.be.eql({});
                done();
            });
        });

        it('and return error', (done) => {
            json5.parse(invalidJsonText, (err, result) => {
                expect(err).to.exist;
                expect(result).to.not.exist;
                done();
            });
        });

    });

});
