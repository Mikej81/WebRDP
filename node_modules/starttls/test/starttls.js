/**
 * @overview
 * @author Matthew Caruana Galizia <m@m.cg>
 * @copyright Copyright (c) 2013, Matthew Caruana Galizia
 * @license MIT
 * @preserve
 */

'use strict';

/*jshint node:true*/
/*global test, suite*/

var assert = require('assert');
var net = require('net');
var tls = require('tls');

var starttls = require('../lib/starttls');

suite('starttls tests', function() {
	var options;

	options = {
		host: 'www.google.com',
		port: 443
	};

	test('simple connect with prepared socket', function(done) {
		net.createConnection(options, function() {
			var pair;

			pair = starttls(this, function(err) {
				assert.ifError(err);
				assert(pair.cleartext.authorized);
				assert.ifError(pair.cleartext.authorizationError);

				assert(this === pair);

				done();
			});
		});
	});

	test('identity check with prepared socket', function(done) {
		net.createConnection(options, function() {
			var pair;

			pair = starttls(this, function(err) {
				var cert, check;

				cert = pair.cleartext.getPeerCertificate();

				// Returns error or undefined on node v0.12.0 and true or false on previous versions.
				check = tls.checkServerIdentity(options.host, cert);
				assert.equal(check === true || typeof check === 'undefined', true);

				check = tls.checkServerIdentity('www.facebook.com', cert);
				assert.equal(check === false || check instanceof Error, true);

				done();
			});
		});
	});

	test('simple connect with options and prepared socket', function(done) {
		starttls({
			socket: net.createConnection(options)
		}, function(err) {
			var pair = this;

			assert.ifError(err);

			assert(pair.cleartext);
			assert(pair.cleartext.authorized);
			assert.ifError(pair.cleartext.authorizationError);

			done();
		});
	});

	test('simple connect with options', function(done) {
		starttls(options, function(err) {
			var pair = this;

			assert.ifError(err);

			assert(pair.cleartext);
			assert(pair.cleartext.authorized);
			assert.ifError(pair.cleartext.authorizationError);

			done();
		});
	});

	test('host is checked', function(done) {
		var options;

		options = {

			// Take advantage of the fact that this domain has an SSL certificate error.
			host: 'projects.icij.org.s3.amazonaws.com',
			port: 443
		};

		starttls(options, function(err) {
			assert(err);
			done();
		});
	});

	test('host is checked even if socket is provided', function(done) {
		var falseHost = 'www.facebook.com';

		starttls({
			host: falseHost,
			socket: net.createConnection(options)
		}, function(err) {
			assert(err);
			done();
		});
	});
});
