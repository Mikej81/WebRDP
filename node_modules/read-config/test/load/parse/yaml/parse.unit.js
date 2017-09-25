'use strict';

const expect = require('chai').expect,
    yaml = requireLib('load/parse/yaml');

describe('YAML.parse module test:', () => {

    const validYaml = { x: 'a' },
        validYamlText = "x: 'a'",
        invalidYamlText = "'foobar";

    describe('should parseSync yaml document', () => {

        it('and return object', () => {
            const result = yaml.parseSync(validYamlText);
            expect(result).to.exist;
            expect(result).to.be.eql(validYaml);
        });

        it('and return error', () => {
            expect(() => {
                yaml.parseSync(invalidYamlText);
            }).to.throw();
        });

        it('and return empty object on empty json', () => {
            const result = yaml.parseSync('');
            expect(result).to.exist;
            expect(result).to.be.eql({});
        });

    });

    describe('should parse yaml document', () => {

        it('and return object', (done) => {
            yaml.parse(validYamlText, (err, result) => {
                if (err) return done(err);
                expect(result).to.exist;
                expect(result).to.be.eql(validYaml);
                done();
            });
        });

        it('and return empty object on empty json', (done) => {
            yaml.parse('', (err, result) => {
                if (err) return done(err);
                expect(result).to.exist;
                expect(result).to.be.eql({});
                done();
            });
        });

        it('and return error', (done) => {
            yaml.parse(invalidYamlText, (err, result) => {
                expect(err).to.exist;
                expect(result).to.not.exist;
                done();
            });
        });

    });

});
