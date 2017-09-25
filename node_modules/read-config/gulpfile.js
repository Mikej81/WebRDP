'use strict';

const pkg = require('./package'),
    gulp = require('gulp'),
    gulpif = require('gulp-if'),
    gutil = require('gulp-util'),
    sync = require('gulp-sync')(gulp).sync,
    eslint = require('gulp-eslint'),
    mocha = require('gulp-mocha'),
    istanbul = require('gulp-istanbul'),
    mkdirp = require('mkdirp'),
    path = require('path'),
    fs = require('fs'),
    del = require('del'),
    _ = require('lodash'),
    argv = require('minimist')(process.argv.slice(2), {
        boolean: ['debug', 'bail'],
        string: ['file'],
        alias: {
            file: 'f',
            debug: 'd',
            bail: 'b'
        }
    });

// Print banner
gutil.log([
    fs.readFileSync('.banner', 'utf8'),
    `${pkg.name} v${pkg.version}`,
    pkg.description
].map(_.unary(gutil.colors.green)).join('\n'));

argv.debug && gutil.log('Paremeters:', argv);

function initTestMode() {
    global.testMode = 'unit';
    process.env.JUNIT_REPORT_PATH = 'build/test/results/report.xml';
    process.env.JUNIT_REPORT_STACK = true;
    global.requireLib = function(libmodule) {
        return require(path.resolve(__dirname, 'lib', libmodule));
    };
}

gulp.task('clean', (done) => {
    del(['build']).then((paths) => {
        argv.debug && paths.length && gutil.log('Deleted files/folders:\n', paths.join('\n'));
        done();
    });
});

gulp.task('lint', () => {
    const src = argv.file || [
        '**/*.js',
        '!node_modules/**/*',
        '!build/**/*'
    ];
    argv.debug && gutil.log('Running code lint on:', src);
    return gulp.src(src)
        .pipe(eslint())
        .pipe(gulpif(!argv.bail, eslint.format()))
        .pipe(gulpif(!argv.bail, eslint.failAfterError()))
        .pipe(gulpif(argv.bail, eslint.failOnError()));
});

gulp.task('test', () => {
    const testSrc = argv.file || 'test/**/*.unit.js';
    argv.debug && gutil.log('Running unit tests for:', testSrc);
    initTestMode();
    return gulp.src(testSrc)
        .pipe(mocha({
            reporter: 'mocha-jenkins-reporter',
            debug: argv.debug,
            bail: argv.bail
        }))
        .on('error', (e) => {
            gutil.log('[mocha]', e.stack);
        });
});

gulp.task('test-cov', (done) => {
    mkdirp.sync('./build/test/results');
    mkdirp.sync('./build/test/coverage');
    global.testMode = 'unit';
    gulp.src('lib/**/*.js')
        .pipe(istanbul({
            includeUntested: true
        }))
        .pipe(istanbul.hookRequire())
        .on('finish', () => {
            const testSrc = argv.file || 'test/**/*.unit.js';
            initTestMode();
            argv.debug && gutil.log('Running instrumented unit tests for:', testSrc);
            gulp.src(testSrc)
                .pipe(mocha({
                    reporter: 'mocha-jenkins-reporter',
                    debug: argv.debug,
                    bail: argv.bail
                }))
                .pipe(istanbul.writeReports({
                    dir: './build/test/coverage',
                    reporters: ['lcov', 'json', 'text', 'text-summary', 'cobertura'],
                    reportOpts: { dir: './build/test/coverage' }
                }))
                .on('error', (e) => {
                    gutil.log('[mocha]', e.stack);
                })
                .on('end', done);
        });
});

gulp.task('default', sync(['clean', 'lint', 'test']));
gulp.task('ci', sync(['clean', 'lint', 'test-cov']));
