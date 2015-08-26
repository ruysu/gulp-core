var gulp = require('gulp'),
    gutil = require('gulp-util'),
    _ = require('lodash'),
    path = require('path'),
    requirejs = require('requirejs'),
    notify = require('gulp-notify'),
    through = require('through2');

/**
 * Optimize gulp task
 * @param  {object} options The options object passed to rjs command
 */
var optimize = function(options) {
    var stream = through.obj(function(file, enc, cb) {
        var out = options.out;

        // Convert to the main file to a vinyl file
        options.out = function(text) {
            cb(null, new gutil.File({
                path: out,
                contents: new Buffer(text)
            }));
        };

        // Optimize the main file
        requirejs.optimize(options, null, function(err) {
            stream.emit('error', new gutil.PluginError('gulp-rjs', err.message));
        });
    });

    return stream;
}

/**
 * @param  {string|object} main      The main file to optimize or and options object
 * @param  {string|object} outputDir The output path on wich to save the optimized file, or an options object
 * @param  {object}        options   The options object passed to rjs command
 */
module.exports = function (main, dest, options) {
    // Options were provided instead of a main file
    if (typeof main == 'object') {
        options = main;
        main = 'main.js';
    }

    // Options were provided on the outputDir parameter
    if (typeof outputDir == 'object') {
        options = outputDir;
        outputDir = null;
    }

    if (typeof options.optimize == 'undefined' && !gutil.env.production) {
        options.optimize = 'none';
    }

    return function () {
        // Add some defaults in case they were not provided
        var optimizeOptions = _.merge({   
            // The main config file
            mainConfigFile: main,
            // The base path on wich requirejs should look for scripts, or an options object, defaults to basedir of main config file
            baseUrl: path.dirname(main),
            // The output file, defaults to the main requirejs file's filename
            out: path.basename(main),
            // The name of the module generated with the first define on the main js
            name: path.basename(main).replace(new RegExp('.js$'), '')
        }, options);

        gulp.src(main)
            .pipe(optimize(optimizeOptions))
            .pipe(gulp.dest(dest || 'js'))
            .pipe(notify('Optimized: <%= file.relative %>!'));
    }
}