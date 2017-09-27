'use strict';

var libmodule = 'load/index',
	load = requireLib(libmodule),
	path = require('path'),
	expect = require('chai').expect;

cases(libmodule + ' async test:', load.async);
cases(libmodule + ' sync test:', function(filepath, basedirs, callback) {
	var result;
	callback = callback || basedirs;
	basedirs = typeof basedirs === 'function' ? null : basedirs;
	try {
		result = load.sync(filepath, basedirs);
	} catch(e) {
		return callback(e);
	}
	callback(null, result);
});

function cases(name, load) {

	function absolute(filepath) {
		return path.resolve(__dirname, filepath);
	}

	describe(name, function() {

		it('should load config file by absolute filepath', function(done) {
			load(absolute('configs/config1'), function(err, config) {
				expect(err).to.not.exist;
				expect(config).to.exist;
				expect(config).to.be.eql({
					a: 1,
					b: 2
				});
				done();
			});
		});

		it('should load config file by relative filepath', function(done) {
			load('configs/config1', { basedir: __dirname }, function(err, config) {
				expect(err).to.not.exist;
				expect(config).to.exist;
				expect(config).to.be.eql({
					a: 1,
					b: 2
				});
				done();
			});
		});

		it('should load and merge 2 config files with parents', function(done) {
			load(['config2', 'config4'], { basedir: __dirname + '/configs', parentField: '__parent' }, function(err, config) {
				expect(err).to.not.exist;
				expect(config).to.exist;
				expect(config).to.be.eql({
					a: 1,
					b: 22,
					c: 333,
					d: 4444,
					e: 5555
				});
				done();
			});
		});

		it('should load cofig file relative to child configuration file', function(done) {
			load(absolute('configs/config2'), { parentField: '__parent' }, function(err, config) {
				expect(err).to.not.exist;
				expect(config).to.exist;
				expect(config).to.be.eql({
					a: 1,
					b: 22,
					c: 33
				});
				done();
			});
		});

		it('should load cofig file relative to process CWD', function(done) {
			load(absolute('configs/config5'), { parentField: '__parent' }, function(err, config) {
				expect(err).to.not.exist;
				expect(config).to.exist;
				expect(config).to.be.eql({
					a: 1,
					b: 22,
					c: 33
				});
				done();
			});
		});

	});
}
