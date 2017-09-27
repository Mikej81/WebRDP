'use strict';

var expect = require('chai').expect,
	path = require('path'),
	properties = requireLib('load/parse/properties');

describe("properties.load test:", function() {

	var validPropertiesFile = path.resolve(__dirname, './valid.properties'),
		validProperties = { x: 'a' },
		emptyPropertiesFile = path.resolve(__dirname, './empty.properties');

	describe("should loadSync properties document", function() {

		it("and return object", function() {
			var result = properties.loadSync(validPropertiesFile);
			expect(result).to.exist;
			expect(result).to.have.property('x', 'a');
		});

		it("and return empty object", function() {
			var result = properties.loadSync(emptyPropertiesFile);
			expect(result).to.exist;
			expect(result).to.be.eql({});
		});

	});

	describe("should loadAsync properties document", function() {

		it("and return object", function(done) {
			properties.load(validPropertiesFile, function(err, result) {
				if (err) return done(err);
				expect(result).to.exist;
				expect(result).to.be.eql(validProperties);
				done();
			});
		});

		it("and return empty object", function(done) {
			properties.load(emptyPropertiesFile, function(err, result) {
				if (err) return done(err);
				expect(result).to.exist;
				expect(result).to.be.eql({});
				done();
			});
		});

	});

});
