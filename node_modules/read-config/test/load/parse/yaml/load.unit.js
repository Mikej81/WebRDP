'use strict';

const expect = require('chai').expect,
    path = require('path'),
    yaml = requireLib('load/parse/yaml');

describe('YAML.load test:', () => {

    const validYamlFile = path.resolve(__dirname, './valid.yml'),
        validYaml = { x: 'a' },
        emptyYamlFile = path.resolve(__dirname, './empty.yml'),
        invalidYamlFile = path.resolve(__dirname, './invalid.yml');

    describe('should loadSync yaml document', () => {

        it('and return object', () => {
            const result = yaml.loadSync(validYamlFile);
            expect(result).to.exist;
            expect(result).to.have.property('x', 'a');
        });

        it('and return error', () => {
            expect(() => {
                yaml.loadSync(invalidYamlFile);
            }).to.throw();
        });

        it('and return empty object', () => {
            const result = yaml.loadSync(emptyYamlFile);
            expect(result).to.exist;
            expect(result).to.be.eql({});
        });

    });

    describe('should loadAsync yaml document', () => {

        it('and return object', (done) => {
            yaml.load(validYamlFile, (err, result) => {
                if (err) return done(err);
                expect(result).to.exist;
                expect(result).to.be.eql(validYaml);
                done();
            });
        });

        it('and return error', (done) => {
            yaml.load(invalidYamlFile, (err, result) => {
                expect(err).to.exist;
                expect(result).to.not.exist;
                done();
            });
        });

        it('and return empty object', (done) => {
            yaml.load(emptyYamlFile, (err, result) => {
                if (err) return done(err);
                expect(result).to.exist;
                expect(result).to.be.eql({});
                done();
            });
        });

    });

});
