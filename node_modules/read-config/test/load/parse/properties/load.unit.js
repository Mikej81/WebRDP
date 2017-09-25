'use strict';

const expect = require('chai').expect,
    path = require('path'),
    properties = requireLib('load/parse/properties');

describe('properties.load test:', () => {

    const validPropertiesFile = path.resolve(__dirname, './valid.properties'),
        validProperties = { x: 'a' },
        emptyPropertiesFile = path.resolve(__dirname, './empty.properties');

    describe('should loadSync properties document', () => {

        it('and return object', () => {
            const result = properties.loadSync(validPropertiesFile);
            expect(result).to.exist;
            expect(result).to.have.property('x', 'a');
        });

        it('and return empty object', () => {
            const result = properties.loadSync(emptyPropertiesFile);
            expect(result).to.exist;
            expect(result).to.be.eql({});
        });

    });

    describe('should loadAsync properties document', () => {

        it('and return object', (done) => {
            properties.load(validPropertiesFile, (err, result) => {
                if (err) return done(err);
                expect(result).to.exist;
                expect(result).to.be.eql(validProperties);
                done();
            });
        });

        it('and return empty object', (done) => {
            properties.load(emptyPropertiesFile, (err, result) => {
                if (err) return done(err);
                expect(result).to.exist;
                expect(result).to.be.eql({});
                done();
            });
        });

    });

});
