'use strict';

var expect = require('chai').expect,
	path = require('path'),
	json5 = requireLib('load/parse/json5');

describe("Json5.load test:", function() {

	var validJsonFile = path.resolve(__dirname, './valid.json'),
		validJson = { x: 'a' },
		invalidJsonFile = path.resolve(__dirname, './invalid.json');

	describe("should loadSync json5 document", function() {

		it("and return object", function() {
			var result = json5.loadSync(validJsonFile);
			expect(result).to.exist;
			expect(result).to.have.property('x', 'a');
		});

		it("and return error", function() {
			expect(function() {
				json5.loadSync(invalidJsonFile);
			}).to.throw();
		});

	});

	describe("should loadAsync json5 document", function() {

		it("and return object", function(done) {
			json5.load(validJsonFile, function(err, result) {
				if (err) return done(err);
				expect(result).to.exist;
				expect(result).to.be.eql(validJson);
				done();
			});
		});

		it("and return error", function(done) {
			json5.load(invalidJsonFile, function(err, result) {
				expect(err).to.exist;
				expect(result).to.not.exist;
				done();
			});
		});

	});

});
