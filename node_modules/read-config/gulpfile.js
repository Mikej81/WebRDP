'use strict';

var gulp = require('gulp'),
	gutil = require('gulp-util'),
	sync = require('gulp-sync')(gulp).sync,
	jshint = require('gulp-jshint'),
	mocha = require('gulp-mocha'),
	path = require('path'),
	fs = require('fs'),
	mkdirp = require('mkdirp'),
	del = require('del'),
	jscs = require('gulp-jscs'),
	istanbul = require('gulp-istanbul');

(function printBanner() {
	var bannerPath = path.resolve(__dirname, '.banner');
	if (fs.existsSync(bannerPath)) {
		gutil.log('\n' + gutil.colors.green(fs.readFileSync(bannerPath, 'utf8')));
	} else {
		gutil.log(gutil.colors.gray('Could not load application banner :('));
	}
})();

function initTestMode() {
	global.testMode = 'unit';
	global.requireLib = function(libmodule) {
		return require(path.resolve(__dirname, 'lib', libmodule));
	};
}

gulp.task('clean', function(done) {
	del('build', done);
});

gulp.task('jshint', function() {
	return gulp.src([
			'**/*.js',
			'!node_modules/**/*'
		])
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jshint.reporter('fail'));
});

gulp.task('jscsrc', function() {
	return gulp.src([
			'**/*.js',
			'!node_modules/**/*'
		])
		.pipe(jscs());
});

gulp.task('test', function() {
	var testSrc = gutil.env.file || 'test/**/*.unit.js';
	initTestMode();
	gutil.log('Running unit tests for:', testSrc);
	return gulp.src(testSrc)
		.pipe(mocha({
			reporter: 'mocha-jenkins-reporter',
			debug: gutil.env.debug
		}))
		.on('error', function(e) {
			gutil.log('[mocha] ' + e.stack);
		});
});

gulp.task('test-cov', function(done) {
	mkdirp.sync('./build/test/results');
	mkdirp.sync('./build/test/coverage');
	global.testMode = 'unit';
	process.env.JUNIT_REPORT_PATH = 'build/test/results/report.xml';
	process.env.JUNIT_REPORT_STACK = true;
	gulp.src('lib/**/*.js')
		.pipe(istanbul({
			includeUntested: true
		}))
		.pipe(istanbul.hookRequire())
		.on('finish', function() {
			var testSrc = gutil.env.file || 'test/**/*.unit.js';
			initTestMode();
			gutil.log('Running instrumented unit tests for:', testSrc);
			gulp.src(testSrc)
				.pipe(mocha({
					reporter: 'mocha-jenkins-reporter',
					debug: gutil.env.debug
				}))
				.pipe(istanbul.writeReports({
					dir: './build/test/coverage',
					reporters: ['lcov', 'json', 'text', 'text-summary', 'cobertura'],
					reportOpts: { dir: './build/test/coverage' }
				}))
				.on('error', function(e) {
					gutil.log('[mocha] ' + e.stack);
				})
				.on('end', done);
		});
});

gulp.task('checkstyle', sync(['jshint', 'jscsrc']));
gulp.task('default', sync(['clean', 'jshint', 'test']));
gulp.task('ci', sync(['clean', 'checkstyle', 'test-cov']));
