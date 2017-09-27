'use strict';

var expect = require('chai').expect,
	yaml = requireLib('load/parse/yaml');

describe("YAML.parse module test:", function() {

	var validYaml = { x: 'a' },
		validYamlText = "x: 'a'",
		invalidYamlText = "'foobar";

	describe("should parseSync yaml document", function() {

		it("and return object", function() {
			var result = yaml.parseSync(validYamlText);
			expect(result).to.exist;
			expect(result).to.be.eql(validYaml);
		});

		it("and return error", function() {
			expect(function() {
				yaml.parseSync(invalidYamlText);
			}).to.throw();
		});

		it("and return empty object on empty json", function() {
			var result = yaml.parseSync('');
			expect(result).to.exist;
			expect(result).to.be.eql({});
		});

	});

	describe("should parse yaml document", function() {

		it("and return object", function(done) {
			yaml.parse(validYamlText, function(err, result) {
				if (err) return done(err);
				expect(result).to.exist;
				expect(result).to.be.eql(validYaml);
				done();
			});
		});

		it("and return empty object on empty json", function(done) {
			yaml.parse('', function(err, result) {
				if (err) return done(err);
				expect(result).to.exist;
				expect(result).to.be.eql({});
				done();
			});
		});

		it("and return error", function(done) {
			yaml.parse(invalidYamlText, function(err, result) {
				expect(err).to.exist;
				expect(result).to.not.exist;
				done();
			});
		});

	});

});
