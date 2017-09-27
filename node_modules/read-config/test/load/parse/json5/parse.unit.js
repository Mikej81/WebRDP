'use strict';

var expect = require('chai').expect,
	json5 = requireLib('load/parse/json5');

describe("Json5.parse module test:", function() {

	var validJson = { x: 'a' },
		validJsonText = "{ x: 'a' }",
		invalidJsonText = "{ x: 'a' y: 'b' }";

	describe("should parseSync json5 document", function() {

		it("and return object", function() {
			var result = json5.parseSync(validJsonText);
			expect(result).to.exist;
			expect(result).to.be.eql(validJson);
		});

		it("and return error", function() {
			expect(function() {
				json5.parseSync(invalidJsonText);
			}).to.throw();
		});

	});

	describe("should parse json5 document", function() {

		it("and return object", function(done) {
			json5.parse(validJsonText, function(err, result) {
				if (err) return done(err);
				expect(result).to.exist;
				expect(result).to.be.eql(validJson);
				done();
			});
		});

		it("and return empty object on empty json", function(done) {
			json5.parse('', function(err, result) {
				if (err) return done(err);
				expect(result).to.exist;
				expect(result).to.be.eql({});
				done();
			});
		});

		it("and return error", function(done) {
			json5.parse(invalidJsonText, function(err, result) {
				expect(err).to.exist;
				expect(result).to.not.exist;
				done();
			});
		});

	});

});
