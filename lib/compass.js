var gulp = require('gulp'),
    compass = require('gulp-compass'),
    cssmin = require('gulp-cssmin'),
    gulpif = require('gulp-if'),
    notify = require('gulp-notify'),
    rename = require('gulp-rename'),
    gutils = require('gulp-util'),
    _ = require('underscore'),
    path = require('path');

module.exports = function (src, dest, options) {
    if (typeof dest == 'object') {
        options = dest;
        dest = null;
    }

    if (typeof options == 'undefined') {
        options = {};
    }

    options = _.extend({
        project: path.resolve(__dirname, '../'),
        sass: path.dirname(src),
        css: dest || 'css'
    }, options);

    return function () {
        var minify = function () {
            return gutils.env.production;
        };

        var appendMin = function () {
            return Boolean(gutils.env.production && gutils.env.min);
        }

        return gulp.src(src)
            .pipe(compass(options).on('error', notify.onError('<%= error.message %>')))
            .pipe(gulpif(minify, cssmin()))
            .pipe(gulpif(appendMin, rename({suffix: '.min'})))
            .pipe(gulp.dest(dest || 'css'))
            .pipe(notify('Compiled: <%= file.relative %>!'));
    };
};