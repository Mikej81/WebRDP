'use strict';

const expect = require('chai').expect,
    path = require('path'),
    json5 = requireLib('load/parse/json5');

describe('Json5.load test:', () => {

    const validJsonFile = path.resolve(__dirname, './valid.json'),
        validJson = { x: 'a' },
        invalidJsonFile = path.resolve(__dirname, './invalid.json');

    describe('should loadSync json5 document', () => {

        it('and return object', () => {
            const result = json5.loadSync(validJsonFile);
            expect(result).to.exist;
            expect(result).to.have.property('x', 'a');
        });

        it('and return error', () => {
            expect(() => {
                json5.loadSync(invalidJsonFile);
            }).to.throw();
        });

    });

    describe('should loadAsync json5 document', () => {

        it('and return object', (done) => {
            json5.load(validJsonFile, (err, result) => {
                if (err) return done(err);
                expect(result).to.exist;
                expect(result).to.be.eql(validJson);
                done();
            });
        });

        it('and return error', (done) => {
            json5.load(invalidJsonFile, (err, result) => {
                expect(err).to.exist;
                expect(result).to.not.exist;
                done();
            });
        });

    });

});
