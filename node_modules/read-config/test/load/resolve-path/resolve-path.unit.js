'use strict';

var libmodule = 'load/resolve-path',
	resolvePath = requireLib(libmodule),
	path = require('path'),
	expect = require('chai').expect;

cases(libmodule + ' async test:', resolvePath.async);
cases(libmodule + ' sync test:', function(filepath, basedirs, callback) {
	callback = callback || basedirs;
	basedirs = typeof basedirs === 'function' ? null : basedirs;
	callback(resolvePath.sync(filepath, basedirs));
});

function cases(name, resolvePath) {

	function absolute(filepath) {
		return path.resolve(__dirname, filepath);
	}

	describe(name, function() {

		describe('should resolve existing config file ', function() {

			it('defined by absolute filepath', function(done) {
				resolvePath(absolute('configs/config1.json'), function(resolved) {
					expect(resolved).to.exist;
					expect(resolved).to.be.eql(absolute('configs/config1.json'));
					done();
				});
			});

			it('defined by absolute filepath without extension', function(done) {
				resolvePath(absolute('configs/config1'), function(resolved) {
					expect(resolved).to.exist;
					expect(resolved).to.be.eql(absolute('configs/config1.json'));
					done();
				});
			});

			it('defined by relative filepath', function(done) {
				resolvePath('configs/config1.json', [__dirname], function(resolved) {
					expect(resolved).to.exist;
					expect(resolved).to.be.eql(absolute('configs/config1.json'));
					done();
				});
			});

			it('defined by relative filepath without extension', function(done) {
				resolvePath('configs/config1', [__dirname], function(resolved) {
					expect(resolved).to.exist;
					expect(resolved).to.be.eql(absolute('configs/config1.json'));
					done();
				});
			});

			it('defined in subfolder of relative filepath', function(done) {
				resolvePath('config3', [__dirname, __dirname + '/configs'], function(resolved) {
					expect(resolved).to.exist;
					expect(resolved).to.be.eql(absolute('configs/config3.json'));
					done();
				});
			});

			it('defined in first of basedirs', function(done) {
				resolvePath('config3', [__dirname + '/configs', __dirname, '/configs/subfolder'], function(resolved) {
					expect(resolved).to.exist;
					expect(resolved).to.be.eql(absolute('configs/config3.json'));
					done();
				});
			});

			it('defined in second of basedirs', function(done) {
				resolvePath('config3', [__dirname, __dirname + '/configs/subfolder'], function(resolved) {
					expect(resolved).to.exist;
					expect(resolved).to.be.eql(absolute('configs/subfolder/config3.json'));
					done();
				});
			});

		});

		describe('should not resolve a filepath ', function() {

			it('defined by absolute filepath', function(done) {
				resolvePath(absolute('configs/configX.json'), function(resolved) {
					expect(resolved).to.not.exist;
					done();
				});
			});

			it('defined by relative filepath', function(done) {
				resolvePath('configs/configX.json', [__dirname], function(resolved) {
					expect(resolved).to.not.exist;
					done();
				});
			});

			it('defined by relative filepath without basedir', function(done) {
				resolvePath('configs/config1', function(resolved) {
					expect(resolved).to.not.exist;
					done();
				});
			});

		});

	});
}
