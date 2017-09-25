'use strict';

const expect = require('chai').expect,
    properties = requireLib('load/parse/properties');

describe('properties.parse module test:', () => {

    const validProperties = { x: 'a' },
        validPropertiesText = 'x = a',
        validNestedProperties = { x: { y: 'a' } },
        validNestedPropertiesText = 'x.y = a';

    describe('should parseSync properties document', () => {

        it('and return an object', () => {
            const result = properties.parseSync(validPropertiesText);
            expect(result).to.exist;
            expect(result).to.be.eql(validProperties);
        });

        it('and return a nested object', () => {
            const result = properties.parseSync(validNestedPropertiesText);
            expect(result).to.exist;
            expect(result).to.be.eql(validNestedProperties);
        });

        it('and return empty object on empty json', () => {
            const result = properties.parseSync('');
            expect(result).to.exist;
            expect(result).to.be.eql({});
        });

    });

    describe('should parse properties document', () => {

        it('and return object', (done) => {
            properties.parse(validPropertiesText, (err, result) => {
                if (err) return done(err);
                expect(result).to.exist;
                expect(result).to.be.eql(validProperties);
                done();
            });
        });

        it('and return a nested object', (done) => {
            properties.parse(validNestedPropertiesText, (err, result) => {
                if (err) return done(err);
                expect(result).to.exist;
                expect(result).to.be.eql(validNestedProperties);
                done();
            });
        });

        it('and return empty object on empty json', (done) => {
            properties.parse('', (err, result) => {
                if (err) return done(err);
                expect(result).to.exist;
                expect(result).to.be.eql({});
                done();
            });
        });

    });

});
