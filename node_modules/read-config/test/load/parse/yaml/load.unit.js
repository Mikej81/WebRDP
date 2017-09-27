'use strict';

var expect = require('chai').expect,
	path = require('path'),
	yaml = requireLib('load/parse/yaml');

describe("YAML.load test:", function() {

	var validYamlFile = path.resolve(__dirname, './valid.yml'),
		validYaml = { x: 'a' },
		emptyYamlFile = path.resolve(__dirname, './empty.yml'),
		invalidYamlFile = path.resolve(__dirname, './invalid.yml');

	describe("should loadSync yaml document", function() {

		it("and return object", function() {
			var result = yaml.loadSync(validYamlFile);
			expect(result).to.exist;
			expect(result).to.have.property('x', 'a');
		});

		it("and return error", function() {
			expect(function() {
				yaml.loadSync(invalidYamlFile);
			}).to.throw();
		});

		it("and return empty object", function() {
			var result = yaml.loadSync(emptyYamlFile);
			expect(result).to.exist;
			expect(result).to.be.eql({});
		});

	});

	describe("should loadAsync yaml document", function() {

		it("and return object", function(done) {
			yaml.load(validYamlFile, function(err, result) {
				if (err) return done(err);
				expect(result).to.exist;
				expect(result).to.be.eql(validYaml);
				done();
			});
		});

		it("and return error", function(done) {
			yaml.load(invalidYamlFile, function(err, result) {
				expect(err).to.exist;
				expect(result).to.not.exist;
				done();
			});
		});

		it("and return empty object", function(done) {
			yaml.load(emptyYamlFile, function(err, result) {
				if (err) return done(err);
				expect(result).to.exist;
				expect(result).to.be.eql({});
				done();
			});
		});

	});

});
